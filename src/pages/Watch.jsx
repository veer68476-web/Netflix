import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import VideoPlayer from '../components/VideoPlayer.jsx'
import { getMovieDetails, getMovieEpisode } from '../services/movieApi.js'

export default function Watch() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie'
  const season = Number(searchParams.get('season') || 1)
  const episode = Number(searchParams.get('episode') || 1)
  const [record, setRecord] = useState(null)

  useEffect(() => {
    let alive = true
    const mediaRequest = type === 'tv' && searchParams.has('episode')
      ? getMovieEpisode(id, season, episode)
      : getMovieDetails(id, type)
    mediaRequest.then((movie) => { if (alive) setRecord({ id, type, movie }) })
    return () => { alive = false }
  }, [id, type, season, episode, searchParams])

  if (record?.id !== id || record?.type !== type) return <main className="details-page"><LoadingSpinner label="Loading player" /></main>
  return record.movie ? <VideoPlayer movie={record.movie} /> : <main className="page-wrap"><EmptyState title="Title not found" message="We couldn’t find this title in the current catalog." action="Back to home" to="/" /></main>
}
