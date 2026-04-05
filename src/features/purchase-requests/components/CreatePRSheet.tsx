import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useCreatePR } from '../queries'
import {
  lineItemSchema,
  createPRSchema,
  type LineItemDraft,
  type LineItemErrors,
  type CreatePRLineItemPayload,
} from '../types'
import { LineItemRow } from './PRLineItemFields'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function emptyLineItem(): LineItemDraft {
  return {
    product_id: '',
    product_name: '',
    product_sku: '',
    quantity: 1,
    estimated_price: null,
    supplier_id: '',
    supplier_name: '',
  }
}

function validateLineItems(items: LineItemDraft[]): LineItemErrors[] {
  return items.map((item) => {
    const result = lineItemSchema.safeParse(item)
    if (result.success) return {}
    const errors: LineItemErrors = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof LineItemDraft
      if (!errors[field]) errors[field] = issue.message
    }
    return errors
  })
}

// ─── Create PR Sheet ──────────────────────────────────────────────────────────

interface CreatePRSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePRSheet({ open, onOpenChange }: CreatePRSheetProps) {
  const createPR = useCreatePR()
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([emptyLineItem()])
  const [lineItemErrors, setLineItemErrors] = useState<LineItemErrors[]>([{}])

  const form = useForm({
    defaultValues: { notes: undefined as string | undefined },
    validators: {
      onSubmit: createPRSchema,
    },
    onSubmit: async ({ value }) => {
      // Validate line items with Zod safeParse (outside TanStack Form's tree)
      const errors = validateLineItems(lineItems)
      setLineItemErrors(errors)
      if (errors.some((e) => Object.values(e).some(Boolean))) return

      const items: CreatePRLineItemPayload[] = lineItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        estimated_price: item.estimated_price ?? undefined,
        supplier_id: item.supplier_id ?? undefined,
      }))

      await createPR.mutateAsync({
        notes: value.notes || undefined,
        items,
      })

      handleClose()
    },
  })

  function handleClose() {
    onOpenChange(false)
    setLineItems([emptyLineItem()])
    setLineItemErrors([{}])
    form.reset()
  }

  function addItem() {
    setLineItems((prev) => [...prev, emptyLineItem()])
    setLineItemErrors((prev) => [...prev, {}])
  }

  function removeItem(index: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== index))
    setLineItemErrors((prev) => prev.filter((_, i) => i !== index))
  }

  function updateItem(index: number, updated: LineItemDraft) {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? updated : item)),
    )
    // Clear only fields that are now valid — don't add new errors mid-typing
    setLineItemErrors((prev) =>
      prev.map((e, i) => {
        if (i !== index) return e
        const result = lineItemSchema.safeParse(updated)
        if (result.success) return {}
        const stillInvalid = new Set(
          result.error.issues.map((iss) => iss.path[0] as string),
        )
        const cleared: LineItemErrors = {}
        for (const key of Object.keys(e) as (keyof LineItemErrors)[]) {
          if (stillInvalid.has(key)) cleared[key] = e[key]
        }
        return cleared
      }),
    )
  }

  const totalValue = lineItems.reduce(
    (sum, item) => sum + item.quantity * (item.estimated_price ?? 0),
    0,
  )

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="flex w-130 flex-col border-slate-800 bg-slate-950 p-0 sm:max-w-130"
      >
        <SheetHeader className="border-b border-slate-800 px-6 py-5">
          <SheetTitle className="text-slate-50">
            New Purchase Request
          </SheetTitle>
          <SheetDescription className="text-slate-400">
            Add line items and submit for manager approval.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form
            id="create-pr-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            {/* Notes — validated by TanStack Form via validators.onSubmit: createPRSchema */}
            <div className="mb-6">
              <form.Field name="notes">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <div>
                      <Label className="mb-1.5 block text-xs text-slate-400">
                        Notes (optional)
                      </Label>
                      <textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        rows={2}
                        placeholder="Reason for request, urgency, etc."
                        className={`w-full resize-none rounded-lg border px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:outline-none ${
                          isInvalid
                            ? 'border-rose-500/50 bg-rose-500/5 focus:ring-rose-500/30'
                            : 'border-slate-700 bg-slate-800/50 focus:border-sky-500/50 focus:ring-sky-500/30'
                        }`}
                      />
                      {isInvalid && field.state.meta.errors.length > 0 && (
                        <p className="mt-1 text-xs text-rose-400">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  )
                }}
              </form.Field>
            </div>

            <Separator className="mb-5 bg-slate-800" />

            {/* Line items — validated with lineItemSchema.safeParse */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">
                Line Items
              </span>
              <span className="text-xs text-slate-500">
                {lineItems.length} {lineItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <LineItemRow
                  key={index}
                  index={index}
                  item={item}
                  errors={lineItemErrors[index] ?? {}}
                  onChange={(updated) => updateItem(index, updated)}
                  onRemove={() => removeItem(index)}
                  canRemove={lineItems.length > 1}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addItem}
              className="mt-3 w-full border border-dashed border-slate-700 text-slate-400 hover:border-sky-500/50 hover:text-sky-400"
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              Add Line Item
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-4">
          {totalValue > 0 && (
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-slate-400">Estimated Total</span>
              <span className="font-semibold text-slate-200">
                $
                {totalValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              form="create-pr-form"
              type="submit"
              className="flex-1 bg-sky-500 text-white hover:bg-sky-400"
              disabled={createPR.isPending}
            >
              {createPR.isPending ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Creating…
                </>
              ) : (
                'Create PR'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
