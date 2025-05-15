import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import NavBar from './components/NavBar'
import LoginSignupPage from './components/LoginSignupPage'
import CategoriesPage from './components/CategoriesPage'
import ExercisesPage from './components/ExercisesPage'
import AddExercisePage from './components/AddExercisePage'

export default function App({ user, setUser }) {
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
