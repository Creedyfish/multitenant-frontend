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
import { useCreateProduct } from '../queries'

const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(50),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(500).optional(),
  category: z.string().max(100).optional(),
  min_stock_level: z
    .number({ message: 'Must be a number' })
    .int()
    .min(0)
    .optional(),
})

type CreateProductValues = z.infer<typeof createProductSchema>

interface CreateProductSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProductSheet({
  open,
  onOpenChange,
}: CreateProductSheetProps) {
  const { mutateAsync: createProduct, isPending } = useCreateProduct()

  const form = useForm({
    defaultValues: {
      sku: '',
      name: '',
      description: '',
      category: '',
      min_stock_level: 0,
    } as CreateProductValues,
    onSubmit: async ({ value }) => {
      const parsed = createProductSchema.parse(value)
      await createProduct({
        ...parsed,
        description: parsed.description || undefined,
        category: parsed.category || undefined,
      })
      form.reset()
      onOpenChange(false)
    },
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-50"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-slate-50">New Product</SheetTitle>
          <SheetDescription className="text-slate-400">
            Add a new product to your inventory catalog.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-5"
        >
          {/* SKU */}
          <form.Field name="sku">
            {(field) => (
              <div className="flex flex-col gap-1.5 p-4">
                <Label htmlFor="sku" className="text-slate-300">
                  SKU <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="sku"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="e.g. PROD-001"
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
              <div className="flex flex-col gap-1.5 p-4">
                <Label htmlFor="name" className="text-slate-300">
                  Name <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Product name"
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

          {/* Category + Min Stock row */}
          <div className="grid grid-cols-2 gap-4 p-4">
            <form.Field name="category">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="category" className="text-slate-300">
                    Category
                  </Label>
                  <Input
                    id="category"
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
                  <Label htmlFor="min_stock" className="text-slate-300">
                    Min Stock Level
                  </Label>
                  <Input
                    id="min_stock"
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
              <div className="flex flex-col gap-1.5 p-4">
                <Label htmlFor="description" className="text-slate-300">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Optional description"
                  rows={3}
                  className="resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0 focus:outline-none"
                />
              </div>
            )}
          </form.Field>

          <SheetFooter className="mt-2 flex gap-3">
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
              {isPending ? 'Creating…' : 'Create Product'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
