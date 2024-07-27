import React from 'react'

const WaterIntake = ({ waterIntake, onIncrement, onDecrement }) => {
  const fullWaterImage = (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#D6DEEE" stroke="#EDEDF3" className="bi bi-droplet-fill" viewBox="0 0 16 16">
      <path d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6M6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13"/>
    </svg>
  )

  const emptyWaterImage = (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" stroke="none" fill="#EDEDF3" className="bi bi-droplet" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M7.21.8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
      <path fillRule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z"/>
    </svg>
  )

  const waterUnits = Math.floor(waterIntake / 21)

  const handleClick = (index) => {
    if (index < waterUnits) {
      onDecrement((waterUnits - index) * 21)
    } else {
      onIncrement((index - waterUnits + 1) * 21)
    }
  }

  const images = []

  for (let i = 0; i < 6; i++) {
    images.push(
      <div
        key={i}
        style={{ cursor: 'pointer', display: 'inline-block' }}
        onClick={() => handleClick(i)}
      >
        {i < waterUnits ? fullWaterImage : emptyWaterImage}
      </div>
    )
  }

  return <div>{images}</div>
}

export default WaterIntake

// click on the thing how far is it from the leftmost

//  each subsequent droplet has a value, do increment 3 times if you click on the third droplet 

// "blop blop blop" type beat

// a for loop calls increment/decrement and runs it, ternary is for like water level