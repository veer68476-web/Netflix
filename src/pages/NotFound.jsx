import { Link } from 'react-router-dom'
import { ArrowLeft, Clapperboard } from 'lucide-react'
import './Pages.css'

export default function NotFound() {
  return <main className="not-found-page"><div className="empty-state-icon"><Clapperboard size={24} /></div><span className="section-kicker">OUT OF FRAME</span><h1>404</h1><p>Looks like you wandered off screen. Let’s get you back to the good stuff.</p><Link className="button-primary" to="/"><ArrowLeft size={16} /> Back to home</Link></main>
}
