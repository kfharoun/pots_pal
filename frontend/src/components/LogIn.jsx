import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import Header from './Header'

export default function Login() {
  const initialState = {
    username: '',
    password: '',
    error: ''
  }

  const [formState, setFormState] = useState(initialState)
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  const buttonRef = useRef(null)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      navigate(`/home/${loggedInUser}`)
      return
    }

    const getUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/users/`)
        setUsers(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    getUsers()
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()

    const user = users.find(user => user.username === formState.username)

    if (!user) {
      setFormState({
        ...formState,
        error: 'Username does not exist'
      })
      return
    }

    if (user.password !== formState.password) {
      setFormState({
        ...formState,
        error: 'Incorrect Password'
      })
      return
    }

    if (buttonRef.current) {
      buttonRef.current.classList.add('active') 
    }

    setTimeout(() => {
      localStorage.setItem('loggedInUser', user.username)
      navigate(`/home/${user.username}`)
    }, 700)
  }

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
      error: ''
    })
  }

  

  return (
    <div className='Login'>
      <h2 className="text-center mb-4 login-text">ready to spot the patterns?</h2>
      <h2 className='login-emoji'>✨</h2>
    <Container className="mt-5">
      <Header />
      <Row className="justify-content-center">
        <Col md={10}>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                id="username"
                value={formState.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-5">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                id="password"
                value={formState.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className='button-container-1'>
            <span class="mas">login</span>
            <button ref={buttonRef} variant="primary" type="submit" className="w-100" id='work'>login</button>
            </div>
            {formState.error && <Alert variant="danger" className="mt-3">{formState.error}</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
    </div>
  )
}