"use client";

import { useState } from "react";

type WishlistCartActionProps = {
  productId: string;
  initialInCart?: boolean;
};

export default function WishlistCartAction({ productId, initialInCart = false }: WishlistCartActionProps) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(initialInCart);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (adding || added) return;

    setAdding(true);
    setError(null);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to add this item to your cart.");
        return;
      }

      setAdded(true);
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch {
      setError("Unable to reach the cart service. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={adding || added}
        className="flex min-h-full w-full flex-1 items-center justify-center rounded-full border border-dark/20 bg-paper px-4 py-3 text-center text-sm font-black text-dark hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
      >
        {adding ? "Adding..." : added ? "Added to Cart!" : "Add to cart"}
      </button>
      {error && <p className="mt-2 text-xs font-bold text-brand">{error}</p>}
    </div>
  );
}