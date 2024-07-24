import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function Home() {
  const { username } = useParams()

  return (
    <div>
      <h1>✨ welcome back, {username} ✨</h1>
    </div>
  )
}