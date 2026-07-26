// Hand-written types to match your Supabase schema. Once your tables are
// finalized, you can replace this file entirely with generated types:
//   npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts

export type UserRole = 'admin' | 'staff' | 'customer'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  category_id: string | null
  created_at: string
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

export interface Order {
  id: string
  customer_id: string | null
  customer_name: string
  total: number
  status: OrderStatus
  created_at: string
}

export interface DashboardStats {
  totalProducts: number
  ordersToday: number
  lowStockItems: number
  revenueLast30Days: number
}