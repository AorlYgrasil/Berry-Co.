import { createClient } from '@/lib/supabase/server'
import type { DashboardStats, Order } from '@/types/database'

const EMPTY_STATS: DashboardStats = {
  totalProducts: 0,
  ordersToday: 0,
  lowStockItems: 0,
  revenueLast30Days: 0,
}

/**
 * Pulls the four dashboard stat cards from Supabase.
 * Each query is checked independently — if a table (like "products" or
 * "orders") doesn't exist yet, that one stat quietly falls back to 0
 * instead of breaking the whole dashboard.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()
  const stats = { ...EMPTY_STATS }

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [productsCount, ordersTodayCount, lowStockCount, revenueRows] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfToday.toISOString()),
    // Adjust the stock threshold to whatever counts as "low" for your catalog.
    supabase.from('products').select('*', { count: 'exact', head: true }).lte('stock', 5),
    supabase.from('orders').select('total').gte('created_at', thirtyDaysAgo.toISOString()),
  ])

  if (!productsCount.error) stats.totalProducts = productsCount.count ?? 0
  if (!ordersTodayCount.error) stats.ordersToday = ordersTodayCount.count ?? 0
  if (!lowStockCount.error) stats.lowStockItems = lowStockCount.count ?? 0
  if (!revenueRows.error) {
    stats.revenueLast30Days = (revenueRows.data ?? []).reduce(
      (sum, row) => sum + Number(row.total ?? 0),
      0
    )
  }

  return stats
}

export async function getRecentOrders(limit = 5): Promise<Order[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data as Order[]
}