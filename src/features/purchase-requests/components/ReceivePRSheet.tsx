import { useState } from 'react'
import { Loader2, Package, Warehouse } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { useWarehouses } from '@/features/warehouses/queries'
import { useReceivePR } from '../queries'
import type { PurchaseRequest } from '../types'

interface ReceivePRSheetProps {
  pr: PurchaseRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReceivePRSheet({
  pr,
  open,
  onOpenChange,
}: ReceivePRSheetProps) {
  // warehouse_id per item_id
  const [warehouseMap, setWarehouseMap] = useState<Record<string, string>>({})

  const { data: warehouses = [] } = useWarehouses()
  const receivePR = useReceivePR()

  function handleWarehouseChange(itemId: string, warehouseId: string) {
    setWarehouseMap((prev) => ({ ...prev, [itemId]: warehouseId }))
  }

  const allAssigned =
    !!pr &&
    pr.items.length > 0 &&
    pr.items.every((item) => !!warehouseMap[item.id])

  async function handleConfirm() {
    if (!pr || !allAssigned) return

    await receivePR.mutateAsync({
      id: pr.id,
      payload: {
        items: pr.items.map((item) => ({
          item_id: item.id,
          warehouse_id: warehouseMap[item.id],
        })),
      },
    })

    setWarehouseMap({})
    onOpenChange(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) setWarehouseMap({})
    onOpenChange(next)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="flex w-120 flex-col border-slate-800 bg-slate-900 sm:max-w-120"
      >
        <SheetHeader className="border-b border-slate-800 pb-4">
          <SheetTitle className="text-slate-50">Mark as Received</SheetTitle>
          <SheetDescription className="text-slate-400">
            Assign a destination warehouse for each line item. Stock IN
            movements will be created on confirmation.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {!pr || pr.items.length === 0 ? (
            <p className="text-sm text-slate-500">No line items found.</p>
          ) : (
            <div className="space-y-4">
              {pr.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-800 bg-slate-800/30 p-4"
                >
                  {/* Product info */}
                  <div className="mb-3 flex items-start gap-2">
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-200">
                        {item.product_name ?? item.product_id}
                      </p>
                      <p className="font-mono text-xs text-slate-500">
                        {item.product_sku ?? '—'} · Qty:{' '}
                        <span className="text-slate-400">{item.quantity}</span>
                      </p>
                    </div>
                  </div>

                  {/* Warehouse selector */}
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Warehouse className="h-3 w-3" />
                      Destination Warehouse
                    </Label>
                    <Select
                      value={warehouseMap[item.id] ?? ''}
                      onValueChange={(val) =>
                        handleWarehouseChange(item.id, val)
                      }
                    >
                      <SelectTrigger className="border-slate-700 bg-slate-800 text-slate-200 focus:ring-sky-500">
                        <SelectValue placeholder="Select warehouse…" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-700 bg-slate-800">
                        {warehouses.map((wh) => (
                          <SelectItem
                            key={wh.id}
                            value={wh.id}
                            className="text-slate-200 focus:bg-slate-700 focus:text-slate-100"
                          >
                            {wh.name}
                            {wh.location && (
                              <span className="ml-1.5 text-slate-500">
                                · {wh.location}
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-slate-800 pt-4">
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-slate-200"
            onClick={() => handleOpenChange(false)}
            disabled={receivePR.isPending}
          >
            Cancel
          </Button>
          <Button
            className="bg-sky-500 text-white hover:bg-sky-400 disabled:opacity-50"
            onClick={handleConfirm}
            disabled={!allAssigned || receivePR.isPending}
          >
            {receivePR.isPending ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Confirming…
              </>
            ) : (
              'Confirm Receipt'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
