'use client'

import { useActionState } from 'react'
import { setStock } from '@/lib/actions/action-products'
import type { ProductWithCategory } from '@/types/database'

export default function StockAdjust({
  product,
}: {
  product: ProductWithCategory
}) {
  const setProductStock = setStock.bind(null, product.id)
  const [state, formAction, pending] = useActionState(setProductStock, { error: null })

  return (
    <form action={formAction} className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-stone-900">Stock</h2>
          <p className="text-sm text-stone-500">Update the available quantity for this product.</p>
        </div>
        <span className="text-sm text-stone-500">Current: {product.stock}</span>
      </div>

      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <div className="flex max-w-sm items-end gap-3">
        <div className="flex-1">
          <label htmlFor="stock" className="mb-1.5 block text-sm font-medium text-stone-700">
            Stock quantity
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={product.stock}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-800 focus:border-[#d9483a] focus:outline-none focus:ring-2 focus:ring-[#d9483a]/20"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#d9483a] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c23f32] disabled:opacity-70"
        >
          {pending ? 'Saving...' : 'Update stock'}
        </button>
      </div>
    </form>
  )
}