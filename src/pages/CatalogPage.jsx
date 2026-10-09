import { useEffect, useMemo, useState } from 'react'
import { getPopularMovies } from '../services/movieApi.js'
import GenreFilter from '../components/GenreFilter.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import { useApp } from '../context/appContext.js'
import './Pages.css'

export default function CatalogPage({ title, description, type = '' }) {
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [filters, setFilters] = useState({ type, genre: '', year: '', rating: '', sort: 'popular' })
  const { profile } = useApp()

  useEffect(() => {
    let alive = true
    getPopularMovies(type || 'all').then((items) => { if (alive) setCatalog(items) }).catch(() => { if (alive) setError(true) }).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [retryCount, type])

  const results = useMemo(() => {
    const filtered = catalog.filter((movie) => (!profile?.kids || ['PG', 'TV-Y', 'TV-Y7', 'G', 'TV-G', 'TV-PG'].includes(movie.rating))
      && (!type || movie.type === type)
      && (!filters.genre || movie.genres.includes(filters.genre))
      && (!filters.year || String(movie.year) === String(filters.year))
      && (!filters.rating || movie.score >= Number(filters.rating)))
    if (filters.sort === 'rating') return filtered.sort((a, b) => b.score - a.score)
    if (filters.sort === 'latest') return filtered.sort((a, b) => b.year - a.year)
    if (filters.sort === 'az') return filtered.sort((a, b) => a.title.localeCompare(b.title))
    return filtered
  }, [catalog, filters, type, profile?.kids])
  let content
  if (loading) content = <div className="movie-grid">{Array.from({ length: 12 }, (_, index) => <SkeletonCard key={index} />)}</div>
  else if (results.length) content = <MovieGrid movies={results} />
  else content = <div className="catalog-empty">No titles match these filters. Try a different combination.</div>

  return (
    <main className="browse-page page-wrap">
      <div className="page-intro"><span className="section-kicker">THE NEXFLIX COLLECTION</span><h1>{title}</h1><p>{description}</p></div>
      <GenreFilter filters={filters} onChange={setFilters} showType={!type} />
      {error && <div className="inline-error" role="alert">We couldn’t load the collection. <button type="button" onClick={() => { setError(false); setLoading(true); setRetryCount((count) => count + 1) }}>Try again</button></div>}
      {content}
    </main>
  )
}
