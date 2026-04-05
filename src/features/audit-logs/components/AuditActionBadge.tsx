import { Badge } from '@/components/ui/badge'

const ACTION_STYLES: Record<string, string> = {
  CREATE: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  UPDATE: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
  DELETE: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  APPROVE: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  REJECT: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  SUBMIT: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  ADJUST: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
  MARK_ORDERED: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
  RECEIVE: 'border-teal-500/30 bg-teal-500/10 text-teal-400',
}

const DEFAULT_STYLE = 'border-slate-600/50 bg-slate-800/50 text-slate-400'

interface Props {
  action: string
}

export function AuditActionBadge({ action }: Props) {
  const cls = ACTION_STYLES[action] ?? DEFAULT_STYLE
  return (
    <Badge variant="outline" className={cls}>
      {action}
    </Badge>
  )
}
