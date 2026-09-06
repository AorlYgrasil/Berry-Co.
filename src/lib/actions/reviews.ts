'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ReviewFormState = { error: string | null; success: string | null }

export async function createProductReview(
  productId: string,
  _previousState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const rating = Number(formData.get('rating'))
  const comment = String(formData.get('comment') ?? '').trim()

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: 'Choose a rating from 1 to 5 stars.', success: null }
  }
  if (comment.length < 10 || comment.length > 1000) {
    return { error: 'Your review must be between 10 and 1000 characters.', success: null }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Please sign in to leave a review.', success: null }

  const { error } = await supabase.from('product_reviews').insert({
    product_id: productId,
    user_id: user.id,
    rating,
    comment,
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'You have already reviewed this product.', success: null }
    }
    if (error.code === '23503') {
      return { error: 'This product is no longer available.', success: null }
    }
    return { error: error.message, success: null }
  }

  revalidatePath(`/products/${productId}`)
  return { error: null, success: 'Thanks for sharing your review.' }
}
