import { useState, useRef, useEffect } from 'react'
import { Search, Loader2, Package, Trash2, Truck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProducts } from '@/features/products/queries'
import { useDebounce } from '@/hooks/useDebounce'
import type { Product } from '@/features/products/types'
import type { LineItemDraft, LineItemErrors } from '../types'
import { useSuppliers } from '#/features/suppliers/queries'
import type { Supplier } from '#/features/suppliers/types'
import { useStockLevels } from '@/features/stock-movements/queries'
// ─── Product Combobox ─────────────────────────────────────────────────────────

interface ProductComboboxProps {
  value: Pick<LineItemDraft, 'product_id' | 'product_name' | 'product_sku'>
  onChange: (
    p: Pick<LineItemDraft, 'product_id' | 'product_name' | 'product_sku'>,
  ) => void
  error?: string
}

export function ProductCombobox({
  value,
  onChange,
  error,
}: ProductComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data, isFetching } = useProducts({
    search: debouncedSearch,
    limit: 20,
    offset: 0,
  })

  const { data: stockLevels = [] } = useStockLevels()

  const stockByProduct = stockLevels.reduce<
    Record<string, { stock: number; min: number }>
  >((acc, s) => {
    if (!acc[s.product_id]) {
      acc[s.product_id] = { stock: 0, min: s.min_stock_level }
    }
    acc[s.product_id].stock += s.current_stock
    return acc
  }, {})

  const products = data?.items ?? []

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleSelect(product: Product) {
    onChange({
      product_id: product.id,
      product_name: product.name,
      product_sku: product.sku,
    })
    setSearch('')
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${
          error
            ? 'border-rose-500/50 bg-rose-500/5'
            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
        }`}
        onClick={() => setOpen(true)}
      >
        {value.product_id ? (
          <>
            <Package className="h-3.5 w-3.5 shrink-0 text-sky-400" />
            <span className="truncate text-slate-200">
              {value.product_name}
            </span>
            <span className="ml-auto shrink-0 font-mono text-xs text-slate-500">
              {value.product_sku}
            </span>
          </>
        ) : (
          <>
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-500">Search products…</span>
          </>
        )}
      </div>

      {open && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <input
              autoFocus
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
              placeholder="Type name or SKU…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isFetching && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
            )}
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {products.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-slate-500">
                {isFetching ? 'Searching…' : 'No products found'}
              </li>
            ) : (
              products.map((p) => (
                <li
                  key={p.id}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-slate-800"
                  onClick={() => handleSelect(p)}
                >
                  <Package className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span className="truncate text-slate-200">{p.name}</span>
                  <div className="ml-auto flex shrink-0 items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">
                      {p.sku}
                    </span>
                    {(() => {
                      const level = stockByProduct[p.id]
                      const stock = level?.stock ?? 0
                      const min = level?.min ?? 0
                      const color =
                        stock === 0
                          ? 'text-rose-400'
                          : stock < min
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                      return (
                        <span className={`font-mono text-xs ${color}`}>
                          {stock} in stock
                        </span>
                      )
                    })()}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  )
}

// ─── Supplier Combobox ─────────────────────────────────────────────────────────

interface SupplierComboboxProps {
  value: Pick<LineItemDraft, 'supplier_id' | 'supplier_name'>
  onChange: (p: Pick<LineItemDraft, 'supplier_id' | 'supplier_name'>) => void
  error?: string
}

export function SupplierCombobox({
  value,
  onChange,
  error,
}: SupplierComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const { data = [], isFetching } = useSuppliers()

  const filtered = search.trim()
    ? data.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : data

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleSelect(supplier: Supplier) {
    onChange({ supplier_id: supplier.id, supplier_name: supplier.name })
    setSearch('')
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${
          error
            ? 'border-rose-500/50 bg-rose-500/5'
            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
        }`}
        onClick={() => setOpen(true)}
      >
        {value.supplier_id ? (
          <>
            <Truck className="h-3.5 w-3.5 shrink-0 text-violet-400" />
            <span className="truncate text-slate-200">
              {value.supplier_name}
            </span>
          </>
        ) : (
          <>
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-500">Select supplier…</span>
          </>
        )}
      </div>

      {open && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <input
              autoFocus
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
              placeholder="Type supplier name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isFetching && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
            )}
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-slate-500">
                {isFetching ? 'Loading…' : 'No suppliers found'}
              </li>
            ) : (
              filtered.map((s) => (
                <li
                  key={s.id}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-slate-800"
                  onClick={() => handleSelect(s)}
                >
                  <Truck className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span className="truncate text-slate-200">{s.name}</span>
                  {s.contact_email && (
                    <span className="ml-auto shrink-0 text-xs text-slate-500">
                      {s.contact_email}
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  )
}

// ─── Line Item Row ────────────────────────────────────────────────────────────

interface LineItemRowProps {
  index: number
  item: LineItemDraft
  errors: LineItemErrors
  onChange: (updated: LineItemDraft) => void
  onRemove: () => void
  canRemove: boolean
}

export function LineItemRow({
  index,
  item,
  errors,
  onChange,
  onRemove,
  canRemove,
}: LineItemRowProps) {
  return (
    <div
      className={`rounded-lg border bg-slate-900/40 p-4 transition-colors ${
        Object.values(errors).some(Boolean)
          ? 'border-rose-500/30'
          : 'border-slate-800'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Item {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-slate-500 transition-colors hover:text-rose-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="mb-1.5 text-xs text-slate-400">Product</Label>
          <ProductCombobox
            value={item}
            onChange={(p) => onChange({ ...item, ...p })}
            error={errors.product_id}
          />
        </div>

        <div>
          <Label className="mb-1.5 text-xs text-slate-400">Supplier</Label>
          <SupplierCombobox
            value={item}
            onChange={(p) => onChange({ ...item, ...p })}
            error={errors.supplier_id}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1.5 text-xs text-slate-400">Quantity</Label>
            <Input
              type="number"
              min={1}
              value={item.quantity === 0 ? '' : item.quantity}
              placeholder="1"
              onChange={(e) =>
                onChange({
                  ...item,
                  quantity: e.target.value ? Number(e.target.value) : 0,
                })
              }
              className={`border-slate-700 bg-slate-800/50 text-slate-200 placeholder:text-slate-600 ${
                errors.quantity ? 'border-rose-500/50 bg-rose-500/5' : ''
              }`}
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-rose-400">{errors.quantity}</p>
            )}
          </div>
          <div>
            <Label className="mb-1.5 text-xs text-slate-400">
              Est. Price (optional)
            </Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={item.estimated_price ?? ''}
              placeholder="0.00"
              onChange={(e) =>
                onChange({
                  ...item,
                  estimated_price: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              className={`border-slate-700 bg-slate-800/50 text-slate-200 placeholder:text-slate-600 ${
                errors.estimated_price ? 'border-rose-500/50 bg-rose-500/5' : ''
              }`}
            />
            {errors.estimated_price && (
              <p className="mt-1 text-xs text-rose-400">
                {errors.estimated_price}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
