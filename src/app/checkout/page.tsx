import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCustomerCart } from '@/lib/data/storefront'
import CheckoutForm from '@/components/storefront/checkout-form'

export default async function CheckoutPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const cart = await getCustomerCart(user.id)

  return (
    <main className="page-shell">
      <div className="page-container max-w-6xl">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Checkout</p>
          <h1 className="mt-2 text-4xl font-black text-dark">Complete your order</h1>
        </div>

        {cart.itemCount === 0 ? (
          <div className="content-panel flex min-h-[22rem] items-center justify-center text-center">
            <div className="space-y-5">
              <p className="text-sm font-semibold text-dark/70">Your cart is empty.</p>
              <Link href="/products" className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-black text-white hover:bg-brand-dark">
                Explore products
              </Link>
            </div>
          </div>
        ) : (
          <CheckoutForm cart={cart} userEmail={user.email ?? 'customer@berryco.test'} />
        )}
      </div>
    </main>
  )
}
