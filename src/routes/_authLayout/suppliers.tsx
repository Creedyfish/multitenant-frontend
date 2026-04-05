import { createFileRoute } from '@tanstack/react-router'
import { Building2, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DeleteSupplierDialog } from '@/features/suppliers/components/DeleteSupplierDialog'
import { SupplierFormSheet } from '@/features/suppliers/components/SupplierFormSheet'
import { SuppliersTable } from '@/features/suppliers/components/SuppliersTable'
import { useSuppliers } from '@/features/suppliers/queries'
import type { Supplier } from '@/features/suppliers/types'
import { usePermissions } from '@/features/auth/hooks'

export const Route = createFileRoute('/_authLayout/suppliers')({
  component: SuppliersPage,
})

function SuppliersPage() {
  const { data: suppliers = [], isLoading, isError } = useSuppliers()
  const { isAdmin, isManager } = usePermissions()
  const canManage = isAdmin || isManager

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>()
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(
    null,
  )

  function handleEdit(supplier: Supplier) {
    setEditingSupplier(supplier)
    setSheetOpen(true)
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open)
    if (!open) setEditingSupplier(undefined)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
            <Building2 className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-50">Suppliers</h1>
            <p className="text-sm text-slate-400">
              {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {canManage && (
          <Button
            onClick={() => setSheetOpen(true)}
            className="bg-sky-500 hover:bg-sky-400"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Supplier
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-slate-500">Loading suppliers…</p>
        </div>
      ) : isError ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-rose-400">Failed to load suppliers.</p>
        </div>
      ) : (
        <SuppliersTable
          suppliers={suppliers}
          canManage={canManage}
          onEdit={handleEdit}
          onDelete={setDeletingSupplier}
        />
      )}

      {/* Sheet — key remounts on edit target change */}
      <SupplierFormSheet
        key={editingSupplier?.id ?? 'new'}
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        supplier={editingSupplier}
      />

      <DeleteSupplierDialog
        supplier={deletingSupplier}
        onOpenChange={(open) => {
          if (!open) setDeletingSupplier(null)
        }}
      />
    </div>
  )
}
