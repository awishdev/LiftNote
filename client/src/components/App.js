import React, {useEffect, useState} from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import NavBar from './NavBar'
import LoginSignupPage from './LoginSignupPage'
import CategoriesPage from './CategoriesPage'
import ExercisesPage from './ExercisesPage'
import AddExercisePage from './AddExercisePage'

export default function App() {

  const [user, setUser] = useState(null)
    useEffect(() => {
    fetch('/check_session', { credentials: 'include' })
      .then(res => res.json())
      .then(data => { if (!data.error) setUser(data); });
  }, []);

  return (
    <BrowserRouter>
      {user
        ? <>
            <NavBar onLogout={() => setUser(null)} />
            <Routes>
              <Route path="/" element={<CategoriesPage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/add" element={<AddExercisePage />} />
              {/* catch‐all redirects back home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        : <Routes>
            <Route
              path="/login"
              element={<LoginSignupPage onLogin={setUser} />}
            />
            {/* any other path → login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      }
    </BrowserRouter>
  )
}
