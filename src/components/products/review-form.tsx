'use client'

import { useActionState } from 'react'
import { createProductReview, type ReviewFormState } from '@/lib/actions/reviews'

const initialState: ReviewFormState = { error: null, success: null }

export default function ReviewForm({ productId }: { productId: string }) {
  const action = createProductReview.bind(null, productId)
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="mt-5 border-t border-dark/10 pt-5">
      <h3 className="text-sm font-black uppercase text-dark">Leave a review</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-[10rem_1fr_auto] sm:items-end">
        <label className="text-xs font-bold text-dark/70">
          Rating
          <select
            name="rating"
            defaultValue="5"
            className="mt-1 block w-full rounded-xl border border-dark/20 bg-paper px-3 py-2 text-sm font-semibold text-dark focus:border-brand focus:outline-none"
          >
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </label>
        <label className="text-xs font-bold text-dark/70">
          Your review
          <textarea
            name="comment"
            required
            minLength={10}
            maxLength={1000}
            rows={2}
            placeholder="What did you think?"
            className="mt-1 block w-full rounded-xl border border-dark/20 bg-paper px-3 py-2 text-sm font-semibold text-dark placeholder:text-dark/40 focus:border-brand focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand px-5 py-2.5 text-xs font-black text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? 'Posting...' : 'Post review'}
        </button>
      </div>
      {state.error && <p role="alert" className="mt-2 text-xs font-bold text-red-600">{state.error}</p>}
      {state.success && <p role="status" className="mt-2 text-xs font-bold text-green-700">{state.success}</p>}
    </form>
  )
}
