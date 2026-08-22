import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOrderByIdForUser } from '@/lib/data/storefront'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const order = await getOrderByIdForUser(user.id, id)
  if (!order) redirect('/orders')

  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <main className="page-shell">
      <div className="page-container max-w-4xl">
        <div className="content-panel space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Order</p>
              <h1 className="mt-2 text-3xl font-black text-dark">{order.order.order_number}</h1>
            </div>
            <div className="rounded-full bg-cream px-3 py-2 text-sm font-black text-dark">
              {order.order.status}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-dark/10 bg-paper p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-dark/50">Order total</p>
              <p className="mt-2 text-3xl font-black text-dark">₱{Number(order.order.total_amount).toLocaleString('en-PH')}</p>
            </div>
            <div className="rounded-[1.5rem] border border-dark/10 bg-paper p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-dark/50">Payment status</p>
              <p className="mt-2 text-xl font-black text-dark">{order.order.payment_status}</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-dark/10 bg-paper p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-dark/50">Shipping address</p>
            <p className="mt-3 text-base font-bold text-dark">{order.order.shipping_address || 'Not provided'}</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-dark/50">Items</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-[1.5rem] border border-dark/10 bg-paper p-4">
                <div>
                  <p className="text-base font-black text-dark">{item.product_name}</p>
                  <p className="text-sm font-semibold text-dark/60">Qty {item.quantity}</p>
                </div>
                <p className="text-lg font-black text-dark">₱{(item.price * item.quantity).toLocaleString('en-PH')}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[1.5rem] border border-dark/10 bg-cream/40 p-4 text-right">
            <p className="text-sm font-semibold text-dark/60">Subtotal</p>
            <p className="text-2xl font-black text-dark">₱{total.toLocaleString('en-PH')}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
