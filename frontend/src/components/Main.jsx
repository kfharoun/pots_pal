import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Home from './Home'
import CalendarPage from './CalendarPage'
import DailyLog from './DailyLog'
import LoginButton from './LogIn'
import SignUp from './SignUp'

export default function Main() {
  return (
    <div className="Main">
      <Routes>
        <Route path="/home/:username" element={<Home />} />
        <Route path="/calendar" element={<CalendarPage/>} />
        <Route path="/log/:username" element={<DailyLog/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginButton />} />
      </Routes>
    </div>
  )
}