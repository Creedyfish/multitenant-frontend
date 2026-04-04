import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { AuditActionBadge } from './AuditActionBadge'
import type { AuditLog } from '../types'

interface Props {
  data: AuditLog[]
  isLoading: boolean
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function DiffRow({ log }: { log: AuditLog }) {
  const keys = Array.from(
    new Set([
      ...Object.keys(log.before ?? {}),
      ...Object.keys(log.after ?? {}),
    ]),
  )

  if (keys.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-slate-500 italic">
        No field data recorded.
      </div>
    )
  }

  return (
    <div className="px-4 py-3">
      <div className="overflow-hidden rounded-lg border border-slate-700">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800">
              <th className="w-1/3 px-3 py-2 text-left font-medium text-slate-400">
                Field
              </th>
              <th className="w-1/3 px-3 py-2 text-left font-medium text-rose-400">
                Before
              </th>
              <th className="w-1/3 px-3 py-2 text-left font-medium text-emerald-400">
                After
              </th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key, i) => {
              const before = log.before?.[key]
              const after = log.after?.[key]
              const changed = JSON.stringify(before) !== JSON.stringify(after)

              return (
                <tr
                  key={key}
                  className={[
                    i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-950',
                    changed ? 'ring-1 ring-sky-500/20 ring-inset' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <td className="px-3 py-1.5 font-mono text-slate-300">
                    {key}
                  </td>
                  <td className="px-3 py-1.5 font-mono text-slate-500">
                    {before === undefined ? (
                      <span className="text-slate-600 italic">—</span>
                    ) : (
                      String(before)
                    )}
                  </td>
                  <td className="px-3 py-1.5 font-mono text-slate-200">
                    {after === undefined ? (
                      <span className="text-slate-600 italic">—</span>
                    ) : (
                      String(after)
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AuditLogTable({ data, isLoading }: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const columns: ColumnDef<AuditLog, any>[] = [
    {
      id: 'expand',
      header: '',
      size: 40,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-400 hover:text-slate-200"
          onClick={() => toggleExpand(row.original.id)}
        >
          {expandedIds.has(row.original.id) ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ getValue }) => (
        <span className="text-sm whitespace-nowrap text-slate-300">
          {formatTimestamp(getValue<string>())}
        </span>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ getValue }) => <AuditActionBadge action={getValue<string>()} />,
    },
    {
      accessorKey: 'entity',
      header: 'Entity',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-200">
            {row.original.entity}
          </span>
          <span className="font-mono text-xs text-slate-500">
            {row.original.entity_id.slice(0, 8)}…
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'actor_id',
      header: 'Actor',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-slate-400">
          {getValue<string>().slice(0, 8)}…
        </span>
      ),
    },
    {
      accessorKey: 'ip_address',
      header: 'IP Address',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-slate-500">
          {getValue<string | null>() ?? '—'}
        </span>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {} as any,
  })

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              {['', 'Timestamp', 'Action', 'Entity', 'Actor', 'IP Address'].map(
                (h) => (
                  <TableHead key={h} className="font-medium text-slate-400">
                    {h}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i} className="border-slate-800">
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 py-16 text-center">
        <p className="text-sm text-slate-500">No audit log entries found.</p>
        <p className="mt-1 text-xs text-slate-600">
          Try adjusting your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow
              key={hg.id}
              className="border-slate-800 bg-slate-900 hover:bg-transparent"
            >
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="font-medium text-slate-400"
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
          {table.getRowModel().rows.map((row) => (
            <>
              <TableRow
                key={row.id}
                className="cursor-pointer border-slate-800 hover:bg-slate-800/50"
                onClick={() => toggleExpand(row.original.id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {expandedIds.has(row.original.id) && (
                <TableRow
                  key={`${row.id}-expanded`}
                  className="border-slate-800 hover:bg-transparent"
                >
                  <TableCell
                    colSpan={columns.length}
                    className="bg-slate-950 p-0"
                  >
                    <DiffRow log={row.original} />
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
