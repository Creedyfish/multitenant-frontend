import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { Plus, Search, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProducts, useDeleteProduct } from '@/features/products/queries'
import { ProductsTable } from '@/features/products/ProductsTable'
import { CreateProductSheet } from '@/features/products/CreateProductSheet'
import { EditProductSheet } from '@/features/products/EditProductSheet'
import { DeleteProductDialog } from '@/features/products/DeleteProductDialog'
import type { Product } from '@/features/products/types'
import { useDebounce } from '@/hooks/useDebounce'

export const Route = createFileRoute('/_authLayout/products')({
  component: ProductsPage,
})

const PAGE_SIZE = 20

function ProductsPage() {
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, isError } = useProducts({
    limit: PAGE_SIZE,
    offset,
    search: debouncedSearch || undefined,
  })

  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
      setOffset(0)
    },
    [],
  )

  const handleDeleteConfirm = useCallback(
    (id: string) => {
      deleteProduct(id, { onSuccess: () => setDeleteTarget(null) })
    },
    [deleteProduct],
  )

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1

  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10">
              <Package className="h-4 w-4 text-sky-400" />
            </div>
            <h1
              className="text-2xl font-bold text-slate-50"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Products
            </h1>
          </div>
          {data && (
            <p className="pl-10 text-sm text-slate-500">
              {data.total} product{data.total !== 1 ? 's' : ''} in catalog
            </p>
          )}
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-1.5 bg-sky-500 text-white hover:bg-sky-400"
        >
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name or SKU…"
          className="border-slate-700 bg-slate-800 pl-9 text-slate-50 placeholder:text-slate-500 focus-visible:ring-sky-500"
        />
      </div>

      {/* Table states */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-slate-800/50"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 py-16">
          <p className="font-medium text-rose-400">Failed to load products</p>
          <p className="text-sm text-slate-500">
            Check your connection and try again.
          </p>
        </div>
      ) : (
        <>
          <ProductsTable
            data={data?.items ?? []}
            onEditClick={setEditTarget}
            onDeleteClick={setDeleteTarget}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                  className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setOffset(offset + PAGE_SIZE)}
                  className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Overlays */}
      <CreateProductSheet open={createOpen} onOpenChange={setCreateOpen} />
      <EditProductSheet
        product={editTarget}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      />
      <DeleteProductDialog
        product={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}
