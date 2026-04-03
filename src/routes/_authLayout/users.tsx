import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks'
import { useUsers } from '@/features/users/queries'
import { UsersTable } from '@/features/users/components/UsersTable'
import { UserFormSheet } from '@/features/users/components/UserFormSheet'
import { DeleteUserDialog } from '@/features/users/components/DeleteUserDialog'
import type { User } from '@/features/users/types'

export const Route = createFileRoute('/_authLayout/users')({
  component: UsersPage,
})

function UsersPage() {
  const { user: currentUser } = useAuth()
  const { data: users, isLoading, isError } = useUsers()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  function handleEdit(user: User) {
    setEditingUser(user)
    setSheetOpen(true)
  }

  function handleSheetClose(open: boolean) {
    setSheetOpen(open)
    if (!open) setEditingUser(undefined)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">Users</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Manage team members and their roles
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(undefined)
            setSheetOpen(true)
          }}
          className="bg-sky-500 text-white hover:bg-sky-400"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-slate-800/50"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-5 py-4">
          <p className="text-sm text-rose-400">Failed to load users.</p>
        </div>
      )}

      {!isLoading && !isError && users && (
        <>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-500">
              {users.length} {users.length === 1 ? 'member' : 'members'}
            </span>
          </div>
          <UsersTable
            data={users}
            currentUserId={currentUser!.id}
            onEdit={handleEdit}
            onDelete={setDeletingUser}
          />
        </>
      )}

      <UserFormSheet
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        user={editingUser}
      />

      <DeleteUserDialog
        user={deletingUser}
        onOpenChange={(open) => {
          if (!open) setDeletingUser(null)
        }}
      />
    </div>
  )
}
