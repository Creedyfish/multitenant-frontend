import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Send,
  Loader2,
  Package,
  FileText,
  User,
  Clock,
  AlertTriangle,
  Hash,
  ShoppingCart,
  PackageCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { PRStatusBadge } from './PRStatusBadge'
import { RejectDialog } from './RejectDialog'
import {
  usePurchaseRequest,
  useSubmitPR,
  useApprovePR,
  useRejectPR,
  useMarkOrderedPR,
} from '../queries'
import { usePermissions } from '@/features/auth/hooks'
import type { PRLineItem } from '../types'
import { ReceivePRSheet } from './ReceivePRSheet'

interface PRDetailPageProps {
  id: string
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: React.ElementType
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-sm font-medium text-slate-200">{value}</p>
    </div>
  )
}

// ─── Line items table ─────────────────────────────────────────────────────────

function LineItemsTable({ items }: { items: PRLineItem[] }) {
  const total = items.reduce((sum, item) => {
    const price = item.estimated_price ? parseFloat(item.estimated_price) : 0
    return sum + item.quantity * price
  }, 0)

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <table className="w-full">
        <thead className="border-b border-slate-800 bg-slate-900/60">
          <tr>
            {['Product', 'SKU', 'Qty', 'Est. Price', 'Subtotal'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-slate-400 uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {items.map((item) => {
            const price = item.estimated_price
              ? parseFloat(item.estimated_price)
              : 0
            const subtotal = item.quantity * price

            return (
              <tr
                key={item.id}
                className="bg-slate-900/20 transition-colors hover:bg-slate-800/20"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <Package className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                    <span className="text-sm text-slate-200">
                      {item.product_name ?? '—'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-mono text-xs text-slate-400">
                    {item.product_sku ?? '—'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-slate-300">
                    {item.quantity}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-slate-300">
                    {price > 0 ? `$${price.toFixed(2)}` : '—'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm font-medium text-slate-200">
                    {subtotal > 0 ? `$${subtotal.toFixed(2)}` : '—'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
        {total > 0 && (
          <tfoot className="border-t border-slate-800 bg-slate-900/40">
            <tr>
              <td
                colSpan={4}
                className="px-4 py-3.5 text-right text-sm font-semibold text-slate-400"
              >
                Estimated Total
              </td>
              <td className="px-4 py-3.5 text-sm font-bold text-slate-100">
                ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {items.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-500">
            No line items on this request
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PRDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-36 rounded-lg bg-slate-800" />
        <div className="h-9 w-40 rounded-lg bg-slate-800" />
      </div>
      <div className="h-8 w-48 rounded-lg bg-slate-800" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-slate-800/60" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-slate-800/60" />
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function PRDetailPage({ id }: PRDetailPageProps) {
  const navigate = useNavigate()
  const { isAdmin, isManager } = usePermissions()
  const canApprove = isAdmin || isManager

  const [rejectOpen, setRejectOpen] = useState(false)
  const [receiveOpen, setReceiveOpen] = useState(false)
  const { data: pr, isLoading, isError } = usePurchaseRequest(id)
  const submitPR = useSubmitPR()
  const approvePR = useApprovePR()
  const rejectPR = useRejectPR()
  const markOrdered = useMarkOrderedPR()
  if (isLoading) return <PRDetailSkeleton />

  if (isError || !pr) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <AlertTriangle className="h-8 w-8 text-rose-400" />
        <p className="text-sm text-slate-400">
          Could not load purchase request. It may have been deleted.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-slate-200"
          onClick={() => navigate({ to: '/purchase-requests' })}
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5" />
          Back to list
        </Button>
      </div>
    )
  }

  const isDraft = pr.status === 'DRAFT'
  const isSubmitted = pr.status === 'SUBMITTED'
  const isApproved = pr.status === 'APPROVED'
  const isOrdered = pr.status === 'ORDERED'
  const anyPending =
    submitPR.isPending ||
    approvePR.isPending ||
    rejectPR.isPending ||
    markOrdered.isPending

  async function handleSubmit() {
    await submitPR.mutateAsync(id)
  }

  async function handleApprove() {
    await approvePR.mutateAsync(id)
  }

  async function handleReject(rejection_reason: string) {
    await rejectPR.mutateAsync({ id, payload: { rejection_reason } })
    setRejectOpen(false)
  }

  return (
    <>
      {/* Back nav + action bar */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-400 hover:text-slate-200"
          onClick={() => navigate({ to: '/purchase-requests' })}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Purchase Requests
        </Button>

        <div className="flex items-center gap-2">
          {isDraft && (
            <Button
              className="bg-sky-500 text-white hover:bg-sky-400"
              onClick={handleSubmit}
              disabled={anyPending}
            >
              {submitPR.isPending ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="mr-2 h-3.5 w-3.5" />
              )}
              Submit for Approval
            </Button>
          )}

          {isSubmitted && canApprove && (
            <>
              <Button
                variant="ghost"
                className="border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                onClick={() => setRejectOpen(true)}
                disabled={anyPending}
              >
                <XCircle className="mr-2 h-3.5 w-3.5" />
                Reject
              </Button>
              <Button
                className="bg-emerald-600 text-white hover:bg-emerald-500"
                onClick={handleApprove}
                disabled={anyPending}
              >
                {approvePR.isPending ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                )}
                Approve
              </Button>
            </>
          )}
          {isApproved && canApprove && (
            <Button
              variant="ghost"
              className="border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
              onClick={() => markOrdered.mutateAsync(id)}
              disabled={anyPending}
            >
              {markOrdered.isPending ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShoppingCart className="mr-2 h-3.5 w-3.5" />
              )}
              Mark as Ordered
            </Button>
          )}

          {isOrdered && canApprove && (
            <Button
              variant="ghost"
              className="border border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20"
              onClick={() => setReceiveOpen(true)}
              disabled={anyPending}
            >
              <PackageCheck className="mr-2 h-3.5 w-3.5" />
              Mark as Received
            </Button>
          )}
        </div>
      </div>

      {/* PR header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-50">
              {pr.request_number}
            </h1>
            <PRStatusBadge status={pr.status} />
          </div>
          {pr.notes && (
            <p className="mt-1 max-w-xl text-sm text-slate-400">{pr.notes}</p>
          )}
        </div>
      </div>

      {/* Status banners */}
      {pr.status === 'REJECTED' && pr.rejection_reason && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3.5">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <div>
            <p className="mb-0.5 text-xs font-semibold tracking-wider text-rose-400 uppercase">
              Rejection Reason
            </p>
            <p className="text-sm text-slate-300">{pr.rejection_reason}</p>
            {pr.rejected_at && (
              <p className="mt-1 text-xs text-slate-500">
                {new Date(pr.rejected_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
      )}

      {pr.status === 'APPROVED' && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <p className="text-sm text-emerald-300">
            This purchase request has been approved.
            {pr.approved_by_name && (
              <>
                {' '}
                Approved by{' '}
                <span className="font-semibold">{pr.approved_by_name}</span>
                {pr.approved_at && (
                  <span className="text-emerald-400/70">
                    {' '}
                    ·{' '}
                    {new Date(pr.approved_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
                .
              </>
            )}
          </p>
        </div>
      )}

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Requested By"
          value={pr.created_by_name ?? pr.created_by}
          icon={User}
        />
        <StatCard label="PR Number" value={pr.request_number} icon={Hash} />
        <StatCard
          label="Created"
          value={new Date(pr.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
          icon={Clock}
        />
        <StatCard
          label="Last Updated"
          value={new Date(pr.updated_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
          icon={FileText}
        />
      </div>

      <Separator className="mb-6 bg-slate-800" />

      {/* Line items */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200">Line Items</h2>
        <Badge
          variant="outline"
          className="border-slate-700 bg-slate-800/50 text-slate-400"
        >
          {pr.items.length} {pr.items.length === 1 ? 'product' : 'products'}
        </Badge>
      </div>

      <LineItemsTable items={pr.items} />

      <ReceivePRSheet
        pr={pr}
        open={receiveOpen}
        onOpenChange={setReceiveOpen}
      />

      <RejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onConfirm={handleReject}
        isPending={rejectPR.isPending}
      />
    </>
  )
}
