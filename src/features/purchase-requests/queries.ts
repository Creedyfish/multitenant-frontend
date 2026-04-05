import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type {
  PurchaseRequest,
  PurchaseRequestListItem,
  CreatePRPayload,
  UpdatePRPayload,
  RejectPRPayload,
  ReceivePRPayload,
  PRStatus,
} from './types'

// ─── Query keys ───────────────────────────────────────────────────────────────

export const prKeys = {
  all: ['purchase_requests'] as const,
  list: (params: Record<string, unknown>) =>
    [...prKeys.all, 'list', params] as const,
  detail: (id: string) => [...prKeys.all, 'detail', id] as const,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildUrl(
  base: string,
  params: Record<string, string | number | undefined>,
): string {
  const url = new URL(base, 'http://x')
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') url.searchParams.set(k, String(v))
  }
  return url.pathname + url.search
}

// ─── Queries ──────────────────────────────────────────────────────────────────

interface UsePurchaseRequestsParams {
  status?: PRStatus | 'ALL'
  limit?: number
  skip?: number
}

export function usePurchaseRequests(params: UsePurchaseRequestsParams = {}) {
  const { status, limit = 20, skip = 0 } = params

  return useQuery({
    queryKey: prKeys.list({ status, limit, skip }),
    queryFn: () => {
      const url = buildUrl('/api/v1/purchase_requests', {
        limit,
        skip,
        ...(status && status !== 'ALL' ? { status } : {}),
      })
      return apiClient.get(url).json<PurchaseRequestListItem[]>()
    },
  })
}

export function usePurchaseRequest(id: string) {
  return useQuery({
    queryKey: prKeys.detail(id),
    queryFn: () =>
      apiClient.get(`/api/v1/purchase_requests/${id}`).json<PurchaseRequest>(),
    enabled: !!id,
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreatePR() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePRPayload) =>
      apiClient
        .url('/api/v1/purchase_requests')
        .json(payload)
        .post()
        .json<PurchaseRequest>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: prKeys.all }),
  })
}

export function useUpdatePR() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePRPayload }) =>
      apiClient
        .url(`/api/v1/purchase_requests/${id}`)
        .json(payload)
        .patch()
        .json<PurchaseRequest>(),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: prKeys.all })
      qc.invalidateQueries({ queryKey: prKeys.detail(id) })
    },
  })
}

export function useDeletePR() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.url(`/api/v1/purchase_requests/${id}`).delete().res(),
    onSuccess: () => qc.invalidateQueries({ queryKey: prKeys.all }),
  })
}

export function useSubmitPR() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient
        .url(`/api/v1/purchase_requests/${id}/submit`)
        .post()
        .json<PurchaseRequest>(),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: prKeys.all })
      qc.invalidateQueries({ queryKey: prKeys.detail(id) })
    },
  })
}

export function useApprovePR() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient
        .url(`/api/v1/purchase_requests/${id}/approve`)
        .post()
        .json<PurchaseRequest>(),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: prKeys.all })
      qc.invalidateQueries({ queryKey: prKeys.detail(id) })
    },
  })
}

export function useRejectPR() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectPRPayload }) =>
      apiClient
        .url(`/api/v1/purchase_requests/${id}/reject`)
        .json(payload)
        .post()
        .json<PurchaseRequest>(),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: prKeys.all })
      qc.invalidateQueries({ queryKey: prKeys.detail(id) })
    },
  })
}

export function useMarkOrderedPR() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient
        .url(`/api/v1/purchase_requests/${id}/mark-ordered`)
        .post()
        .json<PurchaseRequest>(),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: prKeys.all })
      qc.invalidateQueries({ queryKey: prKeys.detail(id) })
    },
  })
}

export function useReceivePR() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReceivePRPayload }) =>
      apiClient
        .url(`/api/v1/purchase_requests/${id}/receive`)
        .json(payload)
        .post()
        .json<PurchaseRequest>(),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: prKeys.all })
      qc.invalidateQueries({ queryKey: prKeys.detail(id) })
    },
  })
}
