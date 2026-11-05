
const STORAGE_PREFIX = 'app:'

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (!import.meta.client) return fallback

  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch (error) {
    console.warn(`[storage] load error "${key}":`, error)
    return fallback
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (!import.meta.client) return

  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch (error) {
    console.warn(`[storage] save error "${key}":`, error)
  }
}

export function removeFromStorage(key: string): void {
  if (!import.meta.client) return

  localStorage.removeItem(STORAGE_PREFIX + key)
}
