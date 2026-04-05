// ─── KPI Card ─────────────────────────────────────────────────────────────────
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
type Accent = keyof typeof accentMap

interface KpiCardProps {
  title: string
  icon: React.ReactNode
  value: number | undefined
  isLoading: boolean
  isError: boolean
  accent: Accent
}

export const accentMap = {
  sky: {
    icon: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  amber: {
    icon: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  emerald: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  violet: {
    icon: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },

  rose: {
    icon: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  red: {
    icon: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  orange: {
    icon: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  yellow: {
    icon: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
  lime: {
    icon: 'text-lime-400',
    bg: 'bg-lime-500/10',
    border: 'border-lime-500/20',
  },
  green: {
    icon: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  teal: {
    icon: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
  cyan: {
    icon: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  blue: {
    icon: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  indigo: {
    icon: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  purple: {
    icon: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  pink: {
    icon: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  fuchsia: {
    icon: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/20',
  },
  slate: {
    icon: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
  },
  gray: {
    icon: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20',
  },
  zinc: {
    icon: 'text-zinc-400',
    bg: 'bg-zinc-500/10',
    border: 'border-zinc-500/20',
  },
  neutral: {
    icon: 'text-neutral-400',
    bg: 'bg-neutral-500/10',
    border: 'border-neutral-500/20',
  },
  stone: {
    icon: 'text-stone-400',
    bg: 'bg-stone-500/10',
    border: 'border-stone-500/20',
  },
}

export function KpiCard({
  title,
  icon,
  value,
  isLoading,
  isError,
  accent,
}: KpiCardProps) {
  const colors = accentMap[accent]

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium tracking-wider text-slate-400 uppercase">
          {title}
        </CardTitle>
        <div className={`rounded-lg p-2 ${colors.bg} ${colors.border} border`}>
          <span className={`block h-4 w-4 ${colors.icon}`}>{icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Skeleton pulse
          <div className="h-8 w-16 animate-pulse rounded-md bg-slate-800" />
        ) : isError ? (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <span className="text-sm text-rose-400">Failed to load</span>
          </div>
        ) : (
          <p className="text-2xl font-bold text-slate-50">
            {value?.toLocaleString() ?? '—'}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
