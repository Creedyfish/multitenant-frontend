/**
 * api-client.ts
 *
 * This is the SINGLE entry point for all HTTP communication in the app.
 * Nothing else should ever call fetch() directly.
 *
 * RESPONSIBILITIES:
 *   1. Attach the Authorization header to every request automatically
 *   2. On 401 → silently refresh the access token → retry the original request
 *   3. On refresh failure → clear auth state → redirect to login
 *   4. Normalize all API errors into a predictable shape
 *
 * WRETCH MIDDLEWARE PATTERN:
 *   Middleware in wretch follows this signature:
 *     (next) => (url, opts) => Promise<Response>
 *
 *   Think of it as a pipeline. Each middleware can:
 *     - Modify the request before passing to `next`
 *     - Inspect/modify the response after `next` returns
 *     - Short-circuit (return early) without calling `next`
 *
 *   Middleware chain:
 *     Request → [authMiddleware] → [actual fetch] → [401 handler via .resolve()]
 */

import wretch from 'wretch'
import type { ConfiguredMiddleware } from 'wretch'
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  isRefreshing,
  startRefreshing,
  finishRefreshing,
  waitForRefresh,
} from './token-store'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape of every successful response from the backend */
export interface ApiResponse<T> {
  success: true
  data: T
  message: string
}

/** Shape of every error response from the backend */
export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: { field: string; message: string }[]
  }
}

/** Shape of paginated list responses */
export interface PaginatedResponse<T> {
  success: true
  data: T[]
  pagination: {
    page: number
    page_size: number
    total_items: number
    total_pages: number
  }
}

/** A normalized error we throw throughout the app */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: { field: string; message: string }[],
    public status?: number,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// ─── Auth Middleware ──────────────────────────────────────────────────────────

/**
 * Attaches the Authorization header before every request.
 *
 * WHY AS MIDDLEWARE and not just calling .auth() on the wretch instance?
 * Because .auth() is evaluated ONCE when the instance is created.
 * The token changes over time (rotates every 60 min). Middleware runs
 * on EVERY request, so it always reads the latest token from the store.
 */
const authMiddleware: ConfiguredMiddleware = (next) => (url, opts) => {
  const token = getAccessToken()

  if (token) {
    // Merge our auth header into whatever headers are already on the request
    const headers = {
      ...(opts.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    }
    return next(url, { ...opts, headers })
  }

  // No token yet (e.g., during login request itself) — pass through unchanged
  return next(url, opts)
}

// ─── Base Configuration ───────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

// ─── Silent Refresh Logic ─────────────────────────────────────────────────────

/**
 * Calls the backend refresh endpoint. The HttpOnly refresh token cookie is sent
 * automatically by the browser — we don't need to touch it at all.
 *
 * Returns the new access token on success, or null on failure.
 */
const performSilentRefresh = async (): Promise<string | null> => {
  try {
    // Use a plain wretch instance (no auth middleware) to avoid circular issues
    const response = await wretch(`${BASE_URL}/api/v1/auth/refresh`)
      .options({ credentials: 'include' }) // This sends the HttpOnly cookie
      .post()
      .json<{ access_token: string }>()

    return response.access_token
  } catch {
    return null
  }
}

/**
 * The configured wretch instance. Every feature's query/mutation function
 * imports THIS and calls methods on it.
 *
 * .options({ credentials: 'include' }) — sends cookies (needed for refresh token)
 * .middlewares([authMiddleware])       — auto-attaches Bearer token
 * .resolve(...)                        — the 401 → refresh → retry flow
 */
export const apiClient = wretch(BASE_URL)
  .options({ credentials: 'include' })
  .middlewares([authMiddleware])

  /**
   * .catcher() pre-registers error handlers on the Wretch REQUEST instance.
   * This is the correct v3 approach — it avoids the TypeScript inference
   * issues with .resolve() where `w` can be typed as Wretch<unknown,...>
   * before an HTTP method is called.
   *
   * .catcher(statusCode, handler) is equivalent to calling .unauthorized(),
   * .forbidden() etc. on the response chain, but registered upfront so every
   * request made from this instance automatically has them.
   *
   * Handler signature: (error: WretchError, originalRequest: Wretch) => any
   * Return a value to resolve the promise, throw to reject it.
   */

  // ── 401 Handler: Silent Refresh + Retry ──────────────────────────────────────
  .catcher(401, async (error, originalRequest) => {
    /**
     * IMPORTANT: The "refresh race" problem.
     *
     * Imagine 3 API calls fire simultaneously. All 3 get 401.
     * Without coordination, all 3 would try to call /auth/refresh.
     * The first refresh invalidates the refresh token (tokens rotate),
     * so the 2nd and 3rd refresh calls would FAIL, logging the user out.
     *
     * Solution: only ONE refresh runs. The others wait via the queue
     * in token-store.ts. Once the first refresh completes, everyone
     * retries with the new token.
     */
    if (isRefreshing()) {
      // Another request already triggered a refresh — wait for it
      const newToken = await waitForRefresh()
      if (!newToken) throw error

      // Retry this request with the new token
      return originalRequest.auth(`Bearer ${newToken}`).fetch().json()
    }

    // We're the first to get 401 — kick off the refresh
    startRefreshing()
    const newToken = await performSilentRefresh()

    if (!newToken) {
      // Refresh failed (expired or invalid refresh token)
      finishRefreshing(null)
      clearAccessToken()

      // Dispatch a custom event so the auth store can react without
      // creating a circular import (api-client → auth-store → api-client)
      window.dispatchEvent(new CustomEvent('auth:logout'))

      throw error
    }

    // Refresh succeeded — store new token and notify waiting requests
    setAccessToken(newToken)
    finishRefreshing(newToken)

    // Retry original request with the new token
    return originalRequest.auth(`Bearer ${newToken}`).fetch().json()
  })

  // ── 403 Handler ──────────────────────────────────────────────────────────────
  // 403 means authenticated but not permitted. Do NOT log the user out.
  .catcher(403, async (error) => {
    const body: ApiError = await error.response?.json().catch(() => null)
    throw new AppError(
      'FORBIDDEN',
      body?.error?.message ??
        'You do not have permission to perform this action.',
      undefined,
      403,
    )
  })

  // ── 400 Handler: Validation Errors ───────────────────────────────────────────
  .catcher(400, async (error) => {
    const body: ApiError = await error.response?.json().catch(() => null)
    throw new AppError(
      body?.error?.code ?? 'VALIDATION_ERROR',
      body?.error?.message ?? 'Invalid request.',
      body?.error?.details,
      400,
    )
  })

  // ── 404 Handler ──────────────────────────────────────────────────────────────
  .catcher(404, async (error) => {
    const body: ApiError = await error.response?.json().catch(() => null)
    throw new AppError(
      'NOT_FOUND',
      body?.error?.message ?? 'Resource not found.',
      undefined,
      404,
    )
  })

  // ── 429 Rate Limit Handler ────────────────────────────────────────────────────
  .catcher(429, async () => {
    throw new AppError(
      'RATE_LIMITED',
      'Too many requests. Please wait a moment and try again.',
      undefined,
      429,
    )
  })

  // ── 500 Handler ──────────────────────────────────────────────────────────────
  .catcher(500, async () => {
    throw new AppError(
      'SERVER_ERROR',
      'Something went wrong on our end. Please try again later.',
      undefined,
      500,
    )
  })

// ─── Convenience Helpers ──────────────────────────────────────────────────────

/**
 * Builds a URL with query params, filtering out undefined/null values.
 *
 * Usage:
 *   buildUrl('/products', { page: 1, search: undefined })
 *   → '/products?page=1'
 *
 * WHY: Undefined params would show up as "?search=undefined" without this.
 */
export const buildUrl = (
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): string => {
  if (!params) return path

  const clean = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  )
  if (clean.length === 0) return path

  const query = new URLSearchParams(
    clean.map(([k, v]) => [k, String(v)]),
  ).toString()

  return `${path}?${query}`
}
