import { genres, movies as mockMovies } from '../data/movies.js'

const API_BASE = 'https://api.themoviedb.org/3'
const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'
const DEMO_TRAILER = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
const genreIds = {
  Action: { movie: 28, tv: 10759 }, Adventure: { movie: 12, tv: 10759 }, Animation: { movie: 16, tv: 16 },
  Comedy: { movie: 35, tv: 35 }, Crime: { movie: 80, tv: 80 }, Documentary: { movie: 99, tv: 99 },
  Drama: { movie: 18, tv: 18 }, Family: { movie: 10751, tv: 10762 }, Fantasy: { movie: 14 },
  History: { movie: 36 }, Horror: { movie: 27 }, Mystery: { movie: 9648, tv: 9648 },
  Music: { movie: 10402 }, Nature: { movie: 99, tv: 99 }, Reality: { tv: 10764 },
  Romance: { movie: 10749 }, 'Sci-Fi': { movie: 878, tv: 10765 }, Talk: { tv: 10767 },
  Thriller: { movie: 53 }, 'TV Movie': { movie: 10770 }, Western: { movie: 37 },
}
const genreNames = new Map([
  [12, 'Adventure'], [14, 'Fantasy'], [16, 'Animation'], [18, 'Drama'], [27, 'Horror'],
  [28, 'Action'], [35, 'Comedy'], [36, 'History'], [37, 'Western'], [53, 'Thriller'],
  [80, 'Crime'], [99, 'Documentary'], [878, 'Sci-Fi'], [9648, 'Mystery'], [10402, 'Music'],
  [10749, 'Romance'], [10751, 'Family'], [10759, 'Action'], [10762, 'Family'],
  [10763, 'Documentary'], [10764, 'Reality'], [10765, 'Sci-Fi'], [10766, 'Drama'],
  [10767, 'Talk'], [10768, 'History'], [10770, 'TV Movie'],
])
const catalogCache = new Map()

export const isTmdbConfigured = () => Boolean(import.meta.env.VITE_TMDB_API_KEY?.trim())

async function request(path, params = {}) {
  const key = import.meta.env.VITE_TMDB_API_KEY
  if (!key) throw new Error('TMDB API key is not configured')
  const url = new URL(`${API_BASE}${path}`)
  url.searchParams.set('api_key', key)
  url.searchParams.set('language', 'en-US')
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(name, String(value))
  }
  const response = await fetch(url)
  if (!response.ok) throw new Error(`TMDB request failed (${response.status})`)
  return response.json()
}

function image(path, size, fallback) {
  return path ? `${IMAGE_BASE}/${size}${path}` : fallback
}

function formatRuntime(runtime, item, type) {
  if (runtime) return `${Math.floor(runtime / 60)}h ${String(runtime % 60).padStart(2, '0')}m`
  if (type === 'tv' && item.number_of_seasons) return `${item.number_of_seasons} ${item.number_of_seasons === 1 ? 'Season' : 'Seasons'}`
  return type === 'tv' ? 'Series' : 'Feature film'
}

function normalizeTitle(item, fallbackType = 'movie') {
  const type = item.media_type === 'tv' || fallbackType === 'tv' ? 'tv' : 'movie'
  const releaseDate = item.release_date || item.first_air_date || ''
  const rawGenres = item.genres || item.genre_ids || []
  const titleGenres = rawGenres.map((genre) => typeof genre === 'string' ? genre : genre.name || genreNames.get(genre.id)).filter(Boolean)
  const credits = item.credits || {}
  const director = credits.crew?.find((person) => person.job === 'Director' || person.job === 'Executive Producer')?.name || 'Not listed'
  const cast = (credits.cast || []).slice(0, 5).map((person) => person.name)
  const trailer = item.videos?.results?.find((video) => video.site === 'YouTube' && video.type === 'Trailer' && video.key)
  const title = item.title || item.name || 'Untitled'
  const id = String(item.id)
  const score = Number(item.vote_average || item.score || 0).toFixed(1)
  const normalized = {
    id,
    title,
    description: item.overview || 'More details for this title are not available yet.',
    overview: item.overview || '',
    poster: image(item.poster_path, 'w500', `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=520&h=760&q=75`),
    backdrop: image(item.backdrop_path, 'w1280', `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=80`),
    year: releaseDate.slice(0, 4) || '—',
    releaseDate,
    rating: item.adult ? '18+' : '13+',
    score,
    match: Math.min(99, Math.round(Number(score) * 10 + 10)),
    duration: formatRuntime(item.runtime || item.episode_run_time?.[0], item, type),
    runtime: formatRuntime(item.runtime || item.episode_run_time?.[0], item, type),
    genres: titleGenres.length ? titleGenres : ['Drama'],
    type,
    language: item.original_language?.toUpperCase() || '—',
    director,
    cast: cast.length ? cast : ['Cast information unavailable'],
    seasons: item.seasons || [],
    episodes: item.episodes || [],
    trailer: DEMO_TRAILER,
    youtubeTrailer: trailer ? `https://www.youtube-nocookie.com/embed/${trailer.key}?rel=0&playsinline=1` : '',
    popularity: Number(item.popularity || 0),
    source: 'tmdb',
  }
  catalogCache.set(id, normalized)
  return normalized
}

function mockList(type = 'all') {
  return mockMovies.filter((movie) => type === 'all' || movie.type === type)
}

function filterResults(items, filters = {}) {
  return items.filter((movie) => (!filters.type || movie.type === filters.type)
    && (!filters.genre || movie.genres.includes(filters.genre))
    && (!filters.year || String(movie.year) === String(filters.year))
    && (!filters.rating || Number(movie.score) >= Number(filters.rating)))
}

function remember(items) {
  items.forEach((item) => catalogCache.set(item.id, item))
  return items
}

export async function getTrendingMovies(type = 'all') {
  try {
    const endpoint = type === 'all' ? '/trending/all/week' : `/trending/${type}/week`
    const data = await request(endpoint)
    return remember((data.results || []).filter((item) => item.media_type !== 'person').map((item) => normalizeTitle(item, item.media_type)))
  } catch {
    return mockList(type).sort((a, b) => b.popularity - a.popularity)
  }
}

export async function getPopularMovies(type = 'all') {
  try {
    if (type === 'all') return await getTrendingMovies('all')
    const data = await request(`/${type}/popular`)
    return remember((data.results || []).map((item) => normalizeTitle(item, type)))
  } catch {
    return mockList(type).sort((a, b) => b.popularity - a.popularity)
  }
}

export async function getTopRatedMovies(type = 'all') {
  try {
    if (type === 'all') {
      const [moviesResult, tvResult] = await Promise.all([request('/movie/top_rated'), request('/tv/top_rated')])
      return remember([...(moviesResult.results || []).map((item) => normalizeTitle(item, 'movie')), ...(tvResult.results || []).map((item) => normalizeTitle(item, 'tv'))].sort((a, b) => Number(b.score) - Number(a.score)))
    }
    const data = await request(`/${type}/top_rated`)
    return remember((data.results || []).map((item) => normalizeTitle(item, type)))
  } catch {
    return mockList(type).sort((a, b) => Number(b.score) - Number(a.score))
  }
}

export async function getMoviesByGenre(genre, type = 'movie') {
  try {
    const genreId = genreIds[genre]?.[type]
    if (isTmdbConfigured() && genreId) {
      const data = await request(`/discover/${type}`, { with_genres: genreId, sort_by: 'popularity.desc' })
      return remember((data.results || []).map((item) => normalizeTitle(item, type)))
    }
  } catch {
    // Fall back to the local collection below when TMDB is unavailable.
  }
  if (!genres.includes(genre)) return []
  return mockList(type).filter((movie) => movie.genres.includes(genre))
}

export async function getMovieDetails(id, type = 'movie') {
  const cachedMock = mockMovies.find((movie) => movie.id === String(id))
  if (!/^\d+$/.test(String(id)) || !isTmdbConfigured()) return cachedMock || catalogCache.get(String(id)) || null
  try {
    const details = await request(`/${type}/${id}`, { append_to_response: 'credits,videos' })
    return normalizeTitle(details, type)
  } catch {
    return catalogCache.get(String(id)) || cachedMock || null
  }
}

export async function searchMovies(query, filters = {}) {
  const normalizedQuery = query.trim()
  if (isTmdbConfigured() && !normalizedQuery) return filterResults(await getTrendingMovies('all'), filters)
  if (isTmdbConfigured() && normalizedQuery) {
    try {
      const data = await request('/search/multi', { query: normalizedQuery, include_adult: false })
      const remoteResults = remember((data.results || []).filter((item) => item.media_type === 'movie' || item.media_type === 'tv').map((item) => normalizeTitle(item, item.media_type)))
      return filterResults(remoteResults, filters)
    } catch {
      // Use local results when search is offline or the API key is rejected.
    }
  }
  const term = normalizedQuery.toLowerCase()
  const localResults = mockMovies.filter((movie) => !term || [movie.title, movie.description, movie.genres.join(' '), movie.cast.join(' ')]
    .some((value) => value.toLowerCase().includes(term)))
  return filterResults(localResults, filters)
}

export async function getRecommendations(id, type = 'movie') {
  if (isTmdbConfigured() && /^\d+$/.test(String(id))) {
    try {
      const data = await request(`/${type}/${id}/recommendations`)
      return remember((data.results || []).map((item) => normalizeTitle(item, type)))
    } catch {
      // Use related local titles below if recommendations are not available.
    }
  }
  const current = mockMovies.find((movie) => movie.id === String(id)) || catalogCache.get(String(id))
  if (!current) return mockMovies.slice(0, 8)
  return mockMovies.filter((movie) => movie.id !== current.id && movie.genres.some((genre) => current.genres.includes(genre))).slice(0, 8)
}

export async function getEpisodes(seriesId, season = 1) {
  const fallbackSeries = mockMovies.find((movie) => movie.id === String(seriesId) && movie.type === 'tv')
  if (/^\d+$/.test(String(seriesId)) && isTmdbConfigured()) {
    try {
      const data = await request(`/tv/${seriesId}/season/${season}`)
      return (data.episodes || []).map((episode) => ({
        id: `${seriesId}-s${season}-e${episode.episode_number}`,
        episode_number: episode.episode_number,
        season_number: season,
        title: episode.name,
        overview: episode.overview || '',
        runtime: episode.runtime || 45,
        still: image(episode.still_path, 'w500', fallbackSeries?.backdrop || ''),
        playbackUrl: `/watch/${seriesId}?type=tv&season=${season}&episode=${episode.episode_number}`,
      }))
    } catch {
      // Fall through to local sample episodes if season data is unavailable.
    }
  }
  return (fallbackSeries?.episodes || []).filter((episode) => episode.season_number === Number(season)).map((episode) => ({
    ...episode,
    id: `${seriesId}-s${season}-e${episode.episode_number}`,
    title: episode.name,
    still: episode.still_path || fallbackSeries.backdrop,
    playbackUrl: `/watch/${seriesId}?type=tv&season=${season}&episode=${episode.episode_number}`,
  }))
}

export async function getMovieEpisode(seriesId, season = 1, episodeNumber = 1) {
  const episodes = await getEpisodes(seriesId, season)
  const episode = episodes.find((item) => item.episode_number === Number(episodeNumber))
  if (!episode) return null
  const series = await getMovieDetails(seriesId, 'tv')
  return {
    ...series,
    ...episode,
    id: episode.id,
    detailsId: String(seriesId),
    title: episode.title,
    description: episode.overview || series.description,
    poster: episode.still || series.poster,
    backdrop: episode.still || series.backdrop,
    duration: `${episode.runtime}m`,
    runtime: `${episode.runtime}m`,
    youtubeTrailer: '',
    playbackUrl: episode.playbackUrl,
  }
}
