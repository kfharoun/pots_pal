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
  const isDailyLogPage = location.pathname.includes('/log')

  return (
    <div className='Header'>
      <Navbar bg="#223863" className="navbar-custom">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto nav-container">
            <div className="nav-item-container">
              {loggedIn ? (
                <>
                  <Nav.Link onClick={handleLogout} className="nav-item">Logout</Nav.Link>
                  {!isCalendarPage && (
                    <div className="calendar-nav">
                      <div onClick={handlePreviousDay} className='arrow'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" fill="currentColor" className="bi bi-heart-arrow flipped-arrow" style={{ transform: 'scaleX(-1)' }} viewBox="0 0 16 16">
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                        </svg>
                      </div>
                      <span className='datecal'>{format(currentDate, 'MMMM d')}</span>
                      <div onClick={handleNextDay} disabled={isAfter(currentDate, new Date())} className='arrow'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" fill="currentColor" className="bi bi-heart-arrow" viewBox="0 0 16 16">
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </>
              ) : isSignUpPage ? (
                <Nav.Link as={Link} to="/login" className='nav-item'>Login</Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/signup" className='nav-item'>Sign Up</Nav.Link>
              )}
            </div>
            {loggedIn && (
              <div className="nav-item-container">
                {!isCalendarPage && (
                  <Link to={`/calendar/${username}`} className="nav-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="auto" fill="currentColor" className="bi bi-calendar-heart-fill" viewBox="0 0 16 16">
                      <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
                    </svg>
                  </Link>
                )}
                {isCalendarPage && (
                  <Link to={`/home/${username}`} className="nav-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-house-heart-fill" viewBox="0 0 16 16">
                      <path d="M7.293 1.5a1 1 0 0 1 1.414 0L11 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l2.354 2.353a.5.5 0 0 1-.708.707L8 2.207 1.354 8.853a.5.5 0 1 1-.708-.707z"/>
                      <path d="m14 9.293-6-6-6 6V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5zm-6-.811c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.691 0-5.018"/>
                    </svg>
                  </Link>
                )}
                {isDailyLogPage && (
                  <Link to={`/home/${username}`} className="nav-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="35" fill="currentColor" className="bi bi-house-heart-fill" viewBox="0 0 16 16">
                      <path d="M7.293 1.5a1 1 0 0 1 1.414 0L11 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l2.354 2.353a.5.5 0 0 1-.708.707L8 2.207 1.354 8.853a.5.5 0 1 1-.708-.707z"/>
                      <path d="m14 9.293-6-6-6 6V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5zm-6-.811c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.691 0-5.018"/>
                    </svg>
                  </Link>
                )}
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}