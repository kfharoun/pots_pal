import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

export default function Login() {
  const loggedInUser = localStorage.getItem('loggedInUser');
  
  const initialState = {
    username: '',
    password: '',
    error: ''
  };

  const [formState, setFormState] = useState(initialState);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      const redirectToUserProfile = async (userId) => {
        try {
          const userResponse = await axios.get(`http://localhost:8000/users/${userId}`);
          navigate(`/username/${userResponse.data.username}`);
        } catch (error) {
          console.error('Error redirecting to user profile:', error);
        }
      };
      redirectToUserProfile(loggedInUser);
    }

    const getUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/users/`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    getUsers();
  }, [loggedInUser, navigate]);

  const getUserId = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8000/users/${username}/`);
      localStorage.setItem('loggedInUser', response.data.id);
      navigate(`/username/${username}`);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = users.find(user => user.username === formState.username);

    if (!user) {
      setFormState({
        ...formState,
        error: 'Username does not exist'
      });
      return;
    }

    if (user.password !== formState.password) {
      setFormState({
        ...formState,
        error: 'Incorrect Password'
      });
      return;
    }

    getUserId(user.username);
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
      error: ''
    });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                id="username"
                value={formState.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
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
  );
}