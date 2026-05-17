import { useState, useCallback } from 'react'

export function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  const set = useCallback(updater => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
      return next
    })
  }, [key])

  const reset = useCallback(() => {
    try { localStorage.removeItem(key) } catch {}
    setState(initial)
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  return [state, set, reset]
}
