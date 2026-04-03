import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useEffect } from 'react'
import { useAuth } from '@/features/auth/hooks'
import { Boxes, ArrowRight, Loader2 } from 'lucide-react'
import { useLogin } from '@/features/auth/hooks'
import { authStore } from '@/features/auth/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// ─── Route Definition ─────────────────────────────────────────────────────────

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const { user, isInitializing } = authStore.state
    if (isInitializing) return // wait — don't redirect yet
    if (user) throw redirect({ to: '/dashboard' })
  },
  component: LoginPage,
})

// ─── Validation Schema ────────────────────────────────────────────────────────

const loginSchema = z.object({
  subdomain: z.string().min(1, 'Workspace is required'),
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
// ─── Component ────────────────────────────────────────────────────────────────

function LoginPage() {
  const { mutate: login, isPending, error } = useLogin()
  const { isAuthenticated, isInitializing } = useAuth()
  const navigate = useNavigate()

  // Reactive redirect — fires when useInitAuth finishes and finds a valid session
  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      navigate({ to: '/dashboard' })
    }
  }, [isInitializing, isAuthenticated])
  const form = useForm({
    defaultValues: { subdomain: '', email: '', password: '' },
    onSubmit: ({ value }) => {
      login(value)
    },
  })

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* ── Left panel — branding ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-slate-800 bg-slate-900 p-12 lg:flex lg:w-1/2">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(148,163,184,1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow */}
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-20 h-64 w-64 rounded-full bg-violet-500/8 blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15">
            <Boxes className="h-4 w-4 text-sky-400" />
          </div>
          <span
            className="text-lg font-bold tracking-tight text-slate-50"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            LogistiCore
          </span>
        </div>

        {/* Middle copy */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-widest text-sky-400 uppercase">
              Inventory & Supply Chain
            </p>
            <h2
              className="text-4xl leading-tight font-bold text-slate-50"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Your operations,
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                fully in control.
              </span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Multi-tenant inventory management built for teams that move fast
              and need to know exactly what's where.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 pt-2">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '<200ms', label: 'API response' },
              { value: 'SOC 2', label: 'Compliant' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p
                  className="text-xl font-bold text-slate-50"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {value}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-slate-600">
          © {new Date().getFullYear()} LogistiCore. All rights reserved.
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/15">
            <Boxes className="h-4 w-4 text-sky-400" />
          </div>
          <span
            className="font-bold text-slate-50"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            LogistiCore
          </span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          {/* Heading */}
          <div className="space-y-1.5">
            <h1
              className="text-2xl font-bold text-slate-50"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Welcome back
            </h1>
            <p className="text-sm text-slate-400">
              Sign in to your organization's workspace.
            </p>
          </div>

          {/* Global API error */}
          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
              <p className="text-sm text-rose-400">
                {error instanceof Error
                  ? error.message
                  : 'Invalid email or password.'}
              </p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-5"
          >
            <form.Field
              name="subdomain"
              validators={{
                onBlur: ({ value }) => {
                  const result = z
                    .string()
                    .min(1, 'Workspace is required')
                    .safeParse(value)
                  return result.success
                    ? undefined
                    : result.error.issues[0].message
                },
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="subdomain"
                    className="text-xs font-semibold tracking-wider text-slate-300 uppercase"
                  >
                    Workspace
                  </Label>
                  <div className="flex items-center overflow-hidden rounded-lg border border-slate-700 bg-slate-900 focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/50">
                    <Input
                      id="subdomain"
                      type="text"
                      autoComplete="off"
                      placeholder="acme"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, ''),
                        )
                      }
                      onBlur={field.handleBlur}
                      disabled={isPending}
                      className="flex-1 border-0 bg-transparent text-slate-50 placeholder:text-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="shrink-0 pr-3 text-sm text-slate-500">
                      .logisticore.com
                    </span>
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-rose-400">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Email */}
            <form.Field
              name="email"
              validators={{
                onBlur: ({ value }) => {
                  const result = loginSchema.shape.email.safeParse(value)
                  return result.success
                    ? undefined
                    : result.error.issues[0].message
                },
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold tracking-wider text-slate-300 uppercase"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={isPending}
                    className={cn(
                      'border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-600',
                      'focus-visible:border-sky-500/50 focus-visible:ring-sky-500/50',
                      'disabled:opacity-50',
                      field.state.meta.errors.length > 0 &&
                        'border-rose-500/50 focus-visible:ring-rose-500/30',
                    )}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-rose-400">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Password */}
            <form.Field
              name="password"
              validators={{
                onBlur: ({ value }) => {
                  const result = loginSchema.shape.password.safeParse(value)
                  return result.success
                    ? undefined
                    : result.error.issues[0].message
                },
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold tracking-wider text-slate-300 uppercase"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={isPending}
                    className={cn(
                      'border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-600',
                      'focus-visible:border-sky-500/50 focus-visible:ring-sky-500/50',
                      'disabled:opacity-50',
                      field.state.meta.errors.length > 0 &&
                        'border-rose-500/50 focus-visible:ring-rose-500/30',
                    )}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-rose-400">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Submit */}
            <form.Subscribe selector={(s) => s.isValid}>
              {() => (
                <Button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 w-full gap-2 bg-sky-500 font-semibold text-white hover:bg-sky-400"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <p className="text-center text-xs text-slate-600">
            Contact your administrator to get access.
          </p>
        </div>
      </div>
    </div>
  )
}
