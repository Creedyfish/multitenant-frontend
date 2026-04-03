import { useForm } from '@tanstack/react-form'
import { Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCreateUser, useUpdateUser } from '../queries'
import { createUserSchema, editUserSchema } from '../types'
import type { User, UserRole } from '../types'

interface UserFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User // if provided → edit mode
}

const ROLES: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'ADMIN',
    label: 'Admin',
    description: 'Full access including user management',
  },
  {
    value: 'MANAGER',
    label: 'Manager',
    description: 'Can approve PRs and manage inventory',
  },
  {
    value: 'STAFF',
    label: 'Staff',
    description: 'Can submit PRs and view inventory',
  },
]

export function UserFormSheet({
  open,
  onOpenChange,
  user,
}: UserFormSheetProps) {
  const isEdit = !!user
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()

  const form = useForm({
    defaultValues: {
      full_name: user?.full_name ?? '',
      email: user?.email ?? '',
      password: '',
      role: (user?.role ?? 'STAFF') as UserRole,
    },

    validators: {
      onSubmit: isEdit ? editUserSchema : createUserSchema,
    },

    onSubmit: async ({ value }) => {
      if (isEdit) {
        const dirty: Record<string, unknown> = {}
        if (value.full_name !== user.full_name)
          dirty.full_name = value.full_name
        if (value.email !== user.email) dirty.email = value.email
        if (value.role !== user.role) dirty.role = value.role
        if (Object.keys(dirty).length > 0) {
          await updateUser.mutateAsync({ id: user.id, payload: dirty })
        }
      } else {
        await createUser.mutateAsync({
          full_name: value.full_name,
          email: value.email,
          password: value.password,
          role: value.role,
        })
      }
      onOpenChange(false)
    },
  })

  const isPending = createUser.isPending || updateUser.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-120 flex-col border-slate-800 bg-slate-950 p-0 sm:max-w-120"
      >
        <SheetHeader className="border-b border-slate-800 px-6 py-5">
          <SheetTitle className="text-slate-50">
            {isEdit ? 'Edit User' : 'Invite User'}
          </SheetTitle>
          <SheetDescription className="text-slate-400">
            {isEdit
              ? 'Update name, email, or role.'
              : 'Create a new account for your organization.'}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {/* Full Name */}
            <form.Field name="full_name">
              {(field) => (
                <div className="space-y-1.5">
                  <Label className="text-slate-300">
                    Full Name <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Jane Smith"
                    className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500 focus-visible:ring-sky-500"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors[0] && (
                    <p className="text-xs text-rose-400">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Email */}
            <form.Field name="email">
              {(field) => (
                <div className="space-y-1.5">
                  <Label className="text-slate-300">
                    Email <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="jane@company.com"
                    className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500 focus-visible:ring-sky-500"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors[0] && (
                    <p className="text-xs text-rose-400">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Password — create only */}
            {!isEdit && (
              <form.Field name="password">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label className="text-slate-300">
                      Password <span className="text-rose-400">*</span>
                    </Label>
                    <Input
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Min. 8 characters"
                      className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500 focus-visible:ring-sky-500"
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
            )}

            {/* Role */}
            <form.Field name="role">
              {(field) => (
                <div className="space-y-2">
                  <Label className="text-slate-300">Role</Label>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as UserRole)}
                    className="space-y-2"
                  >
                    {ROLES.map((r) => (
                      <label
                        key={r.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                          field.state.value === r.value
                            ? 'border-sky-500/40 bg-sky-500/5'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <RadioGroupItem value={r.value} className="mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">
                            {r.label}
                          </p>
                          <p className="text-xs text-slate-500">
                            {r.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </form.Field>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-sky-500 text-white hover:bg-sky-400"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
