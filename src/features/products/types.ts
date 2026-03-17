export interface Product {
  id: string
  org_id: string
  sku: string
  name: string
  description: string | null
  category: string | null
  min_stock_level: number
  created_at: string
  updated_at: string
}

export interface PagedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

export interface CreateProductPayload {
  sku: string
  name: string
  description?: string
  category?: string
  min_stock_level?: number
}
