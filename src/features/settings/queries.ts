import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { setAuthUser } from '@/features/auth/store'
import { useAuth } from '@/features/auth/hooks'
import type {
  UpdateProfilePayload,
  ChangePasswordPayload,
  UpdateOrgPayload,
  OrganizationRead,
} from './types'

// ── User read (UserRead shape from backend) ───────────────────────────────────

interface UserRead {
  id: string
  email: string
  full_name: string
  role: string
  org_id: string
  created_at: string
}

// ── Profile ───────────────────────────────────────────────────────────────────

export const useUpdateProfile = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      apiClient.url('/api/v1/users/me').json(payload).patch().json<UserRead>(),

    onSuccess: (updated) => {
      // Keep authStore in sync so topbar name updates immediately
      if (user) {
        setAuthUser({
          id: updated.id,
          email: updated.email,
          name: updated.full_name,
          role: user.role,
          orgId: user.orgId,
          isActive: true,
        })
      }
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

// ── Password ──────────────────────────────────────────────────────────────────

export const useChangePassword = () =>
  useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      apiClient
        .url('/api/v1/users/me/password')
        .json({
          current_password: payload.current_password,
          new_password: payload.new_password,
        })
        .patch()
        .json<UserRead>(),
  })

// ── Organization ──────────────────────────────────────────────────────────────

export const useMyOrganization = () =>
  useQuery({
    queryKey: ['organization', 'me'],
    queryFn: () =>
      apiClient.url('/api/v1/organizations/me').get().json<OrganizationRead>(),
  })

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateOrgPayload) =>
      apiClient
        .url('/api/v1/organizations/me')
        .json(payload)
        .patch()
        .json<OrganizationRead>(),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', 'me'] })
    },
  })
}
