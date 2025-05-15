// src/components/ExercisesPage.jsx
import React, { useState } from 'react'
import ExerciseCard from './ExerciseCard'

export default function ExercisesPage({ cats, exerciseRecords, setExerciseRecords }) {
  const [openCatId, setOpenCatId] = useState(null)
  //console.log('Exercise Records:', exerciseRecords)
  // Handler to delete via API and update state
  const handleDelete = async (id) => {
    await fetch(`/exercises/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    setExerciseRecords(prev => prev.filter(e => e.id !== id))
  }

  // Handler to patch via API and update state
  const handleEdit = async (id, updates) => {
    const res = await fetch(`/exercises/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (res.ok) {
      const edited = await res.json()
      setExerciseRecords(prev =>
        prev.map(e => (e.id === id ? edited : e))
      )
    }
  }

  return (
    <div style={{ padding: '16px' }}>
      <h1>My Exercises</h1>

      {/* Category selector */}
      <div style={{ marginBottom: '16px' }}>
        {cats.map(cat => (
          <button
            key={cat.id}
            onClick={() =>
              setOpenCatId(prev => (prev === cat.id ? null : cat.id))
            }
            style={{
              padding: '8px 16px',
              marginRight: '8px',
              backgroundColor: openCatId === cat.id ? '#007bff' : '#f0f0f0',
              color: openCatId === cat.id ? '#fff'     : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Render only the open category’s exercises */}
      {cats.map(cat => {
        if (cat.id !== openCatId) return null
        const myExs = exerciseRecords.filter(er => er.category_id === cat.id)
        return (
          <div key={cat.id}>
            {myExs.map(ex => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
