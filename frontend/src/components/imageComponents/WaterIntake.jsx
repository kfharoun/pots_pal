import React from 'react'

const WaterIntake = ({ waterIntake, onIncrement, onDecrement }) => {
  const fullWaterImage = 'https://i.imgur.com/dgyhEIv.png'
  const emptyWaterImage = 'https://i.imgur.com/TQ2YOV8.png'
  const waterUnits = waterIntake / 21

  const images = []

  for (let i = 0; i < 6; i++) {
    images.push(
      <img
        key={i}
        src={i < waterUnits ? fullWaterImage : emptyWaterImage}
        alt="Water level"
        width="50px"
        height="auto"
        style={{ cursor: 'pointer' }}
        onClick={() => i < waterUnits ? onDecrement() : onIncrement()}
      />
    )
  }

  return <div>{images}</div>
}

export default WaterIntake