"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CancelOrderButtonProps = {
  orderId: string;
  canCancel: boolean;
};

export default function CancelOrderButton({ orderId, canCancel }: CancelOrderButtonProps) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canCancel) return null;

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;

    setCancelling(true);
    setError(null);
    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to cancel this order.");
        return;
      }
      window.dispatchEvent(new CustomEvent("orders-updated", { detail: { delta: -1 } }));
      router.push("/orders?cancelled=1");
    } catch {
      setError("Unable to reach the order service. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="border-t border-dark/10 pt-5">
      <button
        type="button"
        onClick={handleCancel}
        disabled={cancelling}
        className="w-full rounded-full border border-red-600/40 bg-red-50 px-5 py-3 text-sm font-black text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cancelling ? "Cancelling..." : "Cancel Order"}
      </button>
      {error && <p className="mt-2 text-center text-sm font-bold text-brand">{error}</p>}
    </div>
  );
}