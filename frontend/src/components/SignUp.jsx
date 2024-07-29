import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './Header'

const CustomSignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const buttonRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (buttonRef.current) {
      buttonRef.current.classList.add('active')
    }

    try {
      const response = await axios.post('http://localhost:8000/users/', {
        username,
        email,
        password,
       
      })
      console.log('Server response:', response.data);

      // Wait for the animation to complete before continuing
      setTimeout(() => {
        window.location.href = '/login'; // Redirect or handle after animation
      }, 700)
    } catch (error) {
      console.error('Error signing up:', error.response?.data || error.message)
      setError('Error signing up')
    }
  }

  return (
    <div className='signup'>      
    <h2 className="text-center mb-4 login-text">create an account?</h2>
      <h2 className='login-emoji'>✨</h2>
    <Container className="mt-5">
      <Header />
      <Row className="justify-content-center">
        <Col md={6}>
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
            <div className="button-container-1">
              <span className="mas">Sign Up</span>
              <button 
                variant="primary" 
                type="submit" 
                className="w-100" 
                ref={buttonRef}
              >
                Sign Up
              </button>
            </div>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
    </div>
  )
}

export default CustomSignUp;