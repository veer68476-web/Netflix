import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext.js'
import { useApp } from '../context/appContext.js'
import './Pages.css'

export default function Signup() {
  const { signUp } = useAuth()
  const { setProfile } = useApp()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const nameValue = form.get('name')
    const emailValue = form.get('email')
    const passwordValue = form.get('password')
    const confirmationValue = form.get('confirmation')
    const name = typeof nameValue === 'string' ? nameValue.trim() : ''
    const email = typeof emailValue === 'string' ? emailValue.trim() : ''
    const password = typeof passwordValue === 'string' ? passwordValue : ''
    const confirmation = typeof confirmationValue === 'string' ? confirmationValue : ''

    if (password !== confirmation) {
      setError('Those passwords do not match.')
      return
    }

    const result = signUp(name, email, password)
    if (!result.ok) {
      setError(result.error)
      return
    }

    setProfile({ id: `profile-${email}`, name: name.split(' ')[0] || 'My Profile', color: '#466a84', kids: false })
    setError('')
    navigate('/home')
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="section-kicker">YOUR NEXT FAVORITE AWAITS</span>
        <h1>Create account</h1>
        <p>Set up a local demo profile and start streaming instantly.</p>
        <form className="auth-form" onSubmit={submit}>
          <label>
            Name
            <input name="name" autoComplete="name" required minLength="2" placeholder="Your name" />
          </label>
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="new-password" required minLength="6" placeholder="At least 6 characters" />
          </label>
          <label>
            Confirm password
            <input name="confirmation" type="password" autoComplete="new-password" required minLength="6" placeholder="Enter it again" />
          </label>
          {error && <span className="auth-error" role="alert">{error}</span>}
          <button type="submit" className="button-primary">Create account</button>
        </form>
        <div className="auth-switch">Already have a profile? <Link to="/login">Sign in</Link></div>
        <p className="auth-note">Demo mode: this is a local prototype app, so your account details stay on this device only.</p>
      </section>
    </main>
  )
}
