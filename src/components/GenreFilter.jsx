import { Filter } from 'lucide-react'
import { genres } from '../data/movies.js'
import './Media.css'

export default function GenreFilter({ filters, onChange, showType = true }) {
  const update = (key) => (event) => onChange({ ...filters, [key]: event.target.value })
  return (
    <div className="filter-bar"><span className="filter-label"><Filter size={15} /> Filters</span>
      {showType && <select aria-label="Content type" value={filters.type || ''} onChange={update('type')}><option value="">All titles</option><option value="movie">Movies</option><option value="tv">TV Shows</option></select>}
      <select aria-label="Genre" value={filters.genre || ''} onChange={update('genre')}><option value="">All genres</option>{genres.map((genre) => <option key={genre} value={genre}>{genre}</option>)}</select>
      <select aria-label="Year" value={filters.year || ''} onChange={update('year')}><option value="">Any year</option>{[2026, 2025, 2024, 2023, 2022].map((year) => <option key={year} value={year}>{year}</option>)}</select>
      <select aria-label="Minimum rating" value={filters.rating || ''} onChange={update('rating')}><option value="">Any rating</option>{[9, 8, 7, 6].map((rating) => <option key={rating} value={rating}>{rating}+ rating</option>)}</select>
      <select aria-label="Sort results" value={filters.sort || 'popular'} onChange={update('sort')}><option value="popular">Popular</option><option value="rating">Top rated</option><option value="latest">Latest</option><option value="az">A–Z</option></select>
    </div>
  )
}
