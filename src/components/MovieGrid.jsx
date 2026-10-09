import MovieCard from './MovieCard.jsx'
import './Media.css'

export default function MovieGrid({ movies }) {
  return <div className="movie-grid">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div>
}
