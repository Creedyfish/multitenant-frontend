import { createFileRoute } from '@tanstack/react-router'
import { Package, ClipboardList, Warehouse, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks'
import {
  useProductCount,
  usePendingPrCount,
  useWarehouseCount,
} from '@/features/dashboard/hooks/queries'

export const Route = createFileRoute('/_authLayout/dashboard')({
  component: DashboardPage,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string
  icon: React.ReactNode
  value: number | undefined
  isLoading: boolean
  isError: boolean
  accent: 'sky' | 'amber' | 'emerald' | 'violet'
}

const accentMap = {
  sky: {
    icon: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  amber: {
    icon: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  emerald: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  violet: {
    icon: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
}

function KpiCard({
  title,
  icon,
  value,
  isLoading,
  isError,
  accent,
}: KpiCardProps) {
  const colors = accentMap[accent]

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium tracking-wider text-slate-400 uppercase">
          {title}
        </CardTitle>
        <div className={`rounded-lg p-2 ${colors.bg} ${colors.border} border`}>
          <span className={`block h-4 w-4 ${colors.icon}`}>{icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Skeleton pulse
          <div className="h-8 w-16 animate-pulse rounded-md bg-slate-800" />
        ) : isError ? (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <span className="text-sm text-rose-400">Failed to load</span>
          </div>
        ) : (
          <p className="text-2xl font-bold text-slate-50">
            {value?.toLocaleString() ?? '—'}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  const products = useProductCount()
  const pendingPrs = usePendingPrCount()
  const warehouses = useWarehouseCount()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-bold text-slate-50"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {getGreeting()}, {firstName} 👋
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Here&apos;s what&apos;s happening across your inventory today.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Products"
          icon={<Package className="h-4 w-4" />}
          value={products.data}
          isLoading={products.isLoading}
          isError={products.isError}
          accent="sky"
        />
        <KpiCard
          title="Pending PRs"
          icon={<ClipboardList className="h-4 w-4" />}
          value={pendingPrs.data}
          isLoading={pendingPrs.isLoading}
          isError={pendingPrs.isError}
          accent="amber"
        />
        <KpiCard
          title="Active Warehouses"
          icon={<Warehouse className="h-4 w-4" />}
          value={warehouses.data}
          isLoading={warehouses.isLoading}
          isError={warehouses.isError}
          accent="emerald"
        />
        {/* Placeholder for Low Stock — needs backend support for min_stock_level filter */}
        <Card className="border-dashed border-slate-800 bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium tracking-wider text-slate-500 uppercase">
              Low Stock Alerts
            </CardTitle>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-2">
              <AlertTriangle className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
