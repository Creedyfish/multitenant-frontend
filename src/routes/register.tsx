import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState, useEffect } from 'react'
import { Boxes, Building2, User, Mail, Lock, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/features/auth/hooks'
import { useRegister } from '@/features/users/queries'
import { registerSchema, type RegisterPayload } from '@/features/users/types'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { mutateAsync, isPending, error } = useRegister()
  const [success, setSuccess] = useState(false)
  const [createdSubdomain, setCreatedSubdomain] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate({ to: '/dashboard' })
  }, [isAuthenticated])

  const form = useForm({
    defaultValues: {
      org_name: '',
      subdomain: '',
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
    } as RegisterPayload,
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await mutateAsync(value)
      setCreatedSubdomain(res.subdomain)
      setSuccess(true)
    },
  })

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-xl border border-emerald-500/20 bg-slate-900 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
            <Building2 className="h-6 w-6 text-emerald-400" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-slate-50">
            Organization created!
          </h2>
          <p className="mb-1 text-sm text-slate-400">
            Your subdomain is{' '}
            <span className="font-mono text-sky-400">{createdSubdomain}</span>.
          </p>
          <p className="mb-6 text-sm text-slate-400">
            Use it along with your email and password to sign in.
          </p>
          <Button
            className="w-full bg-sky-500 text-white hover:bg-sky-400"
            onClick={() => navigate({ to: '/login' })}
          >
            Go to sign in →
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Left — branding */}
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

        {/* Glows */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/3 -left-20 h-64 w-64 rounded-full bg-emerald-500/8 blur-3xl" />

        {/* Logo */}
        <Link
          className="relative flex cursor-pointer items-center gap-3"
          to="/"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15">
            <Boxes className="h-4 w-4 text-sky-400" />
          </div>
          <span
            className="text-lg font-bold tracking-tight text-slate-50"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            LogistiCore
          </span>
        </Link>

        {/* Middle copy */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              Get started for free
            </p>
            <h2
              className="text-4xl leading-tight font-bold text-slate-50"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Your organization,
              <br />
              <span className="bg-linear-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                up in minutes.
              </span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              One account gives your whole team visibility into stock levels,
              purchase requests, and warehouse movements — all in one place.
            </p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-3 pt-2">
            {[
              { label: 'Role-based access for your entire team' },
              { label: 'Real-time stock tracking across warehouses' },
              { label: 'Full audit log of every operation' },
            ].map(({ label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                  <svg
                    className="h-3 w-3 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-slate-600">
          © {new Date().getFullYear()} LogistiCore. All rights reserved.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            to="/"
            className="mb-8 flex items-center gap-2 no-underline lg:hidden"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/15">
              <Boxes className="h-4 w-4 text-sky-400" />
            </div>
            <span className="text-sm font-bold text-slate-50">LogistiCore</span>
          </Link>

          <h2 className="mb-1 text-xl font-semibold text-slate-50">
            Create your organization
          </h2>
          <p className="mb-8 text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-400 hover:text-sky-300">
              Sign in
            </Link>
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-5"
          >
            {/* Org section */}
            <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                <Building2 className="h-3.5 w-3.5" />
                Organization
              </p>

              <form.Field name="org_name">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">
                      Organization name
                    </Label>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Acme Corp"
                      className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-600 focus-visible:ring-sky-500"
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors[0] && (
                        <p className="text-xs text-rose-400">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              <form.Field name="subdomain">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Subdomain</Label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 shrink-0 text-slate-500" />
                      <Input
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(e.target.value.toLowerCase())
                        }
                        onBlur={field.handleBlur}
                        placeholder="acme"
                        className="border-slate-700 bg-slate-800 font-mono text-slate-50 placeholder:text-slate-600 focus-visible:ring-sky-500"
                      />
                    </div>
                    <p className="text-xs text-slate-600">
                      Used to identify your organization at login
                    </p>
                    {field.state.meta.isTouched &&
                      field.state.meta.errors[0] && (
                        <p className="text-xs text-rose-400">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Admin section */}
            <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                <User className="h-3.5 w-3.5" />
                Admin account
              </p>

              <form.Field name="full_name">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Full name</Label>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="John Doe"
                      className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-600 focus-visible:ring-sky-500"
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors[0] && (
                        <p className="text-xs text-rose-400">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <Input
                        type="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="admin@acme.com"
                        className="border-slate-700 bg-slate-800 pl-9 text-slate-50 placeholder:text-slate-600 focus-visible:ring-sky-500"
                      />
                    </div>
                    {field.state.meta.isTouched &&
                      field.state.meta.errors[0] && (
                        <p className="text-xs text-rose-400">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Password</Label>
                    <div className="relative">
                      <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <Input
                        type="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Min. 8 characters"
                        className="border-slate-700 bg-slate-800 pl-9 text-slate-50 placeholder:text-slate-600 focus-visible:ring-sky-500"
                      />
                    </div>
                    {field.state.meta.isTouched &&
                      field.state.meta.errors[0] && (
                        <p className="text-xs text-rose-400">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>
              <form.Field name="confirm_password">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <Input
                        type="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Repeat your password"
                        className="border-slate-700 bg-slate-800 pl-9 text-slate-50 placeholder:text-slate-600 focus-visible:ring-sky-500"
                      />
                    </div>
                    {field.state.meta.isTouched &&
                      field.state.meta.errors[0] && (
                        <p className="text-xs text-rose-400">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>
            </div>

            {error && (
              <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                {(error as any)?.json?.detail ?? 'Registration failed'}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-sky-500 text-white hover:bg-sky-400 disabled:opacity-50"
            >
              {isPending ? 'Creating organization...' : 'Create organization'}
            </Button>

            <Separator className="bg-slate-800" />

            <p className="text-center text-xs text-slate-600">
              By signing up you agree to our terms of service and privacy
              policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
