import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import { useEffect, useState } from 'react'

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser')
    setLoggedIn(!!user)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser')
    setLoggedIn(false)
    navigate('/login')
  }

  const isSignUpPage = location.pathname === '/signup'

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/"><img src='https://i.imgur.com/QpaCVKn.png' width={40} alt="Logo" /></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {loggedIn ? (
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          ) : isSignUpPage ? (
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

