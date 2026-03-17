import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from './types'

const col = createColumnHelper<Product>()

interface ProductsTableProps {
  data: Product[]
  onEditClick: (product: Product) => void
  onDeleteClick: (product: Product) => void
}

export function ProductsTable({
  data,
  onEditClick,
  onDeleteClick,
}: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<Product, any>[] = [
    col.accessor('sku', {
      header: 'SKU',
      cell: (info) => (
        <span className="font-mono text-xs text-sky-400">
          {info.getValue()}
        </span>
      ),
    }),
    col.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <span className="font-medium text-slate-100">{info.getValue()}</span>
      ),
    }),
    col.accessor('category', {
      header: 'Category',
      cell: (info) => (
        <span className="text-slate-400">{info.getValue() ?? '—'}</span>
      ),
    }),
    col.accessor('min_stock_level', {
      header: 'Min Stock',
      cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
    }),
    col.accessor('created_at', {
      header: 'Created',
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
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditClick(row.original)}
            className="h-8 w-8 text-slate-500 hover:bg-sky-500/10 hover:text-sky-400"
            aria-label={`Edit ${row.original.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteClick(row.original)}
            className="h-8 w-8 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
            aria-label={`Delete ${row.original.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterFns: {} as any,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-800 bg-slate-900/60">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()
                return (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-slate-400 uppercase"
                  >
                    {canSort ? (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-200"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {sorted === 'asc' ? (
                          <ArrowUp className="h-3 w-3 text-sky-400" />
                        ) : sorted === 'desc' ? (
                          <ArrowDown className="h-3 w-3 text-sky-400" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-slate-500"
              >
                No products found.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-slate-800/60 transition-colors hover:bg-slate-800/40 ${
                  i % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/30'
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-slate-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
