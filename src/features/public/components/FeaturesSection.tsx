import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="2"
          y="3"
          width="16"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M6 7h8M6 10h8M6 13h5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Real-time inventory',
    description:
      'Track every SKU across multiple warehouses. Know what you have, where it is, and when to reorder — without guessing.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M4 10l4 4 8-8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Purchase request workflows',
    description:
      'Draft → Submit → Approve → Done. A structured approval chain so nothing slips through the cracks.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="7" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="13" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M1 17c0-3 2.5-5 6-5M19 17c0-3-2.5-5-6-5M10 17c0-3-2-4.5-3-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Role-based access',
    description:
      'Admins, Managers, Staff — each with exactly the right permissions. Enforce the right controls without friction.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2v4M10 14v4M2 10h4M14 10h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Low stock alerts',
    description:
      'Automatic alerts trigger reorder workflows before stock hits zero. Stay ahead before it becomes a problem.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="3"
          y="3"
          width="14"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M7 9l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Full audit trail',
    description:
      'Every action logged — who did what, when, and what changed. Compliance-ready from day one.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 10h14M10 3v14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect
          x="2"
          y="2"
          width="16"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    title: 'Multi-tenant ready',
    description:
      'Run multiple warehouse organizations from one platform. Complete data isolation between tenants guaranteed.',
    color: 'text-slate-300',
    bg: 'bg-slate-700/40',
    border: 'border-slate-600/30',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-slate-900 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <Badge
            variant="outline"
            className="mb-4 border-sky-800 bg-sky-500/10 text-sky-400"
          >
            Features
          </Badge>
          <h2
            className="text-3xl font-bold tracking-tight text-slate-50 lg:text-4xl"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Everything your operations team needs
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Built around how warehouse teams actually work — not the other way
            around.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group rounded-xl border ${f.border} bg-slate-800/50 p-6 transition-all hover:border-slate-600 hover:bg-slate-800`}
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${f.bg} ${f.color}`}
              >
                {f.icon}
              </div>
              <h3 className="mb-2 text-sm font-bold text-slate-100">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
