/**
 * North API Client — Client-side HTTP proxy
 *
 * All requests go through Next.js API routes (/api/north/*) which forward
 * to the North API with proper auth headers. This avoids CORS issues.
 *
 * Auth token stored in localStorage. Supports:
 * - Email/password sign-in (demo instances)
 * - Direct token paste (SSO/OKTA)
 * - Full cookie string (IAP-protected instances)
 */

const API_BASE = "/api/north"
const REQUEST_TIMEOUT_MS = 300000 // 5 min for agent calls
const TOKEN_STORAGE_KEY = "north_auth_token"
const IAP_STORAGE_KEY = "north_iap_cookie"
const HOST_STORAGE_KEY = "north_api_host"
const DEFAULT_HOST = "https://demo.north.cohere.com/api"

// ─── Token Management ──────────────────────────────────────────────────────

export function getAuthToken(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem(TOKEN_STORAGE_KEY) || ""
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token)
  else localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export function getIapCookie(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem(IAP_STORAGE_KEY) || ""
}

export function setIapCookie(cookie: string): void {
  if (typeof window === "undefined") return
  if (cookie) localStorage.setItem(IAP_STORAGE_KEY, cookie)
  else localStorage.removeItem(IAP_STORAGE_KEY)
}

export function getApiHost(): string {
  if (typeof window === "undefined") return DEFAULT_HOST
  return localStorage.getItem(HOST_STORAGE_KEY) || DEFAULT_HOST
}

export function setApiHost(host: string): void {
  if (typeof window === "undefined") return
  if (host) localStorage.setItem(HOST_STORAGE_KEY, host)
  else localStorage.removeItem(HOST_STORAGE_KEY)
}

export function setFromFullCookies(fullCookies: string): void {
  const authMatch = fullCookies.match(/(?:^|;\s*)authToken=([^;]*)/)
  if (authMatch) setAuthToken(authMatch[1])
  setIapCookie(fullCookies)
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(IAP_STORAGE_KEY)
}

export function hasAuthToken(): boolean {
  return getAuthToken().length > 0
}

export function getCurrentUser(): { fullname: string; email: string } | null {
  const token = getAuthToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return {
      fullname: payload?.context?.fullname || "",
      email: payload?.context?.email || "",
    }
  } catch { return null }
}

// ─── Sign In ────────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string, host?: string): Promise<{ token: string }> {
  if (host) setApiHost(host)
  const res = await fetch(`${API_BASE}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, host: host || getApiHost() }),
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Sign-in failed`)
  const data = await res.json()
  if (!data.token) throw new Error("No token in response")
  setAuthToken(data.token)
  return data
}

// ─── HTTP Client ────────────────────────────────────────────────────────────

class NorthClient {
  private get headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      ...(getAuthToken() ? { "x-north-token": getAuthToken() } : {}),
      ...(getIapCookie() ? { "x-north-iap-cookie": getIapCookie() } : {}),
      ...(getApiHost() ? { "x-north-host": getApiHost() } : {}),
    }
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    if (!hasAuthToken()) throw { status: 0, message: "Not signed in" }
    const url = new URL(`${API_BASE}${path}`, window.location.origin)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    const res = await fetch(url.toString(), { headers: this.headers, signal: controller.signal }).finally(() => clearTimeout(timeout))
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw { status: res.status, message: body.error || res.statusText }
    }
    return res.json()
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    if (!hasAuthToken()) throw { status: 0, message: "Not signed in" }
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout))
    if (!res.ok) {
      const respBody = await res.json().catch(() => ({}))
      throw { status: res.status, message: respBody.error || res.statusText }
    }
    return res.json()
  }
}

export const northClient = new NorthClient()
