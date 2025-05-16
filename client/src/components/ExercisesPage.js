// src/components/ExercisesPage.jsx
import React, { useState } from 'react'
import ExerciseCard from './ExerciseCard'

export default function ExercisesPage({ cats, setCats }) {
  const [openCatId, setOpenCatId] = useState(null)
  //console.log('Exercise Records:', exerciseRecords)
  const handleDelete = async (id) => {
  await fetch(`/exercises/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })

  setCats(prevCats =>
    prevCats
      // use map to filter out the exercise
      .map(cat => ({
        ...cat,
        exercises: cat.exercises.filter(ex => ex.id !== id)
      }))
      //filter empty cats
      .filter(cat => cat.exercises.length > 0)
  )
}


  const handleEdit = async (id, updates) => {
    const res = await fetch(`/exercises/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (res.ok) {
      const edited = await res.json()

    setCats(prevCats =>
      prevCats.map(cat => {
      // if this category doesn’t contain our exercise, leave it untouched
        if (!cat.exercises.some(ex => ex.id === id)) return cat

        // otherwise, return a new category object with its exercises array updated
        return {
          ...cat,
          exercises: cat.exercises.map(ex =>
            ex.id === id ? edited : ex
          )
      }
      })
    )
    }
  }

  return (
    <div style={{ padding: '16px' }}>
      <h1>My Exercises</h1>

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
              color: openCatId === cat.id ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
      {cats.map(cat => {
        if (cat.id !== openCatId) return null
        return (
          <div key={cat.id}>
            {cat.exercises.map(ex => (
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
