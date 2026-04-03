import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { User, CreateUserPayload, UpdateUserPayload } from './types'

const KEYS = {
  all: ['users'] as const,
  detail: (id: string) => ['users', id] as const,
}

export function useUsers() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: () => apiClient.url('/users').get().json<User[]>(),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      apiClient.url('/users').json(payload).post().json<User>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      apiClient.url(`/users/${id}`).json(payload).patch().json<User>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.url(`/users/${id}`).delete().res(),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}
