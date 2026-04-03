import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useDeleteUser } from '../queries'
import type { User } from '../types'

interface DeleteUserDialogProps {
  user: User | null
  onOpenChange: (open: boolean) => void
}

export function DeleteUserDialog({
  user,
  onOpenChange,
}: DeleteUserDialogProps) {
  const deleteUser = useDeleteUser()

  async function handleDelete() {
    if (!user) return
    await deleteUser.mutateAsync(user.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={!!user} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-slate-800 bg-slate-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-50">
            Remove {user?.full_name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            This will permanently delete their account. They will lose access
            immediately. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
            Cancel
          </AlertDialogCancel>
          <Button
            className="bg-rose-500 text-white hover:bg-rose-600"
            disabled={deleteUser.isPending}
            onClick={handleDelete}
          >
            {deleteUser.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Remove User
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
