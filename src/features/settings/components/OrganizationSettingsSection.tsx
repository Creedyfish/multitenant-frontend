import { useForm } from '@tanstack/react-form'
import { Building2, CheckCircle2, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useMyOrganization, useUpdateOrganization } from '../queries'
import { updateOrgSchema } from '../types'

function ReadOnlyField({
  label,
  value,
}: {
  label: string
  value: string | undefined
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-300">{label}</Label>
      <div className="flex h-9 items-center rounded-lg border border-slate-800 bg-slate-800/30 px-3">
        <span className="text-sm text-slate-400">
          {value ?? <span className="text-slate-600">—</span>}
        </span>
      </div>
    </div>
  )
}

export function OrganizationSettingsSection() {
  const { data: org, isLoading } = useMyOrganization()
  const { mutateAsync, isPending } = useUpdateOrganization()
  const [saved, setSaved] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onSubmit: updateOrgSchema as any,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  // Populate form once org data loads
  useEffect(() => {
    if (org) {
      form.setFieldValue('name', org.name)
    }
  }, [org])

  const createdDate = org?.created_at
    ? new Date(org.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
          <Building2 className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-50">
            Organization
          </h2>
          <p className="text-xs text-slate-400">
            Manage your organization's details
          </p>
        </div>
      </div>

      <Separator className="bg-slate-800" />

      {isLoading ? (
        <div className="flex items-center gap-2 py-4 text-xs text-slate-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading organization…
        </div>
      ) : (
        <div className="space-y-4">
          {/* Read-only fields */}
          <ReadOnlyField label="Subdomain" value={org?.subdomain} />
          <ReadOnlyField label="Member since" value={createdDate} />

          <Separator className="bg-slate-800" />

          {/* Editable org name */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <form.Field name="name">
              {(field) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="org_name"
                    className="text-xs font-medium text-slate-300"
                  >
                    Organization name
                  </Label>
                  <Input
                    id="org_name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Your organization name"
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
                {isPending && (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                )}
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
      )}
    </div>
  )
}
