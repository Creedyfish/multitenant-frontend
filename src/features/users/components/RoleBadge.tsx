import { Badge } from '@/components/ui/badge'
import type { UserRole } from '../types'

export function RoleBadge({ role }: { role: UserRole }) {
  switch (role) {
    case 'ADMIN':
      return (
        <Badge
          variant="outline"
          className="border-violet-500/30 bg-violet-500/10 text-violet-400"
        >
          Admin
        </Badge>
      )
    case 'MANAGER':
      return (
        <Badge
          variant="outline"
          className="border-sky-500/30 bg-sky-500/10 text-sky-400"
        >
          Manager
        </Badge>
      )
    case 'STAFF':
      return (
        <Badge
          variant="outline"
          className="border-slate-600/50 bg-slate-800/50 text-slate-400"
        >
          Staff
        </Badge>
      )
  }
}
