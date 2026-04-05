import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, Mail, Pencil, Phone, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Supplier } from '../types'

interface Props {
  suppliers: Supplier[]
  canManage: boolean
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}

const col = createColumnHelper<Supplier>()

export function SuppliersTable({
  suppliers,
  canManage,
  onEdit,
  onDelete,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const columns = [
    col.accessor('name', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name <ArrowUpDown className="h-3.5 w-3.5" />
        </button>
      ),
      cell: (info) => (
        <span className="font-medium text-slate-100">{info.getValue()}</span>
      ),
    }),
    col.accessor('contact_email', {
      header: () => <span className="text-slate-400">Email</span>,
      cell: (info) =>
        info.getValue() ? (
          <a
            href={`mailto:${info.getValue()}`}
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300"
          >
            <Mail className="h-3.5 w-3.5" />
            {info.getValue()}
          </a>
        ) : (
          <span className="text-slate-500">—</span>
        ),
    }),
    col.accessor('contact_phone', {
      header: () => <span className="text-slate-400">Phone</span>,
      cell: (info) =>
        info.getValue() ? (
          <span className="flex items-center gap-1.5 text-slate-300">
            <Phone className="h-3.5 w-3.5 text-slate-500" />
            {info.getValue()}
          </span>
        ) : (
          <span className="text-slate-500">—</span>
        ),
    }),
    col.accessor('address', {
      header: () => <span className="text-slate-400">Address</span>,
      cell: (info) =>
        info.getValue() ? (
          <span className="max-w-60 truncate text-slate-300">
            {info.getValue()}
          </span>
        ) : (
          <span className="text-slate-500">—</span>
        ),
    }),
    col.accessor('created_at', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created <ArrowUpDown className="h-3.5 w-3.5" />
        </button>
      ),
      cell: (info) => (
        <span className="text-slate-400">
          {dateFormatter.format(new Date(info.getValue()))}
        </span>
      ),
    }),
    ...(canManage
      ? [
          col.display({
            id: 'actions',
            header: () => null,
            cell: ({ row }) => (
              <div className="flex items-center justify-end gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(row.original)}
                  className="h-8 w-8 text-slate-400 hover:text-slate-200"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(row.original)}
                  className="h-8 w-8 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          }),
        ]
      : []),
  ]

  const table = useReactTable({
    data: suppliers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {} as any,
  })

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow
              key={hg.id}
              className="border-slate-800 hover:bg-transparent"
            >
              {hg.headers.map((header) => (
                <TableHead key={header.id} className="text-slate-400">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-slate-500"
              >
                No suppliers found
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-slate-800 hover:bg-slate-800/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
