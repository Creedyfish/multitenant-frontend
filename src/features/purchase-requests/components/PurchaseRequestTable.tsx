import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { PRStatusBadge } from './PRStatusBadge'
import type { PurchaseRequestListItem } from '../types'

interface PurchaseRequestsTableProps {
  data: PurchaseRequestListItem[]
  canManage: boolean
  onDelete: (id: string) => void
  isDeleting: boolean
}

const col = createColumnHelper<PurchaseRequestListItem>()

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (!sorted)
    return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-slate-500" />
  if (sorted === 'asc')
    return <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-sky-400" />
  return <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-sky-400" />
}

export function PurchaseRequestsTable({
  data,
  canManage,
  onDelete,
  isDeleting,
}: PurchaseRequestsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: true },
  ])

  const columns = [
    col.accessor('request_number', {
      header: 'PR Number',
      cell: (info) => (
        <span className="font-mono text-xs font-medium text-slate-300">
          {info.getValue()}
        </span>
      ),
    }),
    col.accessor('status', {
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold tracking-wider text-slate-400 uppercase hover:text-slate-200"
          onClick={() => column.toggleSorting()}
        >
          Status
          <SortIcon sorted={column.getIsSorted()} />
        </button>
      ),
      cell: (info) => <PRStatusBadge status={info.getValue()} />,
    }),
    col.accessor('created_by_name', {
      header: 'Requested By',
      cell: (info) => (
        <span className="text-sm text-slate-300">{info.getValue() ?? '—'}</span>
      ),
    }),
    col.accessor('approved_at', {
      header: 'Approved At',
      cell: (info) => {
        const val = info.getValue()
        return val ? (
          <span className="text-sm text-slate-300">
            {new Date(val).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        ) : (
          <span className="text-sm text-slate-600">—</span>
        )
      },
    }),
    col.accessor('created_at', {
      header: ({ column }) => (
        <button
          className="flex items-center text-xs font-semibold tracking-wider text-slate-400 uppercase hover:text-slate-200"
          onClick={() => column.toggleSorting()}
        >
          Created
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
        const pr = row.original
        const isDraft = pr.status === 'DRAFT'
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200"
              asChild
            >
              <Link to="/purchase-requests/$id" params={{ id: pr.id }}>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>

            {canManage && isDraft && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-rose-400"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-slate-800 bg-slate-900">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-slate-50">
                      Delete Purchase Request?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                      This draft will be permanently deleted. This action cannot
                      be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-rose-500 text-white hover:bg-rose-600"
                      onClick={() => onDelete(pr.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
          <p className="text-sm text-slate-500">No purchase requests found</p>
        </div>
      )}
    </div>
  )
}
