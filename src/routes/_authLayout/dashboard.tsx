import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authLayout/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl font-bold text-slate-50"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Good morning 👋
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Here&apos;s what&apos;s happening across your inventory today.
        </p>
      </div>

      {/* KPI placeholder grid — replace with real data in Milestone 2 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          'Total Products',
          'Pending PRs',
          'Low Stock Alerts',
          'Active Warehouses',
        ].map((label) => (
          <div
            key={label}
            className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
              {label}
            </p>
            <p className="text-2xl font-bold text-slate-50">—</p>
          </div>
        ))}
      </div>
    </div>
  )
}
