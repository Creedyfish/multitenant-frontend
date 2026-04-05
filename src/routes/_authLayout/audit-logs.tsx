import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePermissions } from '@/features/auth/hooks'
import { useAuditLogs } from '@/features/audit-logs/queries'
import { AuditLogTable } from '@/features/audit-logs/components/AuditLogTable'
import type { AuditLogFilters } from '@/features/audit-logs/types'

export const Route = createFileRoute('/_authLayout/audit-logs')({
  component: AuditLogsPage,
})

const PAGE_SIZE = 20

const ENTITY_OPTIONS = [
  'Product',
  'Warehouse',
  'PurchaseRequest',
  'StockMovement',
  'User',
  'Organization',
]

const ACTION_OPTIONS = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'APPROVE',
  'REJECT',
  'SUBMIT',
  'ADJUST',
]

function AuditLogsPage() {
  const { isAdmin, isManager } = usePermissions()
  const canView = isAdmin || isManager

  const [skip, setSkip] = useState(0)
  const [entity, setEntity] = useState<string>('')
  const [action, setAction] = useState<string>('')
  const [actorId, setActorId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filters: AuditLogFilters = {
    skip,
    limit: PAGE_SIZE,
    entity: (entity as any) || undefined,
    action: (action as any) || undefined,
    actor_id: actorId.trim() || undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  }

  const { data, isLoading, isError } = useAuditLogs(filters)

  const logs = data ?? []

  const hasNext = logs.length > PAGE_SIZE
  const visibleLogs = hasNext ? logs.slice(0, PAGE_SIZE) : logs

  const hasPrev = skip > 0
  const page = Math.floor(skip / PAGE_SIZE) + 1

  function applyFilters() {
    setSkip(0)
  }

  function clearFilters() {
    setEntity('')
    setAction('')
    setActorId('')
    setStartDate('')
    setEndDate('')
    setSkip(0)
  }

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32">
        <Shield className="h-10 w-10 text-slate-600" />
        <p className="text-sm text-slate-400">
          You don't have permission to view audit logs.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Audit Logs</h1>
        <p className="mt-1 text-sm text-slate-400">
          Immutable record of all system actions across your organization.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm font-semibold text-slate-300">Filters</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Entity */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">Entity Type</Label>
            <Select
              value={entity ?? ''}
              onValueChange={(v) => setEntity(v === 'ALL_ENTITIES' ? '' : v)}
            >
              <SelectTrigger className="border-slate-700 bg-slate-800 text-slate-200">
                <SelectValue placeholder="All entities" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800">
                <SelectItem value="ALL_ENTITIES" className="text-slate-300">
                  All entities
                </SelectItem>
                {ENTITY_OPTIONS.map((e) => (
                  <SelectItem key={e} value={e} className="text-slate-300">
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">Action</Label>
            <Select
              value={action ?? ''}
              onValueChange={(v) => setAction(v === 'ALL_ACTIONS' ? '' : v)}
            >
              <SelectTrigger className="border-slate-700 bg-slate-800 text-slate-200">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800">
                <SelectItem value="ALL_ACTIONS" className="text-slate-300">
                  All actions
                </SelectItem>
                {ACTION_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a} className="text-slate-300">
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actor ID */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">Actor ID (UUID)</Label>
            <Input
              value={actorId}
              onChange={(e) => setActorId(e.target.value)}
              placeholder="e.g. 550e8400-..."
              className="border-slate-700 bg-slate-800 font-mono text-xs text-slate-200 placeholder:text-slate-500"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">From</Label>
            <Input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-slate-700 bg-slate-800 text-slate-200"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">To</Label>
            <Input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-slate-700 bg-slate-800 text-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button
            onClick={applyFilters}
            className="bg-sky-500 text-white hover:bg-sky-400"
            size="sm"
          >
            Apply Filters
          </Button>
          <Button
            onClick={clearFilters}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-200"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-4">
          <p className="text-sm text-rose-400">
            Failed to load audit logs. Please try again.
          </p>
        </div>
      )}

      {/* Table */}
      <AuditLogTable data={visibleLogs} isLoading={isLoading} />

      {/* Pagination */}
      {!isLoading && logs.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Page {page}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrev}
              onClick={() => setSkip((s) => Math.max(0, s - PAGE_SIZE))}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext}
              onClick={() => setSkip((s) => s + PAGE_SIZE)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
