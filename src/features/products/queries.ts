import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, buildUrl } from '@/lib/api-client'
import type { Product, PagedResponse, CreateProductPayload } from './types'

export const productKeys = {
  all: ['products'] as const,
  list: (params: ProductListParams) => ['products', 'list', params] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
}

export interface ProductListParams {
  limit?: number
  offset?: number
  search?: string
}

export function useProducts(params: ProductListParams = {}) {
  const { limit = 20, offset = 0, search } = params
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () =>
      apiClient
        .url(buildUrl('/api/v1/products', { limit, offset, search }))
        .get()
        .json<PagedResponse<Product>>(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      apiClient
        .url('/api/v1/products')
        .json(payload)
        .post()
        .json<{ success: boolean; data: Product }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.url(`/api/v1/products/${id}`).delete().res(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}

export interface UpdateProductPayload {
  sku?: string
  name?: string
  description?: string
  category?: string
  min_stock_level?: number
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateProductPayload
    }) =>
      apiClient
        .url(`/api/v1/products/${id}`)
        .json(payload)
        .patch()
        .json<{ success: boolean; data: Product }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}
