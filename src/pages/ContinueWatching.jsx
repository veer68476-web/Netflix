import { Link } from 'react-router-dom'
import { CirclePlay, X } from 'lucide-react'
import { useApp } from '../context/appContext.js'
import EmptyState from '../components/EmptyState.jsx'
import { movies } from '../data/movies.js'
import './Pages.css'

export default function ContinueWatching() {
  const { continueWatching, removeProgress, profile } = useApp()
  const entries = continueWatching.map((progress) => ({ ...progress, movie: movies.find((item) => item.id === progress.id) || progress })).filter((item) => item.movie?.title && (!profile?.kids || ['PG', 'TV-Y', 'TV-Y7', 'G', 'TV-G', 'TV-PG'].includes(item.movie.rating)))
  return <main className="collection-page page-wrap"><div className="page-intro"><span className="section-kicker">PICK UP WHERE YOU LEFT OFF</span><h1>Continue Watching</h1><p>Your recent viewing, right where you paused.</p></div>{entries.length ? <div className="resume-grid">{entries.map(({ movie, progress }) => { const watchPath = movie.playbackUrl || `/watch/${movie.id}?type=${movie.type || 'movie'}`; return <article className="resume-card" key={movie.id}><Link to={watchPath} className="resume-image"><img src={movie.backdrop} alt={`${movie.title} scene`} loading="lazy" /><span className="resume-play"><CirclePlay size={24} /></span><span className="movie-progress"><span style={{ width: `${progress}%` }} /></span></Link><div className="resume-info"><div><Link to={watchPath}>{movie.title}</Link><span>{Math.round(progress)}% watched</span></div><button type="button" aria-label={`Remove ${movie.title} from Continue Watching`} onClick={() => removeProgress(movie.id)}><X size={17} /></button></div></article> })}</div> : <EmptyState title="Nothing in progress" message="Start watching something and your progress will be saved here." action="Explore titles" to="/movies" />}</main>
}
