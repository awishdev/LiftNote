import React, { useState, useEffect } from 'react'

export default function ExercisesPage() {
  const [grouped, setGrouped] = useState([])

  useEffect(() => {
    fetch('/exercises', { credentials: 'include' })
      .then(r => r.json())
      .then(setGrouped)
  }, [])

  return (
    <div>
      <h1>My Exercises</h1>
      {grouped.map(g => (
        <div key={g.category.id}>
          <h2>{g.category.name}</h2>
          <ul>
            {g.exercises.map(e => (
              <li key={e.id}>
                {e.name} — {e.record} on {e.date}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
