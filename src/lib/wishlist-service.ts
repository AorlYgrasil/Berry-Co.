import { createClient } from '@/lib/supabase/server'

/**
 * Wishlist is intentionally simple: it's a save-for-later list, not tied to
 * price or stock validation (unlike Cart). A user can wishlist an
 * out-of-stock or future pre-order item — that's the point of a wishlist.
 */

export async function getOrCreateWishlist(userId: string) {
  const supabase = await createClient()
  const { data: existing, error: lookupError } = await supabase
    .from('wishlists')
    .select('id, user_id, created_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (lookupError) throw new Error(lookupError.message)
  if (existing) return existing

  const { data: created, error: createError } = await supabase
    .from('wishlists')
    .insert({ user_id: userId })
    .select('id, user_id, created_at')
    .single()

  if (createError || !created) throw new Error(createError?.message ?? 'Unable to create wishlist.')
  return created
}

export async function getWishlist(userId: string) {
  const wishlist = await getOrCreateWishlist(userId);
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('id, wishlist_id, product_id, added_at, products(id, name, price, image_url)')
    .eq('wishlist_id', wishlist.id)
    .order('added_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function addToWishlist(userId: string, productId: string) {
  const supabase = await createClient()
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id')
    .eq('id', productId)
    .maybeSingle()
  if (productError || !product) throw Object.assign(new Error('PRODUCT_NOT_FOUND'), { status: 404 })

  const wishlist = await getOrCreateWishlist(userId);
  const { data: existing } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('wishlist_id', wishlist.id)
    .eq('product_id', productId)
    .maybeSingle()
  if (existing) return existing

  const { data: item, error } = await supabase
    .from('wishlist_items')
    .insert({ wishlist_id: wishlist.id, product_id: productId })
    .select('id, wishlist_id, product_id, added_at')
    .single()
  if (error || !item) throw new Error(error?.message ?? 'Unable to save wishlist item.')
  return item
}

export async function removeFromWishlist(userId: string, productId: string) {
  const wishlist = await getOrCreateWishlist(userId);
  const supabase = await createClient()
  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('wishlist_id', wishlist.id)
    .eq('product_id', productId)
  if (error) throw new Error(error.message)
}

/** Used to move a saved item straight into the cart ("Move to Cart" UX). */
export async function isProductWishlisted(userId: string, productId: string) {
  const wishlist = await getOrCreateWishlist(userId);
  const supabase = await createClient()
  const { data: item } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('wishlist_id', wishlist.id)
    .eq('product_id', productId)
    .maybeSingle()
  return Boolean(item);
}
