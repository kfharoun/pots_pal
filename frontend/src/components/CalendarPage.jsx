import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Calendar from 'react-calendar'
import axios from 'axios'
import Header from './Header'
// import 'react-calendar/dist/Calendar.css'

const CalendarPage = () => {
    const { username } = useParams()
    const [datesWithStatus, setDatesWithStatus] = useState({})
    const [selectedFilter, setSelectedFilter] = useState(null)
    const [aggregatedData, setAggregatedData] = useState({})
  
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
  
    useEffect(() => {
      const fetchAggregatedData = async () => {
        if (selectedFilter) {
          try {
            const response = await axios.get(`http://localhost:8000/days/${username}/aggregate/${selectedFilter}/`)
            setAggregatedData(response.data)
          } catch (error) {
            console.error('Error fetching aggregated data:', error)
          }
        }
      }
      fetchAggregatedData()
    }, [username, selectedFilter])
  
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
  
    const handleFilterClick = (filter) => {
      setSelectedFilter(filter)
    }
  
    const renderAggregatedData = (data) => {
      return (
        <div>
          <p>Meal Items: {JSON.stringify(data.meal_items)}</p>
          <p>Activity Items: {JSON.stringify(data.activity_items)}</p>
          <p>Water Intake: {data.water_intake}</p>
          <p>Salt Intake: {data.salt_intake}</p>
          <p>Weather: {data.weather}</p>
          <p>Low Heart Rate: {data.low_heart_rate}</p>
          <p>High Heart Rate: {data.high_heart_rate}</p>
        </div>
      )
    }

    return (
        <div className="calendar-page">
          <Header />
          <Calendar tileContent={tileContent} />
          <div className="filter-buttons">
            <button onClick={() => handleFilterClick('good_day')}>
              {selectedFilter === 'good_day' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-emoji-smile-fill" viewBox="0 0 16 16">
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-emoji-smile" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
                </svg>
              )}
            </button>
            <button onClick={() => handleFilterClick('neutral_day')}>
              {selectedFilter === 'neutral_day' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-emoji-neutral-fill" viewBox="0 0 16 16">
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m-3 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-emoji-neutral" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M4 10.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5m3-4C7 5.672 6.552 5 6 5s-1 .672-1 1.5S5.448 8 6 8s1-.672 1-1.5m4 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5S9.448 8 10 8s1-.672 1-1.5"/>
                </svg>
              )}
            </button>
            <button onClick={() => handleFilterClick('bad_day')}>
              {selectedFilter === 'bad_day' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-emoji-frown-fill" viewBox="0 0 16 16">
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m-2.715 5.933a.5.5 0 0 1-.183-.683A4.5 4.5 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 0 1-.866.5A3.5 3.5 0 0 0 8 10.5a3.5 3.5 0 0 0-3.032 1.75.5.5 0 0 1-.683.183M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-emoji-frown" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
          </svg>
        )}
      </button>
    </div>

    {selectedFilter && (
      <div className="aggregated-data">
        <h3>Aggregated Data for {selectedFilter.replace('_', ' ')}:</h3>
        <h4>Current Day:</h4>
        {renderAggregatedData(aggregatedData.current_day)}
        <h4>Day Before:</h4>
        {renderAggregatedData(aggregatedData.day_before)}
        <h4>Day After:</h4>
        {renderAggregatedData(aggregatedData.day_after)}
      </div>
    )}
  </div>
)
}

export default CalendarPage
