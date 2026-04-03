import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { MapPin, Package, AlertTriangle } from 'lucide-react'
import type { Warehouse } from '../types'
import { useWarehouseStock } from '../queries'

// ── Stock badge ───────────────────────────────────────────────────────────────

function StockBadge({ qty, minStock }: { qty: number; minStock: number }) {
  if (qty === 0)
    return (
      <Badge
        variant="outline"
        className="border-rose-500/30 bg-rose-500/10 text-rose-400"
      >
        Out of stock
      </Badge>
    )
  if (qty <= minStock)
    return (
      <Badge
        variant="outline"
        className="border-amber-500/30 bg-amber-500/10 text-amber-400"
      >
        Low — {qty}
      </Badge>
    )
  return (
    <Badge
      variant="outline"
      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
    >
      {qty} in stock
    </Badge>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

interface WarehouseStockSheetProps {
  warehouse: Warehouse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WarehouseStockSheet({
  warehouse,
  open,
  onOpenChange,
}: WarehouseStockSheetProps) {
  const { data: rows = [], isLoading } = useWarehouseStock(
    warehouse?.id ?? null,
  )

  const sorted = [...rows].sort((a, b) =>
    a.product_name.localeCompare(b.product_name),
  )

  const totalStock = rows.reduce((sum, r) => sum + r.current_stock, 0)
  const lowStockCount = rows.filter(
    (r) => r.current_stock > 0 && r.current_stock <= r.min_stock_level,
  ).length
  const outOfStockCount = rows.filter((r) => r.current_stock === 0).length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full max-w-lg flex-col border-slate-800 bg-slate-900 text-slate-50"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="text-slate-50">{warehouse?.name}</SheetTitle>
          <SheetDescription className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {warehouse?.location}
          </SheetDescription>
        </SheetHeader>

        {/* Summary stats */}
        {!isLoading && rows.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3 p-4">
            <div className="flex flex-col gap-0.5 rounded-lg border border-slate-800 bg-slate-950 p-3">
              <span className="text-xs text-slate-500">Products</span>
              <span className="text-lg font-semibold text-slate-50">
                {rows.length}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 rounded-lg border border-slate-800 bg-slate-950 p-3">
              <span className="text-xs text-slate-500">Total Units</span>
              <span className="text-lg font-semibold text-slate-50">
                {totalStock.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 rounded-lg border border-slate-800 bg-slate-950 p-3">
              <span className="text-xs text-slate-500">Alerts</span>
              <span className="text-lg font-semibold text-amber-400">
                {lowStockCount + outOfStockCount}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-slate-800/50"
              />
            ))
          ) : sorted.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
                <Package className="h-6 w-6 text-slate-500" />
              </div>
              <p className="font-medium text-slate-300">No stock recorded</p>
              <p className="text-center text-sm text-slate-500">
                No stock movements have been recorded for this warehouse yet.
              </p>
            </div>
          ) : (
            <>
              {(lowStockCount > 0 || outOfStockCount > 0) && (
                <div className="mb-1 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                  <p className="text-xs text-amber-400">
                    {outOfStockCount > 0 && `${outOfStockCount} out of stock`}
                    {outOfStockCount > 0 && lowStockCount > 0 && ' · '}
                    {lowStockCount > 0 && `${lowStockCount} low stock`}
                  </p>
                </div>
              )}

              {sorted.map((row) => (
                <div
                  key={row.product_id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 transition-colors hover:border-slate-700"
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-slate-100">
                      {row.product_name}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      {row.product_sku}
                    </span>
                  </div>
                  <StockBadge
                    qty={row.current_stock}
                    minStock={row.min_stock_level}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
