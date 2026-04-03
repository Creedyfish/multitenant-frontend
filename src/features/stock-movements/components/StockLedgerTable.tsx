import { useMemo } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StockMovementBadge } from './StockMovementBadge'
import type { StockMovement } from '../types'
import type { Product } from '@/features/products/types'
import type { Warehouse } from '@/features/warehouses/types'

interface Props {
  data: StockMovement[]
  products: Product[]
  warehouses: Warehouse[]
  isLoading: boolean
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const columnHelper = createColumnHelper<StockMovement>()

export function StockLedgerTable({
  data,
  products,
  warehouses,
  isLoading,
}: Props) {
  const productMap = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  )
  const warehouseMap = useMemo(
    () => new Map(warehouses.map((w) => [w.id, w])),
    [warehouses],
  )

  const columns = useMemo<ColumnDef<StockMovement, any>[]>(
    () => [
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => <StockMovementBadge type={info.getValue()} />,
      }),
      columnHelper.accessor('product_id', {
        header: 'Product',
        cell: (info) => {
          const product = productMap.get(info.getValue())
          return product ? (
            <div>
              <p className="text-sm font-medium text-slate-200">
                {product.name}
              </p>
              <p className="text-xs text-slate-500">{product.sku}</p>
            </div>
          ) : (
            <span className="font-mono text-xs text-slate-500">
              {info.getValue().slice(0, 8)}…
            </span>
          )
        },
      }),
      columnHelper.accessor('warehouse_id', {
        header: 'Warehouse',
        cell: (info) => {
          const wh = warehouseMap.get(info.getValue())
          return wh ? (
            <span className="text-sm text-slate-300">{wh.name}</span>
          ) : (
            <span className="font-mono text-xs text-slate-500">
              {info.getValue().slice(0, 8)}…
            </span>
          )
        },
      }),
      columnHelper.accessor('quantity', {
        header: 'Qty',
        cell: (info) => {
          const type = info.row.original.type
          const qty = info.getValue() as number
          const isNegative = type === 'OUT' || type === 'TRANSFER_OUT'
          return (
            <span
              className={
                isNegative
                  ? 'font-semibold text-rose-400'
                  : 'font-semibold text-emerald-400'
              }
            >
              {isNegative ? '-' : '+'}
              {qty}
            </span>
          )
        },
      }),
      columnHelper.accessor('reference', {
        header: 'Reference',
        cell: (info) =>
          info.getValue() ? (
            <span className="font-mono text-xs text-slate-400">
              {info.getValue()}
            </span>
          ) : (
            <span className="text-slate-600">—</span>
          ),
      }),
      columnHelper.accessor('notes', {
        header: 'Notes',
        cell: (info) =>
          info.getValue() ? (
            <span
              className="max-w-[200px] truncate text-sm text-slate-400"
              title={info.getValue()}
            >
              {info.getValue()}
            </span>
          ) : (
            <span className="text-slate-600">—</span>
          ),
      }),
      columnHelper.accessor('created_at', {
        header: 'Date',
        cell: (info) => (
          <span className="text-sm whitespace-nowrap text-slate-400">
            {formatDate(info.getValue())}
          </span>
        ),
      }),
    ],
    [productMap, warehouseMap],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {} as any,
  })

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-lg bg-slate-800/60"
          />
        ))}
      </div>
    )
  }

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
                <TableHead
                  key={header.id}
                  className="text-xs font-semibold tracking-wide text-slate-500 uppercase"
                >
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
                className="py-16 text-center text-sm text-slate-500"
              >
                No movements found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-slate-800 hover:bg-slate-800/40"
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
