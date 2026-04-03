import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { authStore } from '@/features/auth/store'
import { useAuth } from '@/features/auth/hooks'
import { AppSidebar } from '@/components/AppSidebar'
import { AppTopbar } from '@/components/AppTopbar'

export const Route = createFileRoute('/_authLayout')({
  beforeLoad: () => {
    const { user, isInitializing } = authStore.state
    if (isInitializing) return
    if (!user) throw redirect({ to: '/login' })
  },
  component: AuthLayout,
})

function AuthLayout() {
  const { isInitializing, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isInitializing, isAuthenticated])

  if (isInitializing) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
