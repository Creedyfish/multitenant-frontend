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
import { useUpdateProduct } from './queries'
import type { Product } from './types'

const editProductSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(50),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(500).optional(),
  category: z.string().max(100).optional(),
  min_stock_level: z.number({ message: 'Must be a number' }).int().min(0),
})

type EditProductValues = z.infer<typeof editProductSchema>

interface EditProductSheetProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProductSheet({
  product,
  open,
  onOpenChange,
}: EditProductSheetProps) {
  const { mutateAsync: updateProduct, isPending } = useUpdateProduct()

  const form = useForm({
    defaultValues: {
      sku: product?.sku ?? '',
      name: product?.name ?? '',
      description: product?.description ?? '',
      category: product?.category ?? '',
      min_stock_level: product?.min_stock_level ?? 0,
    } as EditProductValues,
    onSubmit: async ({ value }) => {
      if (!product) return
      const parsed = editProductSchema.parse(value)

      // Only send fields that actually changed
      const dirty: Partial<EditProductValues> = {}
      if (parsed.sku !== product.sku) dirty.sku = parsed.sku
      if (parsed.name !== product.name) dirty.name = parsed.name
      if ((parsed.description || '') !== (product.description ?? ''))
        dirty.description = parsed.description || undefined
      if ((parsed.category || '') !== (product.category ?? ''))
        dirty.category = parsed.category || undefined
      if (parsed.min_stock_level !== product.min_stock_level)
        dirty.min_stock_level = parsed.min_stock_level

      if (Object.keys(dirty).length === 0) {
        onOpenChange(false)
        return
      }

      await updateProduct({ id: product.id, payload: dirty })
      onOpenChange(false)
    },
  })

  // Re-initialize form when product changes
  if (product && form.state.values.sku === '' && product.sku !== '') {
    form.setFieldValue('sku', product.sku)
    form.setFieldValue('name', product.name)
    form.setFieldValue('description', product.description ?? '')
    form.setFieldValue('category', product.category ?? '')
    form.setFieldValue('min_stock_level', product.min_stock_level)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full max-w-md flex-col border-slate-800 bg-slate-900 text-slate-50"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-slate-50">Edit Product</SheetTitle>
          <SheetDescription className="text-slate-400">
            Update the details for{' '}
            <span className="font-medium text-slate-300">
              {product?.name ?? 'this product'}
            </span>
            .
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-1 flex-col gap-5"
        >
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
            {/* SKU */}
            <form.Field name="sku">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-sku" className="text-slate-300">
                    SKU <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="edit-sku"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
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

            {/* Name */}
            <form.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-name" className="text-slate-300">
                    Name <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
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

            {/* Category + Min Stock */}
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="category">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-category" className="text-slate-300">
                      Category
                    </Label>
                    <Input
                      id="edit-category"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="e.g. Electronics"
                      className="border-slate-700 bg-slate-800 text-slate-50 placeholder:text-slate-500 focus-visible:ring-sky-500"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="min_stock_level">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-min-stock" className="text-slate-300">
                      Min Stock Level
                    </Label>
                    <Input
                      id="edit-min-stock"
                      type="number"
                      min={0}
                      step={1}
                      value={field.state.value ?? 0}
                      onChange={(e) =>
                        field.handleChange(parseInt(e.target.value, 10) || 0)
                      }
                      onBlur={field.handleBlur}
                      className="border-slate-700 bg-slate-800 text-slate-50 focus-visible:ring-sky-500"
                    />
                    {field.state.meta.errors[0] && (
                      <p className="text-xs text-rose-400">
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Description */}
            <form.Field name="description">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-description" className="text-slate-300">
                    Description
                  </Label>
                  <textarea
                    id="edit-description"
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    rows={3}
                    className="resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0 focus:outline-none"
                  />
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
              {isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
