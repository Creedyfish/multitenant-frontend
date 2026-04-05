import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type {
  LedgerFilters,
  StockAdjustPayload,
  StockInPayload,
  StockMovement,
  StockOutPayload,
  StockTransferPayload,
  StockLevel,
} from './types'

// ── Query keys ────────────────────────────────────────────────────────────────

export const stockMovementKeys = {
  all: ['stock-movements'] as const,
  ledger: (filters: LedgerFilters) =>
    ['stock-movements', 'ledger', filters] as const,
  levels: ['stock-levels'] as const,
}

// ── Ledger (read) ─────────────────────────────────────────────────────────────

export function useStockLedger(filters: LedgerFilters) {
  return useQuery({
    queryKey: stockMovementKeys.ledger(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('skip', String(filters.offset))
      params.set('limit', String(filters.limit))
      if (filters.type) params.set('type', filters.type)
      if (filters.product_id) params.set('product_id', filters.product_id)
      if (filters.warehouse_id) params.set('warehouse_id', filters.warehouse_id)
      if (filters.start_date) params.set('start_date', filters.start_date)
      if (filters.end_date) params.set('end_date', filters.end_date)

      return apiClient
        .url(`/stock_movements/ledger?${params.toString()}`)
        .get()
        .json<StockMovement[]>()
    },
  })
}

export function useStockLevels() {
  return useQuery({
    queryKey: stockMovementKeys.levels,
    queryFn: () =>
      apiClient
        .url('/stock_movements/levels?include_product=true')
        .get()
        .json<StockLevel[]>(),
    staleTime: 30_000,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

function invalidateLedger(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: stockMovementKeys.all })
  qc.invalidateQueries({ queryKey: stockMovementKeys.levels })
}

export function useStockIn() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: StockInPayload) =>
      apiClient
        .url('/stock_movements/in')
        .json(payload)
        .post()
        .json<StockMovement>(),
    onSuccess: () => invalidateLedger(qc),
  })
}

export function useStockOut() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: StockOutPayload) =>
      apiClient
        .url('/stock_movements/out')
        .json(payload)
        .post()
        .json<StockMovement>(),
    onSuccess: () => invalidateLedger(qc),
  })
}

export function useStockTransfer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: StockTransferPayload) =>
      apiClient
        .url('/stock_movements/transfer')
        .json(payload)
        .post()
        .json<StockMovement[]>(),
    onSuccess: () => invalidateLedger(qc),
  })
}

export function useStockAdjust() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: StockAdjustPayload) =>
      apiClient
        .url('/stock_movements/adjust')
        .json(payload)
        .post()
        .json<StockMovement>(),
    onSuccess: () => invalidateLedger(qc),
  })
}
