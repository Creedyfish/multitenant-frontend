/**
 * auth/hooks.ts
 *
 * React hooks that give components access to auth state and actions.
 * Components import from HERE only — never from store.ts or api-client.ts directly.
 *
 * HOOKS PROVIDED:
 *   useAuth()        → who am I? (user, isAuthenticated, isInitializing)
 *   useLogin()       → mutation to log in
 *   useLogout()      → mutation to log out
 *   usePermissions() → what can I do? (role-based boolean flags)
 *   useInitAuth()    → runs once on app boot to restore session via silent refresh
 *
 * WHY SEPARATE HOOKS FROM STORE?
 *   The store is framework-agnostic state. The hooks are the React binding layer.
 *   If you ever need to test auth logic without React, you test the store/actions.
 *   If you need to test a component that uses auth, you mock the hooks.
 *   Clean separation = easier testing.
 */

import { useStore } from '@tanstack/react-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import {
  authStore,
  setAuthUser,
  clearAuthUser,
  type AuthUser,
  type UserRole,
} from './store'
import { apiClient } from '@/lib/api-client'
import { setAccessToken, clearAccessToken } from '@/lib/token-store'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginCredentials {
  email: string
  password: string
  subdomain: string
}

interface MeResponse {
  id: string
  email: string
  full_name: string
  role: UserRole
  org_id: string
}

const mapMeResponse = (me: MeResponse): AuthUser => ({
  id: me.id,
  email: me.email,
  name: me.full_name,
  role: me.role,
  orgId: me.org_id,
  isActive: true,
})

// ─── useAuth ──────────────────────────────────────────────────────────────────

/**
 * The primary hook for reading auth state in components.
 *
 * Usage:
 *   const { user, isAuthenticated, isInitializing } = useAuth()
 *
 *   if (isInitializing) return <Spinner />
 *   if (!isAuthenticated) return <Navigate to="/login" />
 */
export const useAuth = () => {
  // useStore subscribes this component to store changes.
  // It only re-renders when the selected slice actually changes.
  const user = useStore(authStore, (s) => s.user)
  const isInitializing = useStore(authStore, (s) => s.isInitializing)

  return {
    user,
    isAuthenticated: user !== null,
    isInitializing,
    role: user?.role ?? null,
    orgId: user?.orgId ?? null,
  }
}

// ─── useLogin ─────────────────────────────────────────────────────────────────

/**
 * Mutation hook for the login flow.
 *
 * Usage:
 *   const { mutate: login, isPending, error } = useLogin()
 *   login({ email: '...', password: '...' })
 *
 * On success:
 *   1. Stores the access token in memory (token-store)
 *   2. Fetches the current user profile (/users/me)
 *   3. Sets the user in the auth store
 *   4. Redirects to dashboard
 *
 * WHY DO WE FETCH /users/me AFTER LOGIN?
 *   The login response only gives us tokens. The user's name, role, orgId etc.
 *   live on the user object. We need a separate call to get the full profile.
 *   This keeps the login endpoint doing one thing (issuing tokens) and
 *   /users/me doing one thing (returning user data). Single responsibility.
 */
export const useLogin = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const formData = new URLSearchParams()
      formData.append('username', credentials.email)
      formData.append('password', credentials.password)

      const loginResponse = await apiClient
        .url('/api/v1/auth/token')
        .headers({
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Tenant-ID': credentials.subdomain,
        })
        .post(formData.toString())
        .json<{ access_token: string; token_type: string }>()

      setAccessToken(loginResponse.access_token)

      const meResponse = await apiClient
        .url('/api/v1/users/me')
        .get()
        .json<MeResponse>()

      return mapMeResponse(meResponse)
    },

    onSuccess: (user) => {
      // Update the auth store — all subscribed components re-render
      setAuthUser(user)

      // Clear any stale query cache from a previous session
      queryClient.clear()

      // Redirect to dashboard
      router.navigate({ to: '/dashboard' })
    },

    // Note: we do NOT handle the error here.
    // The error is returned from useMutation and the login FORM handles displaying it.
    // Hooks should not know about UI — that's the form's job.
  })
}

// ─── useLogout ────────────────────────────────────────────────────────────────

/**
 * Mutation hook for logging out.
 *
 * Calls the backend to invalidate the refresh token, then clears local state.
 * Even if the backend call fails, we still clear local state (fail-safe logout).
 *
 * Usage:
 *   const { mutate: logout } = useLogout()
 *   <button onClick={() => logout()}>Log out</button>
 */
export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // Tell the backend to invalidate the refresh token
      // We use .res() instead of .json() because the response body doesn't matter
      await apiClient.url('/api/v1/auth/logout').post().res()
    },

    onSettled: () => {
      // Always clear local state, regardless of whether the server call succeeded.
      // A failed logout call should never leave the user "stuck" logged in locally.
      clearAccessToken()
      clearAuthUser()
      queryClient.clear()
      router.navigate({ to: '/login' })
    },
  })
}

// ─── usePermissions ───────────────────────────────────────────────────────────

/**
 * Returns boolean flags for what the current user can do.
 *
 * CRITICAL RULE: Components NEVER check `role === 'ADMIN'` directly.
 * They always use these named booleans. Why?
 *
 *   1. If permission rules change (e.g., Managers can now manage users),
 *      you update ONE place — here — not 20 scattered comparisons.
 *
 *   2. The name `canManageUsers` is self-documenting. `role === 'ADMIN'`
 *      forces the reader to reason about what that implies.
 *
 *   3. Future: if you add more granular permissions (per-user overrides),
 *      this hook is the only place that needs to change.
 *
 * Usage:
 *   const { canApprovePR, canManageUsers } = usePermissions()
 *   {canApprovePR && <ApproveButton />}
 */
export const usePermissions = () => {
  const role = useStore(authStore, (s) => s.user?.role ?? null)

  const is = (allowedRoles: UserRole[]): boolean =>
    role !== null && allowedRoles.includes(role)

  return {
    // ── User Management ──────────────────────────────────────────────────
    canManageUsers: is(['ADMIN']),
    canViewUsers: is(['ADMIN', 'MANAGER']),

    // ── Products ──────────────────────────────────────────────────────────
    canCreateProduct: is(['ADMIN', 'MANAGER']),
    canEditProduct: is(['ADMIN', 'MANAGER']),
    canDeleteProduct: is(['ADMIN']),
    canViewProducts: is(['ADMIN', 'MANAGER', 'STAFF']),

    // ── Purchase Requests ────────────────────────────────────────────────
    canCreatePR: is(['ADMIN', 'MANAGER', 'STAFF']),
    canSubmitPR: is(['ADMIN', 'MANAGER', 'STAFF']),
    canApprovePR: is(['ADMIN', 'MANAGER']),
    canRejectPR: is(['ADMIN', 'MANAGER']),
    canViewAllPRs: is(['ADMIN', 'MANAGER']),

    // ── Stock Movements ───────────────────────────────────────────────────
    canAdjustStock: is(['ADMIN', 'MANAGER']),
    canViewStockMovements: is(['ADMIN', 'MANAGER', 'STAFF']),

    // ── Audit Logs ────────────────────────────────────────────────────────
    canViewAuditLogs: is(['ADMIN']),

    // ── Organization ──────────────────────────────────────────────────────
    canManageOrganization: is(['ADMIN']),

    // ── Raw role (use sparingly, prefer the named flags above) ────────────
    role,
    isAdmin: role === 'ADMIN',
    isManager: role === 'MANAGER',
    isStaff: role === 'STAFF',
  }
}

// ─── useInitAuth ──────────────────────────────────────────────────────────────

/**
 * Runs ONCE on app boot. Attempts a silent refresh to restore the user's session.
 *
 * Mount this hook in your root layout (__root.tsx). It handles the critical
 * question: "Does the user have an active session when they open/refresh the page?"
 *
 * Flow:
 *   1. App loads, isInitializing: true → show spinner, don't redirect yet
 *   2. This hook calls /auth/refresh (HttpOnly cookie is sent automatically)
 *   3a. Success → setAccessToken + setAuthUser → isInitializing: false
 *   3b. Failure → clearAuthUser → isInitializing: false → route guard redirects to login
 *
 * WHY NOT USE useQuery FOR THIS?
 *   Silent refresh is a one-time initialization side effect, not a data query.
 *   It mutates auth state as a side effect. useEffect is the right tool here.
 *   useQuery is for data you want to read, cache, and refetch. This is none of those.
 *
 * Usage (in __root.tsx):
 *   export function RootComponent() {
 *     useInitAuth()
 *     const { isInitializing } = useAuth()
 *     if (isInitializing) return <FullPageSpinner />
 *     return <Outlet />
 *   }
 */
export const useInitAuth = () => {
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await apiClient
          .url('/api/v1/auth/refresh')
          .post()
          .json<{ access_token: string; token_type: string }>()

        setAccessToken(response.access_token)

        const meResponse = await apiClient
          .url('/api/v1/users/me')
          .get()
          .json<MeResponse>()

        setAuthUser(mapMeResponse(meResponse))
      } catch (err) {
        console.error('❌ useInitAuth: caught error', err)
        clearAuthUser()
      }
    }

    initializeAuth()

    // Listen for the logout event dispatched by api-client.ts when refresh fails mid-session
    const handleForceLogout = () => {
      clearAccessToken()
      clearAuthUser()
    }

    window.addEventListener('auth:logout', handleForceLogout)
    return () => window.removeEventListener('auth:logout', handleForceLogout)
  }, []) // Empty deps — run only once on mount
}
