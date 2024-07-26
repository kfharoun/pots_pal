import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Calendar from 'react-calendar'
import axios from 'axios'
import Header from './Header'
import 'react-calendar/dist/Calendar.css'

const CalendarPage = () => {
  const { username } = useParams()
  const [datesWithStatus, setDatesWithStatus] = useState({})

  useEffect(() => {
    const getDayData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/days/${username}/`)
        const data = response.data
        const datesStatus = data.reduce((acc, day) => {
          acc[day.date] = {
            good_day: day.good_day,
            neutral_day: day.neutral_day,
            nauseous: day.nauseous,
            fainting: day.fainting,
            bed_bound: day.bed_bound
          }
          return acc
        }, {})
        setDatesWithStatus(datesStatus)
      } catch (error) {
        console.error('Error getting data:', error)
      }
    }
    getDayData()
  }, [username])

//   •	data is the array being reduced.
//   •	acc is the accumulator, which starts as an empty object ({}) and is used to build up the final result.
//   •	day is the current item in the array as reduce iterates over it.


  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0]
      const status = datesWithStatus[dateString]
      if (status) {
        const dots = []
        if (status.good_day) dots.push(<div key="good" className="dot good-day"></div>)
        if (status.neutral_day) dots.push(<div key="neutral" className="dot neutral-day"></div>)
        if (status.nauseous) dots.push(<div key="nauseous" className="dot nauseous"></div>)
        if (status.fainting) dots.push(<div key="fainting" className="dot fainting"></div>)
        if (status.bed_bound) dots.push(<div key="bed_bound" className="dot bed-bound"></div>)
        return <div className="dots">{dots}</div>
      }
    }
    return null
  }

  return (
    <div className="calendar-page">
    <Header/>
        
      <Calendar
        tileContent={tileContent}
        // calendarType="ISO 8601"
      />
    </div>
  )
}

export default CalendarPage