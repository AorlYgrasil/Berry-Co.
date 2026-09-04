import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCustomerCart, getWishlistForUser } from '@/lib/data/storefront'
import WishlistItemActions from '@/components/storefront/wishlist-item-actions'
import WishlistCartAction from '@/components/storefront/wishlist-cart-action'

export default async function WishlistPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [items, cart] = await Promise.all([
    getWishlistForUser(user.id),
    getCustomerCart(user.id),
  ])
  const cartProductIds = new Set(cart.items.map((item) => item.product_id))

  return (
    <main className="page-shell">
      <div className="page-container max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Saved items</p>
            <h1 className="mt-2 text-4xl font-black text-dark">Wishlist</h1>
          </div>
          <Link href="/products" className="rounded-full border border-dark/20 bg-paper px-4 py-2 text-sm font-black text-dark hover:border-brand hover:text-brand">
            Browse products
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="content-panel flex min-h-[20rem] items-center justify-center text-center">
            <div className="space-y-4">
              <p className="text-lg font-bold text-dark/70">Your wishlist is empty.</p>
              <Link href="/products" className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-black text-white hover:bg-brand-dark">
                Explore products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-[2rem] border border-dark/10 bg-highlights p-4 shadow-sm">
                <div className="flex h-52 items-center justify-center overflow-hidden rounded-[1.5rem] bg-cream text-xs font-black uppercase tracking-[0.2em] text-dark/40">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    'No product image available'
                  )}
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-dark/60">Saved item</p>
                    <h2 className="text-xl font-black text-dark">{item.product_name}</h2>
                  </div>
                  <p className="text-xl font-black text-dark">₱{item.price.toLocaleString('en-PH')}</p>
                  <div className="flex items-stretch gap-3">
                    <WishlistItemActions productId={item.product_id} />
                    <WishlistCartAction
                      productId={item.product_id}
                      initialInCart={cartProductIds.has(item.product_id)}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
