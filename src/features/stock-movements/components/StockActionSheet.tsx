import { useForm } from '@tanstack/react-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  useStockIn,
  useStockOut,
  useStockTransfer,
  useStockAdjust,
} from '../queries'
import {
  stockInSchema,
  stockOutSchema,
  stockTransferSchema,
  stockAdjustSchema,
} from '../types'
import type { Product } from '@/features/products/types'
import type { Warehouse } from '@/features/warehouses/types'

export type StockActionMode = 'in' | 'out' | 'transfer' | 'adjust'

interface Props {
  mode: StockActionMode
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
  warehouses: Warehouse[]
}

const CONFIG = {
  in: {
    title: 'Stock In',
    description: 'Record incoming stock for a product at a warehouse.',
    submitLabel: 'Record Stock In',
    schema: stockInSchema,
  },
  out: {
    title: 'Stock Out',
    description:
      'Record outgoing stock. Will fail if insufficient stock exists.',
    submitLabel: 'Record Stock Out',
    schema: stockOutSchema,
  },
  transfer: {
    title: 'Transfer Stock',
    description: 'Move stock from one warehouse to another.',
    submitLabel: 'Transfer Stock',
    schema: stockTransferSchema,
  },
  adjust: {
    title: 'Adjust Stock',
    description:
      'Correct stock levels. Use positive to add, negative to remove.',
    submitLabel: 'Apply Adjustment',
    schema: stockAdjustSchema,
  },
} as const

function FieldError({ errors }: { errors: string[] }) {
  if (!errors.length) return null
  return <p className="mt-1 text-xs text-rose-400">{errors[0]}</p>
}

function FormField({
  label,
  children,
  error,
}: {
  label: string
  children: React.ReactNode
  error?: string[]
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-300">{label}</Label>
      {children}
      {error && <FieldError errors={error} />}
    </div>
  )
}

export function StockActionSheet({
  mode,
  open,
  onOpenChange,
  products,
  warehouses,
}: Props) {
  const config = CONFIG[mode]
  const stockIn = useStockIn()
  const stockOut = useStockOut()
  const stockTransfer = useStockTransfer()
  const stockAdjust = useStockAdjust()

  const isPending =
    stockIn.isPending ||
    stockOut.isPending ||
    stockTransfer.isPending ||
    stockAdjust.isPending

  const form = useForm({
    defaultValues: {
      product_id: '',
      warehouse_id: '',
      from_warehouse_id: '',
      to_warehouse_id: '',
      quantity: '' as unknown as number,
      reference: '',
      notes: '',
    },
    validators: {
      onSubmit: config.schema as any,
    },
    onSubmit: async ({ value }) => {
      const close = () => {
        onOpenChange(false)
        form.reset()
      }

      if (mode === 'in') {
        await stockIn.mutateAsync(
          {
            product_id: value.product_id,
            warehouse_id: value.warehouse_id,
            quantity: value.quantity,
            reference: value.reference || undefined,
            notes: value.notes || undefined,
          },
          { onSuccess: close },
        )
      } else if (mode === 'out') {
        await stockOut.mutateAsync(
          {
            product_id: value.product_id,
            warehouse_id: value.warehouse_id,
            quantity: value.quantity,
            reference: value.reference || undefined,
            notes: value.notes || undefined,
          },
          { onSuccess: close },
        )
      } else if (mode === 'transfer') {
        await stockTransfer.mutateAsync(
          {
            product_id: value.product_id,
            from_warehouse_id: value.from_warehouse_id,
            to_warehouse_id: value.to_warehouse_id,
            quantity: value.quantity,
            notes: value.notes || undefined,
          },
          { onSuccess: close },
        )
      } else if (mode === 'adjust') {
        await stockAdjust.mutateAsync(
          {
            product_id: value.product_id,
            warehouse_id: value.warehouse_id,
            quantity: value.quantity,
            reference: value.reference || undefined,
            notes: value.notes || undefined,
          },
          { onSuccess: close },
        )
      }
    },
  })

  const isTransfer = mode === 'transfer'

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
        className="w-105 border-slate-800 bg-slate-900 sm:max-w-105"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-slate-50">{config.title}</SheetTitle>
          <SheetDescription className="text-slate-400">
            {config.description}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4 p-4"
        >
          {/* Product */}
          <form.Field name="product_id">
            {(field) => (
              <FormField
                label="Product"
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              >
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger className="border-slate-700 bg-slate-800 text-slate-200">
                    <SelectValue placeholder="Select product…" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-800">
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <span className="text-slate-200">{p.name}</span>
                        <span className="ml-2 text-xs text-slate-500">
                          {p.sku}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}
          </form.Field>

          {/* Warehouse(s) */}
          {!isTransfer ? (
            <form.Field name="warehouse_id">
              {(field) => (
                <FormField
                  label="Warehouse"
                  error={
                    field.state.meta.isTouched
                      ? field.state.meta.errors
                      : undefined
                  }
                >
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger className="border-slate-700 bg-slate-800 text-slate-200">
                      <SelectValue placeholder="Select warehouse…" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-700 bg-slate-800">
                      {warehouses.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}
            </form.Field>
          ) : (
            <>
              <form.Field name="from_warehouse_id">
                {(field) => (
                  <FormField
                    label="From Warehouse"
                    error={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  >
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="border-slate-700 bg-slate-800 text-slate-200">
                        <SelectValue placeholder="Source warehouse…" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-700 bg-slate-800">
                        {warehouses.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              </form.Field>

              <form.Field name="to_warehouse_id">
                {(field) => (
                  <FormField
                    label="To Warehouse"
                    error={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  >
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="border-slate-700 bg-slate-800 text-slate-200">
                        <SelectValue placeholder="Destination warehouse…" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-700 bg-slate-800">
                        {warehouses.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              </form.Field>
            </>
          )}

          {/* Quantity */}
          <form.Field name="quantity">
            {(field) => (
              <FormField
                label={
                  mode === 'adjust'
                    ? 'Quantity (+ to add, − to remove)'
                    : 'Quantity'
                }
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              >
                <Input
                  type="number"
                  value={field.state.value as unknown as string}
                  onChange={(e) => field.handleChange(e.target.value as any)}
                  onBlur={field.handleBlur}
                  placeholder={mode === 'adjust' ? 'e.g. -10 or 25' : 'e.g. 50'}
                  className="border-slate-700 bg-slate-800 text-slate-200 placeholder:text-slate-500"
                />
              </FormField>
            )}
          </form.Field>

          {/* Reference (not on transfer) */}
          {!isTransfer && (
            <form.Field name="reference">
              {(field) => (
                <FormField label="Reference (optional)">
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. PO-12345, INV-789"
                    className="border-slate-700 bg-slate-800 text-slate-200 placeholder:text-slate-500"
                  />
                </FormField>
              )}
            </form.Field>
          )}

          {/* Notes */}
          <form.Field name="notes">
            {(field) => (
              <FormField label="Notes (optional)">
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={3}
                  placeholder="Any additional context…"
                  className="resize-none border-slate-700 bg-slate-800 text-slate-200 placeholder:text-slate-500"
                />
              </FormField>
            )}
          </form.Field>

          {/* Server error */}
          {(stockIn.error ||
            stockOut.error ||
            stockTransfer.error ||
            stockAdjust.error) && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
              {(
                stockIn.error ||
                stockOut.error ||
                stockTransfer.error ||
                stockAdjust.error
              )?.message ?? 'Something went wrong. Please try again.'}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                form.reset()
                onOpenChange(false)
              }}
              className="text-slate-400 hover:bg-slate-800 hover:text-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-sky-500 text-white hover:bg-sky-400"
            >
              {isPending ? 'Saving…' : config.submitLabel}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
