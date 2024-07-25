import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Cursor } from 'mongoose'

export default function Home() {
    const [formData, setFormData] = useState({
      good_day: false,
      neutral_day: false,
      nauseous: false,
      fainting: false,
      bed_bound: false,
      water_intake: 0,
      salt_intake: 0
    })
    const [error, setError] = useState('')
    const { username } = useParams()
  
    useEffect(() => {
      const initializeDefaultValues = async () => {
        try {
          const userResponse = await axios.get(`http://localhost:8000/users/${username}/`)
          const userId = userResponse.data.id
  
          const todaysDate = new Date().toISOString().split('T')[0]
  
        //   const dayResponse = await axios.post(`http://localhost:8000/days/`, {
        //     user: userId,
        //     date: todaysDate,
        //     good_day: false,
        //     neutral_day: false,
        //     nauseous: false,
        //     fainting: false,
        //     bed_bound: false
        //   })
  
        //   const dayId = dayResponse.data.id
  
          await axios.get(`http://localhost:8000/data/${username}`, {
            // day: dayId,
            meal_item: [],
            favorite_meal: false,
            water_intake: 0,
            salt_intake: 0,
            weather: 0,
            low_heart_rate: 0,
            high_heart_rate: 0,
            activity_item: [],
            favorite_activity: false
          })
        } catch (error) {
          console.error('Error setting default values:', error)
          setError('Error initializing default values. Please try again later.')
        }
      }
  
      initializeDefaultValues()
    }, [username])
  
    const handleChange = (e) => {
      const { id, value, type, checked } = e.target
      setFormData(prevFormData => ({
        ...prevFormData,
        [id]: type === 'checkbox' ? checked : value
      }))
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
  
      try {
        const userResponse = await axios.get(`http://localhost:8000/users/username/${username}/`)
        const userId = userResponse.data.id
  
        const todaysDate = new Date().toISOString().split('T')[0]
  
        const dayResponse = await axios.post(`http://localhost:8000/days/`, {
          user: userId,
          date: todaysDate,
          ...formData
        })
  
        const dayId = dayResponse.data.id
  
        await axios.post(`http://localhost:8000/data/`, {
          day: dayId,
          meal_item: [],
          favorite_meal: formData.favorite_meal || false,
          water_intake: formData.water_intake,
          salt_intake: formData.salt_intake,
          weather: 0,
          low_heart_rate: 0,
          high_heart_rate: 0,
          activity_item: [],
          favorite_activity: false
        })
  
        setError('') // Clear any previous error messages
      } catch (error) {
        console.error('Error submitting data:', error)
        setError('Error submitting data. Please try again later.')
      }
    }

  const handleIncrement = (field, increment) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: prevFormData[field] + increment
    }))
  }

  const handleDecrement = (field, decrement) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: prevFormData[field] - decrement
    }))
  }

  return (
    <Container className='Home mt-5'>
      <Row className='justify-content-center'>
        <Col md={10} className='text-center'>
          <h1 className='HomeWelcome'>✨ Welcome back, {username} ✨</h1>
          <Link to={`/log/${username}`}><Button variant="primary" className='mt-3'>Daily Log</Button></Link>

          <Form onSubmit={handleSubmit} className='mt-4'>
            <h3>How are you feeling today?</h3>

            <Form.Check 
              type="checkbox" 
              id="good_day" 
              label="Good Day" 
              checked={formData.good_day} 
              onChange={handleChange} 
            />
            <Form.Check 
              type="checkbox" 
              id="neutral_day" 
              label="Neutral Day" 
              checked={formData.neutral_day} 
              onChange={handleChange} 
            />
            <Form.Check 
              type="checkbox" 
              id="nauseous" 
              label="Nauseous" 
              checked={formData.nauseous} 
              onChange={handleChange} 
            />
            <Form.Check 
              type="checkbox" 
              id="fainting" 
              label="Fainting" 
              checked={formData.fainting} 
              onChange={handleChange} 
            />
            <Form.Check 
              type="checkbox" 
              id="bed_bound" 
              label="Bed Bound" 
              checked={formData.bed_bound} 
              onChange={handleChange} 
            />

            <h3 className='mt-4'>Represents 800mgs of sodium</h3>

            <Form.Group controlId="salt_intake" className='d-flex align-items-center'>
                
              <Form.Label className='mr-3'>Sodium Intake</Form.Label>
              <h2 variant="secondary" onClick={() => handleDecrement('salt_intake', 800)}> - </h2>
              <Form.Control 
                type="number" 
                value={formData.salt_intake} 
                onChange={handleChange} 
                min="0" 
                className='ml-3'
              />
               <h2 variant="secondary" onClick={() => handleIncrement('salt_intake', 800)}> + </h2>
            </Form.Group>

            <Form.Group controlId="water_intake" className='d-flex align-items-center'>
              <Form.Label className='mr-3'>Water Intake (ml)</Form.Label>
              <h2 variant="secondary" onClick={() => handleDecrement('water_intake', 16)}>-</h2>
              <Form.Control 
                type="number" 
                value={formData.water_intake} 
                onChange={handleChange} 
                min="0" 
                className='ml-3'
              />
              <h2 variant="secondary" onClick={() => handleIncrement('water_intake', 16)}>+</h2>
            </Form.Group>

            {error && <Alert variant="danger" className='mt-3'>{error}</Alert>}

            <Button type="submit" variant="primary" className='mt-4'>Submit</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}