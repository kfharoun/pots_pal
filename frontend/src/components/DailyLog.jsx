import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Button, Alert } from 'react-bootstrap'
import Header from './Header'

const DailyLog = () => {
  const { username } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const dateParam = queryParams.get('date') || new Date().toISOString().split('T')[0]
  const [currentDate, setCurrentDate] = useState(dateParam)
  const [logData, setLogData] = useState({
    high_heart_rate: '',
    low_heart_rate: '',
    weather: '',
    meal_item: [],
    activity_item: [],
    favorite_meal: false,
    favorite_activity: false,
  })
  const [isEditing, setIsEditing] = useState(true)
  const [favorites, setFavorites] = useState({ food_items: [], activity_items: [] })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const logResponse = await axios.get(`http://localhost:8000/data/${username}/date/${currentDate}/`)
        const logData = logResponse.data

        const favResponse = await axios.get(`http://localhost:8000/favorites/${username}/`)
        const favoritesData = favResponse.data
        setFavorites(favoritesData)

        const favoriteMeal = logData.meal_item.some(item => favoritesData.food_items.includes(item))
        const favoriteActivity = logData.activity_item.some(item => favoritesData.activity_items.includes(item))
        setLogData({
          ...logData,
          favorite_meal: favoriteMeal,
          favorite_activity: favoriteActivity,
        })
      } catch (error) {
        console.error('Error getting log data or favorites:', error)
      }
    }

    getData()
  }, [username, currentDate])

  const renderLogData = () => (
    <div>
      <p>High Heart Rate: {logData.high_heart_rate}</p>
      <p>Low Heart Rate: {logData.low_heart_rate}</p>
      <p>Weather: {logData.weather}</p>
      <div>
        <p>Food Items:</p>
        {Array.isArray(logData.meal_item) && logData.meal_item.length > 0 ? logData.meal_item.map((item, index) => (
          <div key={index}>
            {item}
          </div>
        )) : <p>No food items logged.</p>}
      </div>
      <div>
        <p>Activity Items:</p>
        {Array.isArray(logData.activity_item) && logData.activity_item.length > 0 ? logData.activity_item.map((item, index) => (
          <div key={index}>
            {item}
          </div>
        )) : <p>No activities logged.</p>}
      </div>
    </div>
  )

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <div>
        <label>High Heart Rate</label>
        <input
          type="text"
          name="high_heart_rate"
          value={logData.high_heart_rate}
          onChange={(e) => handleChange(e, null, null)}
        />
      </div>
      <div>
        <label>Low Heart Rate</label>
        <input
          type="text"
          name="low_heart_rate"
          value={logData.low_heart_rate}
          onChange={(e) => handleChange(e, null, null)}
        />
      </div>
      <div>
        <label>Weather</label>
        <input
          type="text"
          name="weather"
          value={logData.weather}
          onChange={(e) => handleChange(e, null, null)}
        />
      </div>
      <div>
        <label>Food Items</label>
        {logData.meal_item.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              value={item}
              onChange={(e) => handleChange(e, index, 'meal')}
            />
            <Button variant="danger" onClick={() => handleRemoveInput(index, 'meal')}>Remove</Button>
          </div>
        ))}
        <Button variant="primary" onClick={() => handleAddInput('meal')}>Add Food Item</Button>
      </div>
      <div>
        <label>Activity Items</label>
        {logData.activity_item.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              value={item}
              onChange={(e) => handleChange(e, index, 'activity')}
            />
            <Button variant="danger" onClick={() => handleRemoveInput(index, 'activity')}>Remove</Button>
          </div>
        ))}
        <Button variant="primary" onClick={() => handleAddInput('activity')}>Add Activity Item</Button>
      </div>
      <button type="submit">Submit Log</button>
    </form>
  )

  const handleChange = (e, index, type) => {
    const { name, value } = e.target
    if (type === 'meal') {
      const newMealItems = [...logData.meal_item]
      newMealItems[index] = value
      setLogData((prev) => ({
        ...prev,
        meal_item: newMealItems,
      }))
    } else if (type === 'activity') {
      const newActivityItems = [...logData.activity_item]
      newActivityItems[index] = value
      setLogData((prev) => ({
        ...prev,
        activity_item: newActivityItems,
      }))
    } else {
      setLogData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleAddInput = (type) => {
    if (type === 'meal') {
      setLogData((prev) => ({
        ...prev,
        meal_item: [...prev.meal_item, ''],
      }))
    } else if (type === 'activity') {
      setLogData((prev) => ({
        ...prev,
        activity_item: [...prev.activity_item, ''],
      }))
    }
  }

  const handleRemoveInput = (index, type) => {
    if (type === 'meal') {
      const newMealItems = logData.meal_item.filter((_, i) => i !== index)
      setLogData((prev) => ({
        ...prev,
        meal_item: newMealItems,
      }))
    } else if (type === 'activity') {
      const newActivityItems = logData.activity_item.filter((_, i) => i !== index)
      setLogData((prev) => ({
        ...prev,
        activity_item: newActivityItems,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.patch(`http://localhost:8000/data/${username}/${logData.id}/`, logData)
      setLogData(response.data)
      setIsEditing(false)
      setSuccess(true)
      setError(null)
    } catch (error) {
      setError('Error submitting log data')
      setSuccess(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  return (
    <>
      <Header />
      <div className='container mt-4'>
        <h1>log</h1>
        {error && <Alert variant='danger' className='mt-3'>{error}</Alert>}
        {success && <Alert variant='success' className='mt-3'>Data submitted successfully!</Alert>}
        {isEditing ? renderForm() : renderLogData()}
        {!isEditing && <Button onClick={handleEdit} variant="primary" className='mt-4'>Edit Log</Button>}
      </div>
    </>
  )
}

export default DailyLog