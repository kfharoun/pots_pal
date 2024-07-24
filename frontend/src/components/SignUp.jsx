import React, { useState } from 'react'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const CustomSignUp = () => {
  const { loginWithRedirect } = useAuth0()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8000/users/', {
        email,
        password,
        username,
      });
      console.log('Server response:', response.data)
      await loginWithRedirect()
    } catch (error) {
      console.error('Error signing up:', error.response?.data || error.message)
      setError('Error signing up');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Sign Up</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Sign Up</Button>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default CustomSignUp;