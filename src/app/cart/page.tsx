'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCart = async () => {
    const response = await fetch('/api/cart');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? 'Unable to load your cart.');
    setCart((data.items ?? []).map((item: { id: string; quantity: number; unit_price_snapshot: number; product: { name: string; image_url: string | null } | null }) => ({
      id: item.id,
      name: item.product?.name ?? 'Product unavailable',
      price: Number(item.unit_price_snapshot),
      quantity: item.quantity,
      image_url: item.product?.image_url ?? null,
    })));
  };

  useEffect(() => {
    fetch('/api/cart')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? 'Unable to load your cart.');
        return data;
      })
      .then((data) => {
        setCart((data.items ?? []).map((item: { id: string; quantity: number; unit_price_snapshot: number; product: { name: string; image_url: string | null } | null }) => ({
          id: item.id,
          name: item.product?.name ?? 'Product unavailable',
          price: Number(item.unit_price_snapshot),
          quantity: item.quantity,
          image_url: item.product?.image_url ?? null,
        })));
      })
      .catch((loadError: Error) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  const updateQuantity = (itemId: string, delta: number) => {
    const item = cart.find((entry) => entry.id === itemId);
    if (!item) return;
    fetch(`/api/cart/${itemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: Math.max(1, item.quantity + delta) }) })
      .then((response) => response.ok ? loadCart() : response.json().then((data) => Promise.reject(new Error(data.error))))
      .catch((updateError: Error) => setError(updateError.message));
  };

  const removeFromCart = (itemId: string) => {
    fetch(`/api/cart/${itemId}`, { method: 'DELETE' })
      .then((response) => response.ok ? loadCart() : response.json().then((data) => Promise.reject(new Error(data.error))))
      .catch((removeError: Error) => setError(removeError.message));
  };

  const subtotal = cart.reduce<number>((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <main className="max-w-7xl w-full mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-black text-dark">Your Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Cart Items Section */}
        <div className="flex-1 bg-highlights rounded-3xl p-6 shadow-sm border border-dark/10 w-full space-y-4">
          {loading ? <p className="py-12 text-center text-sm font-semibold text-dark/60">Loading cart...</p> : error ? <p className="py-12 text-center text-sm font-semibold text-brand">{error}</p> : cart.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-sm font-semibold text-dark/70">Your cart is empty.</p>
              <Link
                href="/products"
                className="inline-block bg-brand hover:bg-brand-dark text-white font-bold px-6 py-2.5 rounded-full text-xs transition shadow-sm"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-[#F3E4C8]/50 border border-dark/10 rounded-2xl p-4 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#F3E4C8] rounded-xl flex items-center justify-center text-[10px] text-dark/60 font-bold overflow-hidden">
                    {item.image_url ? <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" /> : 'Image'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-dark">{item.name}</h3>
                    <p className="text-xs text-dark/70">{item.category}</p>
                    <p className="font-extrabold text-sm text-dark mt-1">${item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-highlights border border-dark/20 rounded-full px-3 py-1 gap-3 text-xs font-bold">
                    <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-[#E23B2E]">
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-[#E23B2E]">
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-brand font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="w-full lg:w-80 bg-highlights rounded-3xl p-6 shadow-sm border border-dark/10 space-y-4">
          <h2 className="text-lg font-bold text-dark border-b border-dark/10 pb-2">
            Order Summary
          </h2>

          <div className="space-y-2 text-xs font-medium text-dark/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₱{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>₱{shipping}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-dark pt-2 border-t border-dark/10">
              <span>Total</span>
              <span>₱{total}</span>
            </div>
          </div>

          <Link
            href={cart.length > 0 ? '/checkout' : '#'}
            className={`w-full block text-center font-bold py-3 rounded-full text-xs transition ${
              cart.length > 0
                ? 'bg-[#E23B2E] hover:bg-brand-dark text-white shadow-sm'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}