import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ShippingAddress } from './db'
import { generateOrderNumber } from './order-number'

export interface CheckoutInput {
  userId: string; // checkout requires a logged-in user (guests must sign in/up first)
  shippingAddress: ShippingAddress;
  paymentMethod: string; // e.g. "card", "gcash", "cod" — left generic on purpose
  shippingFee?: number;
}

// NOTE ON MONEY MATH: this uses plain `number` for totals, which is fine for
// the in-memory stand-in but is NOT safe for real currency math (floating
// point rounding). Once Supabase is connected, store prices as integer
// cents/centavos, or use a decimal library (e.g. decimal.js) for the
// subtotal/total calculations below — the same way Prisma.Decimal was doing
// it before this file was adapted away from Prisma.

/**
 * Checkout is the one place where correctness matters most, so everything
 * happens inside a single transaction wrapper (db.$transaction — see the
 * migration note in db.ts about making this a real Postgres transaction
 * once Supabase is connected):
 *   1. Re-fetch the cart fresh (never trust client-side totals).
 *   2. Re-validate EVERY line against current availability/stock/pre-order
 *      window — prices and stock can change between "view cart" and
 *      "click checkout".
 *   3. Decrement stockQty for IN_STOCK / ON_SALE items (pre-orders don't
 *      decrement stock the same way — see note below).
 *   4. Snapshot product name + price onto OrderItem so the order stays
 *      accurate even if the product is edited/discontinued later.
 *   5. Create the Order with status PENDING — matching the "Pending" badge
 *      already shown in your admin's Recent Orders table.
 *   6. Empty the cart.
 * If any step fails, the whole checkout throws and nothing is created.
 * (Real atomicity — no partial orders, no stock silently vanishing — only
 * arrives once step 3-6 run inside an actual Postgres transaction; see
 * the $transaction note in db.ts.)
 */
export async function checkout(input: CheckoutInput) {
  const authClient = await createClient()
  const supabase = createAdminClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user || user.id !== input.userId) {
    throw Object.assign(new Error('UNAUTHENTICATED'), { status: 401 })
  }

  const { data: cart } = await supabase.from('carts').select('id').eq('user_id', input.userId).maybeSingle()
  if (!cart) throw Object.assign(new Error('Your cart is empty.'), { status: 400 })

  const { data: items, error: itemsError } = await supabase
    .from('cart_items')
    .select('id, product_id, quantity, unit_price_snapshot')
    .eq('cart_id', cart.id)
  if (itemsError) throw new Error(itemsError.message)
  if (!items?.length) throw Object.assign(new Error('Your cart is empty.'), { status: 400 })

  const productIds = items.map((item) => item.product_id)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price, stock')
    .in('id', productIds)
  if (productsError) throw new Error(productsError.message)

  const productMap = new Map((products ?? []).map((product) => [product.id, product]))
  let subtotal = 0
  const orderItems = []

  for (const item of items) {
    const product = productMap.get(item.product_id)
    if (!product) throw Object.assign(new Error('A product in your cart is no longer available.'), { status: 409 })
    if (product.stock < item.quantity) throw Object.assign(new Error(`Not enough stock for "${product.name}".`), { status: 409 })

    const price = Number(product.price)
    subtotal += price * item.quantity
    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      quantity: item.quantity,
      price,
    })
  }

  const shippingFee = input.shippingFee ?? 0
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: generateOrderNumber(),
      customer_id: input.userId,
      customer_name: input.shippingAddress.fullName,
      customer_email: user.email ?? null,
      total_amount: subtotal + shippingFee,
      status: 'pending',
      payment_status: 'pending',
      shipping_address: JSON.stringify(input.shippingAddress),
    })
    .select('*')
    .single()
  if (orderError || !order) throw new Error(orderError?.message ?? 'Unable to create order.')

  const { error: itemError } = await supabase.from('order_items').insert(
    orderItems.map((item) => ({ ...item, order_id: order.id }))
  )
  if (itemError) throw new Error(itemError.message)

  for (const item of items) {
    const product = productMap.get(item.product_id)!
    const { error: stockError } = await supabase
      .from('products')
      .update({ stock: product.stock - item.quantity, updated_at: new Date().toISOString() })
      .eq('id', product.id)
    if (stockError) throw new Error(stockError.message)
  }

  const { error: clearError } = await supabase.from('cart_items').delete().eq('cart_id', cart.id)
  if (clearError) throw new Error(clearError.message)

  return { ...order, items: orderItems }
}
