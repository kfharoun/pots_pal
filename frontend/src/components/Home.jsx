import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Home() {
  const { username } = useParams()
  const [formData, setFormData] = useState({
    good_day: false,
    neutral_day: false,
    nauseous: false,
    fainting: false,
    bed_bound: false,
    salt_intake: 0,
    water_intake: 0,
  })
  const [existingEntry, setExistingEntry] = useState(null)
  const [existingData, setExistingData] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const currentDate = new Date().toISOString().split('T')[0]

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
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setExistingEntry(null)
          setExistingData(null)
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

  const handleSubmit = async (e) => {
    e.preventDefault()

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
    } catch (err) {
      setError(err.response ? err.response.data : 'Error submitting data')
      setSuccess(false)
    }
  }

  return (
    <Container className='Home mt-5'>
      <Row className='justify-content-center'>
        <Col md={10} className='text-center'>
          <h1 className='HomeWelcome'>✨ Welcome back, {username} ✨</h1>
          <Link to={`/log/${username}`}>
            <Button variant='primary' className='mt-3'>
              Daily Log
            </Button>
          </Link>

          <Form onSubmit={handleSubmit} className='mt-4'>
            <h3>How are you feeling today?</h3>

            <Form.Check
              type='checkbox'
              id='good_day'
              label='Good Day'
              checked={formData.good_day}
              onChange={handleChange}
            />
            <Form.Check
              type='checkbox'
              id='neutral_day'
              label='Neutral Day'
              checked={formData.neutral_day}
              onChange={handleChange}
            />
            <Form.Check
              type='checkbox'
              id='nauseous'
              label='Nauseous'
              checked={formData.nauseous}
              onChange={handleChange}
            />
            <Form.Check
              type='checkbox'
              id='fainting'
              label='Fainting'
              checked={formData.fainting}
              onChange={handleChange}
            />
            <Form.Check
              type='checkbox'
              id='bed_bound'
              label='Bed Bound'
              checked={formData.bed_bound}
              onChange={handleChange}
            />

            <h3 className='mt-4'>Represents 800mgs of sodium</h3>

            <Form.Group controlId='salt_intake' className='d-flex align-items-center'>
              <Form.Label className='mr-3'>Sodium Intake</Form.Label>
              <Button variant='secondary' onClick={() => handleDecrement('salt_intake', 800)}>-</Button>
              <Form.Control
                type='number'
                value={formData.salt_intake}
                onChange={handleChange}
                min='0'
                className='ml-3'
              />
              <Button variant='secondary' onClick={() => handleIncrement('salt_intake', 800)}>+</Button>
            </Form.Group>

            <Form.Group controlId='water_intake' className='d-flex align-items-center'>
              <Form.Label className='mr-3'>Water Intake (ml)</Form.Label>
              <Button variant='secondary' onClick={() => handleDecrement('water_intake', 16)}>-</Button>
              <Form.Control
                type='number'
                value={formData.water_intake}
                onChange={handleChange}
                min='0'
                className='ml-3'
              />
              <Button variant='secondary' onClick={() => handleIncrement('water_intake', 16)}>+</Button>
            </Form.Group>

            {error && <Alert variant='danger' className='mt-3'>{error}</Alert>}
            {success && <Alert variant='success' className='mt-3'>Data submitted successfully!</Alert>}

            <Button type='submit' variant='primary' className='mt-4'>
              {existingEntry ? 'Update' : 'Submit'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}