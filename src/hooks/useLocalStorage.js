import { useCallback, useEffect, useState } from 'react'

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const legacyKey = key.startsWith('nexflix-') ? `streamflix-${key.slice('nexflix-'.length)}` : null
      const stored = window.localStorage.getItem(key) ?? (legacyKey ? window.localStorage.getItem(legacyKey) : null)
      return stored === null ? initialValue : JSON.parse(stored)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      if (key.startsWith('nexflix-')) window.localStorage.removeItem(`streamflix-${key.slice('nexflix-'.length)}`)
    } catch {
      // Storage may be unavailable in private browsing; in-memory state still works.
    }
  }, [key, value])

  const updateValue = useCallback((nextValue) => {
    setValue((current) => typeof nextValue === 'function' ? nextValue(current) : nextValue)
  }, [])

  return [value, updateValue]
}
