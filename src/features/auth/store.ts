/**
 * auth/store.ts
 *
 * This is the TanStack Store for AUTH UI STATE.
 * It answers the question: "Who is the currently logged-in user?"
 *
 * WHAT LIVES HERE (UI state — components react to this):
 *   - user object (name, email, id)
 *   - role (ADMIN | MANAGER | STAFF)
 *   - orgId (for display purposes)
 *   - isAuthenticated flag
 *   - isInitializing flag (true while silent refresh runs on page load)
 *
 * WHAT DOES NOT LIVE HERE (infrastructure — lives in token-store.ts):
 *   - The raw access token string
 *
 * WHY TANSTACK STORE AND NOT REACT STATE?
 *   Auth state is needed by components at every level of the tree —
 *   the sidebar, the header, route guards, individual buttons.
 *   Passing it via props would require "prop drilling" through dozens
 *   of components. A store makes it globally accessible without drilling.
 *
 *   TanStack Store is also framework-agnostic, meaning the store itself
 *   has no React dependency. The `useStore` hook is the React binding.
 *   This separation makes testing easier.
 */

import { Store } from '@tanstack/store'

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: UserRole
  orgId: string
  isActive: boolean
}

interface AuthState {
  /** The authenticated user, or null if not logged in */
  user: AuthUser | null

  /**
   * True while the app is doing the initial silent refresh on page load.
   * Use this to show a loading spinner instead of flashing the login page.
   *
   * Flow: app starts → isInitializing: true → silent refresh runs
   *       → success: user set, isInitializing: false
   *       → failure: user null, isInitializing: false → redirect to login
   */
  isInitializing: boolean
}

// ─── Store Instance ───────────────────────────────────────────────────────────

export const authStore = new Store<AuthState>({
  user: null,
  isInitializing: true, // Start true — assume we might have a session until proven otherwise
})

// ─── Derived State ────────────────────────────────────────────────────────────

// These are plain functions, not hooks. They read from the store synchronously.
// The hooks (useAuth, usePermissions) in hooks.ts wrap these for React components.

export const getIsAuthenticated = (): boolean => authStore.state.user !== null
export const getCurrentUser = (): AuthUser | null => authStore.state.user
export const getCurrentRole = (): UserRole | null =>
  authStore.state.user?.role ?? null

// ─── Store Actions ────────────────────────────────────────────────────────────

/**
 * Called after a successful login or silent refresh.
 * Sets the user in the store — all subscribed components re-render.
 */
export const setAuthUser = (user: AuthUser): void => {
  authStore.setState((state) => ({ ...state, user, isInitializing: false }))
}

/**
 * Called on logout or when refresh fails completely.
 * Wipes the user from the store.
 */
export const clearAuthUser = (): void => {
  authStore.setState((state) => ({
    ...state,
    user: null,
    isInitializing: false,
  }))
}

/**
 * Called when initialization (silent refresh check) is complete.
 * Even if the user is null (not logged in), we need to mark this done
 * so the app stops showing the loading spinner.
 */
export const setInitializingDone = (): void => {
  authStore.setState((state) => ({ ...state, isInitializing: false }))
}
