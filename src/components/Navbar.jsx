import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Menu, Search, X } from 'lucide-react'
import { useApp } from '../context/appContext.js'
import { useAuth } from '../context/authContext.js'
import './Navbar.css'

const navigation = [
  { label: 'Home', to: '/home' },
  { label: 'TV Shows', to: '/tv-shows' },
  { label: 'Movies', to: '/movies' },
  { label: 'New & Popular', to: '/new-and-popular' },
  { label: 'My List', to: '/my-list' },
  { label: 'Browse by Languages', to: '/languages' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchInputRef = useRef(null)
  const profileMenuRef = useRef(null)
  const { profile } = useApp()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (!profileMenuOpen) return undefined
    const dismiss = (event) => {
      if (event.type === 'keydown' && event.key === 'Escape') setProfileMenuOpen(false)
      if (event.type === 'pointerdown' && !profileMenuRef.current?.contains(event.target)) setProfileMenuOpen(false)
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', dismiss)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', dismiss)
    }
  }, [profileMenuOpen])

  function submitSearch(event) {
    event.preventDefault()
    const term = query.trim()
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/search')
    setSearchOpen(false)
    setMenuOpen(false)
  }

  function logout() {
    signOut()
    setProfileMenuOpen(false)
    navigate('/login')
  }

  const initials = profile?.name?.slice(0, 1).toUpperCase() || 'U'

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nav-shell">
        <Link className="brand" to="/home" aria-label="NEXFLIX home"><span className="brand-mark">N</span><span>NEXFLIX</span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/home'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{item.label}</NavLink>)}
        </nav>
        <div className="nav-actions">
          {searchOpen ? <form className="nav-search" onSubmit={submitSearch} role="search"><Search size={17} aria-hidden="true" /><input ref={searchInputRef} aria-label="Search titles" placeholder="Search for movies, shows, genres..." value={query} onChange={(event) => setQuery(event.target.value)} /><button type="button" className="icon-button search-close" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={17} /></button></form> : <button type="button" className="icon-button" aria-label="Open search" onClick={() => setSearchOpen(true)}><Search size={20} /></button>}
          <Link className="icon-button notification-button" to="/new-and-popular" aria-label="New and popular"><Bell size={19} /><span className="notification-dot" /></Link>
          <div className="profile-menu-wrap" ref={profileMenuRef}>
            <button type="button" className="profile-control" aria-label="Open profile menu" aria-expanded={profileMenuOpen} onClick={() => setProfileMenuOpen((open) => !open)}><span className="profile-avatar" style={{ '--avatar-color': profile?.color }}>{initials}</span><ChevronDown size={15} /></button>
            {profileMenuOpen && <div className="profile-dropdown" role="menu"><Link role="menuitem" to="/profiles" onClick={() => setProfileMenuOpen(false)}>Manage Profiles</Link><Link role="menuitem" to="/account" onClick={() => setProfileMenuOpen(false)}>Account</Link><Link role="menuitem" to="/settings" onClick={() => setProfileMenuOpen(false)}>Settings</Link><a role="menuitem" href="mailto:help@nexflix.example" onClick={() => setProfileMenuOpen(false)}>Help Center</a><span className="dropdown-divider" /><button role="menuitem" type="button" onClick={logout}>Sign Out</button></div>}
          </div>
          <button type="button" className="icon-button mobile-menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {menuOpen && <nav className="mobile-menu" aria-label="Mobile navigation">{navigation.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>{item.label}</NavLink>)}<NavLink to="/search" onClick={() => setMenuOpen(false)} className="mobile-nav-link">Search</NavLink><NavLink to="/account" onClick={() => setMenuOpen(false)} className="mobile-nav-link">Account</NavLink></nav>}
    </header>
  )
}
