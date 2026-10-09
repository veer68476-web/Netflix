import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Captions, Maximize, Pause, PictureInPicture2, Play, Volume2, VolumeX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/appContext.js'
import './VideoPlayer.css'

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00'
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

export default function VideoPlayer({ movie }) {
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const lastSavedRef = useRef(0)
  const { saveProgress, removeProgress, continueWatching } = useApp()
  const saved = continueWatching.find((item) => item.id === movie.id)
  const initialProgressRef = useRef(saved?.progress ?? 0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [speed, setSpeed] = useState('1')
  const [captionsOn, setCaptionsOn] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume
  }, [volume])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) { try { await video.play() } catch { setError(true) } }
    else video.pause()
  }
  const persistProgress = () => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0 || video.currentTime < 1) return
    saveProgress(movie, Math.min(99, (video.currentTime / video.duration) * 100), video.duration)
    lastSavedRef.current = video.currentTime
  }
  const updateTime = () => {
    const video = videoRef.current
    if (!video) return
    setCurrentTime(video.currentTime)
    setDuration(video.duration || 0)
    if (video.duration > 0 && Math.abs(video.currentTime - lastSavedRef.current) >= 4) persistProgress()
  }
  const restoreTime = () => {
    const video = videoRef.current
    if (!video) return
    setDuration(video.duration || 0)
    if (initialProgressRef.current > 0 && video.duration) {
      video.currentTime = video.duration * (initialProgressRef.current / 100)
      lastSavedRef.current = video.currentTime
    }
  }
  const handleEnd = () => { setPlaying(false); removeProgress(movie.id) }
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) playerRef.current?.requestFullscreen?.()
    else document.exitFullscreen?.()
  }
  const toggleCaptions = () => {
    const track = videoRef.current?.textTracks?.[0]
    const nextState = !captionsOn
    if (track) track.mode = nextState ? 'showing' : 'hidden'
    setCaptionsOn(nextState)
  }
  const togglePictureInPicture = async () => {
    const video = videoRef.current
    if (!video || !document.pictureInPictureEnabled) return
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture()
      else await video.requestPictureInPicture()
    } catch {
      setError(true)
    }
  }
  const seek = (event) => {
    const video = videoRef.current
    if (video && duration) video.currentTime = (Number(event.target.value) / 100) * duration
  }
  const progressPercent = duration ? (currentTime / duration) * 100 : 0
  const detailsPath = movie.detailsId
    ? `/title/${movie.detailsId}?type=tv`
    : `/title/${movie.id}?type=${movie.type}`

  return (
    <main className="watch-page">
      <section className="video-player" ref={playerRef} aria-label={`Player for ${movie.title}`}>
        {movie.youtubeTrailer ? <iframe className="player-embed" src={movie.youtubeTrailer} title={`${movie.title} official trailer`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <video ref={videoRef} src={movie.trailer} poster={movie.backdrop} playsInline preload="metadata" muted={muted} onPlay={() => setPlaying(true)} onPause={() => { setPlaying(false); persistProgress() }} onTimeUpdate={updateTime} onLoadedMetadata={restoreTime} onEnded={handleEnd} onError={() => setError(true)} onClick={togglePlay}><track kind="captions" src="/demo-captions.vtt" srcLang="en" label="English" default /></video>}
        <div className="player-top"><Link to={detailsPath} className="player-back"><ArrowLeft size={19} /><span>Back to details</span></Link><div><b>{movie.title}</b><small>{movie.youtubeTrailer ? 'Official trailer' : movie.episode_number ? `S${movie.season_number} · E${movie.episode_number}` : 'Demo preview'}</small></div></div>
        {error && <div className="player-message" role="alert">The demo video could not be loaded. Try again later.</div>}
        {!movie.youtubeTrailer && <div className={`player-controls${playing ? ' is-playing' : ''}`}>
          <button type="button" className="player-play" aria-label={playing ? 'Pause video' : 'Play video'} onClick={togglePlay}>{playing ? <Pause size={21} fill="currentColor" /> : <Play size={21} fill="currentColor" />}</button>
          <span className="player-clock">{formatTime(currentTime)}</span>
          <input className="player-seek" type="range" min="0" max="100" value={progressPercent} onChange={seek} aria-label="Video position" style={{ '--played': `${progressPercent}%` }} />
          <span className="player-clock">{formatTime(duration)}</span>
          <button type="button" className="player-control-button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted((value) => !value)}>{muted ? <VolumeX size={19} /> : <Volume2 size={19} />}</button>
          <input className="player-volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => { const next = Number(event.target.value); setVolume(next); setMuted(next === 0) }} aria-label="Volume" />
          <select className="player-speed" aria-label="Playback speed" value={speed} onChange={(event) => { setSpeed(event.target.value); if (videoRef.current) videoRef.current.playbackRate = Number(event.target.value) }}><option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option></select>
          <button type="button" className="player-control-button" aria-label={captionsOn ? 'Turn captions off' : 'Turn captions on'} aria-pressed={captionsOn} onClick={toggleCaptions}><Captions size={18} /></button>
          <button type="button" className="player-control-button" aria-label="Picture in picture" onClick={togglePictureInPicture}><PictureInPicture2 size={18} /></button>
          <button type="button" className="player-control-button" aria-label="Fullscreen" onClick={toggleFullscreen}><Maximize size={18} /></button>
        </div>}
        <span className="player-demo-note">{movie.youtubeTrailer ? 'Trailer hosted by YouTube' : 'Sample preview video · Creative Commons'}</span>
      </section>
    </main>
  )
}
