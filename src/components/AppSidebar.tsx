import { useStore } from '@tanstack/react-store'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ArrowLeftRight,
  Users,
  ScrollText,
  Warehouse,
  Truck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Boxes,
} from 'lucide-react'
import { shellStore, toggleSidebar } from '#/features/auth/shellStore'
import { useAuth } from '@/features/auth/hooks'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  roles?: Array<'ADMIN' | 'MANAGER' | 'STAFF'>
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Users',
    icon: Users,
    to: '/users',
    roles: ['ADMIN'],
  },
  {
    label: 'Products',
    to: '/products',
    icon: Package,
  },
  {
    label: 'Purchase Requests',
    to: '/purchase-requests',
    icon: ShoppingCart,
  },

  {
    label: 'Stock Movements',
    to: '/stock-movements',
    icon: ArrowLeftRight,
  },
  {
    label: 'Warehouses',
    to: '/warehouses',
    icon: Warehouse,
  },
  {
    label: 'Suppliers',
    to: '/suppliers',
    icon: Truck,
  },
]

const BOTTOM_NAV_ITEMS: NavItem[] = [
  {
    label: 'Users',
    to: '/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    label: 'Audit Logs',
    to: '/audit-logs',
    icon: ScrollText,
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: Settings,
  },
]

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const { role } = useAuth()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  if (
    item.roles &&
    role &&
    !item.roles.includes(role as 'ADMIN' | 'MANAGER' | 'STAFF')
  ) {
    return null
  }

  const isActive =
    currentPath === item.to || currentPath.startsWith(item.to + '/')
  const Icon = item.icon

  const linkContent = (
    <Link
      to={item.to}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
        'hover:bg-slate-800 hover:text-slate-50',
        isActive
          ? 'border border-sky-500/20 bg-sky-500/10 text-sky-400'
          : 'border border-transparent text-slate-400',
        collapsed && 'justify-center px-2',
      )}
    >
      <Icon
        className={cn(
          'shrink-0',
          isActive ? 'text-sky-400' : 'text-slate-400',
          collapsed ? 'h-5 w-5' : 'h-4 w-4',
        )}
      />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="border-slate-700 bg-slate-800 text-slate-50"
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
}

export function AppSidebar() {
  const collapsed = useStore(shellStore, (s) => s.sidebarCollapsed)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex h-screen shrink-0 flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out',
          collapsed ? 'w-[60px]' : 'w-[220px]',
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex h-14 shrink-0 items-center border-b border-slate-800 px-3',
            collapsed ? 'justify-center' : 'gap-2.5',
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/15">
            <Boxes className="h-4 w-4 text-sky-400" />
          </div>
          {!collapsed && (
            <span
              className="text-sm font-bold tracking-tight text-slate-50"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              LogistiCore
            </span>
          )}
        </div>

        {/* Main nav */}
        <nav className="flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto px-2 py-3">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>

        <Separator className="bg-slate-800" />

        {/* Bottom nav */}
        <nav className="space-y-0.5 px-2 py-3">
          {BOTTOM_NAV_ITEMS.map((item) => (
            <NavLink key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>

        <Separator className="bg-slate-800" />

        {/* Collapse toggle */}
        <div className={cn('px-2 py-3', collapsed && 'flex justify-center')}>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              'text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-50',
              collapsed ? 'h-9 w-9 p-0' : 'w-full justify-start gap-2',
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
