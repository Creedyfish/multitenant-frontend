import { z } from 'zod'

// ── Profile ───────────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
})

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>

// ── Password ──────────────────────────────────────────────────────────────────

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirm_password: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>

// ── Organization ──────────────────────────────────────────────────────────────

export const updateOrgSchema = z.object({
  name: z.string().min(1, 'Organization name is required').max(100),
})

export type UpdateOrgPayload = z.infer<typeof updateOrgSchema>

export interface OrganizationRead {
  id: string
  name: string
  subdomain: string
  created_at: string
}
