import { z } from 'zod'

// ─── Status ───────────────────────────────────────────────────────────────────

export type PRStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'ORDERED'

// ─── API response types ───────────────────────────────────────────────────────

export interface PRLineItem {
  id: string
  request_id: string
  product_id: string
  product_name: string | null
  product_sku: string | null
  quantity: number
  estimated_price: string | null // Decimal serializes as string from Python
  supplier_id: string | null
}

export interface PurchaseRequest {
  id: string
  org_id: string
  request_number: string
  status: PRStatus
  created_by: string
  created_by_name: string | null
  approved_by: string | null
  approved_by_name: string | null
  approved_at: string | null
  rejected_by: string | null
  rejected_by_name: string | null
  rejected_at: string | null
  rejection_reason: string | null
  notes: string | null
  created_at: string
  updated_at: string
  items: PRLineItem[]
}

// Matches PurchaseRequestListOut — lighter shape used by the list endpoint
export interface PurchaseRequestListItem {
  id: string
  org_id: string
  request_number: string
  status: PRStatus
  created_by: string
  created_by_name: string | null
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

// ─── Zod schemas — single source of truth for form validation ─────────────────

export const lineItemSchema = z.object({
  product_id: z.string().min(1, 'Select a product'),
  product_name: z.string(),
  product_sku: z.string(),
  quantity: z
    .number({ message: 'Enter a valid quantity' })
    .min(1, 'Quantity must be at least 1'),
  estimated_price: z
    .number({ message: 'Enter a valid price' })
    .min(0, 'Price cannot be negative')
    .nullable(),
})

export const createPRSchema = z.object({
  notes: z.string().max(500, 'Notes must be 500 characters or less'),
})

// ─── Inferred form types ──────────────────────────────────────────────────────

export type LineItemDraft = z.infer<typeof lineItemSchema>
export type LineItemErrors = Partial<Record<keyof LineItemDraft, string>>
export type CreatePRFormValues = z.infer<typeof createPRSchema>

// ─── API payload types ────────────────────────────────────────────────────────

export interface CreatePRLineItemPayload {
  product_id: string
  quantity: number
  estimated_price?: number
  supplier_id?: string
}

export interface CreatePRPayload {
  notes?: string
  items: CreatePRLineItemPayload[]
}

export interface UpdatePRPayload {
  notes?: string
  items?: CreatePRLineItemPayload[]
}

export interface RejectPRPayload {
  rejection_reason: string
}
