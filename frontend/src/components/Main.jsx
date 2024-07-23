import { Route, Routes } from 'react-router-dom';
import Home from './Home'
import CalendarPage from './CalendarPage';
import DailyLog from './DailyLog';

export default function Main() {
    return (
        <div className='Main'>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/log" element={<DailyLog/>} />
        </Routes>
        </div>
    )
}