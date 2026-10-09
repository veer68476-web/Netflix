import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Plus, Trash2 } from 'lucide-react'
import ProfileAvatar from '../components/ProfileAvatar.jsx'
import { useApp } from '../context/appContext.js'
import './Pages.css'

export default function Profiles() {
  const { profiles, profile, setProfile, addProfile, removeProfile } = useApp()
  const [manage, setManage] = useState(false)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const choose = (item) => {
    if (manage) return
    setProfile(item)
    void navigate('/home')
  }
  const submitProfile = (event) => {
    event.preventDefault()
    const nextName = name.trim()
    if (!nextName) return
    const nextProfile = addProfile(nextName)
    setProfile(nextProfile)
    setName('')
    setAdding(false)
    setManage(false)
    void navigate('/home')
  }

  return <main className="profiles-page"><div className="profiles-content"><span className="section-kicker">NEXFLIX · WHO’S WATCHING?</span><h1>{manage ? 'Manage Profiles' : 'Who’s watching?'}</h1><div className="profile-grid">{profiles.map((item) => <div className={`profile-tile${profile?.id === item.id ? ' is-current' : ''}`} key={item.id}><button type="button" className="profile-tile-select" onClick={() => choose(item)} disabled={manage}><ProfileAvatar name={item.name} color={item.color} size={96} /><span>{item.name}</span>{item.kids && <small>Kids</small>}</button>{manage && <button className="profile-remove" type="button" aria-label={`Remove ${item.name} profile`} onClick={() => removeProfile(item.id)}><Trash2 size={16} /></button>}</div>)}
      {!manage && <button type="button" className="add-profile-tile" onClick={() => { setManage(false); setAdding(true) }}><span><Plus size={30} /></span><small>Add Profile</small></button>}
    </div>
    {adding && <form className="add-profile-form" onSubmit={submitProfile}><label htmlFor="new-profile-name">Profile name</label><input id="new-profile-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={24} placeholder="Enter a name" /><button className="button-primary" type="submit"><Check size={15} /> Create profile</button><button className="profile-cancel" type="button" onClick={() => setAdding(false)}>Cancel</button></form>}
    <button type="button" className={`manage-profiles-button${manage ? ' active' : ''}`} onClick={() => { setManage((value) => !value); setAdding(false) }}>{manage ? 'Done' : 'Manage Profiles'}</button></div></main>
}
