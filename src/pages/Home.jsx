import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, Bookmark, CirclePlay, Info, Plus, Sparkles, Star } from 'lucide-react'
import { movies } from '../data/movies.js'
import { getTopRatedMovies, getTrendingMovies } from '../services/movieApi.js'
import { useApp } from '../context/appContext.js'
import MovieRow from '../components/MovieRow.jsx'
import Top10Row from '../components/Top10Row.jsx'
import './Home.css'

const fallbackFeatures = [movies[0], movies[2], movies[4]]
const fallbackTopRated = [...movies].sort((a, b) => Number(b.score) - Number(a.score))

export default function Home() {
  const [trending, setTrending] = useState(movies)
  const [topRated, setTopRated] = useState(fallbackTopRated)
  const [featuredTitles, setFeaturedTitles] = useState(fallbackFeatures)
  const [active, setActive] = useState(0)
  const { toggleMyList, isInMyList, continueWatching, profile, preferences } = useApp()
  const featuredPool = profile?.kids ? trending.filter((movie) => ['PG', 'TV-Y', 'TV-Y7', 'G', 'TV-G', 'TV-PG'].includes(movie.rating)) : featuredTitles
  const safeFeaturedPool = featuredPool.length ? featuredPool : [movies[9]]
  const featured = safeFeaturedPool[active % safeFeaturedPool.length]
  const saved = isInMyList(featured.id)
  const ListIcon = saved ? Bookmark : Plus
  const availableTitles = [...trending, ...topRated]
  const visibleTitles = (list) => profile?.kids ? list.filter((movie) => ['PG', 'TV-Y', 'TV-Y7', 'G', 'TV-G', 'TV-PG'].includes(movie.rating)) : list
  const recommendScore = (movie) => Object.values(preferences).reduce((total, preference) => {
    const sharesGenre = preference.genres?.some((genre) => movie.genres.includes(genre))
    if (!sharesGenre) return total
    if (preference.value === 'like') return total + 2
    if (preference.value === 'dislike') return total - 3
    return total
  }, Number(movie.popularity || 0))
  const resumeTitles = continueWatching.map((entry) => availableTitles.find((movie) => movie.id === entry.id) || movies.find((movie) => movie.id === entry.id) || entry).filter((movie) => movie.title)
  const topTitles = visibleTitles([...topRated].sort((a, b) => Number(b.score) - Number(a.score)))
  const popularTitles = visibleTitles([...trending].sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0)))
  const actionTitles = visibleTitles(trending.filter((movie) => movie.genres.includes('Action')))
  const comedyTitles = visibleTitles(trending.filter((movie) => movie.genres.includes('Comedy')))
  const dramaTitles = visibleTitles(trending.filter((movie) => movie.genres.includes('Drama')))
  const sciFiTitles = visibleTitles(trending.filter((movie) => movie.genres.includes('Sci-Fi')))
  const horrorTitles = visibleTitles(trending.filter((movie) => movie.genres.includes('Horror')))

  useEffect(() => {
    let alive = true
    Promise.all([getTrendingMovies(), getTopRatedMovies()]).then(([popular, rated]) => {
      if (!alive) return
      if (popular.length) {
        setTrending(popular)
        setFeaturedTitles(popular.slice(0, 3))
        setActive(0)
      }
      if (rated.length) setTopRated(rated)
    })
    return () => { alive = false }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setActive((index) => (index + 1) % safeFeaturedPool.length), 8500)
    return () => window.clearInterval(timer)
  }, [safeFeaturedPool.length])

  return (
    <main className="home-page">
      <section className="feature-hero" style={{ '--hero-image': `url("${featured.backdrop}")` }} aria-label="Featured title">
        <div className="hero-grain" />
        <div className="hero-copy" key={featured.id}>
          <div className="hero-eyebrow"><Sparkles size={13} /> {featured.badge || 'FEATURED TONIGHT'}</div>
          <h1>{featured.title}</h1>
          <p className="hero-tagline">{featured.tagline || 'Stories worth staying in for.'}</p>
          <div className="hero-meta"><span className="rating-chip">{featured.rating}</span><span>{featured.year}</span><span>{featured.duration}</span><span className="meta-score"><Star size={13} fill="currentColor" /> {featured.score}</span></div>
          <p className="hero-description">{featured.description}</p>
          <div className="hero-genres">{featured.genres.map((genre) => <span key={genre}>{genre}</span>)}</div>
          <div className="hero-buttons"><Link to={`/watch/${featured.id}?type=${featured.type}`} className="button-primary"><CirclePlay size={19} fill="currentColor" /> Play</Link><Link to={`/${featured.type === 'tv' ? 'tv' : 'movie'}/${featured.id}`} className="button-glass"><Info size={18} /> More info</Link><button type="button" className="button-glass hero-list-button" aria-label={saved ? 'Remove from My List' : 'Add to My List'} onClick={() => toggleMyList(featured)}><ListIcon size={17} /> {saved ? 'In My List' : 'My List'}</button></div>
        </div>
        <div className="hero-pagination"><span className="hero-slide-label">FEATURED <b>0{active + 1}</b> / {String(safeFeaturedPool.length).padStart(2, '0')}</span><div className="hero-dots">{safeFeaturedPool.map((title, index) => <button key={title.id} type="button" aria-label={`Show featured title ${index + 1}`} aria-current={active === index} className={active === index ? 'active' : ''} onClick={() => setActive(index)} />)}</div></div>
        <a href="#discover" className="scroll-cue" aria-label="Scroll to discover"><ArrowDown size={15} /></a>
      </section>

      <div className="home-content" id="discover">
        <div className="welcome-strip"><div><span className="section-kicker">YOUR NEXT FAVORITE IS HERE</span><p>A handpicked mix of thrillers, romance, and binge-worthy stories.</p></div><span className="catalog-source">{trending.some((movie) => movie.source === 'tmdb') ? 'TMDB LIVE CATALOG' : 'CURATED STREAMING PICKS'}</span></div>
        {resumeTitles.length > 0 && <MovieRow title="Continue Watching" movies={resumeTitles} />}
        <MovieRow title="Trending Now" movies={popularTitles.slice(0, 20)} />
        <MovieRow title="Popular on NEXFLIX" movies={popularTitles.slice().reverse().slice(0, 20)} />
        <Top10Row movies={topTitles.slice(0, 10)} />
        <MovieRow title="Top Rated" movies={topTitles.slice(0, 20)} />
        <MovieRow title="Action" movies={actionTitles} />
        <MovieRow title="Comedy" movies={comedyTitles} />
        <MovieRow title="Dramas" movies={dramaTitles} />
        <MovieRow title="Award-Winning Picks" movies={visibleTitles([...trending].filter((movie) => ['Top 10', 'Award Winning', 'Critics Pick', 'Fan Favorite'].includes(movie.badge)).slice(0, 20))} />
        <MovieRow title="Sci-Fi" movies={sciFiTitles} />
        <MovieRow title="Horror" movies={horrorTitles} />
        <MovieRow title="New Releases" movies={visibleTitles([...trending].sort((a, b) => b.year - a.year))} />
        <MovieRow title="Because you watched something you liked" movies={visibleTitles([...trending].sort((a, b) => recommendScore(b) - recommendScore(a)).slice(0, 20))} />
        <section className="membership-banner"><div className="membership-glow" /><div><span className="section-kicker">A WORLD OF STORIES</span><h2>Find your next favorite.</h2><p>Browse a fresh collection of films and series, picked for a great night in.</p></div><Link to="/movies" className="button-glass">Browse all titles <Info size={16} /></Link></section>
      </div>
    </main>
  )
}
