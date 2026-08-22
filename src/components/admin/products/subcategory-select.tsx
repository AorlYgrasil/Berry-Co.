import type { CategoryNode } from '@/lib/data/data-products'

const defaultClass =
  'w-full rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-800 focus:border-[#d9483a] focus:outline-none focus:ring-2 focus:ring-[#d9483a]/20'

export default function SubcategorySelect({
  categories,
  className,
}: {
  categories: CategoryNode[]
  className?: string
}) {
  return (
    <select id="subcategory_id" name="subcategory_id" defaultValue="" className={className ?? defaultClass}>
      <option value="">Select a subcategory…</option>
      {categories.flatMap((top) =>
        top.children.map((subcategory) => (
          <option key={subcategory.id} value={subcategory.id}>
            {top.name} — {subcategory.name}
          </option>
        ))
      )}
    </select>
  )
}
