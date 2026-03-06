import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authLayout/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-zinc-900">Dashboard</h1>
      <p className="mt-2 text-zinc-500">Welcome to LogistiCore.</p>
    </div>
  )
}
