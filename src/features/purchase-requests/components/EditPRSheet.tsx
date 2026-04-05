import { useState, useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Trash2, Plus, Loader2 } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { useUpdatePR } from '../queries'
import type {
  PurchaseRequest,
  PRLineItem,
  LineItemDraft,
  LineItemErrors,
  UpdatePRPayload,
} from '../types'
import { lineItemSchema } from '../types'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  pr: PurchaseRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const editNotesSchema = z.object({
  notes: z.string().max(500, 'Notes must be 500 characters or less'),
})

function lineItemFromExisting(item: PRLineItem): LineItemDraft {
  return {
    product_id: item.product_id,
    product_name: item.product_name ?? '',
    product_sku: item.product_sku ?? '',
    quantity: item.quantity,
    estimated_price: item.estimated_price ? Number(item.estimated_price) : null,
  }
}

function validateLineItems(items: LineItemDraft[]): LineItemErrors[] {
  return items.map((item) => {
    const result = lineItemSchema.safeParse(item)
    if (result.success) return {}
    return Object.fromEntries(
      result.error.issues.map((i) => [i.path[0], i.message]),
    ) as LineItemErrors
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditPRSheet({ pr, open, onOpenChange }: Props) {
  const updatePR = useUpdatePR()

  const [items, setItems] = useState<LineItemDraft[]>([])
  const [itemErrors, setItemErrors] = useState<LineItemErrors[]>([])

  // Re-seed items whenever the PR changes (remount or different PR opened)
  useEffect(() => {
    if (pr) {
      setItems(pr.items.map(lineItemFromExisting))
      setItemErrors([])
    }
  }, [pr?.id])

  const form = useForm({
    defaultValues: {
      notes: pr?.notes ?? '',
    },
    validators: {
      onSubmit: editNotesSchema,
    },
    onSubmit: async ({ value }) => {
      if (!pr) return

      const errors = validateLineItems(items)
      const hasItemErrors = errors.some((e) => Object.keys(e).length > 0)
      if (hasItemErrors) {
        setItemErrors(errors)
        return
      }

      // Dirty check — only send what changed
      const payload: UpdatePRPayload = {}

      if (value.notes !== (pr.notes ?? '')) {
        payload.notes = value.notes
      }

      // Always send items (backend replaces them wholesale on PATCH)
      payload.items = items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        ...(item.estimated_price != null
          ? { estimated_price: item.estimated_price }
          : {}),
      }))

      await updatePR.mutateAsync({ id: pr.id, payload })
      onOpenChange(false)
    },
  })

  // ─── Line item handlers ──────────────────────────────────────────────────

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        product_id: '',
        product_name: '',
        product_sku: '',
        quantity: 1,
        estimated_price: null,
      },
    ])
    setItemErrors((prev) => [...prev, {}])
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
    setItemErrors((prev) => prev.filter((_, i) => i !== index))
  }

  function updateItem<K extends keyof LineItemDraft>(
    index: number,
    field: K,
    value: LineItemDraft[K],
  ) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
    // Clear error for that field on change
    setItemErrors((prev) =>
      prev.map((err, i) =>
        i === index ? { ...err, [field]: undefined } : err,
      ),
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  if (!pr) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-xl overflow-y-auto border-slate-800 bg-slate-900"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-slate-50">
            Edit {pr.request_number}
          </SheetTitle>
          <SheetDescription className="text-slate-400">
            Only DRAFT purchase requests can be edited. Changes are saved
            immediately.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          {/* Notes */}
          <form.Field name="notes">
            {(field) => (
              <div className="space-y-1.5 p-4">
                <Label className="text-sm text-slate-300">
                  Notes{' '}
                  <span className="font-normal text-slate-500">(optional)</span>
                </Label>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Add any relevant notes…"
                  className="border-slate-700 bg-slate-800 text-slate-200 placeholder:text-slate-500"
                />
                {field.state.meta.isTouched && field.state.meta.errors[0] && (
                  <p className="text-xs text-rose-400">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <Separator className="bg-slate-800" />

          {/* Line Items */}
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-300">Line Items</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addItem}
                className="h-7 px-2 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Item
              </Button>
            </div>

            {items.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-700 py-4 text-center text-sm text-slate-500">
                No line items. Add at least one.
              </p>
            )}

            <div className="space-y-4">
              {items.map((item, index) => {
                const err = itemErrors[index] ?? {}
                return (
                  <div
                    key={index}
                    className="space-y-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                        Item {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="h-7 w-7 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Product ID */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">
                        Product ID
                      </Label>
                      <Input
                        value={item.product_id}
                        onChange={(e) =>
                          updateItem(index, 'product_id', e.target.value)
                        }
                        placeholder="Product UUID"
                        className="border-slate-700 bg-slate-900 font-mono text-xs text-slate-200 placeholder:text-slate-500"
                      />
                      {err.product_id && (
                        <p className="text-xs text-rose-400">
                          {err.product_id}
                        </p>
                      )}
                    </div>

                    {/* Quantity + Estimated Price */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400">
                          Quantity
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity === 0 ? '' : item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              'quantity',
                              e.target.value ? Number(e.target.value) : 0,
                            )
                          }
                          className="border-slate-700 bg-slate-900 text-slate-200"
                        />
                        {err.quantity && (
                          <p className="text-xs text-rose-400">
                            {err.quantity}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400">
                          Est. Price{' '}
                          <span className="text-slate-600">(optional)</span>
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={item.estimated_price ?? ''}
                          onChange={(e) =>
                            updateItem(
                              index,
                              'estimated_price',
                              e.target.value === ''
                                ? null
                                : parseFloat(e.target.value),
                            )
                          }
                          placeholder="0.00"
                          className="border-slate-700 bg-slate-900 text-slate-200 placeholder:text-slate-500"
                        />
                        {err.estimated_price && (
                          <p className="text-xs text-rose-400">
                            {err.estimated_price}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <SheetFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updatePR.isPending || items.length === 0}
              className="bg-sky-500 text-white hover:bg-sky-400"
            >
              {updatePR.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
