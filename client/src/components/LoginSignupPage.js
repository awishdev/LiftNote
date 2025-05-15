import { useFormik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'


export default function LoginSignupPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  // set up formik with initial values and validation schema
  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().min(3).required('Username is required'),
      password: Yup.string().min(3).required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const endpoint = isLogin ? '/login' : '/register'
        const res = await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const data = await res.json()
        if (res.ok) {
          onLogin(data)
        } else {
          setErrors({ submit: data.error })
        }
      } catch (err) {
        setErrors({ submit: err.message })
      } finally {
        setSubmitting(false)
        //console.log("login fetch")
      }
    }
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

      <input
        name="username"
        placeholder="Username"
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.username && formik.errors.username && (
        <div className="error">{formik.errors.username}</div>
      )}

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.password && formik.errors.password && (
        <div className="error">{formik.errors.password}</div>
      )}

      {formik.errors.submit && (
        <div className="error">{formik.errors.submit}</div>
      )}

      <button type="submit" disabled={formik.isSubmitting}>
        {isLogin ? 'Login' : 'Register'}
      </button>

      <button
        type="button"
        onClick={() => {
          setIsLogin(!isLogin)
          formik.resetForm()
        }}
      >
        {isLogin ? 'Need an account?' : 'Have an account?'}
      </button>
    </form>
  )
}

