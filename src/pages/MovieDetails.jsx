import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, Bookmark, CirclePlay, Plus, Star } from 'lucide-react'
import { useApp } from '../context/appContext.js'
import { getMovieDetails, getRecommendations } from '../services/movieApi.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import MovieRow from '../components/MovieRow.jsx'
import EpisodeList from '../components/EpisodeList.jsx'
import Modal from '../components/Modal.jsx'
import './Pages.css'

function TitleActions({ movie, saved, preference, onToggleList, onPreference, onTrailer }) {
  const ListIcon = saved ? Bookmark : Plus
  return <div className="details-actions"><Link className="button-primary" to={`/watch/${movie.id}?type=${movie.type}`}><CirclePlay size={19} fill="currentColor" /> Play now</Link><button type="button" className="button-glass" onClick={onToggleList}><ListIcon size={17} /> {saved ? 'In My List' : 'Add to My List'}</button><button type="button" className={`button-glass${preference === 'like' ? ' is-preferred' : ''}`} aria-pressed={preference === 'like'} onClick={() => onPreference('like')}>👍 {preference === 'like' ? 'Liked' : 'Like'}</button><button type="button" className={`button-glass${preference === 'dislike' ? ' is-preferred' : ''}`} aria-pressed={preference === 'dislike'} onClick={() => onPreference('dislike')}>👎 Not for me</button><button type="button" className="button-glass" onClick={onTrailer}>Trailer</button></div>
}

export default function MovieDetails() {
  const { id } = useParams()
  const location = useLocation()
  const type = location.pathname.startsWith('/tv/') || new URLSearchParams(location.search).get('type') === 'tv' ? 'tv' : 'movie'
  const { toggleMyList, isInMyList, getTitlePreference, setTitlePreference } = useApp()
  const [loadedRecord, setLoadedRecord] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const loading = loadedRecord?.id !== id || loadedRecord?.type !== type
  const movie = loadedRecord?.id === id && loadedRecord?.type === type ? loadedRecord.movie : null
  const recommendations = loadedRecord?.id === id && loadedRecord?.type === type ? loadedRecord.recommendations : []
  const error = loadedRecord?.id === id && loadedRecord?.type === type && loadedRecord.error

  useEffect(() => {
    let alive = true
    Promise.all([getMovieDetails(id, type), getRecommendations(id, type)]).then(([details, related]) => {
      if (alive) setLoadedRecord({ id, type, movie: details, recommendations: related })
    }).catch(() => { if (alive) setLoadedRecord({ id, type, movie: null, recommendations: [], error: true }) })
    return () => { alive = false }
  }, [id, retryCount, type])

  if (loading) return <main className="details-page"><LoadingSpinner label="Loading title details" /></main>
  if (error) return <main className="page-wrap"><div className="catalog-empty"><div>We couldn’t load this title. <button className="text-action" type="button" onClick={() => setRetryCount((count) => count + 1)}>Try again</button> <Link to="/">Back to home</Link></div></div></main>
  if (!movie) return <main className="page-wrap"><div className="catalog-empty">Title not found. <Link to="/">Back to home</Link></div></main>
  const saved = isInMyList(movie.id)
  const preference = getTitlePreference(movie.id)
  const closeTrailer = useCallback(() => setTrailerOpen(false), [])

  return (
    <main className="details-page">
      <section className="details-hero" style={{ '--detail-backdrop': `url("${movie.backdrop}")` }}>
        <div className="details-gradient" />
        <div className="details-content page-wrap">
          <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to browse</Link>
          <div className="details-main">
            <img className="details-poster" src={movie.poster} alt={`${movie.title} poster`} />
            <div className="details-copy"><span className="section-kicker">{movie.type === 'tv' ? 'SERIES' : 'FEATURE FILM'} · {movie.year}</span><h1>{movie.title}</h1>
              <div className="details-metadata"><span className="details-score"><Star size={15} fill="currentColor" /> {movie.score}/10</span><span>{movie.year}</span><span>{movie.rating}</span><span>{movie.duration}</span></div>
              <div className="detail-genres">{movie.genres.map((genre) => <span key={genre}>{genre}</span>)}</div>
              <p className="details-overview">{movie.description}</p>
              <div className="credits-grid"><div><b>Director</b><span>{movie.director}</span></div><div><b>Cast</b><span>{movie.cast.join(', ')}</span></div><div><b>Language</b><span>{movie.language}</span></div></div>
              <TitleActions movie={movie} saved={saved} preference={preference} onToggleList={() => toggleMyList(movie)} onPreference={(value) => setTitlePreference(movie, value)} onTrailer={() => setTrailerOpen(true)} />
            </div>
          </div>
        </div>
      </section>
      {movie.type === 'tv' && <section className="details-recommendations page-wrap"><EpisodeList series={movie} /></section>}
      <section className="details-recommendations page-wrap"><MovieRow title="More Like This" movies={recommendations} /></section>
      {trailerOpen && <Modal title={`${movie.title} trailer`} onClose={closeTrailer}>{movie.youtubeTrailer ? <iframe src={movie.youtubeTrailer} title={`${movie.title} trailer`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <video src={movie.trailer} poster={movie.backdrop} controls autoPlay><track kind="captions" src="/demo-captions.vtt" srcLang="en" label="English" default /></video>}</Modal>}
    </main>
  )
}
