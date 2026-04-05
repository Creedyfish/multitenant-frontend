import { useForm } from '@tanstack/react-form'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useCreateSupplier, useUpdateSupplier } from '../queries'
import { supplierFormSchema, type Supplier } from '../types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier
}

export function SupplierFormSheet({ open, onOpenChange, supplier }: Props) {
  const isEdit = !!supplier
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const isPending = createSupplier.isPending || updateSupplier.isPending

  const form = useForm({
    defaultValues: {
      name: supplier?.name ?? '',
      contact_email: supplier?.contact_email ?? '',
      contact_phone: supplier?.contact_phone ?? '',
      address: supplier?.address ?? '',
    },
    validators: { onSubmit: supplierFormSchema as any },
    onSubmit: async ({ value }) => {
      const payload = {
        name: value.name,
        contact_email: value.contact_email || null,
        contact_phone: value.contact_phone || null,
        address: value.address || null,
      }

      if (isEdit) {
        const diff: Record<string, unknown> = {}
        if (value.name !== supplier.name) diff.name = value.name
        if ((value.contact_email || null) !== supplier.contact_email)
          diff.contact_email = value.contact_email || null
        if ((value.contact_phone || null) !== supplier.contact_phone)
          diff.contact_phone = value.contact_phone || null
        if ((value.address || null) !== supplier.address)
          diff.address = value.address || null

        if (Object.keys(diff).length === 0) {
          onOpenChange(false)
          return
        }

        await updateSupplier.mutateAsync({ id: supplier.id, payload: diff })
      } else {
        await createSupplier.mutateAsync(payload)
      }

      form.reset()
      onOpenChange(false)
    },
  })

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) form.reset()
        onOpenChange(v)
      }}
    >
      <SheetContent
        side="right"
        className="w-105 border-slate-800 bg-slate-900"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-slate-50">
            {isEdit ? 'Edit Supplier' : 'New Supplier'}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-5 p-4"
        >
          {/* Name */}
          <form.Field name="name">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-300">
                  Name <span className="text-rose-400">*</span>
                </Label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Acme Supplies Co."
                  className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500"
                />
                {field.state.meta.isTouched && field.state.meta.errors[0] && (
                  <p className="text-xs text-rose-400">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Contact Email */}
          <form.Field name="contact_email">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-300">Contact Email</Label>
                <Input
                  type="email"
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="contact@supplier.com"
                  className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500"
                />
                {field.state.meta.isTouched && field.state.meta.errors[0] && (
                  <p className="text-xs text-rose-400">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Contact Phone */}
          <form.Field name="contact_phone">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-300">Contact Phone</Label>
                <Input
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="+63 912 345 6789"
                  className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500"
                />
              </div>
            )}
          </form.Field>

          {/* Address */}
          <form.Field name="address">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-300">Address</Label>
                <Textarea
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="123 Warehouse St., Davao City"
                  rows={3}
                  className="resize-none border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500"
                />
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                form.reset()
                onOpenChange(false)
              }}
              className="text-slate-400 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-sky-500 hover:bg-sky-400"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Supplier'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
