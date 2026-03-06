import {
  createFileRoute,
  Outlet,
  Link,
  redirect,
  useRouterState,
} from '@tanstack/react-router'
import { useAuth, useLogout, usePermissions } from '../features/auth/hooks'

export const Route = createFileRoute('/_authLayout')({
  // beforeLoad runs before the component mounts — perfect for auth guards.
  // If the user is not authenticated, redirect to login before rendering anything.
  // context.auth would be ideal here but since auth state lives in TanStack Store
  // (client-side), we use the store directly via the redirect pattern below.
  beforeLoad: async ({ location }) => {
    // We import the store directly here (not a hook) because beforeLoad
    // is not a React component — hooks cannot be called outside components.
    const { authStore } = await import('../features/auth/store')
    const { user, isInitializing } = authStore.state

    // If still initializing, let the component handle the loading state
    // (the AuthProvider in __root.tsx handles this race condition)
    if (!isInitializing && !user) {
      throw redirect({
        to: '/login',
        search: {
          // Pass the attempted URL so login can redirect back after auth
          redirect: location.href,
        },
      })
    }
  },
  component: AuthLayout,
})

// ─── Nav Items ────────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  to: string
  icon: string
  adminOnly?: boolean
  managerUp?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: '◈' },
  { label: 'Products', to: '/products', icon: '📦' },
  { label: 'Warehouses', to: '/warehouses', icon: '🏭' },
  { label: 'Suppliers', to: '/suppliers', icon: '🤝' },
  {
    label: 'Purchase Requests',
    to: '/purchase-requests',
    icon: '📋',
    managerUp: true,
  },
  { label: 'Stock Movements', to: '/stock-movements', icon: '↕' },
  { label: 'Audit Logs', to: '/audit-logs', icon: '🔍', adminOnly: true },
  { label: 'Users', to: '/users', icon: '👥', adminOnly: true },
]

// ─── Auth Layout ──────────────────────────────────────────────────────────────

function AuthLayout() {
  const { isInitializing, isAuthenticated } = useAuth()

  // Handle the case where auth is still resolving when this layout mounts.
  // This happens when a user directly visits a protected URL (/dashboard)
  // on page load — the layout mounts before useInitAuth() finishes.
  if (isInitializing) {
    return <AppLoadingScreen />
  }

  // Secondary guard — beforeLoad handles the main case, but this catches
  // any edge cases where state changes after the component mounts.
  if (!isAuthenticated) {
    return null // beforeLoad redirect will handle navigation
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

// ─── Top Navigation ───────────────────────────────────────────────────────────

function TopNav() {
  const { user } = useAuth()
  const { canViewAuditLogs, canManageUsers, canApprovePR } = usePermissions()
  const { mutate: logout } = useLogout()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  // Filter nav items based on permissions
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.adminOnly) return canViewAuditLogs || canManageUsers
    if (item.managerUp) return canApprovePR
    return true
  })

  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex shrink-0 items-center gap-2 no-underline"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900">
              <span className="text-[10px] font-black text-white">LC</span>
            </div>
            <span className="text-sm font-black tracking-tight text-zinc-900">
              LogistiCore
            </span>
          </Link>

          {/* Nav links — scrollable on smaller screens */}
          <div className="scrollbar-none mx-6 flex flex-1 items-center gap-1 overflow-x-auto">
            {visibleItems.map((item) => {
              const isActive =
                currentPath === item.to ||
                (item.to !== '/dashboard' && currentPath.startsWith(item.to))

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap no-underline transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <span className="text-sm leading-none">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Right side: org badge + user menu */}
          <div className="flex shrink-0 items-center gap-3">
            {/* Org badge */}
            <div className="hidden items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="max-w-[120px] truncate text-xs font-semibold text-zinc-600">
                {user?.orgId ?? 'Organization'}
              </span>
            </div>

            {/* Role badge */}
            <RoleBadge role={user?.role} />

            {/* User avatar + logout */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                {user?.email?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <button
                onClick={() => logout()}
                className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// ─── Role Badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role?: string }) {
  const styles: Record<string, string> = {
    ADMIN: 'bg-violet-100 text-violet-700',
    MANAGER: 'bg-blue-100 text-blue-700',
    STAFF: 'bg-zinc-100 text-zinc-600',
  }

  if (!role) return null

  return (
    <span
      className={`rounded-md px-2 py-1 text-[10px] font-black tracking-wider uppercase ${styles[role] ?? styles.STAFF}`}
    >
      {role}
    </span>
  )
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

function AppLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900"
          role="status"
          aria-label="Loading"
        />
        <p className="text-sm font-medium text-zinc-400">Loading...</p>
      </div>
    </div>
  )
}
