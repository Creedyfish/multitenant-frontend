import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { AuditLog, AuditLogFilters } from './types'

const AUDIT_LOGS_KEY = 'audit-logs'

function buildParams(filters: AuditLogFilters): Record<string, string> {
  const params: Record<string, string> = {
    skip: String(filters.skip),
    limit: String(filters.limit),
  }
  if (filters.entity) params.entity = filters.entity
  if (filters.entity_id) params.entity_id = filters.entity_id
  if (filters.actor_id) params.actor_id = filters.actor_id
  if (filters.action) params.action = filters.action
  if (filters.start_date) params.start_date = filters.start_date
  if (filters.end_date) params.end_date = filters.end_date
  return params
}

export function useAuditLogs(filters: AuditLogFilters) {
  return useQuery({
    queryKey: [AUDIT_LOGS_KEY, filters],
    queryFn: () => {
      const params = buildParams(filters)
      const queryString = new URLSearchParams(params).toString()
      return apiClient
        .url(`/audit_logs?${queryString}`)
        .get()
        .json<AuditLog[]>()
    },
  })
}

export function useAuditLog(id: string) {
  return useQuery({
    queryKey: [AUDIT_LOGS_KEY, id],
    queryFn: () => apiClient.url(`/audit_logs/${id}`).get().json<AuditLog>(),
    enabled: Boolean(id),
  })
}
