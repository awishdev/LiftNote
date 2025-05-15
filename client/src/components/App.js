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
  const [exercises, setExercises] = useState([])
  const [categories, setCategories] = useState([])
  const [user, setUser] = useState(null)
    useEffect(() => {
    fetch('/check_session', { credentials: 'include' })
      .then(res => res.json())
      .then(data => { if (!data.error) {
        setUser(data);
        setExercises(data.user.exercises);
        setCategories(data.categories);
        //debugger;
      }
        console.log('User is logged in:', data);
       });
  }, []);

  function loginDataHandler(data) {
    console.log('User logged in:', data);
    setUser(data.user);
    setExercises(data.user.exercises);
    setCategories(data.categories);
    //debugger;
  }

  //add function to add a new exercise to state
  function addExercise(newExercise) {
    console.log('Adding exercise:', newExercise)
    
    setExercises([...exercises, newExercise]);
  }



  return (
    <BrowserRouter>
      {user
        ? <>
            <NavBar onLogout={() => setUser(null)} />
            <Routes>
              <Route path="/" element={<CategoriesPage cats={categories} setCats={setCategories}/>} />
              <Route path="/exercises" element={<ExercisesPage cats={categories} exerciseRecords={exercises} setExerciseRecords={setExercises}/>} />
              <Route path="/add" element={<AddExercisePage cats={categories} onAdd={addExercise}/>} />
              {/* catch‐all redirects back home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        : <Routes>
            <Route
              path="/login"
              element={<LoginSignupPage onLogin={loginDataHandler} />}
            />
            {/* any other path → login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      }
    </BrowserRouter>
  )
}
