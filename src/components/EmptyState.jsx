import { Link } from 'react-router-dom'
import { Clapperboard } from 'lucide-react'
import './Media.css'

export default function EmptyState({ title, message, action = 'Explore titles', to = '/movies' }) {
  return <section className="empty-state"><div className="empty-state-icon"><Clapperboard size={24} /></div><h2>{title}</h2><p>{message}</p><Link className="button-primary" to={to}>{action}</Link></section>
}
