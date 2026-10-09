import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import GenreFilter from '../components/GenreFilter.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import SearchBar from '../components/SearchBar.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import { movies } from '../data/movies.js'
import useDebounce from '../hooks/useDebounce.js'
import { searchMovies } from '../services/movieApi.js'
import './Pages.css'
import { useApp } from '../context/appContext.js'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const debouncedQuery = useDebounce(query)
  const [filters, setFilters] = useState({ type: '', genre: '', year: '', rating: '', sort: 'popular' })
  const [results, setResults] = useState(query ? [] : movies)
  const [status, setStatus] = useState(query ? 'loading' : 'success')
  const [retryCount, setRetryCount] = useState(0)
  const { profile } = useApp()

  useEffect(() => {
    let alive = true
    searchMovies(debouncedQuery, filters).then((items) => {
      if (alive) { setResults(items); setStatus('success') }
    }).catch(() => { if (alive) setStatus('error') })
    return () => { alive = false }
  }, [debouncedQuery, filters, retryCount])

  const updateQuery = (value) => {
    setStatus('loading')
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value.trim()) next.set('q', value.trim())
      else next.delete('q')
      return next
    }, { replace: true })
  }
  const updateFilters = (nextFilters) => { setStatus('loading'); setFilters(nextFilters) }
  const sortedResults = profile?.kids ? results.filter((movie) => ['PG', 'TV-Y', 'TV-Y7', 'G', 'TV-G', 'TV-PG'].includes(movie.rating)) : [...results]
  if (filters.sort === 'rating') sortedResults.sort((a, b) => b.score - a.score)
  if (filters.sort === 'latest') sortedResults.sort((a, b) => b.year - a.year)
  if (filters.sort === 'az') sortedResults.sort((a, b) => a.title.localeCompare(b.title))
  let content
  if (status === 'error') content = <div className="inline-error" role="alert">Something went wrong while searching. <button type="button" onClick={() => { setStatus('loading'); setRetryCount((count) => count + 1) }}>Try again</button></div>
  else if (status === 'loading') content = <div className="movie-grid">{Array.from({ length: 8 }, (_, index) => <SkeletonCard key={index} />)}</div>
  else if (sortedResults.length) content = <MovieGrid movies={sortedResults} />
  else content = <div className="catalog-empty">No movies or shows found. Try another search.</div>

  return (
    <main className="search-page page-wrap">
      <div className="page-intro"><span className="section-kicker">FIND YOUR NEXT FAVORITE</span><h1>Search</h1><p>Explore films and series by title, genre, or cast.</p></div>
      <SearchBar value={query} onChange={updateQuery} onClear={() => updateQuery('')} />
      <GenreFilter filters={filters} onChange={updateFilters} />
      {query && <h2 className="results-heading">Results for “{query}” <span>{sortedResults.length} titles</span></h2>}
      {content}
    </main>
  )
}
