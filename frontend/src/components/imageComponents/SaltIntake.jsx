import React from 'react'

const SaltIntake = ({ saltIntake }) => {
  const fullSaltImage = 'https://i.imgur.com/ZxaQX3K.png'
  const emptySaltImage = 'https://i.imgur.com/U6ZXpH6.png'
  const maxSalt = 4800
  const saltUnits = saltIntake / 800

  const images = []

  for (let i = 0; i < 6; i++) {
    images.push(
      <img
        key={i}
        src={i < saltUnits ? fullSaltImage : emptySaltImage}
        alt="Salt level"
        width="50px"
      />
    )
  }

  return <div>{images}</div>
}

export default SaltIntake