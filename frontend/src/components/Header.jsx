import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import { subDays, addDays, format, isAfter, isBefore, startOfToday } from 'date-fns'
import { Link } from 'react-router-dom'

export default function Header({ onDateChange }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkLoggedIn = () => {
      const user = localStorage.getItem('loggedInUser')
      if (user) {
        setUsername(user)
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
    }

    checkLoggedIn()

    window.addEventListener('storage', checkLoggedIn)
    return () => {
      window.removeEventListener('storage', checkLoggedIn)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser')
    setLoggedIn(false)
    navigate('/login')
  }

  const handlePreviousDay = () => {
    setCurrentDate(prevDate => subDays(prevDate, 1))
  }

  const handleNextDay = () => {
    setCurrentDate(prevDate => {
      const newDate = addDays(prevDate, 1)
      if (!isAfter(newDate, new Date())) return newDate
      return prevDate
    })
  }

  useEffect(() => {
    if (typeof onDateChange === 'function') {
      onDateChange(format(currentDate, 'yyyy-MM-dd'))
    }
  }, [currentDate, onDateChange])

  const isSignUpPage = location.pathname === '/signup'
  const isLoginPage = location.pathname === '/login'
  const isCalendarPage = location.pathname.includes('/calendar')
  const isHomePage = location.pathname.includes('/home')

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/login"><img src='https://i.imgur.com/QpaCVKn.png' width={40} alt="Logo" /></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {loggedIn ? (
            <>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              {(isCalendarPage || isHomePage) && (
                <Nav className="calendar">
                  <button onClick={handlePreviousDay}>{'<'}</button>
                  <span>{format(currentDate, 'MM-dd')}</span>
                  <button onClick={handleNextDay} disabled={isAfter(currentDate, new Date())}>{'>'}</button>
                </Nav>
              )}
            </>
          ) : isSignUpPage ? (
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
          )}
        </Nav>
        {loggedIn && (
          <Nav className='ml-auto'>
            {!isCalendarPage && (
              <Link to={`/calendar/${username}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-heart-fill" viewBox="0 0 16 16">
                  <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
                </svg>
              </Link>
            )}
            {isCalendarPage && (
              <Link to={`/home/${username}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-fill" viewBox="0 0 16 16">
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1V.5a.5.5 0 0 0-.5.5v1.293z"/>
                  <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
                </svg>
              </Link>
            )}
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}