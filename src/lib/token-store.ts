/**
 * token-store.ts
 *
 * WHY THIS EXISTS AS A PLAIN MODULE (not TanStack Store, not localStorage):
 *
 * The access token is INFRASTRUCTURE, not UI state. No component ever needs
 * to render differently based on the raw token string — they care about
 * `isAuthenticated` and `user`, which live in the auth store (TanStack Store).
 *
 * Storing the token here (in a JS module variable) means:
 *   ✅ XSS cannot steal it (not in localStorage/sessionStorage)
 *   ✅ No unnecessary React re-renders on token rotation
 *   ✅ The API client can read it synchronously without hooks
 *   ✅ Only this module can mutate it — everything else calls these functions
 *
 * The refresh token lives in an HttpOnly cookie (set by the backend).
 * JS never touches it directly — the browser sends it automatically on
 * requests to /auth/refresh. This is intentional and the most secure setup.
 */

// The raw access token string. Private to this module.
let _accessToken: string | null = null

// A flag to prevent multiple simultaneous refresh calls (the "refresh race").
// Without this, if 3 requests fire at the same time and all get 401,
// you'd call /auth/refresh 3 times. Only the first should run; the others wait.
let _isRefreshing = false

// When a refresh is in-flight, other callers queue up here.
// Once refresh resolves, everyone in the queue gets the new token.
type RefreshCallback = (token: string | null) => void
let _refreshQueue: RefreshCallback[] = []

// ─── Public API ──────────────────────────────────────────────────────────────

/** Read the current access token. Used by the API client to build auth headers. */
export const getAccessToken = (): string | null => _accessToken

/** Store a new access token. Called after login or a successful silent refresh. */
export const setAccessToken = (token: string): void => {
  _accessToken = token
}

/** Wipe the access token. Called on logout or when refresh fails. */
export const clearAccessToken = (): void => {
  _accessToken = null
}

// ─── Refresh Race Prevention ──────────────────────────────────────────────────

/** Returns true if a refresh call is already in-flight. */
export const isRefreshing = (): boolean => _isRefreshing

/** Mark that a refresh has started. */
export const startRefreshing = (): void => {
  _isRefreshing = true
}

/** Mark that refresh is done. Flushes the queue with the new token (or null on failure). */
export const finishRefreshing = (newToken: string | null): void => {
  _isRefreshing = false
  // Notify all waiting callers with the result
  _refreshQueue.forEach((cb) => cb(newToken))
  _refreshQueue = []
}

/**
 * Wait for the current in-flight refresh to complete.
 * Returns a promise that resolves with the new token once refresh finishes.
 *
 * Usage: if (isRefreshing()) { const token = await waitForRefresh() }
 */
export const waitForRefresh = (): Promise<string | null> => {
  return new Promise((resolve) => {
    _refreshQueue.push(resolve)
  })
}
