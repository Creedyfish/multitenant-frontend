/**
 * features/dashboard/queries.ts
 *
 * TanStack Query hooks for dashboard KPI cards.
 * Each hook fetches only what's needed (limit=1 for counts via `total`,
 * no pagination for warehouses since it returns a plain array).
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient, buildUrl } from '@/lib/api-client'

// ─── Response Types ────────────────────────────────────────────────────────────

/** Paginated list shape returned by /products and /purchase_requests */
interface PagedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

interface Product {
  id: string
  sku: string
  name: string
  category: string
  min_stock_level: number
  org_id: string
  created_at: string
  updated_at: string
}

interface PurchaseRequest {
  id: string
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'ORDERED'
  org_id: string
  created_at: string
}

interface Warehouse {
  id: string
  name: string
  location: string
  capacity: number
  org_id: string
  created_at: string
}

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const dashboardKeys = {
  all: ['dashboard'] as const,
  productCount: () => [...dashboardKeys.all, 'product-count'] as const,
  pendingPrCount: () => [...dashboardKeys.all, 'pending-pr-count'] as const,
  warehouseCount: () => [...dashboardKeys.all, 'warehouse-count'] as const,
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────

/** Total number of products in the org */
export function useProductCount() {
  return useQuery({
    queryKey: dashboardKeys.productCount(),
    queryFn: () =>
      apiClient
        .url(buildUrl('/api/v1/products', { limit: 1, offset: 0 }))
        .get()
        .json<PagedResponse<Product>>(),
    select: (data) => data.total,
    staleTime: 5 * 60 * 1000, // 5 min — product counts don't change often
  })
}

/** Number of purchase requests with status SUBMITTED (awaiting approval) */
export function usePendingPrCount() {
  return useQuery({
    queryKey: dashboardKeys.pendingPrCount(),
    queryFn: () =>
      apiClient
        .url(
          buildUrl('/api/v1/purchase_requests', {
            status: 'SUBMITTED',
            limit: 1,
            skip: 0,
          }),
        )
        .get()
        .json<PagedResponse<PurchaseRequest>>(),
    select: (data) => data.total,
    staleTime: 60 * 1000, // 1 min — PRs change more frequently
  })
}

/** Total number of warehouses in the org (plain array, no pagination) */
export function useWarehouseCount() {
  return useQuery({
    queryKey: dashboardKeys.warehouseCount(),
    queryFn: () =>
      apiClient.url('/api/v1/warehouses').get().json<Warehouse[]>(),
    select: (data) => data.length,
    staleTime: 30 * 60 * 1000, // 30 min — warehouses rarely change
  })
}
