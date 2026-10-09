import { Link } from 'react-router-dom'
import { Bookmark, CirclePlay, Info, Plus, Star, ThumbsUp } from 'lucide-react'
import { useApp } from '../context/appContext.js'
import './Media.css'

export default function MovieCard({ movie }) {
  const { toggleMyList, isInMyList, continueWatching, getTitlePreference, setTitlePreference } = useApp()
  const saved = isInMyList(movie.id)
  const liked = getTitlePreference(movie.id) === 'like'
  const watched = continueWatching.find((item) => item.id === movie.id)
  const detailsPath = `/title/${movie.detailsId || movie.id}?type=${movie.type}`
  const playPath = movie.playbackUrl || `/watch/${movie.id}?type=${movie.type}`
  const ListIcon = saved ? Bookmark : Plus

  return (
    <article className="movie-card">
      <div className="movie-card-art">
        <Link to={detailsPath} className="movie-card-image-link" aria-label={`Open ${movie.title}`}><img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=520&h=760&q=75' }} /></Link>
        {movie.badge && <span className="movie-card-badge">{movie.badge}</span>}
        <span className="movie-card-rating"><Star size={12} fill="currentColor" /> {movie.score}</span>
        {watched && <span className="movie-progress"><span style={{ width: `${Math.min(100, watched.progress)}%` }} /></span>}
        <div className="movie-card-overlay"><span className="movie-card-actions"><Link to={playPath} className="card-action play-action" aria-label={`Play ${movie.title}`}><CirclePlay size={19} /></Link><button type="button" className="card-action" aria-label={saved ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`} onClick={() => toggleMyList(movie)}><ListIcon size={17} /></button><button type="button" className={`card-action${liked ? ' is-liked' : ''}`} aria-label={liked ? `Unlike ${movie.title}` : `Like ${movie.title}`} aria-pressed={liked} onClick={() => setTitlePreference(movie, 'like')}><ThumbsUp size={16} /></button><Link to={detailsPath} className="card-action" aria-label={`More about ${movie.title}`}><Info size={17} /></Link></span><Link className="movie-card-overlay-title" to={detailsPath}>{movie.title}</Link><span className="movie-card-extra"><strong>{movie.match || Math.round(Number(movie.score) * 10)}% Match</strong><span>{movie.year} · {movie.rating} · {movie.duration}</span><span>{movie.genres.slice(0, 2).join(' · ')}</span></span></div>
      </div>
      <div className="movie-card-meta"><Link to={detailsPath} className="movie-card-title">{movie.title}</Link><div><span>{movie.year}</span><span>{movie.genres[0]}</span>{movie.type === 'tv' && <span>Series</span>}</div></div>
    </article>
  )
}
