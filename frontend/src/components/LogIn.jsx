import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'

export default function Login() {
  const initialState = {
    username: '',
    password: '',
    error: ''
  }

  const [formState, setFormState] = useState(initialState)
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/users/`)
        setUsers(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    getUsers()
  }, [])

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

    localStorage.setItem('loggedInUser', user.username)
    navigate(`/home/${user.username}`)
  }

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
      error: ''
    })
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <h2 className="text-center mb-4">Login</h2>
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
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                id="password"
                value={formState.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Login</Button>
            {formState.error && <Alert variant="danger" className="mt-3">{formState.error}</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
  )
}