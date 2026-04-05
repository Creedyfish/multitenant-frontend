import { createFileRoute } from '@tanstack/react-router'
import { Package, ClipboardList, Warehouse, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks'
import { KpiCard } from '#/features/dashboard/components/ kpi-card'
import {
  useProductCount,
  usePendingPrCount,
  useWarehouseCount,
  useLowStockCount,
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

// ─── Page ─────────────────────────────────────────────────────────────────────

function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  const products = useProductCount()
  const pendingPrs = usePendingPrCount()
  const warehouses = useWarehouseCount()
  const {
    data: lowStockCount,
    isLoading: lowStockLoading,
    isError: lowStockError,
  } = useLowStockCount()
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
        <KpiCard
          title="Low Stock Alerts"
          icon={<AlertTriangle className="h-4 w-4" />}
          value={lowStockCount}
          isLoading={lowStockLoading}
          isError={lowStockError}
          accent="rose"
        />
      </div>
    </div>
  )
}
