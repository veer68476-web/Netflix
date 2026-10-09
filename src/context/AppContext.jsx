import { useCallback, useMemo } from 'react'
import { AppContext } from './appContext.js'
import useLocalStorage from '../hooks/useLocalStorage.js'

const defaultProfiles = [
  { id: 'alex', name: 'Alex', color: '#466a84', kids: false },
  { id: 'kids', name: 'Kids', color: '#8862a7', kids: true },
  { id: 'guest', name: 'Guest', color: '#9a6949', kids: false },
]

export function AppProvider({ children }) {
  const [myList, setMyList] = useLocalStorage('nexflix-list', [])
  const [continueWatching, setContinueWatching] = useLocalStorage('nexflix-progress', [])
  const [profile, setProfile] = useLocalStorage('nexflix-profile', null)
  const [profiles, setProfiles] = useLocalStorage('nexflix-profiles', defaultProfiles)
  const [preferences, setPreferences] = useLocalStorage('nexflix-preferences', {})
  const [settings, setSettings] = useLocalStorage('nexflix-settings', { language: 'English', subtitles: true, autoplay: true, dataUsage: 'Auto', notifications: true })

  const toggleMyList = useCallback((movie) => setMyList((current) => current.some((item) => item.id === movie.id)
    ? current.filter((item) => item.id !== movie.id)
    : [movie, ...current]), [setMyList])
  const isInMyList = useCallback((id) => myList.some((item) => item.id === id), [myList])
  const saveProgress = useCallback((movie, progress, duration) => setContinueWatching((current) => {
    const next = {
      id: movie.id,
      title: movie.title,
      poster: movie.poster,
      backdrop: movie.backdrop,
      type: movie.type,
      year: movie.year,
      score: movie.score,
      genres: movie.genres,
      rating: movie.rating,
      duration: movie.duration,
      durationSeconds: duration,
      playbackUrl: movie.playbackUrl,
      detailsId: movie.detailsId,
      season: movie.season_number,
      episode: movie.episode_number,
      progress,
      updatedAt: Date.now(),
    }
    return [next, ...current.filter((item) => item.id !== movie.id)]
  }), [setContinueWatching])
  const removeProgress = useCallback((id) => setContinueWatching((current) => current.filter((item) => item.id !== id)), [setContinueWatching])
  const addProfile = useCallback((name) => {
    const profileToAdd = { id: `profile-${Date.now()}`, name: name.trim(), color: '#6d617e', kids: false }
    setProfiles((current) => [...current, profileToAdd])
    return profileToAdd
  }, [setProfiles])
  const removeProfile = useCallback((id) => {
    setProfiles((current) => current.length > 1 ? current.filter((item) => item.id !== id) : current)
    setProfile((current) => current?.id === id ? null : current)
  }, [setProfiles, setProfile])
  const setTitlePreference = useCallback((movie, preference) => setPreferences((current) => {
    if (current[movie.id]?.value === preference) {
      const next = { ...current }
      delete next[movie.id]
      return next
    }
    return { ...current, [movie.id]: { value: preference, genres: movie.genres || [] } }
  }), [setPreferences])
  const getTitlePreference = useCallback((id) => preferences[id]?.value || null, [preferences])
  const updateSetting = useCallback((key, value) => setSettings((current) => ({ ...current, [key]: value })), [setSettings])

  const value = useMemo(() => ({ myList, continueWatching, profile, setProfile, profiles, addProfile, removeProfile, preferences, setTitlePreference, getTitlePreference, settings, updateSetting, toggleMyList, isInMyList, saveProgress, removeProgress }), [myList, continueWatching, profile, setProfile, profiles, addProfile, removeProfile, preferences, setTitlePreference, getTitlePreference, settings, updateSetting, toggleMyList, isInMyList, saveProgress, removeProgress])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
