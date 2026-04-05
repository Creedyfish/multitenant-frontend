import { z } from 'zod'

export interface Supplier {
  id: string
  org_id: string
  name: string
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  created_at: string
}

export const supplierFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_email: z
    .string()
    .email('Invalid email')
    .or(z.literal(''))
    .nullable()
    .optional(),
  contact_phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
})

export type SupplierFormValues = z.infer<typeof supplierFormSchema>

export interface CreateSupplierPayload {
  name: string
  contact_email?: string | null
  contact_phone?: string | null
  address?: string | null
}

export interface UpdateSupplierPayload {
  name?: string
  contact_email?: string | null
  contact_phone?: string | null
  address?: string | null
}
