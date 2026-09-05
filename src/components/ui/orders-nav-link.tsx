"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrdersNavLinkProps = {
  initialCount: number;
};

export default function OrdersNavLink({ initialCount }: OrdersNavLinkProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const handleOrderUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ delta?: number }>;
      const delta = customEvent.detail?.delta ?? 0;
      setCount((currentCount) => Math.max(0, currentCount + delta));
    };

    window.addEventListener("orders-updated", handleOrderUpdate);
    return () => window.removeEventListener("orders-updated", handleOrderUpdate);
  }, []);

  return (
    <Link href="/orders" className="relative inline-flex items-center hover:text-brand transition">
      Orders
      {count > 0 && (
        <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-black leading-none text-white shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}