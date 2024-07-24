import { Route, Routes } from 'react-router-dom';
import Home from './Home'
import CalendarPage from './CalendarPage';
import DailyLog from './DailyLog';
import LoginButton from './LogIn';

export default function Main() {
    return (
        <div className='Main'>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/log" element={<DailyLog/>} />
            <Route path="/login" element={<LoginButton/>} />
        </Routes>
        </div>
    )
}