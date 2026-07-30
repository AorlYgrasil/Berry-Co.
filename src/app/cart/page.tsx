'use client';

import { useState } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));
  };

  const subtotal = cart.reduce<number>((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-[#E8D3B9] text-[#2B2B2B]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-black text-[#2B2B2B]">Your Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 bg-[#FFF8EE] rounded-3xl p-6 shadow-sm border border-[#E2C7A7]/50 w-full space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-sm font-semibold text-[#8C7355]">Your cart is empty.</p>
                <Link
                  href="/products"
                  className="inline-block bg-[#E63946] text-white font-bold px-6 py-2 rounded-full text-xs"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-[#EAD1B3]/40 border border-[#E8D3B9] rounded-2xl p-4 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#EAD1B3] rounded-xl flex items-center justify-center text-[10px] text-[#8C7355] font-bold">
                      Image
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#2B2B2B]">{item.name}</h3>
                      <p className="text-xs text-[#8C7355]">{item.category}</p>
                      <p className="font-extrabold text-sm text-black mt-1">${item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#FFF8EE] border border-[#C5A880] rounded-full px-2 py-1 gap-3 text-xs font-bold">
                      <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-[#E63946]">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-[#E63946]">+</button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-[#E63946] font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="w-full lg:w-80 bg-[#FFF8EE] rounded-3xl p-6 shadow-sm border border-[#E2C7A7]/50 space-y-4">
            <h2 className="text-lg font-bold text-[#2B2B2B] border-b border-[#E2C7A7] pb-2">Order Summary</h2>

            <div className="space-y-2 text-xs font-medium text-[#5A4632]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>${shipping}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#2B2B2B] pt-2 border-t border-[#E2C7A7]">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <Link
              href={cart.length > 0 ? '/checkout' : '#'}
              className={`w-full block text-center font-bold py-2.5 rounded-full text-xs transition-colors ${
                cart.length > 0
                  ? 'bg-[#E63946] text-white hover:bg-[#c92a37]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}