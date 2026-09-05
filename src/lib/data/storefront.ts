import { createClient } from '@/lib/supabase/server'

export interface StorefrontCartItem {
  id: string
  product_id: string
  product_name: string
  price: number
  image_url: string | null
  quantity: number
  unit_price_snapshot: number
}

export interface StorefrontWishlistItem {
  id: string
  product_id: string
  product_name: string
  price: number
  image_url: string | null
}

export interface StorefrontOrder {
  id: string
  order_number: string
  total_amount: number
  customer_name: string
  status: string
  payment_status: string
  created_at: string
  shipping_address: string | null
  items: StorefrontOrderItem[]
}

export interface StorefrontOrderItem {
  id: string
  product_id: string | null
  product_name: string
  quantity: number
  price: number
  image_url: string | null
}

export async function getCustomerCart(userId: string) {
  const supabase = await createClient()

  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (cartError) throw new Error(cartError.message)
  if (!cart) {
    return { items: [] as StorefrontCartItem[], subtotal: 0, itemCount: 0 }
  }

  const { data: cartItems, error: itemsError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cart.id)

  if (itemsError) throw new Error(itemsError.message)

  const productIds = Array.from(new Set((cartItems ?? []).map((item) => item.product_id)))
  const productMap = new Map<string, { name: string; price: number; image_url: string | null }>()

  if (productIds.length > 0) {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, image_url')
      .in('id', productIds)

    if (productsError) throw new Error(productsError.message)

    for (const product of products ?? []) {
      productMap.set(product.id, {
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
      })
    }
  }

  const items = (cartItems ?? []).map((item) => {
    const product = productMap.get(item.product_id)

    return {
      id: item.id,
      product_id: item.product_id,
      product_name: product?.name ?? 'Product unavailable',
      price: product?.price ?? Number(item.unit_price_snapshot),
      image_url: product?.image_url ?? null,
      quantity: item.quantity,
      unit_price_snapshot: Number(item.unit_price_snapshot),
    } satisfies StorefrontCartItem
  })

  const subtotal = items.reduce((sum, item) => sum + item.unit_price_snapshot * item.quantity, 0)

  return { items, subtotal, itemCount: items.length }
}

export async function getWishlistForUser(userId: string) {
  const supabase = await createClient()

  const { data: wishlist, error: wishlistError } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (wishlistError) throw new Error(wishlistError.message)
  if (!wishlist) return [] as StorefrontWishlistItem[]

  const { data: wishlistItems, error: itemsError } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('wishlist_id', wishlist.id)

  if (itemsError) throw new Error(itemsError.message)

  const productIds = Array.from(new Set((wishlistItems ?? []).map((item) => item.product_id)))
  const productMap = new Map<string, { name: string; price: number; image_url: string | null }>()

  if (productIds.length > 0) {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, image_url')
      .in('id', productIds)

    if (productsError) throw new Error(productsError.message)

    for (const product of products ?? []) {
      productMap.set(product.id, {
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
      })
    }
  }

  return (wishlistItems ?? []).map((item) => {
    const product = productMap.get(item.product_id)
    return {
      id: item.id,
      product_id: item.product_id,
      product_name: product?.name ?? 'Product unavailable',
      price: product?.price ?? 0,
      image_url: product?.image_url ?? null,
    } satisfies StorefrontWishlistItem
  })
}

export async function getOrdersForUser(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', userId)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  const orders = data ?? []
  if (orders.length === 0) return [] as StorefrontOrder[]

  const orderIds = orders.map((order) => order.id)
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('id, order_id, product_id, product_name, quantity, price')
    .in('order_id', orderIds)

  if (itemsError) throw new Error(itemsError.message)

  const productIds = Array.from(new Set((orderItems ?? [])
    .map((item) => item.product_id)
    .filter((id): id is string => Boolean(id))))
  const productMap = new Map<string, string | null>()

  if (productIds.length > 0) {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, image_url')
      .in('id', productIds)

    if (productsError) throw new Error(productsError.message)
    for (const product of products ?? []) productMap.set(product.id, product.image_url)
  }

  const itemsByOrder = new Map<string, StorefrontOrderItem[]>()
  for (const item of orderItems ?? []) {
    const orderItem: StorefrontOrderItem = {
      id: item.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: Number(item.price),
      image_url: item.product_id ? productMap.get(item.product_id) ?? null : null,
    }
    const currentItems = itemsByOrder.get(item.order_id) ?? []
    currentItems.push(orderItem)
    itemsByOrder.set(item.order_id, currentItems)
  }

  return orders.map((order) => ({
    ...order,
    total_amount: Number(order.total_amount),
    items: itemsByOrder.get(order.id) ?? [],
  })) as StorefrontOrder[]
}

export async function getOrderCountForUser(userId: string) {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('customer_id', userId)
    .neq('status', 'cancelled')

  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function getOrderByIdForUser(userId: string, orderId: string) {
  const supabase = await createClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('customer_id', userId)
    .maybeSingle()

  if (orderError) throw new Error(orderError.message)
  if (!order) return null

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)

  if (itemsError) throw new Error(itemsError.message)

  const productIds = Array.from(new Set((items ?? [])
    .map((item) => item.product_id)
    .filter((id): id is string => Boolean(id))))
  const productMap = new Map<string, string | null>()

  if (productIds.length > 0) {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, image_url')
      .in('id', productIds)

    if (productsError) throw new Error(productsError.message)
    for (const product of products ?? []) productMap.set(product.id, product.image_url)
  }

  return {
    order: order as StorefrontOrder,
    items: (items ?? []).map((item) => ({
      id: item.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: Number(item.price),
      image_url: item.product_id ? productMap.get(item.product_id) ?? null : null,
    })),
  }
}
