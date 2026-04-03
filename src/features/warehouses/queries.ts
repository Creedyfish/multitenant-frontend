import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, buildUrl } from '@/lib/api-client'
import type {
  Warehouse,
  CreateWarehousePayload,
  UpdateWarehousePayload,
  StockLevelDetail,
} from './types'

export const warehouseKeys = {
  all: ['warehouses'] as const,
  list: () => ['warehouses', 'list'] as const,
  detail: (id: string) => ['warehouses', 'detail', id] as const,
}

export function useWarehouses() {
  return useQuery({
    queryKey: warehouseKeys.list(),
    queryFn: () =>
      apiClient.url('/api/v1/warehouses').get().json<Warehouse[]>(),
    staleTime: 30 * 60 * 1000,
  })
}

export function useWarehouseStock(warehouseId: string | null) {
  return useQuery({
    queryKey: ['stock-levels', 'warehouse', warehouseId],
    queryFn: () =>
      apiClient
        .url(
          buildUrl('/api/v1/stock_movements/levels', {
            warehouse_id: warehouseId!,
            include_product: true,
          }),
        )
        .get()
        .json<StockLevelDetail[]>(),
    enabled: !!warehouseId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateWarehousePayload) =>
      apiClient
        .url('/api/v1/warehouses')
        .json(payload)
        .post()
        .json<Warehouse>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all })
    },
  })
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateWarehousePayload
    }) =>
      apiClient
        .url(`/api/v1/warehouses/${id}`)
        .json(payload)
        .patch()
        .json<Warehouse>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all })
    },
  })
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.url(`/api/v1/warehouses/${id}`).delete().res(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all })
    },
  })
}
