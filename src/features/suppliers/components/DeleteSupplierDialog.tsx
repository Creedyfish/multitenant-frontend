import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteSupplier } from '../queries'
import type { Supplier } from '../types'

interface Props {
  supplier: Supplier | null
  onOpenChange: (open: boolean) => void
}

export function DeleteSupplierDialog({ supplier, onOpenChange }: Props) {
  const deleteSupplier = useDeleteSupplier()

  async function handleDelete() {
    if (!supplier) return
    await deleteSupplier.mutateAsync(supplier.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={!!supplier} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-slate-800 bg-slate-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-50">
            Delete Supplier
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-slate-200">
              {supplier?.name}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSupplier.isPending}
            className="bg-rose-500 hover:bg-rose-600"
          >
            {deleteSupplier.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
