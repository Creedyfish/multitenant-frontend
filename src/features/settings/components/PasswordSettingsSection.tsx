import { useForm } from '@tanstack/react-form'
import { CheckCircle2, KeyRound, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useChangePassword } from '../queries'
import { changePasswordSchema } from '../types'

export function PasswordSettingsSection() {
  const { mutateAsync, isPending } = useChangePassword()
  const [saved, setSaved] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
    validators: {
      onSubmit: changePasswordSchema as any,
    },
    onSubmit: async ({ value }) => {
      setServerError(null)
      try {
        await mutateAsync(value)
        setSaved(true)
        form.reset()
        setTimeout(() => setSaved(false), 3000)
      } catch (err: any) {
        // Backend returns 400 with detail when current_password is wrong
        const detail =
          err?.json?.detail ??
          err?.message ??
          'Incorrect current password. Please try again.'
        setServerError(String(detail))
      }
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/30">
          <KeyRound className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-50">Password</h2>
          <p className="text-xs text-slate-400">Change your account password</p>
        </div>
      </div>

      <Separator className="bg-slate-800" />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* Current password */}
        <form.Field name="current_password">
          {(field) => (
            <div className="space-y-1.5">
              <Label
                htmlFor="current_password"
                className="text-xs font-medium text-slate-300"
              >
                Current password
              </Label>
              <Input
                id="current_password"
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="current-password"
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

        {/* New password */}
        <form.Field name="new_password">
          {(field) => (
            <div className="space-y-1.5">
              <Label
                htmlFor="new_password"
                className="text-xs font-medium text-slate-300"
              >
                New password
              </Label>
              <Input
                id="new_password"
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="new-password"
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

        {/* Confirm password */}
        <form.Field name="confirm_password">
          {(field) => (
            <div className="space-y-1.5">
              <Label
                htmlFor="confirm_password"
                className="text-xs font-medium text-slate-300"
              >
                Confirm new password
              </Label>
              <Input
                id="confirm_password"
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="new-password"
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

        {/* Server-level error (wrong current password etc.) */}
        {serverError && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
            <p className="text-xs text-rose-400">{serverError}</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-sky-500 text-white hover:bg-sky-400"
          >
            {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Update password
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Password updated
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
