import { Badge } from '@/components/ui/badge'

const steps = [
  {
    number: '01',
    title: 'Set up your organization',
    description:
      'Create your warehouse org, invite your team, and assign roles in minutes.',
    color: 'text-sky-400',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
  },
  {
    number: '02',
    title: 'Add your inventory',
    description:
      'Import your product catalog, assign warehouses and suppliers. Go live immediately.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
  {
    number: '03',
    title: 'Start managing',
    description:
      'Staff submit requests, managers approve, stock updates automatically.',
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
  },
  {
    number: '04',
    title: 'Stay informed',
    description:
      'Weekly reports, low stock alerts, and a full audit trail keep everyone in the loop.',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-slate-950 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <Badge
            variant="outline"
            className="mb-4 border-sky-800 bg-sky-500/10 text-sky-400"
          >
            How it works
          </Badge>
          <h2
            className="text-3xl font-bold tracking-tight text-slate-50 lg:text-4xl"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Up and running in under an hour
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Designed to be adopted fast. Your team won't need a manual.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute top-5 left-[calc(100%+12px)] z-10 hidden w-6 border-t border-dashed border-slate-700 lg:block" />
              )}
              <div className="h-full rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <div
                  className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-bold ${step.border} ${step.bg} ${step.color}`}
                >
                  {step.number}
                </div>
                <h3 className="mb-2 text-sm font-bold text-slate-100">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
