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
  ExternalLink,
  Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PRStatusBadge } from './PRStatusBadge'
import type { PurchaseRequestListItem } from '../types'

interface PurchaseRequestsTableProps {
  data: PurchaseRequestListItem[]
  onEdit?: (id: string) => void
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
  onEdit,
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
        return (
          <div className="flex items-center justify-end gap-1">
            {row.original.status === 'DRAFT' && onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-sky-400"
                onClick={() => onEdit(row.original.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
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
