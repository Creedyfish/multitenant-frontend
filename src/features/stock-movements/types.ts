import { z } from 'zod'

// ── Enum ──────────────────────────────────────────────────────────────────────

export type StockMovementType =
  | 'IN'
  | 'OUT'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT'
  | 'ADJUSTMENT'

// ── API response shape ────────────────────────────────────────────────────────

export interface StockMovement {
  id: string
  org_id: string
  product_id: string
  warehouse_id: string
  type: StockMovementType
  quantity: number
  reference: string | null
  notes: string | null
  created_by: string
  created_at: string
}

// ── Zod schemas (for forms) ───────────────────────────────────────────────────

export const stockInSchema = z.object({
  product_id: z.uuid('Select a product'),
  warehouse_id: z.uuid('Select a warehouse'),
  quantity: z.coerce.number().int().min(1, 'Must be at least 1'),
  reference: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
})

export const stockOutSchema = z.object({
  product_id: z.uuid('Select a product'),
  warehouse_id: z.uuid('Select a warehouse'),
  quantity: z.coerce.number().int().min(1, 'Must be at least 1'),
  reference: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
})

export const stockTransferSchema = z.object({
  product_id: z.uuid('Select a product'),
  from_warehouse_id: z.uuid('Select source warehouse'),
  to_warehouse_id: z.uuid('Select destination warehouse'),
  quantity: z.coerce.number().int().min(1, 'Must be at least 1'),
  notes: z.string().max(500).optional(),
})

export const stockAdjustSchema = z.object({
  product_id: z.uuid('Select a product'),
  warehouse_id: z.uuid('Select a warehouse'),
  quantity: z.coerce
    .number()
    .int()
    .refine((v) => v !== 0, 'Cannot be zero'),
  reference: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
})

export type StockInPayload = z.infer<typeof stockInSchema>
export type StockOutPayload = z.infer<typeof stockOutSchema>
export type StockTransferPayload = z.infer<typeof stockTransferSchema>
export type StockAdjustPayload = z.infer<typeof stockAdjustSchema>

// ── Ledger filter params ──────────────────────────────────────────────────────

export interface LedgerFilters {
  type?: StockMovementType
  product_id?: string
  warehouse_id?: string
  start_date?: string
  end_date?: string
  offset: number
  limit: number
}
