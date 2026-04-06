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

export interface RegisterResponse {
  user: User
  org_id: string
  subdomain: string
}

export const registerSchema = z
  .object({
    org_name: z.string().min(2, 'Organization name is required'),
    subdomain: z
      .string()
      .min(2, 'Subdomain is required')
      .max(32)
      .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
    full_name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export type RegisterPayload = z.infer<typeof registerSchema>
