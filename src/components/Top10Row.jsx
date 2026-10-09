import MovieCard from './MovieCard.jsx'
import './Media.css'

export default function Top10Row({ movies }) {
  if (!movies?.length) return null
  return <section className="media-row top10-section" aria-label="Top 10 today"><div className="media-row-heading"><h2>Top 10 Today</h2></div><div className="top10-track">{movies.slice(0, 10).map((movie, index) => <div className="top10-item" key={movie.id}><span className="top10-rank" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><MovieCard movie={movie} /></div>)}</div></section>
}
