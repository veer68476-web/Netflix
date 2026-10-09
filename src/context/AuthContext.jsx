import { useCallback, useMemo } from 'react'
import { AuthContext } from './authContext.js'
import useLocalStorage from '../hooks/useLocalStorage.js'

const demoAccount = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@nexflix.local',
  password: 'demo123',
  createdAt: Date.now(),
}

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('nexflix-user', null)
  const [accounts, setAccounts] = useLocalStorage('nexflix-accounts', [demoAccount])

  const signIn = useCallback((email, password) => {
    const normalizedEmail = String(email ?? '').trim().toLowerCase()
    const normalizedPassword = String(password ?? '')
    const match = accounts.find((account) => account.email.toLowerCase() === normalizedEmail && account.password === normalizedPassword)

    if (!match) return false

    setUser({ id: match.id, email: match.email, name: match.name, signedInAt: Date.now() })
    return true
  }, [accounts, setUser])

  const signUp = useCallback((name, email, password) => {
    const cleanedName = String(name ?? '').trim()
    const normalizedEmail = String(email ?? '').trim().toLowerCase()
    const cleanedPassword = String(password ?? '')

    if (cleanedName.length < 2) return { ok: false, error: 'Please enter a valid display name.' }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return { ok: false, error: 'Please enter a valid email address.' }
    if (cleanedPassword.length < 6) return { ok: false, error: 'Your password must be at least 6 characters long.' }

    const alreadyExists = accounts.some((account) => account.email.toLowerCase() === normalizedEmail)
    if (alreadyExists) return { ok: false, error: 'An account with this email already exists.' }

    const newAccount = {
      id: `user-${Date.now()}`,
      name: cleanedName,
      email: normalizedEmail,
      password: cleanedPassword,
      createdAt: Date.now(),
    }

    setAccounts((current) => [...current, newAccount])
    setUser({ id: newAccount.id, email: newAccount.email, name: cleanedName, signedInAt: Date.now() })
    return { ok: true }
  }, [accounts, setAccounts, setUser])

  const signOut = useCallback(() => setUser(null), [setUser])
  const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user, signIn, signUp, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
