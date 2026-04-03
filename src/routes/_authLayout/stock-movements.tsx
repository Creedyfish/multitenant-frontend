import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePermissions } from '@/features/auth/hooks'
import { useProducts } from '@/features/products/queries'
import { useWarehouses } from '@/features/warehouses/queries'
import { useStockLedger } from '@/features/stock-movements/queries'
import { StockLedgerTable } from '@/features/stock-movements/components/StockLedgerTable'
import { StockActionSheet } from '@/features/stock-movements/components/StockActionSheet'
import type { StockActionMode } from '@/features/stock-movements/components/StockActionSheet'
import type {
  StockMovementType,
  LedgerFilters,
} from '@/features/stock-movements/types'

export const Route = createFileRoute('/_authLayout/stock-movements')({
  component: StockMovementsPage,
})

const PAGE_SIZE = 20

const TYPE_OPTIONS: { value: StockMovementType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All types' },
  { value: 'IN', label: 'Stock In' },
  { value: 'OUT', label: 'Stock Out' },
  { value: 'TRANSFER_IN', label: 'Transfer In' },
  { value: 'TRANSFER_OUT', label: 'Transfer Out' },
  { value: 'ADJUSTMENT', label: 'Adjustment' },
]

function StockMovementsPage() {
  const { isAdmin, isManager } = usePermissions()
  const canRecord = isAdmin || isManager

  // Filters
  const [typeFilter, setTypeFilter] = useState<StockMovementType | 'ALL'>('ALL')
  const [productFilter, setProductFilter] = useState<string>('ALL')
  const [warehouseFilter, setWarehouseFilter] = useState<string>('ALL')
  const [offset, setOffset] = useState(0)

  // Action sheet state
  const [sheetMode, setSheetMode] = useState<StockActionMode | null>(null)

  // Reference data
  const { data: productsData } = useProducts({
    search: '',
    limit: 100,
    offset: 0,
  })
  const products = productsData?.items ?? []

  const { data: warehouses = [] } = useWarehouses()

  // Build filters
  const filters: LedgerFilters = {
    offset,
    limit: PAGE_SIZE,
    ...(typeFilter !== 'ALL' && { type: typeFilter }),
    ...(productFilter !== 'ALL' && { product_id: productFilter }),
    ...(warehouseFilter !== 'ALL' && { warehouse_id: warehouseFilter }),
  }

  const { data: movements = [], isLoading } = useStockLedger(filters)

  const hasPrev = offset > 0
  const hasNext = movements.length === PAGE_SIZE

  function resetPage() {
    setOffset(0)
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-slate-50"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Stock Movements
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Ledger of all inventory changes across your warehouses.
          </p>
        </div>

        {canRecord && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSheetMode('adjust')}
              className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-50"
            >
              <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
              Adjust
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSheetMode('transfer')}
              className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-50"
            >
              <ArrowLeftRight className="mr-1.5 h-3.5 w-3.5" />
              Transfer
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSheetMode('out')}
              className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-50"
            >
              <ArrowUpFromLine className="mr-1.5 h-3.5 w-3.5" />
              Stock Out
            </Button>
            <Button
              size="sm"
              onClick={() => setSheetMode('in')}
              className="bg-sky-500 text-white hover:bg-sky-400"
            >
              <ArrowDownToLine className="mr-1.5 h-3.5 w-3.5" />
              Stock In
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Select
          value={typeFilter}
          onValueChange={(v) => {
            setTypeFilter(v as StockMovementType | 'ALL')
            resetPage()
          }}
        >
          <SelectTrigger className="w-40 border-slate-700 bg-slate-800 text-slate-300">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent className="border-slate-700 bg-slate-800">
            {TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={productFilter}
          onValueChange={(v) => {
            setProductFilter(v)
            resetPage()
          }}
        >
          <SelectTrigger className="w-45 border-slate-700 bg-slate-800 text-slate-300">
            <SelectValue placeholder="All products" />
          </SelectTrigger>
          <SelectContent className="border-slate-700 bg-slate-800">
            <SelectItem value="ALL">All products</SelectItem>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200">{p.name}</span>
                  <span className="text-xs text-slate-400">{p.sku}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={warehouseFilter}
          onValueChange={(v) => {
            setWarehouseFilter(v)
            resetPage()
          }}
        >
          <SelectTrigger className="w-45 border-slate-700 bg-slate-800 text-slate-300">
            <SelectValue placeholder="All warehouses" />
          </SelectTrigger>
          <SelectContent className="border-slate-700 bg-slate-800">
            <SelectItem value="ALL">All warehouses</SelectItem>
            {warehouses.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(typeFilter !== 'ALL' ||
          productFilter !== 'ALL' ||
          warehouseFilter !== 'ALL') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setTypeFilter('ALL')
              setProductFilter('ALL')
              setWarehouseFilter('ALL')
              resetPage()
            }}
            className="text-slate-500 hover:bg-slate-800 hover:text-slate-300"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <StockLedgerTable
        data={movements}
        products={products}
        warehouses={warehouses}
        isLoading={isLoading}
      />

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {isLoading
            ? 'Loading…'
            : movements.length === 0
              ? 'No results'
              : `Showing ${offset + 1}–${offset + movements.length}`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPrev || isLoading}
            onClick={() => setOffset((s) => Math.max(0, s - PAGE_SIZE))}
            className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNext || isLoading}
            onClick={() => setOffset((s) => s + PAGE_SIZE)}
            className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action sheets */}
      {canRecord && sheetMode && (
        <StockActionSheet
          key={sheetMode}
          mode={sheetMode}
          open={sheetMode !== null}
          onOpenChange={(open) => {
            if (!open) setSheetMode(null)
          }}
          products={products}
          warehouses={warehouses}
        />
      )}
    </div>
  )
}
