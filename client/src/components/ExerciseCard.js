// src/components/ExerciseCard.jsx
import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export default function ExerciseCard({ exercise, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name:   exercise.name,
      record: exercise.record,
      date:   exercise.date
    },
    validationSchema: Yup.object({
      name:   Yup.string().required('Name is required'),
      record: Yup.string().required('Record is required'),
      date:   Yup.date().required('Date is required')
    }),
    onSubmit: (values, { setSubmitting }) => {
      onEdit(exercise.id, values)
      setSubmitting(false)
      setIsEditing(false)
    }
  })

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '8px',
      marginBottom: '8px',
      borderRadius: '4px'
    }}>
      {isEditing ? (
        <form onSubmit={formik.handleSubmit}>
          <div style={{ marginBottom: '4px' }}>
            <input
              name="name"
              placeholder="Exercise name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginRight: '8px' }}
            />
            {formik.touched.name && formik.errors.name && (
              <div style={{ color: 'red' }}>{formik.errors.name}</div>
            )}
          </div>

          <div style={{ marginBottom: '4px' }}>
            <input
              name="record"
              placeholder="e.g. 200 lbs"
              value={formik.values.record}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginRight: '8px' }}
            />
            {formik.touched.record && formik.errors.record && (
              <div style={{ color: 'red' }}>{formik.errors.record}</div>
            )}
          </div>

          <div style={{ marginBottom: '8px' }}>
            <input
              name="date"
              type="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginRight: '8px' }}
            />
            {formik.touched.date && formik.errors.date && (
              <div style={{ color: 'red' }}>{formik.errors.date}</div>
            )}
          </div>

          <button type="submit" disabled={formik.isSubmitting} style={{ marginRight: '4px' }}>
            Save
          </button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <b>{exercise.name}</b> — {exercise.record} on {exercise.date}
          <button
            onClick={() => setIsEditing(true)}
            style={{ marginLeft: '12px', marginRight: '4px' }}
          >
            Edit
          </button>
          <button onClick={() => onDelete(exercise.id)}>
            Delete
          </button>
        </>
      )}
    </div>
  )
}
