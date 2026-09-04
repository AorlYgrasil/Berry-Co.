"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type WishlistNavLinkProps = {
  initialCount: number;
};

export default function WishlistNavLink({ initialCount }: WishlistNavLinkProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const handleWishlistUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ delta?: number }>;
      const delta = customEvent.detail?.delta ?? 0;
      setCount((currentCount) => Math.max(0, currentCount + delta));
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  }, []);

  return (
    <Link href="/wishlist" className="relative inline-flex items-center hover:text-brand transition">
      Wishlist
      {count > 0 && (
        <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-black leading-none text-white shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}