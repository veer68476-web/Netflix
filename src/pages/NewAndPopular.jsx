import { useEffect, useState } from 'react'
import { getPopularMovies, getTopRatedMovies, getTrendingMovies } from '../services/movieApi.js'
import MovieRow from '../components/MovieRow.jsx'
import Top10Row from '../components/Top10Row.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import './Pages.css'

export default function NewAndPopular() {
  const [catalog, setCatalog] = useState({ trending: [], popular: [], rated: [] })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    Promise.all([getTrendingMovies(), getPopularMovies(), getTopRatedMovies()]).then(([trending, popular, rated]) => {
      if (alive) setCatalog({ trending, popular, rated })
    }).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])
  const fresh = [...catalog.trending].sort((a, b) => Number(b.year) - Number(a.year))
  return <main className="page-wrap browse-page"><div className="page-intro"><span className="section-kicker">THE LATEST & THE GREATEST</span><h1>New & Popular</h1><p>See what’s arriving, trending, and finding its audience.</p></div>{loading ? <div className="movie-grid">{Array.from({ length: 10 }, (_, index) => <SkeletonCard key={index} />)}</div> : <><MovieRow title="New Releases" movies={fresh.slice(0, 18)} /><MovieRow title="Coming Soon" movies={fresh.filter((movie) => Number(movie.year) >= new Date().getFullYear()).slice(0, 12)} /><MovieRow title="Trending Now" movies={catalog.trending.slice(0, 20)} /><MovieRow title="Popular This Week" movies={catalog.popular.slice(0, 20)} /><Top10Row movies={catalog.rated.slice(0, 10)} /></>}</main>
}
