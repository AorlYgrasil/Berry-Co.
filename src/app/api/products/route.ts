import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/data/data-products'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const search = url.searchParams.get('search') ?? undefined
  const categoryId = url.searchParams.get('category') ?? undefined
  const status = url.searchParams.get('status') ?? undefined
  const page = Number(url.searchParams.get('page') ?? '1') || 1
  const pageSize = Number(url.searchParams.get('pageSize') ?? '20') || 20

  // 1. Fetch paginated products using your data helper
  const result = await getProducts({ search, categoryId, status: status as any, page, pageSize })

  // 2. Fetch active choices for the frontend sidebar filters
  const supabase = await createClient()
const [{ data: categories }, { data: brands }, { data: series }, { data: tags }] = await Promise.all([
  supabase.from('categories').select('name'),
  supabase.from('brands').select('name'),
  supabase.from('series').select('name'),
  supabase.from('tags').select('name'),
])

  // 3. Return products alongside the dynamic filter options
  return NextResponse.json({
    ...result,
    filterOptions: {
      categories: categories?.map((c) => c.name) ?? [],
      brands: brands?.map((b) => b.name) ?? [],
      series: series?.map((s) => s.name) ?? [],
      tags: tags?.map((t) => t.name) ?? [], 
    }
  })
}