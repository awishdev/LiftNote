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
  //const [exercises, setExercises] = useState([])
  const [categories, setCategories] = useState([])
  const [userCategories, setUserCategories] = useState([])
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch('/check_session', { credentials: 'include' })
      .then(res => res.json())
      .then(data => { if (!data.error) {
        setUser(data);
        //setExercises(data.user.exercises);
        setCategories(data.categories);
        setUserCategories(data.user.categories)
        //debugger;
      }
        console.log('User is logged in:', data);
       });
  }, []);

  function loginDataHandler(data) {
    console.log('User logged in:', data);
    setUser(data.user);
    setUserCategories(data.user.categories);
    setCategories(data.categories);
    //debugger;
  }

  //add function to add a new exercise to state
function addExercise(newExercise) {

  setUserCategories(prevCats => {
    // get the category object for the new exercise cat id
    const catObj = categories.find(c => c.id === newExercise.category_id)

    // check for category
    const exists = prevCats.some(c => c.id === catObj.id)

    if (exists) {
      return prevCats.map(c =>
        c.id === catObj.id
          ? { 
              ...c,
              exercises: [...c.exercises, newExercise]
            }
          : c
      )
    } else {
      // if new category, add it
      return [
        ...prevCats,
        {
          ...catObj,
          exercises: [newExercise]
        }
      ]
    }
  })
}



  return (
    <BrowserRouter>
      {user
        ? <>
            <NavBar onLogout={() => setUser(null)} />
            <Routes>
              <Route path="/" element={<CategoriesPage cats={categories} setCats={setCategories}/>} />
              <Route path="/exercises" element={<ExercisesPage cats={userCategories} setCats={setUserCategories}/*exerciseRecords={exercises} setExerciseRecords={setExercises}*//>} />
              <Route path="/add" element={<AddExercisePage cats={categories} onAdd={addExercise}/>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        : <Routes>
            <Route
              path="/login"
              element={<LoginSignupPage onLogin={loginDataHandler} />}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      }
    </BrowserRouter>
  )
}
