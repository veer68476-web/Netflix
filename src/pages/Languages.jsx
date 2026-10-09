import { useEffect, useState } from 'react'
import { movies as mockMovies } from '../data/movies.js'
import { getTrendingMovies } from '../services/movieApi.js'
import MovieGrid from '../components/MovieGrid.jsx'
import './Pages.css'

const languages = ['English', 'Spanish', 'Japanese', 'French', 'Korean', 'Hindi', 'German', 'Italian']

export default function Languages() {
  const [titles, setTitles] = useState(mockMovies)
  const [language, setLanguage] = useState('English')
  useEffect(() => { let alive = true; getTrendingMovies().then((items) => { if (alive && items.length) setTitles(items) }); return () => { alive = false } }, [])
  const results = titles.filter((title) => title.language?.toLowerCase() === language.toLowerCase())
  return <main className="page-wrap"><div className="page-intro"><span className="section-kicker">EXPLORE AROUND THE WORLD</span><h1>Browse by Languages</h1><p>Discover titles in your preferred language.</p></div><fieldset className="language-chips"><legend className="sr-only">Choose a language</legend>{languages.map((item) => <button type="button" className={`language-chip${language === item ? ' active' : ''}`} key={item} aria-pressed={language === item} onClick={() => setLanguage(item)}>{item}</button>)}</fieldset>{results.length ? <MovieGrid movies={results} /> : <div className="catalog-empty">No {language} titles are available in the current catalog yet.</div>}</main>
}
