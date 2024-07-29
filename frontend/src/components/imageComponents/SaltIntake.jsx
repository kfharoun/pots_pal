import React from 'react'

const SaltIntake = ({ saltIntake, onIncrement, onDecrement }) => {
  const fullSaltImage = 'https://i.imgur.com/ZxaQX3K.png'
  const emptySaltImage = 'https://i.imgur.com/U6ZXpH6.png'
  const saltUnits = saltIntake / 800

  const images = []

  for (let i = 0; i < 6; i++) {
    images.push(
      <img
        key={i}
        src={i < saltUnits ? fullSaltImage : emptySaltImage}
        alt="Salt level"
        width="50px"
        height="auto"
        style={{ cursor: 'pointer' }}
        onClick={() => i < saltUnits ? onDecrement() : onIncrement()}
        className='salt-pic'
      />
    )
  }

  return <div>{images}</div>
}

export default SaltIntake