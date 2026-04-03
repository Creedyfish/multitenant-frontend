import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RoleBadge } from './RoleBadge'
import type { User } from '../types'

interface UsersTableProps {
  data: User[]
  currentUserId: string
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

const col = createColumnHelper<User>()

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (!sorted)
    return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-slate-500" />
  if (sorted === 'asc')
    return <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-sky-400" />
  return <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-sky-400" />
}

export function UsersTable({
  data,
  currentUserId,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: false },
  ])

  const columns = [
    col.accessor('full_name', {
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold tracking-wider text-slate-400 uppercase hover:text-slate-200"
          onClick={() => column.toggleSorting()}
        >
          Name
          <SortIcon sorted={column.getIsSorted()} />
        </button>
      ),
      cell: (info) => {
        const user = info.row.original
        const isCurrentUser = user.id === currentUserId
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-200">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                {user.full_name}
                {isCurrentUser && (
                  <span className="ml-2 text-xs text-slate-500">(you)</span>
                )}
              </p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        )
      },
    }),
    col.accessor('role', {
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold tracking-wider text-slate-400 uppercase hover:text-slate-200"
          onClick={() => column.toggleSorting()}
        >
          Role
          <SortIcon sorted={column.getIsSorted()} />
        </button>
      ),
      cell: (info) => <RoleBadge role={info.getValue()} />,
    }),
    col.accessor('created_at', {
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold tracking-wider text-slate-400 uppercase hover:text-slate-200"
          onClick={() => column.toggleSorting()}
        >
          Joined
          <SortIcon sorted={column.getIsSorted()} />
        </button>
      ),
      cell: (info) =>
        new Date(info.getValue()).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    }),
    col.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const user = row.original
        const isSelf = user.id === currentUserId
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200"
              onClick={() => onEdit(user)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            {!isSelf && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:text-rose-400"
                onClick={() => onDelete(user)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {} as any,
  })

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <table className="w-full">
        <thead className="border-b border-slate-800 bg-slate-900/60">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-slate-400 uppercase"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="bg-slate-900/20 transition-colors hover:bg-slate-800/30"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3.5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-slate-500">No users found</p>
        </div>
      )}
    </div>
  )
}
