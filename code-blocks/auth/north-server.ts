/**
 * Server-side North API proxy — used by Next.js API routes only.
 *
 * Reads auth from request headers (x-north-token, x-north-iap-cookie, x-north-host)
 * and forwards to the North API with Bearer auth + optional IAP cookie.
 */

const DEFAULT_HOST = "https://demo.north.cohere.com/api"

function extractAuth(request: Request) {
  return {
    token: request.headers.get("x-north-token") || "",
    host: request.headers.get("x-north-host") || DEFAULT_HOST,
    iapCookie: request.headers.get("x-north-iap-cookie") || "",
  }
}

export async function northSignIn(email: string, password: string, host?: string) {
  const res = await fetch(`${host || DEFAULT_HOST}/v1/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const raw = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((raw as any).message || `Sign-in failed: ${res.status}`)
  const token = (raw as any).token
  if (!token) throw new Error("No token in response")
  return { token, raw }
}

export async function northFetch(request: Request, path: string, options: RequestInit = {}) {
  const { token, host, iapCookie } = extractAuth(request)
  if (!token) throw new Error("No auth token")
  return fetch(`${host}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(iapCookie ? { Cookie: iapCookie } : {}),
      ...(options.headers as Record<string, string> || {}),
    },
  })
}

export async function northGet<T>(request: Request, path: string): Promise<T> {
  const res = await northFetch(request, path)
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status}: ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : ({} as T)
}

export async function northPost<T>(request: Request, path: string, body: unknown): Promise<T> {
  const res = await northFetch(request, path, { method: "POST", body: JSON.stringify(body) })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status}: ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : ({} as T)
}

export function errorResponse(message: string, status = 500) {
  return Response.json({ error: message }, { status })
}
