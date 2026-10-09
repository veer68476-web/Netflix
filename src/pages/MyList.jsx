import { useApp } from '../context/appContext.js'
import EmptyState from '../components/EmptyState.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import './Pages.css'

export default function MyList() {
  const { myList, profile } = useApp()
  const visibleList = profile?.kids ? myList.filter((movie) => ['PG', 'TV-Y', 'TV-Y7', 'G', 'TV-G', 'TV-PG'].includes(movie.rating)) : myList
  return <main className="collection-page page-wrap"><div className="page-intro"><span className="section-kicker">SAVED FOR LATER</span><h1>My List</h1><p>Your personal shortlist for the next movie night.</p></div>{visibleList.length ? <MovieGrid movies={visibleList} /> : <EmptyState title="Nothing here yet" message="Add movies and shows you want to watch. Your list stays saved on this device." action="Browse titles" to="/movies" />}</main>
}
