export interface Warehouse {
  id: string
  org_id: string
  name: string
  location: string
  capacity: number | null
  created_at: string
}

export interface CreateWarehousePayload {
  name: string
  location: string
  capacity?: number
}

export interface UpdateWarehousePayload {
  name?: string
  location?: string
  capacity?: number
}

export interface StockLevelDetail {
  product_id: string
  warehouse_id: string
  current_stock: number
  product_name: string
  product_sku: string
  min_stock_level: number
}
