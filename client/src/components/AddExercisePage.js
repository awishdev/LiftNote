import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'

export default function AddExercisePage({cats, onAdd}) {
  //const [categories, setCategories] = useState([])
  const navigate = useNavigate()
  /* refactored away
  useEffect(() => {
    fetch('/categories', { credentials: 'include' })
      .then(r => r.json())
      .then(setCategories)
  }, [])*/

  console.log('Categories:', cats)

  const formik = useFormik({
    initialValues: {
      name: '',
      record: '',
      date: '',
      category_id: ''
    },
    validationSchema: Yup.object({
      name:        Yup.string().max(100).required('Required'),
      record:      Yup.string().max(100).required('Required'),
      date:        Yup.date().max(new Date(), 'Date cannot be in the future').required('Required'),
      category_id: Yup.number().required('Required'),
    }),
    onSubmit: async (values) => {
      const res = await fetch('/exercises', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      if (res.ok) {
        const data = await res.json()
        onAdd(data)
        navigate('/exercises')
      }
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <h1>Add New Exercise</h1>

      <input
        name="name"
        placeholder="Exercise Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}

      <input
        name="record"
        placeholder="e.g. 200 lbs"
        value={formik.values.record}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.record && formik.errors.record && <div>{formik.errors.record}</div>}

      <input
        name="date"
        type="date"
        value={formik.values.date}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.date && formik.errors.date && <div>{formik.errors.date}</div>}

      <select
        name="category_id"
        value={formik.values.category_id}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      >
        <option value="">Select Category</option>
        {cats.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      {formik.touched.category_id && formik.errors.category_id && <div>{formik.errors.category_id}</div>}

      <button type="submit">Save</button>
    </form>
  )
}
