import React, { useState, useEffect } from 'react'

export default function CategoriesPage() {
  const [cats, setCats] = useState([])

  useEffect(() => {
    fetch('/categories', { credentials: 'include' })
      .then(r => r.json())
      .then(setCats)
  }, [])

  return (
    <div>
      <h1>All Categories</h1>
      <ul>
        {cats.map(c => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  )
}
