import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'
import {
  usePurchaseRequests,
  usePurchaseRequest,
} from '@/features/purchase-requests/queries'
import { PurchaseRequestsTable } from '#/features/purchase-requests/components/PurchaseRequestTable'
import { CreatePRSheet } from '@/features/purchase-requests/components/CreatePRSheet'
import { usePermissions } from '@/features/auth/hooks'
import { EditPRSheet } from '@/features/purchase-requests/components/EditPRSheet'
import type { PRStatus } from '@/features/purchase-requests/types'

export const Route = createFileRoute('/_authLayout/purchase-requests/')({
  component: PurchaseRequestsPage,
})

// ─── Status tabs ──────────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: PRStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Submitted', value: 'SUBMITTED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Ordered', value: 'ORDERED' },
  { label: 'Received', value: 'RECEIVED' },
]

const PAGE_SIZE = 20

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-3">
        <div className="h-4 w-64 animate-pulse rounded bg-slate-800" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-slate-800/60 bg-slate-900/20 px-4 py-4"
        >
          <div className="h-3.5 w-24 animate-pulse rounded bg-slate-800" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-slate-800" />
          <div className="h-3.5 w-16 animate-pulse rounded bg-slate-800" />
          <div className="ml-auto h-3.5 w-28 animate-pulse rounded bg-slate-800" />
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function PurchaseRequestsPage() {
  const { isAdmin, isManager } = usePermissions()
  const canManage = isAdmin || isManager

  const [activeStatus, setActiveStatus] = useState<PRStatus | 'ALL'>('ALL')
  const [skip, setSkip] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const { data: editPR } = usePurchaseRequest(editId ?? '')
  const {
    data: items = [],
    isLoading,
    isError,
  } = usePurchaseRequests({
    status: activeStatus,
    limit: PAGE_SIZE,
    skip,
  })

  // Backend returns a plain array — derive pagination client-side
  const hasMore = items.length === PAGE_SIZE
  const currentPage = Math.floor(skip / PAGE_SIZE) + 1

  function handleTabChange(status: PRStatus | 'ALL') {
    setActiveStatus(status)
    setSkip(0)
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-50">
              Purchase Requests
            </h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Manage procurement approvals and supply orders
            </p>
          </div>
          {canManage && (
            <Button
              className="bg-sky-500 text-white hover:bg-sky-400"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          )}
        </div>

        <Separator className="mb-6 bg-slate-800" />

        {/* Status tabs */}
        <div className="mb-5 flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeStatus === tab.value
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-slate-800">
            <p className="text-sm text-slate-400">
              Failed to load purchase requests.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-sky-400"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </div>
        ) : (
          <>
            <PurchaseRequestsTable
              data={items}
              onEdit={(id) => setEditId(id)}
            />

            {/* Pagination */}
            {(skip > 0 || hasMore) && (
              <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                <span>Page {currentPage}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                    disabled={skip === 0}
                    onClick={() => setSkip((s) => Math.max(0, s - PAGE_SIZE))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                    disabled={!hasMore}
                    onClick={() => setSkip((s) => s + PAGE_SIZE)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <EditPRSheet
        pr={editPR ?? null}
        open={!!editId}
        onOpenChange={(open) => {
          if (!open) setEditId(null)
        }}
      />
      <CreatePRSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
