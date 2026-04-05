import { useForm } from '@tanstack/react-form'
import { CheckCircle2, Loader2, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/features/auth/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useUpdateProfile } from '../queries'
import { updateProfileSchema } from '../types'

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  ADMIN: {
    label: 'Admin',
    className: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
  },
  MANAGER: {
    label: 'Manager',
    className: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
  },
  STAFF: {
    label: 'Staff',
    className: 'border-slate-600/50 bg-slate-800/50 text-slate-400',
  },
}

export function ProfileSettingsSection() {
  const { user } = useAuth()
  const { mutateAsync, isPending } = useUpdateProfile()
  const [saved, setSaved] = useState(false)

  const roleBadge = user?.role ? ROLE_BADGE[user.role] : null

  const form = useForm({
    defaultValues: {
      full_name: user?.name ?? '',
      email: user?.email ?? '',
    },
    validators: {
      onSubmit: updateProfileSchema as any,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 ring-1 ring-sky-500/30">
          <User className="h-5 w-5 text-sky-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-50">Profile</h2>
          <p className="text-xs text-slate-400">
            Update your display name and email address
          </p>
        </div>
      </div>

      <Separator className="bg-slate-800" />

      {/* Role display — read only */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div>
          <p className="text-xs font-medium text-slate-400">Your role</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Roles are managed by your organization admin
          </p>
        </div>
        {roleBadge && (
          <Badge variant="outline" className={roleBadge.className}>
            {roleBadge.label}
          </Badge>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* Full name */}
        <form.Field name="full_name">
          {(field) => (
            <div className="space-y-1.5">
              <Label
                htmlFor="full_name"
                className="text-xs font-medium text-slate-300"
              >
                Full name
              </Label>
              <Input
                id="full_name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Your full name"
                className="border-slate-700 bg-slate-800/60 text-slate-100 placeholder:text-slate-500 focus:border-sky-500/50 focus:ring-sky-500/20"
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <p className="text-xs text-rose-400">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Email */}
        <form.Field name="email">
          {(field) => (
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-slate-300"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="you@example.com"
                className="border-slate-700 bg-slate-800/60 text-slate-100 placeholder:text-slate-500 focus:border-sky-500/50 focus:ring-sky-500/20"
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <p className="text-xs text-rose-400">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-sky-500 text-white hover:bg-sky-400"
          >
            {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Save changes
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
