import { Search, X } from 'lucide-react'
import './Media.css'

export default function SearchBar({ value, onChange, onClear, placeholder = 'Search titles, genres, people' }) {
  return (
    <label className="search-field">
      <Search size={20} aria-hidden="true" />
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label="Search movies and shows" />
      {value && <button type="button" onClick={onClear} aria-label="Clear search"><X size={17} /></button>}
    </label>
  )
}
