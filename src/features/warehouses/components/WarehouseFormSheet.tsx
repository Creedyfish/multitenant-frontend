import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateWarehouse, useUpdateWarehouse } from '../queries'
import type { Warehouse } from '../types'

const warehouseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  location: z.string().min(1, 'Location is required').max(200),
  capacity: z.number({ message: 'Must be a number' }).int().min(1).optional(),
})

type WarehouseFormValues = z.infer<typeof warehouseSchema>

interface WarehouseFormSheetProps {
  /** Pass a warehouse to edit, undefined for create */
  warehouse?: Warehouse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WarehouseFormSheet({
  warehouse,
  open,
  onOpenChange,
}: WarehouseFormSheetProps) {
  const isEdit = !!warehouse
  const { mutateAsync: createWarehouse, isPending: isCreating } =
    useCreateWarehouse()
  const { mutateAsync: updateWarehouse, isPending: isUpdating } =
    useUpdateWarehouse()
  const isPending = isCreating || isUpdating

  const form = useForm({
    defaultValues: {
      name: warehouse?.name ?? '',
      location: warehouse?.location ?? '',
      capacity: warehouse?.capacity ?? undefined,
    } as WarehouseFormValues,
    onSubmit: async ({ value }) => {
      const parsed = warehouseSchema.parse(value)

      if (isEdit) {
        // Only send dirty fields
        const dirty: Partial<WarehouseFormValues> = {}
        if (parsed.name !== warehouse.name) dirty.name = parsed.name
        if (parsed.location !== warehouse.location)
          dirty.location = parsed.location
        if (parsed.capacity !== warehouse.capacity)
          dirty.capacity = parsed.capacity

        if (Object.keys(dirty).length > 0) {
          await updateWarehouse({ id: warehouse.id, payload: dirty })
        }
      } else {
        await createWarehouse({
          name: parsed.name,
          location: parsed.location,
          capacity: parsed.capacity,
        })
      }

      form.reset()
      onOpenChange(false)
    },
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full max-w-md flex-col border-slate-800 bg-slate-900 text-slate-50"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-slate-50">
            {isEdit ? 'Edit Warehouse' : 'New Warehouse'}
          </SheetTitle>
          <SheetDescription className="text-slate-400">
            {isEdit
              ? `Update details for ${warehouse.name}.`
              : 'Add a new warehouse location to your organization.'}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-1 flex-col gap-5"
        >
          <div className="flex flex-1 flex-col gap-5 p-4">
            {/* Name */}
            <form.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="wh-name" className="text-slate-300">
                    Name <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="wh-name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. Main Warehouse"
                    className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500 focus-visible:ring-sky-500"
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-rose-400">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Location */}
            <form.Field name="location">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="wh-location" className="text-slate-300">
                    Location <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="wh-location"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. Manila, Philippines"
                    className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500 focus-visible:ring-sky-500"
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-rose-400">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Capacity */}
            <form.Field name="capacity">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="wh-capacity" className="text-slate-300">
                    Capacity
                    <span className="ml-1.5 text-xs text-slate-500">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="wh-capacity"
                    type="number"
                    min={1}
                    step={1}
                    value={field.state.value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value
                      field.handleChange(
                        val === '' ? undefined : parseInt(val, 10),
                      )
                    }}
                    onBlur={field.handleBlur}
                    placeholder="e.g. 5000"
                    className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500 focus-visible:ring-sky-500"
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-rose-400">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    Maximum number of units this warehouse can hold.
                  </p>
                </div>
              )}
            </form.Field>
          </div>

          <SheetFooter className="flex gap-3 border-t border-slate-800 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-sky-500 text-white hover:bg-sky-400"
            >
              {isPending
                ? isEdit
                  ? 'Saving…'
                  : 'Creating…'
                : isEdit
                  ? 'Save Changes'
                  : 'Create Warehouse'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
