// src/components/CategoriesPage.jsx
import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export default function CategoriesPage({cats, setCats}) {


  // load existing categories

  useEffect(() => {
    fetch('/categories', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setCats(d))
  }, [])

  // formik for new‐category form
  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(100, 'Too long!')
        .required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const res = await fetch('/categories', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const data = await res.json()
        if (!res.ok) {
          setErrors({ name: data.error || 'Server error' })
        } else {
          setCats(prev => [...prev, data])
          resetForm()
        }
      } catch (err) {
        setErrors({ name: err.message })
      } finally {
        setSubmitting(false)
        //console.log("cat post")
      }
    },
  })

  return (
    <div>
      <h1>All Categories</h1>

      <form onSubmit={formik.handleSubmit} style={{ marginBottom: 20 }}>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="New category name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <button type="submit" disabled={formik.isSubmitting}>
          Add
        </button>
        {formik.touched.name && formik.errors.name && (
          <div className="error">{formik.errors.name}</div>
        )}
      </form>

      <ul>
        {cats.map(c => (
          <li className='cats' key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  )
}
