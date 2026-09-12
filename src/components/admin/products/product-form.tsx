'use client'

import { useActionState } from 'react'
import CategoryFields from './category-fields'
import type { CategoryNode, ProductMetadataOptions } from '@/lib/data/data-products'
import type { ProductWithCategory } from '@/types/database'

type FormState = { error: string | null }

const inputClass =
  'w-full rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-[#d9483a] focus:outline-none focus:ring-2 focus:ring-[#d9483a]/20'

export default function ProductForm({
  action,
  categories,
  product,
  metadata,
  submitLabel = 'Save',
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>
  categories: CategoryNode[]
  product?: ProductWithCategory
  metadata: ProductMetadataOptions
  submitLabel?: string
}) {
  const [state, formAction, pending] = useActionState(action, { error: null })

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Product Name */}
        <div className="sm:col-span-2">
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-stone-700">
            Product name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
            className={inputClass}
          />
        </div>

        {/* Short Description */}
        <div className="sm:col-span-2">
          <label htmlFor="short_description" className="mb-1.5 block text-sm font-medium text-stone-700">
            Short Description / Subtitle
          </label>
          <input
            id="short_description"
            name="short_description"
            defaultValue={product?.short_description ?? ''}
            placeholder="e.g. Nendoroid Scale"
            className={inputClass}
          />
        </div>

        {/* Categories */}
        <div className="sm:col-span-2">
          <CategoryFields categories={categories} defaultValue={product?.category_id ?? undefined} />
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="brand_id" className="mb-1.5 block text-sm font-medium text-stone-700">
            Brand
          </label>
          <select id="brand_id" name="brand_id" defaultValue={product?.brand_id ?? ''} className={inputClass}>
            <option value="">Select a brand...</option>
            {metadata.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* Series */}
        <div>
          <label htmlFor="series_id" className="mb-1.5 block text-sm font-medium text-stone-700">
            Series
          </label>
          <select id="series_id" name="series_id" defaultValue={product?.series_id ?? ''} className={inputClass}>
            <option value="">Select a series...</option>
            {metadata.series.map((series) => (
              <option key={series.id} value={series.id}>{series.name}</option>
            ))}
          </select>
        </div>

        {/* Product Tags */}
        <fieldset className="sm:col-span-2">
          <legend className="mb-1.5 block text-sm font-medium text-stone-700">Product tags</legend>
          <div className="grid gap-2 rounded-xl border border-stone-300 bg-white p-3 sm:grid-cols-2">
            {metadata.tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  name="tag_ids"
                  value={tag.id}
                  defaultChecked={product?.tags?.includes(tag.name)}
                  className="accent-[#d9483a]"
                />
                {tag.name}
              </label>
            ))}
            {metadata.tags.length === 0 && (
              <span className="text-sm text-stone-400">No tags configured yet.</span>
            )}
          </div>
        </fieldset>

        {/* SKU */}
        {product ? (
          <div>
            <label htmlFor="sku" className="mb-1.5 block text-sm font-medium text-stone-700">
              SKU
            </label>
            <input
              id="sku"
              name="sku"
              defaultValue={product.sku}
              className={inputClass}
            />
          </div>
        ) : (
          <input type="hidden" name="sku" value="" />
        )}

        {/* Price */}
        <div>
          <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-stone-700">
            Price (₱)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price}
            className={inputClass}
          />
        </div>

        {/* Starting Stock (New Product only) */}
        {!product && (
          <div>
            <label htmlFor="stock" className="mb-1.5 block text-sm font-medium text-stone-700">
              Starting stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              defaultValue={0}
              className={inputClass}
            />
          </div>
        )}

        {/* Low Stock Alert */}
        <div>
          <label
            htmlFor="low_stock_threshold"
            className="mb-1.5 block text-sm font-medium text-stone-700"
          >
            Low stock alert at
          </label>
          <input
            id="low_stock_threshold"
            name="low_stock_threshold"
            type="number"
            min="0"
            defaultValue={product?.low_stock_threshold ?? 5}
            className={inputClass}
          />
        </div>

        {/* Pre-order and sale details */}
        <div>
          <label htmlFor="preorder_start_date" className="mb-1.5 block text-sm font-medium text-stone-700">
            Pre-order start date
          </label>
          <input
            id="preorder_start_date"
            name="preorder_start_date"
            type="date"
            defaultValue={product?.preorder_start_date?.slice(0, 10) ?? ''}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="preorder_end_date" className="mb-1.5 block text-sm font-medium text-stone-700">
            Pre-order end date
          </label>
          <input
            id="preorder_end_date"
            name="preorder_end_date"
            type="date"
            defaultValue={product?.preorder_end_date?.slice(0, 10) ?? ''}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="release_date" className="mb-1.5 block text-sm font-medium text-stone-700">
            Release date
          </label>
          <input
            id="release_date"
            name="release_date"
            type="date"
            defaultValue={product?.release_date?.slice(0, 10) ?? ''}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="sale_percentage" className="mb-1.5 block text-sm font-medium text-stone-700">
            Sale percentage
          </label>
          <div className="relative">
            <input
              id="sale_percentage"
              name="sale_percentage"
              type="number"
              min="0"
              max="100"
              step="1"
              defaultValue={product?.sale_percentage ?? ''}
              placeholder="e.g. 15"
              className={`${inputClass} pr-10`}
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-stone-400">%</span>
          </div>
        </div>

        {/* Cover Image URL */}
        <div className="sm:col-span-2">
          <label htmlFor="image_url" className="mb-1.5 block text-sm font-medium text-stone-700">
            Cover Image URL
          </label>
          <input
            id="image_url"
            name="image_url"
            defaultValue={product?.image_url ?? ''}
            className={inputClass}
          />
        </div>

        {/* Gallery Image URLs Array */}
        <div className="sm:col-span-2">
          <label htmlFor="image_urls" className="mb-1.5 block text-sm font-medium text-stone-700">
            Gallery Image URLs <span className="text-xs text-stone-400 font-normal">(One URL per line)</span>
          </label>
          <textarea
            id="image_urls"
            name="image_urls"
            rows={4}
            defaultValue={product?.image_urls?.join('\n') ?? ''}
            placeholder={`https://example.com/angle-1.jpg\nhttps://example.com/angle-2.jpg`}
            className={inputClass}
          />
        </div>

        {/* Full Description */}
        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-stone-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={product?.description ?? ''}
            className={inputClass}
          />
        </div>

        {/* Specifications */}
        <div className="sm:col-span-2">
          <label htmlFor="specifications" className="mb-1.5 block text-sm font-medium text-stone-700">
            Specifications
          </label>
          <textarea
            id="specifications"
            name="specifications"
            rows={3}
            defaultValue={product?.specifications ?? ''}
            placeholder="e.g. Painted ABS&PVC non-scale articulated figure with stand included. Approximately 100mm in height."
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 rounded-full bg-[#d9483a] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c23f32] disabled:opacity-70"
      >
        {pending && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {pending ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}