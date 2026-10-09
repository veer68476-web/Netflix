import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CirclePlay } from 'lucide-react'
import { getEpisodes } from '../services/movieApi.js'
import './Media.css'

export default function EpisodeList({ series }) {
  const availableSeasons = series.seasons?.filter((season) => season.season_number > 0) || []
  const [season, setSeason] = useState(availableSeasons[0]?.season_number || 1)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)
    getEpisodes(series.id, season).then((items) => { if (alive) setEpisodes(items) }).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [series.id, season])

  return <section className="episode-section"><div className="episode-heading"><div><span className="section-kicker">SERIES EPISODES</span><h2>{series.title}</h2></div>{availableSeasons.length > 0 && <select aria-label="Select season" value={season} onChange={(event) => setSeason(Number(event.target.value))}>{availableSeasons.map((item) => <option key={item.season_number} value={item.season_number}>{item.name || `Season ${item.season_number}`}</option>)}</select>}</div>{loading ? <div className="episode-loading">Loading episodes…</div> : episodes.length ? <div className="episode-list">{episodes.map((episode) => <article className="episode-item" key={episode.id}><Link to={episode.playbackUrl} className="episode-thumbnail"><img src={episode.still} alt={`${episode.title} thumbnail`} loading="lazy" /><span><CirclePlay size={24} /></span></Link><div className="episode-copy"><div><span>{String(episode.episode_number).padStart(2, '0')}</span><h3>{episode.title}</h3><time>{episode.runtime} min</time></div><p>{episode.overview}</p></div><Link className="episode-play" to={episode.playbackUrl} aria-label={`Play episode ${episode.episode_number}: ${episode.title}`}><CirclePlay size={22} /></Link></article>)}</div> : <p className="episode-loading">No episodes are available for this season.</p>}</section>
}
