import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard.jsx'
import './Media.css'

export default function MovieRow({ title, movies }) {
  const rowRef = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  const scroll = (direction) => rowRef.current?.scrollBy({ left: rowRef.current.clientWidth * direction * 0.78, behavior: 'smooth' })
  const updateEdges = useCallback(() => {
    const row = rowRef.current
    if (row) {
      const next = { start: row.scrollLeft < 4, end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 4 }
      setEdges((current) => current.start === next.start && current.end === next.end ? current : next)
    }
  }, [])
  useEffect(() => { updateEdges() }, [movies, updateEdges])
  if (!movies?.length) return null

  return (
    <section className="media-row" aria-label={title}>
      <div className="media-row-heading"><h2>{title}</h2><div className="media-row-controls"><button type="button" aria-label={`Scroll ${title} left`} disabled={edges.start} onClick={() => scroll(-1)}><ChevronLeft size={19} /></button><button type="button" aria-label={`Scroll ${title} right`} disabled={edges.end} onClick={() => scroll(1)}><ChevronRight size={19} /></button></div></div>
      <div className="media-row-track" ref={rowRef} onScroll={updateEdges}>{movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div>
    </section>
  )
}
