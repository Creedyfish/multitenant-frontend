import { z } from 'zod'

export const AuditActionSchema = z.enum([
  'CREATE',
  'UPDATE',
  'DELETE',
  'APPROVE',
  'REJECT',
  'SUBMIT',
  'ADJUST',
])

export type AuditAction = z.infer<typeof AuditActionSchema>

export const AuditEntitySchema = z.enum([
  'Product',
  'Warehouse',
  'PurchaseRequest',
  'StockMovement',
  'User',
  'Organization',
])

export type AuditEntity = z.infer<typeof AuditEntitySchema>

export const AuditLogSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  actor_id: z.string(),
  action: AuditActionSchema,
  entity: AuditEntitySchema,
  entity_id: z.string(),
  before: z.record(z.string(), z.unknown()).nullable(),
  after: z.record(z.string(), z.unknown()),
  timestamp: z.string(),
  ip_address: z.string().nullable(),
  user_agent: z.string().nullable(),
})

export type AuditLog = z.infer<typeof AuditLogSchema>

export const AuditLogFiltersSchema = z.object({
  entity: AuditEntitySchema.optional(),
  entity_id: z.string().optional(),
  actor_id: z.string().optional(),
  action: AuditActionSchema.optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  skip: z.number(),
  limit: z.number(),
})

export type AuditLogFilters = z.infer<typeof AuditLogFiltersSchema>
