import { Bell } from 'lucide-react'
import { useAuth, useLogout } from '@/features/auth/hooks'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouterState } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'

// Derive a readable page title from the current pathname
function usePageTitle(): string {
  const routerState = useRouterState()
  const path = routerState.location.pathname

  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) return 'Dashboard'

  const last = segments[segments.length - 1]
  return last
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Initials avatar from name or email
function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return 'U'
}

export function AppTopbar() {
  const { user } = useAuth()
  const { mutate: logout, isPending: isLoggingOut } = useLogout() // ← wire it up
  const pageTitle = usePageTitle()
  const initials = getInitials(user?.name, user?.email)
  const navigate = useNavigate()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-6">
      <h1
        className="text-sm font-semibold text-slate-50"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {pageTitle}
      </h1>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-slate-400 hover:bg-slate-800 hover:text-slate-50"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-sky-400" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-5 bg-slate-700" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 items-center gap-2.5 rounded-lg px-2 hover:bg-slate-800"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/20 text-xs font-bold text-sky-400">
                {initials}
              </span>
              <div className="flex flex-col items-start leading-none">
                {user?.name && (
                  <span className="text-xs font-medium text-slate-50">
                    {user.name}
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  {user?.role ?? 'Staff'}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 border-slate-700 bg-slate-900 text-slate-300"
          >
            <DropdownMenuLabel className="text-xs font-normal text-slate-400">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem
              className="cursor-pointer text-sm hover:bg-slate-800 hover:text-slate-50"
              onClick={() => navigate({ to: '/settings' })}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            {/* ← disabled + loading state while logout is in flight */}
            <DropdownMenuItem
              className="cursor-pointer text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
              onClick={() => logout()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
