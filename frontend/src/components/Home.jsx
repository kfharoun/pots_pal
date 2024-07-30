import { useEffect, useState, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Row, Col, Form, Alert } from 'react-bootstrap'
import SaltIntake from './imageComponents/SaltIntake'
import WaterIntake from './imageComponents/WaterIntake'
import MoodSelector from './imageComponents/MoodSelector'
import Header from './Header'

export default function Home() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    good_day: false,
    neutral_day: false,
    nauseous: false,
    fainting: false,
    bed_bound: false,
    salt_intake: 0,
    water_intake: 0,
  })
  const [selectedMood, setSelectedMood] = useState(null)
  const [existingEntry, setExistingEntry] = useState(null)
  const [existingData, setExistingData] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const formRef = useRef(null)
  const buttonRef = useRef(null)
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const getExisting = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/days/${username}/${currentDate}/`
        )
        if (response.status === 200) {
          const entry = response.data
          setExistingEntry(entry)
          if (entry.data.length > 0) {
            const data = entry.data[0]
            setExistingData(data)
            setFormData({
              good_day: entry.good_day,
              neutral_day: entry.neutral_day,
              nauseous: entry.nauseous,
              fainting: entry.fainting,
              bed_bound: entry.bed_bound,
              salt_intake: data.salt_intake,
              water_intake: data.water_intake,
            })
            if (entry.good_day) setSelectedMood('good_day')
            if (entry.neutral_day) setSelectedMood('neutral_day')
            if (entry.nauseous) setSelectedMood('nauseous')
            if (entry.fainting) setSelectedMood('fainting')
            if (entry.bed_bound) setSelectedMood('bed_bound')
          } else {
            // No existing data for the day
            setExistingData(null)
            setFormData({
              good_day: false,
              neutral_day: false,
              nauseous: false,
              fainting: false,
              bed_bound: false,
              salt_intake: 0,
              water_intake: 0,
            })
            setSelectedMood(null)
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setExistingEntry(null)
          setExistingData(null)
          setFormData({
            good_day: false,
            neutral_day: false,
            nauseous: false,
            fainting: false,
            bed_bound: false,
            salt_intake: 0,
            water_intake: 0,
          })
          setSelectedMood(null)
        } else {
          console.error('Error getting existing entry:', error)
        }
      }
    }
    getExisting()
  }, [username, currentDate])

  const handleChange = (e) => {
    const { id, checked, value, type } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: type === 'checkbox' ? checked : parseFloat(value),
    }))
  }

  const handleIncrement = (field, increment) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: prevFormData[field] + increment,
    }))
  }

  const handleDecrement = (field, decrement) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: prevFormData[field] - decrement,
    }))
  }

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    setFormData((prevFormData) => ({
      ...prevFormData,
      good_day: mood === 'good_day',
      neutral_day: mood === 'neutral_day',
      nauseous: mood === 'nauseous',
      fainting: mood === 'fainting',
      bed_bound: mood === 'bed_bound',
    }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (buttonRef.current) {
      buttonRef.current.classList.add('active')
    }
    setTimeout(async () => {
      const dayData = {
        user: username,
        good_day: formData.good_day,
        neutral_day: formData.neutral_day,
        nauseous: formData.nauseous,
        fainting: formData.fainting,
        bed_bound: formData.bed_bound,
      }

      const dataData = {
        water_intake: formData.water_intake,
        salt_intake: formData.salt_intake,
        meal_item: [],
        activity_item: []
      }

      try {
        if (existingEntry) {
          // Update existing day without sending the date
          await axios.patch(
            `http://localhost:8000/days/${username}/${existingEntry.id}/`,
            dayData,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )

          // Check if there is existing data for the day
          if (existingData) {
            // Update existing data with PATCH
            await axios.patch(
              `http://localhost:8000/data/${existingData.id}/`,
              dataData,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          } else {
            // Create new data entry
            await axios.post(
              `http://localhost:8000/data/`,
              { ...dataData, day: existingEntry.id },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }
        } else {
          // Create new day entry including the date
          const dayResponse = await axios.post(
            `http://localhost:8000/days/`,
            { ...dayData, date: currentDate },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          const dayId = dayResponse.data.id
          // Create new data entry
          await axios.post(
            `http://localhost:8000/data/`,
            { ...dataData, day: dayId },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        }

        setSuccess(true)
        setError(null)
        window.location.reload()
      } catch (err) {
        setError(err.response ? err.response.data : 'Error submitting data')
        setSuccess(false)
      }
    }, 700) // Delay to match animation duration
  }

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate)
  }

  const handleDailyLogClick = (e) => {
    e.preventDefault()
    if (buttonRef.current) {
      buttonRef.current.classList.add('active')
    }
    setTimeout(() => {
      navigate(`/log/${username}`)
    }, 700) 
  }

  return (
    <>
      <Header currentDate={currentDate} onDateChange={handleDateChange} />
      
      <Row className='justify-content-center'>
        <Col md={10} className='text-center'>
          <h1 className='HomeWelcome'>✨ welcome back, {username} ✨</h1>
          <div className='button-container-1 daily-log'>
            <span className='mas'>Daily Log</span>
            <Link to={`/log/${username}`} onClick={handleDailyLogClick} ref={buttonRef}>
              <button className='w-100' id='daily-log-button'>
                daily log
              </button>
            </Link>
          </div>

          <Form ref={formRef} onSubmit={handleFormSubmit} className='mt-4'>
            <h3 className='mood-check'>How are you feeling today?</h3>
            <MoodSelector selectedMood={selectedMood} onSelectMood={handleMoodSelect} />
            <h3 className='mt-4 mood-check' >Represents 21oz of water</h3>

            <Form.Group controlId='water_intake' className='d-flex align-items-center'>
              <Form.Label className='mr-3'></Form.Label>
              <WaterIntake
                waterIntake={formData.water_intake}
                onIncrement={() => handleIncrement('water_intake', 21)}
                onDecrement={() => handleDecrement('water_intake', 21)}
              />
            </Form.Group>
            <p className='disclaimer'>* based on recommended 126 ounces per day</p>

            <h3 className='mt-4 mood-check'>Represents 1/4 teaspoon of salt</h3>

            <Form.Group controlId='salt_intake' className='d-flex align-items-center'>
              <Form.Label className='mr-3'></Form.Label>
              <SaltIntake
                saltIntake={formData.salt_intake}
                onIncrement={() => handleIncrement('salt_intake', 1)}
                onDecrement={() => handleDecrement('salt_intake', 1)}
              />
            </Form.Group>
            <p className='disclaimer'>* based on recommended 2,300 mg of sodium per day</p>

            <Form.Group className='mt-4'>
              <button type='submit' className='submit-button' ref={buttonRef}>
                Submit
              </button>
            </Form.Group>
          </Form>

          {error && (
            <Alert variant='danger' className='mt-4'>
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant='success' className='mt-4'>
              Form submitted successfully!
            </Alert>
          )}
        </Col>
      </Row>
    </>
  )
}