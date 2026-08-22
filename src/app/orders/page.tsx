import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOrdersForUser } from '@/lib/data/storefront'

export default async function OrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const orders = await getOrdersForUser(user.id)

  return (
    <main className="page-shell">
      <div className="page-container max-w-6xl">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Account</p>
          <h1 className="mt-2 text-4xl font-black text-dark">Order history</h1>
        </div>

        {orders.length === 0 ? (
          <div className="content-panel flex min-h-[18rem] items-center justify-center text-center">
            <div className="space-y-4">
              <p className="text-lg font-bold text-dark/70">You do not have any orders yet.</p>
              <Link href="/products" className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-black text-white hover:bg-brand-dark">
                Start shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="block rounded-[2rem] border border-dark/10 bg-highlights p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-dark/50">{order.order_number}</p>
                    <p className="mt-2 text-xl font-black text-dark">
                      {new Date(order.created_at).toLocaleDateString('en-PH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-dark/70">
                    <span className="rounded-full bg-cream px-3 py-1">{order.status}</span>
                    <span className="rounded-full bg-cream px-3 py-1">{order.payment_status}</span>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-dark/50">Total</p>
                    <p className="text-2xl font-black text-dark">₱{Number(order.total_amount).toLocaleString('en-PH')}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
