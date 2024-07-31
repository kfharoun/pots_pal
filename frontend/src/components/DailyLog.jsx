import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Button, Alert, Form } from 'react-bootstrap'
import Header from './Header'

const DailyLog = () => {
  const { username } = useParams()
  const { buttonRef }= useRef()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const dateParam = queryParams.get('date') || new Date().toISOString().split('T')[0]
  const [currentDate, setCurrentDate] = useState(null)
  const [logData, setLogData] = useState({
    high_heart_rate: '',
    low_heart_rate: '',
    weather: '',
    meal_item: [],
    activity_item: [],
    favorite_meal: false,
    favorite_activity: false,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [favorites, setFavorites] = useState({ food_items: [], activity_items: [] })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(true)
  const {addBottom} = useRef()
  const mealRefs = useRef([])
  const activityRefs = useRef([])
  mealRefs.current = []
  activityRefs.current = []


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
    <div className='logData'>
      <p className='ratetitle title'> Heart Rate</p>
      <div className='heartrate'>
        <div className='high rate'>
        <p>daily high</p> <p className='data heart'>{logData.high_heart_rate} </p> 
        </div>
        <div className='low rate'>
        <p>daily low</p> <p className='data heart'>{logData.low_heart_rate}</p>
        </div>

      </div>
      <div className='weather rate'>
        <p >average temp </p> <p className='data heart'>{logData.weather}</p>
      </div>
      <div>
        <div className='foodActivity'>
        <p className='ratetitle'>food & drink</p>
        <div className='array-org'>
        {Array.isArray(logData.meal_item) && logData.meal_item.length > 0 ? logData.meal_item.map((item, index) => (
          <div key={index} className='mealitem'>
            <p className='item'>{item}</p>
          </div>
        )) : <p>nothing yet!</p>}
      </div>
      </div>
      <div>
        <p className='ratetitle ex'>exercise & activity</p>
        <div className='array-org'>
        {Array.isArray(logData.activity_item) && logData.activity_item.length > 0 ? logData.activity_item.map((item, index) => (
          <div key={index} className='mealitem'>
            <p className='item'>{item}</p>
          </div>
        )) : <p>nothing yet!</p>}
        </div>
      </div>
      </div>
    </div>
  )

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate)
  }

  const renderForm = () => (
    <div className='logData'>
      <p className='ratetitle'>Heart Rate</p>
    <Form onSubmit={handleSubmit}>
      <div className='heartrate'>
      <Form.Group controlId="formHighHeartRate">
        <Form.Label>daily high</Form.Label>
        <Form.Control
          type="text"
          name="high_heart_rate"
          value={logData.high_heart_rate}
          onChange={(e) => handleChange(e, null, null)}
        />
      </Form.Group>
      
      <Form.Group controlId="formLowHeartRate">
        <Form.Label>daily low</Form.Label>
        <Form.Control
          type="text"
          name="low_heart_rate"
          value={logData.low_heart_rate}
          onChange={(e) => handleChange(e, null, null)}
        />
      </Form.Group>
      </div>
      <div className='weather rate form'>
      <Form.Group controlId="formWeather">
        <Form.Label className='weathertext'>average temp</Form.Label>
        <Form.Control
          type="text"
          name="weather"
          value={logData.weather}
          onChange={(e) => handleChange(e, null, null)}
        />
      </Form.Group>
      </div>
      
      <Form.Group>
        <Form.Label  className='ratetitle'>food & drink</Form.Label>
        <div className='array-org form'>
        {logData.meal_item.map((item, index) => (
          <div key={index} className="d-flex align-items-center mb-2" ref={index === logData.meal_item.length - 1 ? addBottom : null}>
            <Form.Control
              type="text"
              value={item}
              onChange={(e) => handleChange(e, index, 'meal')}
              className="me-2 index"
              ref={(el) => mealRefs.current[index] = el}
            />
            <div className='minus' variant="danger" onClick={() => handleRemoveInput(index, 'meal')}><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-patch-minus" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M5.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5"/>
              <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z"/>
            </svg>
            </div>
          </div>
        ))}
        </div>
        <div className='plus' variant="primary" onClick={() => handleAddInput('meal')}> <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-patch-plus" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5"/>
          <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z"/>
        </svg></div> 
      </Form.Group>
     
      <Form.Group>
        <Form.Label  className='ratetitle ex'>exercise & activity </Form.Label>
        <div className='array-org form'>
        {logData.activity_item.map((item, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            <Form.Control
              type="text"
              value={item}
              onChange={(e) => handleChange(e, index, 'activity')}
              className="me-2 index"
              ref={(el) => activityRefs.current[index] = el} 
            />
            <div className='minus' variant="danger" onClick={() => handleRemoveInput(index, 'activity')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-patch-minus" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M5.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5"/>
              <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z"/>
            </svg>
            </div>
          </div>
        ))}
         </div>
        <div className='plus' variant="primary" onClick={() => handleAddInput('activity')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-patch-plus" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5"/>
          <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z"/>
        </svg>
       
        </div>
      </Form.Group>
      <div className=' update-button button-container-1'>
              <span className='mas'>
                submit
              </span>
              <button
                type='submit'
                ref={buttonRef}
                id='submit-button'
              >
                submit
              </button>
            </div>
    </Form>
    </div>
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

  // Effect to scroll to the last added meal item
  useEffect(() => {
    const lastMealIndex = logData.meal_item.length - 1;
    if (mealRefs.current[lastMealIndex]) {
      mealRefs.current[lastMealIndex].scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [logData.meal_item])

  // Effect to scroll to the last added activity item
  useEffect(() => {
    const lastActivityIndex = logData.activity_item.length - 1
    if (activityRefs.current[lastActivityIndex]) {
      activityRefs.current[lastActivityIndex].scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [logData.activity_item])

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
      setLogData((prev) => ({
        ...prev,
        meal_item: prev.meal_item.filter((_, i) => i !== index),
      }))
    } else if (type === 'activity') {
      setLogData((prev) => ({
        ...prev,
        activity_item: prev.activity_item.filter((_, i) => i !== index),
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // if (buttonRef.current) {
    //   buttonRef.current.classList.add('active')
    // }
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
      <Header onDateChange={handleDateChange} />
      <div className='container mt-4 DailyLog'>
        {/* {error && <Alert variant='danger' className='mt-3'>{error}</Alert>}
        {success && <Alert variant='success' className='mt-3'>Data submitted successfully!</Alert>} */}
        {isEditing ? renderForm() : renderLogData()}
        <div className='update-button button-container-1'>
          {!isEditing && (
            <>
              <span className='mas'>
                edit
              </span>
              <button
                onClick={handleEdit}
                variant="primary"
                ref={buttonRef} 
              >
                edit
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
export default DailyLog