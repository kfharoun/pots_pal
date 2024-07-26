import React from 'react'

const WaterIntake = ({ waterintake }) => {
  const fullWaterImage = 'https://i.imgur.com/ZxaQX3K.png'
  const emptyWaterImage = 'https://i.imgur.com/U6ZXpH6.png'
  const maxWater = 128
  const saltUnits = waterintake / 21.33 + 2

  const images = []

  for (let i = 0; i < 6; i++) {
    images.push(
      <img
        key={i}
        src={i < saltUnits ? fullWaterImage : emptyWaterImage}
        alt="Water level"
        width="50px"
      />
    )
  }

  return <div>{images}</div>
}

export default WaterIntake