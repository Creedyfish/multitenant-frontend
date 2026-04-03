import { z } from 'zod'

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF'

export interface User {
  id: string
  org_id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
}

const baseSchema = z.object({
  email: z.email('Invalid email'),
  full_name: z.string().min(1, 'Full name is required'),
  password: z.string(),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']),
})

export const createUserSchema = baseSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const editUserSchema = baseSchema

export type CreateUserPayload = z.infer<typeof createUserSchema>
export type UpdateUserPayload = Partial<Omit<CreateUserPayload, 'password'>>
