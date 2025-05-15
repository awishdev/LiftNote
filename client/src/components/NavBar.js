import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar({ onLogout }) {
  return (
    <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ccc' }}>
      <Link to="/"><button>Categories</button></Link>
      <Link to="/exercises"><button>My Exercises</button></Link>
      <Link to="/add"><button>Add Exercise</button></Link>
      <button
        onClick={() => {
          fetch('/logout', {
            method: 'DELETE',
            credentials: 'include'
          }).then(() => onLogout())
        }}
        style={{ marginLeft: 'auto' }}
      >
        Log Out
      </button>
    </nav>
  )
}
