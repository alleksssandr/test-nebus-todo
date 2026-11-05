
const SCHEMA_VERSION = 1;
const STORAGE_PREFIX = 'test-todo:'

export function saveToStorage<T>(key: string, value: T): void {
  if (!import.meta.client) return

  try {
    const data = { version: SCHEMA_VERSION, data: value };
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
  } catch (error) {
    console.warn(`[storage] save error "${key}":`, error)
  }
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (!import.meta.client) return fallback

  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (raw === null) return fallback


    const parsed = JSON.parse(raw);
    if (parsed.version !== SCHEMA_VERSION) {
      console.warn(`[storage] is not actual schema (${parsed.version} !=== ${SCHEMA_VERSION}). Key: "${key}":`)
      return fallback;
    }

    return parsed.data as T;
  } catch (error) {
    console.warn(`[storage] load error "${key}":`, error)
    return fallback
  }
}

export function removeFromStorage(key: string): void {
  if (!import.meta.client) return

  localStorage.removeItem(STORAGE_PREFIX + key)
}
