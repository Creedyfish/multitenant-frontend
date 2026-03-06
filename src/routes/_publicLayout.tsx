import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PublicNav } from '@/features/public/components/PublicNav'

export const Route = createFileRoute('/_publicLayout')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <PublicNav />
      <Outlet />
    </div>
  )
}
