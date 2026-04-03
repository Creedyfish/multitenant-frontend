import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/hooks'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Menu } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
]

export function PublicNav() {
  const { isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur-md">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500">
          <span className="text-xs font-black text-white">LC</span>
        </div>
        <span className="text-sm font-bold tracking-tight text-slate-100">
          LogistiCore
        </span>
      </Link>

      {/* Desktop nav links */}
      <div className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-sm font-medium text-slate-400 no-underline transition-colors hover:text-slate-100"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Desktop CTAs */}
      <div className="hidden items-center gap-3 md:flex">
        {isAuthenticated ? (
          <Button
            asChild
            size="sm"
            className="rounded-full bg-sky-500 text-white hover:bg-sky-400"
          >
            <Link to="/dashboard">Go to app →</Link>
          </Button>
        ) : (
          <>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-slate-800 hover:text-slate-100"
            >
              <Link to="/login">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-sky-500 text-white hover:bg-sky-400"
            >
              <Link to="/login">Get started</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile: hamburger + Sheet */}
      <div className="flex items-center gap-3 md:hidden">
        {isAuthenticated && (
          <Button
            asChild
            size="sm"
            className="rounded-full bg-sky-500 text-white hover:bg-sky-400"
          >
            <Link to="/dashboard">Go to app →</Link>
          </Button>
        )}

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-72 border-slate-800 bg-slate-950 px-0"
          >
            {/* Sheet logo */}
            <div className="flex items-center gap-2 px-6 pt-2 pb-5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500">
                <span className="text-xs font-black text-white">LC</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-100">
                LogistiCore
              </span>
            </div>

            <Separator className="bg-slate-800" />

            {/* Sheet nav links */}
            <nav className="flex flex-col gap-1 px-3 pt-4">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 no-underline transition-colors hover:bg-slate-800 hover:text-slate-100"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <Separator className="mx-3 mt-5 bg-slate-800" />

            {/* Sheet CTAs */}
            <div className="flex flex-col gap-2 px-6 pt-5">
              {isAuthenticated ? (
                <Button
                  asChild
                  className="w-full bg-sky-500 text-white hover:bg-sky-400"
                >
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                    Go to app →
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                  >
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-sky-500 text-white hover:bg-sky-400"
                  >
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      Get started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
