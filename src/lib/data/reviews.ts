import { createClient } from '@/lib/supabase/server'

export interface ProductReview {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string
  created_at: string
  reviewer_name: string
}

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_reviews')
    .select('id, product_id, user_id, rating, comment, created_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((review) => ({
    id: review.id,
    product_id: review.product_id,
    user_id: review.user_id,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    reviewer_name: 'Berry Co. customer',
  })) as ProductReview[]
}
