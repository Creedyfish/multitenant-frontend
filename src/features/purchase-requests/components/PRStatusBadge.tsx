import { Badge } from '@/components/ui/badge'
import type { PRStatus } from '../types'

interface PRStatusBadgeProps {
  status: PRStatus
}

const statusConfig: Record<PRStatus, { label: string; className: string }> = {
  APPROVED: {
    label: 'Approved',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  },
  SUBMITTED: {
    label: 'Submitted',
    className: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  },
  DRAFT: {
    label: 'Draft',
    className: 'border-slate-600/50 bg-slate-800/50 text-slate-400',
  },
}

export function PRStatusBadge({ status }: PRStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.DRAFT
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
