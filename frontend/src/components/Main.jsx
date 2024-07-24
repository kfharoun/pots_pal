import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './Home';
import CalendarPage from './CalendarPage';
import DailyLog from './DailyLog';
import LoginButton from './LogIn';
import Profile from './Profile';


const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <Component /> : <Navigate to="/" />;
}

export default function Main() {
  return (
    <div className="Main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<ProtectedRoute component={CalendarPage} />} />
        <Route path="/log" element={<ProtectedRoute component={DailyLog} />} />
        <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
        <Route path="/login" element={<LoginButton />} />
      </Routes>
    </div>
  )
}