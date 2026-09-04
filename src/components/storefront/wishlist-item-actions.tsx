"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type WishlistItemActionsProps = {
  productId: string;
};

export default function WishlistItemActions({ productId }: WishlistItemActionsProps) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemove = async () => {
    setRemoving(true);
    setError(null);

    const response = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Unable to remove this item.");
      setRemoving(false);
      return;
    }

    window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { delta: -1 } }));
    router.refresh();
  };

  return (
    <div className="flex flex-1">
      <button
        type="button"
        onClick={handleRemove}
        disabled={removing}
        className="w-full rounded-full border border-brand bg-paper px-4 py-3 text-center text-sm font-black leading-tight text-brand hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {removing ? "Removing..." : "Remove from Wishlist"}
      </button>
      {error && <p className="mt-2 text-xs font-bold text-brand">{error}</p>}
    </div>
  );
}