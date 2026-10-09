import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext.js'
import { useApp } from '../context/appContext.js'
import './Pages.css'

export default function Login() {
  const { signIn } = useAuth()
  const { setProfile } = useApp()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const emailValue = form.get('email')
    const passwordValue = form.get('password')
    const email = typeof emailValue === 'string' ? emailValue.trim() : ''
    const password = typeof passwordValue === 'string' ? passwordValue : ''

    if (!email || !password) {
      setError('Enter your email and password to continue.')
      return
    }

    const signedIn = signIn(email, password)
    if (!signedIn) {
      setError('No account matches that email and password. Try the demo account or create a new one.')
      return
    }

    const formattedName = email.split('@')[0].replace(/[._-]/g, ' ').trim() || 'My Profile'
    setProfile({ id: `profile-${email}`, name: formattedName, color: '#466a84', kids: false })
    setError('')
    navigate('/home')
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="section-kicker">WELCOME BACK</span>
        <h1>Sign in</h1>
        <p>Pick up where your next favorite left off.</p>
        <form className="auth-form" onSubmit={submit}>
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required minLength="6" placeholder="Your password" />
          </label>
          {error && <span className="auth-error" role="alert">{error}</span>}
          <button type="submit" className="button-primary">Sign in</button>
        </form>
        <button className="auth-forgot" type="button" onClick={() => setNotice('Password recovery is not connected in this local demo. Use demo@nexflix.local / demo123 for quick access.')}>Forgot password?</button>
        {notice && <output className="auth-note">{notice}</output>}
        <div className="auth-switch">New to NEXFLIX? <Link to="/signup">Create an account</Link></div>
        <p className="auth-note">Demo mode: accounts are saved locally on this device for a realistic prototype experience.</p>
      </section>
    </main>
  )
}
