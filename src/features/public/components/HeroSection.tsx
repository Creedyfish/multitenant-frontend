import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DashboardIllustration } from './DashboardIllustration'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 pt-28 pb-20">
      {/* Top edge line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-sky-500 opacity-5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Eyebrow badge */}
        <div className="mb-8 flex justify-center">
          <Badge
            variant="outline"
            className="gap-2 rounded-full border-sky-800 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-400"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            Now in Beta — 200+ warehouses onboarded
          </Badge>
        </div>

        {/* Headline */}
        <h1
          className="mx-auto mb-6 max-w-3xl text-center text-5xl leading-tight font-bold tracking-tight text-slate-50 lg:text-6xl"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Inventory management
          <br />
          <span className="text-sky-400">built for how you work.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-center text-lg leading-relaxed text-slate-400">
          LogistiCore gives your warehouse team a single source of truth — track
          stock, manage purchase requests, and stay ahead of supply chain issues
          in real time.
        </p>

        {/* CTAs */}
        <div className="mb-16 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-lg bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 hover:shadow-sky-400/30"
          >
            <Link to="/login">
              Get started
              <ArrowRight size={14} />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-lg border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100"
          >
            <a href="#features">See features</a>
          </Button>
        </div>

        {/* Dashboard preview */}
        <div className="relative mx-auto max-w-4xl">
          {/* Glow behind card */}
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-sky-500 opacity-5 blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl border border-slate-800 shadow-2xl shadow-black/60">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-900 px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              <div className="ml-3 flex-1 rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-500">
                app.logisticore.io/dashboard
              </div>
            </div>
            <DashboardIllustration />
          </div>

          {/* Floating stat badges */}
          <div className="absolute top-1/3 -left-8 hidden rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-xl shadow-black/40 lg:block">
            <p className="mb-0.5 text-xs font-medium text-slate-500">
              Stock accuracy
            </p>
            <p className="text-xl font-bold text-slate-100">99.2%</p>
            <p className="mt-1 text-xs font-semibold text-emerald-400">
              ↑ Industry leading
            </p>
          </div>
          <div className="absolute -right-8 bottom-1/3 hidden rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-xl shadow-black/40 lg:block">
            <p className="mb-0.5 text-xs font-medium text-slate-500">
              PR approval time
            </p>
            <p className="text-xl font-bold text-slate-100">~4 min</p>
            <p className="mt-1 text-xs font-semibold text-sky-400">
              ↓ 70% faster
            </p>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 border-t border-slate-800 pt-10">
          {[
            '4.9★ on G2',
            '200+ Warehouses',
            'SOC 2 Compliant',
            '99.9% Uptime',
          ].map((item) => (
            <Badge
              key={item}
              variant="outline"
              className="border-slate-700 bg-slate-900 text-slate-400"
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
