/**
 * Centralized Data Store — localStorage cache with TTL.
 *
 * Usage:
 *   store.items.get()                    → CachedItem<T> | null
 *   store.items.set(data)               → void
 *   isStale(store.items.get())          → boolean
 *   getAge(store.items.get())           → "5m ago" | "2h ago" | etc.
 *
 * Customize the store object for your domain.
 */

const STORE_PREFIX = "wb_store_"

interface CachedItem<T> {
  data: T
  timestamp: string
  staleAfterMs?: number
}

function key(type: string, id?: string): string {
  return `${STORE_PREFIX}${type}${id ? `_${id.replace(/\s+/g, "_").toLowerCase()}` : ""}`
}

function get<T>(type: string, id?: string): CachedItem<T> | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(key(type, id))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function set<T>(type: string, data: T, id?: string, staleAfterMs?: number): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key(type, id), JSON.stringify({
      data, timestamp: new Date().toISOString(), staleAfterMs,
    }))
  } catch {}
}

export function isStale(item: CachedItem<unknown> | null): boolean {
  if (!item) return true
  return Date.now() - new Date(item.timestamp).getTime() > (item.staleAfterMs || 3600000)
}

export function getAge(item: CachedItem<unknown> | null): string {
  if (!item) return "never"
  const mins = Math.floor((Date.now() - new Date(item.timestamp).getTime()) / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

// ─── Customize for your domain ─────────────────────────────────────────────

export const store = {
  // Example: main list of items
  items: {
    get: () => get<any[]>("items"),
    set: (data: any[]) => set("items", data, undefined, 3600000), // 1h
  },

  // Example: per-item detail
  detail: {
    get: (itemId: string) => get<any>("detail", itemId),
    set: (itemId: string, data: any) => set("detail", data, itemId, 3600000),
  },

  // Example: briefing/digest
  briefing: {
    get: () => get<any>("briefing"),
    set: (data: any) => set("briefing", data, undefined, 14400000), // 4h
  },

  clearAll: () => {
    if (typeof window === "undefined") return
    Object.keys(localStorage)
      .filter((k) => k.startsWith(STORE_PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  },
}
