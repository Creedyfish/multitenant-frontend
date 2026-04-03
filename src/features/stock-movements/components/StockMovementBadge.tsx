import { Badge } from '@/components/ui/badge'
import type { StockMovementType } from '../types'

const CONFIG: Record<StockMovementType, { label: string; className: string }> =
  {
    IN: {
      label: 'Stock In',
      className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    },
    OUT: {
      label: 'Stock Out',
      className: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
    },
    TRANSFER_IN: {
      label: 'Transfer In',
      className: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
    },
    TRANSFER_OUT: {
      label: 'Transfer Out',
      className: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
    },
    ADJUSTMENT: {
      label: 'Adjustment',
      className: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    },
  }

interface Props {
  type: StockMovementType
}

export function StockMovementBadge({ type }: Props) {
  const { label, className } = CONFIG[type]
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}
