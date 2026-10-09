import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/appContext.js'
import { useAuth } from '../context/authContext.js'
import ProfileAvatar from '../components/ProfileAvatar.jsx'
import './Pages.css'

export default function Profile() {
  const { profile, myList, continueWatching } = useApp()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const name = profile?.name || user?.name || 'Guest'
  const logout = () => { signOut(); navigate('/login') }

  return <main className="account-page page-wrap"><div className="page-intro"><span className="section-kicker">ACCOUNT</span><h1>Account</h1><p>Manage your NEXFLIX profile and preferences.</p></div><section className="account-card"><div className="account-profile"><ProfileAvatar name={name} color={profile?.color || '#466a84'} size={55} /><div><b>{name}</b><span>{user?.email || 'Guest profile · this device only'}</span></div><Link to="/profiles">Switch profile</Link></div><div className="account-grid"><article><span>MEMBERSHIP</span><b>NEXFLIX Demo</b><p>Local UI prototype · no billing details</p><button type="button" onClick={() => window.alert('Membership settings are available in this demo prototype.')}>Manage membership</button></article><article><span>PROFILE & PARENTAL CONTROLS</span><b>{name}{profile?.kids ? ' · Kids' : ''}</b><p>Profile, maturity rating, language</p><Link to="/profiles">Manage profiles</Link></article><article><span>SECURITY</span><b>{user ? 'Email sign-in' : 'Guest session'}</b><p>{user?.email || 'Create a local profile to personalize this device.'}</p><Link to={user ? '/settings' : '/login'}>{user ? 'Security settings' : 'Sign in'}</Link></article><article><span>PLAYBACK SETTINGS</span><b>Language & autoplay</b><p>Customize subtitles and playback behavior</p><Link to="/settings">Open settings</Link></article></div><div className="account-quick-links"><Link to="/my-list">My List <b>{myList.length}</b></Link><Link to="/continue-watching">Continue Watching <b>{continueWatching.length}</b></Link></div><button type="button" className="account-signout" onClick={logout}>Sign out</button></section></main>
}
