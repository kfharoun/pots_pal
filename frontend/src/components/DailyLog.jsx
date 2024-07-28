import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useLocation } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import Header from './Header'

const DailyLog = () => {
  const { username } = useParams()
  const location = useLocation()
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [logData, setLogData] = useState({
    high_heart_rate: '',
    low_heart_rate: '',
    weather: '',
    meal_item: [],
    activity_item: [],
    favorite_meal: false,
    favorite_activity: false
  })
  const [isEditing, setIsEditing] = useState(true)
  const [favorites, setFavorites] = useState({ food_items: [], activity_items: [] })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const getDataData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/data/${username}/date/${currentDate}/`)
        setLogData(response.data)
      } catch (error) {
        console.error('Error getting log data:', error)
      }

      try {
        const favResponse = await axios.get(`http://localhost:8000/favorites/${username}/`)
        setFavorites(favResponse.data)
      } catch (error) {
        console.error('Error getting favorites:', error)
      }
    }

    getDataData()
  }, [username, currentDate])

  const handleFavoriteClick = async (item, type) => {
    try {
      const isFavorite = type === 'food'
        ? favorites.food_items.includes(item)
        : favorites.activity_items.includes(item)

      const url = type === 'food'
        ? `http://localhost:8000/favorites/meal/${username}/`
        : `http://localhost:8000/favorites/activity/${username}/`

      if (isFavorite) {
        await axios.delete(url, { data: { item } })
      } else {
        await axios.post(url, { item })
      }

      // Re-fetch favorites to update the state
      const response = await axios.get(`http://localhost:8000/favorites/${username}/`)
      setFavorites(response.data)
    } catch (error) {
      console.error('Error updating favorites:', error.response ? error.response.data : error.message)
    }
  }

  const handleChange = (e, index, type) => {
    const { name, value } = e.target
    if (type === 'meal') {
      const newMealItems = [...logData.meal_item]
      newMealItems[index] = value;
      setLogData((prev) => ({
        ...prev,
        meal_item: newMealItems,
      }))
    } else if (type === 'activity') {
      const newActivityItems = [...logData.activity_item]
      newActivityItems[index] = value;
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
      const newMealItems = logData.meal_item.filter((_, i) => i !== index);
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
    setIsEditing(true);
  }

  const renderFavoriteIcon = (item, type) => {
    const isFavorite = type === 'food'
      ? favorites.food_items.includes(item)
      : favorites.activity_items.includes(item);

    return (
      <span
        onClick={() => handleFavoriteClick(item, type)}
        style={{ cursor: 'pointer', color: isFavorite ? 'red' : 'gray' }}
      >
        {isFavorite ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-suit-heart-fill" viewBox="0 0 16 16">
          <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1"/>
        </svg>
        ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-suit-heart" viewBox="0 0 16 16">
        <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
</svg>
        )}
      </span>
    )
  }

  const renderLogData = () => (
    <div>
      <p>High Heart Rate: {logData.high_heart_rate}</p>
      <p>Low Heart Rate: {logData.low_heart_rate}</p>
      <p>Weather: {logData.weather}</p>
      <div>
        <p>Food Items:</p>
        {Array.isArray(logData.meal_item) ? logData.meal_item.map((item, index) => (
          <div key={index}>
            {item} {renderFavoriteIcon(item, 'food')}
          </div>
        )) : logData.meal_item}
      </div>
      <div>
        <p>Activity:</p>
        {Array.isArray(logData.activity_item) ? logData.activity_item.map((item, index) => (
          <div key={index}>
            {item} {renderFavoriteIcon(item, 'activity')}
          </div>
        )) : logData.activity_item}
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
          onChange={handleChange}
          />
        </div>
        <div>
          <label>Low Heart Rate</label>
          <input
            type="text"
            name="low_heart_rate"
            value={logData.low_heart_rate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Weather</label>
          <input
            type="text"
            name="weather"
            value={logData.weather}
            onChange={handleChange}
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
          <label>Activity</label>
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
          <Button variant="primary" onClick={() => handleAddInput('activity')}>Add Activity</Button>
        </div>
        <button type="submit">Submit Log</button>
      </form>
    )
  
    return (
      <>
        <Header currentDate={currentDate} onDateChange={setCurrentDate} />
        <div className='container mt-4'>
          <h1>Daily Log</h1>
          {error && <Alert variant='danger' className='mt-3'>{error}</Alert>}
          {success && <Alert variant='success' className='mt-3'>Data submitted successfully!</Alert>}
          {isEditing ? renderForm() : renderLogData()}
          {!isEditing && <Button onClick={handleEdit} variant="primary" className='mt-4'>Edit Log</Button>}
        </div>
      </>
    )
  }
  
  export default DailyLog