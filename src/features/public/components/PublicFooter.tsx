import { Separator } from '@/components/ui/separator'

const FOOTER_COLS = [
  {
    heading: 'Product',
    links: ['Features', 'Changelog', 'Roadmap'],
  },
  { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
  { heading: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
]

export function PublicFooter() {
  return (
    <footer className="bg-slate-950 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500">
                <span className="text-xs font-bold text-white">LC</span>
              </div>
              <span className="text-sm font-bold text-slate-100">
                LogistiCore
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              Modern inventory and supply chain management for warehouses that
              mean business.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 text-sm md:grid-cols-3">
            {FOOTER_COLS.map((col) => (
              <div key={col.heading}>
                <p className="mb-4 font-semibold text-slate-300">
                  {col.heading}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-slate-500 no-underline transition-colors hover:text-slate-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-slate-800" />

        <div className="flex flex-col items-center justify-between gap-3 pt-8 md:flex-row">
          <p className="text-xs text-slate-600">
            © 2026 LogistiCore. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built for the modern warehouse team.
          </p>
        </div>
      </div>
    </footer>
  )
}
