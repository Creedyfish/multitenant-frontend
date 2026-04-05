import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type {
  CreateSupplierPayload,
  Supplier,
  UpdateSupplierPayload,
} from './types'

const SUPPLIERS_KEY = ['suppliers']

export function useSuppliers() {
  return useQuery({
    queryKey: SUPPLIERS_KEY,
    queryFn: () => apiClient.url('/api/v1/suppliers').get().json<Supplier[]>(),
  })
}

export function useCreateSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateSupplierPayload) =>
      apiClient.url('/api/v1/suppliers').json(payload).post().json<Supplier>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUPPLIERS_KEY }),
  })
}

export function useUpdateSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateSupplierPayload
    }) =>
      apiClient
        .url(`/api/v1/suppliers/${id}`)
        .json(payload)
        .patch()
        .json<Supplier>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUPPLIERS_KEY }),
  })
}

export function useDeleteSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.url(`/api/v1/suppliers/${id}`).delete().res(),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUPPLIERS_KEY }),
  })
}
