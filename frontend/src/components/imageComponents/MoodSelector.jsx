import React from 'react'

const MoodSelector = ({ selectedMood, onSelectMood }) => {
  const moods = [
    { id: 'good_day', selectedImage: 'https://i.imgur.com/6CW3XSn.png', unselectedImage: 'https://i.imgur.com/72UvQoz.png' },
    { id: 'neutral_day', selectedImage: 'https://i.imgur.com/neutral_day_selected.png', unselectedImage: 'https://i.imgur.com/neutral_day_unselected.png' },
    { id: 'nauseous', selectedImage: 'https://i.imgur.com/h1XFrgR.png', unselectedImage: 'https://i.imgur.com/CUvTcF4.png' },
    { id: 'fainting', selectedImage: 'https://i.imgur.com/bAbbAv1.png', unselectedImage: 'https://i.imgur.com/AyZ6CMY.png' },
    { id: 'bed_bound', selectedImage: 'https://i.imgur.com/c2rBCS2.png', unselectedImage: 'https://i.imgur.com/2DgdRUp.png' },
  ]

  return (
    <div className="mood-selector">
      {moods.map(mood => (
        <img
          key={mood.id}
          src={selectedMood === mood.id ? mood.selectedImage : mood.unselectedImage}
          alt={mood.id}
          width="50px"
          height="50px"
          style={{ cursor: 'pointer' }}
          onClick={() => onSelectMood(mood.id)}
        />
      ))}
    </div>
  )
}

export default MoodSelector