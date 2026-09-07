import { buildCategoryTree, getCategories, getProductMetadataOptions } from '@/lib/data/data-products'
import { createProduct } from '@/lib/actions/action-products'
import ProductForm from '@/components/admin/products/product-form'

export default async function NewProductPage() {
  const [categories, metadata] = await Promise.all([
    getCategories().then(buildCategoryTree),
    getProductMetadataOptions(),
  ])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Add Product</h1>
        <p className="text-sm text-stone-500">Add a new item to your catalog.</p>
      </div>
      <ProductForm action={createProduct} categories={categories} metadata={metadata} submitLabel="Add Product" />
    </div>
  )
}