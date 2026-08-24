'use client'

import { useState } from 'react'
import type { CategoryNode } from '@/lib/data/data-products'

const selectClass =
  'w-full rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-800 focus:border-[#d9483a] focus:outline-none focus:ring-2 focus:ring-[#d9483a]/20'

export default function CategoryFields({
  categories,
  defaultValue,
}: {
  categories: CategoryNode[]
  defaultValue?: string
}) {
  const initialCategory = categories.some((category) =>
    category.children.some((subcategory) => subcategory.id === defaultValue)
  )
    ? categories.find((category) =>
        category.children.some((subcategory) => subcategory.id === defaultValue)
      )?.id ?? ''
    : ''
  const [categoryId, setCategoryId] = useState(initialCategory)
  const subcategories = categories.find((category) => category.id === categoryId)?.children ?? []

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="category_id" className="mb-1.5 block text-sm font-medium text-stone-700">
          Category
        </label>
        <select
          id="category_id"
          name="category_id"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className={selectClass}
        >
          <option value="">Select a category...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="subcategory_id" className="mb-1.5 block text-sm font-medium text-stone-700">
          Subcategory
        </label>
        <select
          id="subcategory_id"
          name="subcategory_id"
          defaultValue={defaultValue ?? ''}
          disabled={!categoryId}
          className={selectClass}
        >
          <option value="">Select a subcategory...</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}