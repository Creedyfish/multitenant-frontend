import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Plus,
  Warehouse as WarehouseIcon,
  MapPin,
  Boxes,
  Pencil,
  Trash2,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  useWarehouses,
  useDeleteWarehouse,
} from '@/features/warehouses/queries'
import { WarehouseFormSheet } from '#/features/warehouses/components/WarehouseFormSheet'
import { DeleteWarehouseDialog } from '#/features/warehouses/components/DeleteWarehouseDialog'
import { WarehouseStockSheet } from '#/features/warehouses/components/WarehouseStockSheet'
import { usePermissions } from '@/features/auth/hooks'
import type { Warehouse } from '@/features/warehouses/types'

export const Route = createFileRoute('/_authLayout/warehouses')({
  component: WarehousesPage,
})

function WarehousesPage() {
  const { isAdmin, isManager } = usePermissions()
  const canWrite = isAdmin || isManager
  const canDelete = isAdmin

  const { data: warehouses, isLoading, isError } = useWarehouses()
  const { mutate: deleteWarehouse, isPending: isDeleting } =
    useDeleteWarehouse()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Warehouse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Warehouse | null>(null)
  const [stockTarget, setStockTarget] = useState<Warehouse | null>(null)

  const handleDeleteConfirm = (id: string) => {
    deleteWarehouse(id, { onSuccess: () => setDeleteTarget(null) })
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
              <WarehouseIcon className="h-4 w-4 text-violet-400" />
            </div>
            <h1
              className="text-2xl font-bold text-slate-50"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Warehouses
            </h1>
          </div>
          {warehouses && (
            <p className="pl-10 text-sm text-slate-500">
              {warehouses.length} location
              {warehouses.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {canWrite && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-1.5 bg-sky-500 text-white hover:bg-sky-400"
          >
            <Plus className="h-4 w-4" />
            New Warehouse
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-slate-800/50"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 py-16">
          <p className="font-medium text-rose-400">Failed to load warehouses</p>
          <p className="text-sm text-slate-500">
            Check your connection and try again.
          </p>
        </div>
      ) : warehouses?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 py-20">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
            <WarehouseIcon className="h-6 w-6 text-slate-500" />
          </div>
          <p className="font-medium text-slate-300">No warehouses yet</p>
          <p className="text-sm text-slate-500">
            Add your first warehouse location to get started.
          </p>
          {canWrite && (
            <Button
              onClick={() => setCreateOpen(true)}
              className="mt-2 gap-1.5 bg-sky-500 text-white hover:bg-sky-400"
            >
              <Plus className="h-4 w-4" />
              New Warehouse
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {warehouses?.map((warehouse) => (
            <WarehouseCard
              key={warehouse.id}
              warehouse={warehouse}
              canWrite={canWrite}
              canDelete={canDelete}
              onView={setStockTarget}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Overlays */}
      <WarehouseFormSheet open={createOpen} onOpenChange={setCreateOpen} />
      <WarehouseFormSheet
        key={editTarget?.id ?? 'edit'}
        warehouse={editTarget ?? undefined}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      />
      <DeleteWarehouseDialog
        warehouse={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
      <WarehouseStockSheet
        warehouse={stockTarget}
        open={!!stockTarget}
        onOpenChange={(open) => !open && setStockTarget(null)}
      />
    </div>
  )
}

interface WarehouseCardProps {
  warehouse: Warehouse
  canWrite: boolean
  canDelete: boolean
  onView: (warehouse: Warehouse) => void
  onEdit: (warehouse: Warehouse) => void
  onDelete: (warehouse: Warehouse) => void
}

function WarehouseCard({
  warehouse,
  canWrite,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: WarehouseCardProps) {
  return (
    <div
      onClick={() => onView(warehouse)}
      className="group flex cursor-pointer flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700 hover:bg-slate-800/50"
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold text-slate-50">
              {warehouse.name}
            </h3>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span className="truncate">{warehouse.location}</span>
          </div>
        </div>

        {/* Action buttons — stop propagation so they don't trigger the card click */}
        {(canWrite || canDelete) && (
          <div
            className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {canWrite && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(warehouse)}
                className="h-7 w-7 text-slate-500 hover:bg-sky-500/10 hover:text-sky-400"
                aria-label={`Edit ${warehouse.name}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(warehouse)}
                className="h-7 w-7 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                aria-label={`Delete ${warehouse.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Capacity */}
      <div className="flex items-center gap-2">
        <Boxes className="h-4 w-4 shrink-0 text-slate-500" />
        {warehouse.capacity != null ? (
          <Badge
            variant="outline"
            className="border-violet-500/30 bg-violet-500/10 text-violet-400"
          >
            {warehouse.capacity.toLocaleString()} units capacity
          </Badge>
        ) : (
          <span className="text-sm text-slate-500">No capacity set</span>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-600">
        Added{' '}
        {new Date(warehouse.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>
  )
}
