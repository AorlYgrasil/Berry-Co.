"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartNavLinkProps = {
  initialCount: number;
};

export default function CartNavLink({ initialCount }: CartNavLinkProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const refreshCartCount = async (event?: Event) => {
      const customEvent = event as CustomEvent<{ count?: number }> | undefined;
      if (typeof customEvent?.detail?.count === "number") {
        setCount(Math.max(0, customEvent.detail.count));
        return;
      }

      try {
        const response = await fetch("/api/cart");
        if (!response.ok) return;
        const data = await response.json();
        setCount(Number(data.itemCount) || 0);
      } catch {
        // Keep the last known count when the cart cannot be refreshed.
      }
    };

    window.addEventListener("cart-updated", refreshCartCount);
    refreshCartCount();
    return () => window.removeEventListener("cart-updated", refreshCartCount);
  }, []);

  return (
    <Link href="/cart" className="relative inline-flex items-center hover:text-brand transition">
      Cart
      {count > 0 && (
        <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-black leading-none text-white shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}