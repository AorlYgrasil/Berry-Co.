"use client";

import { useState } from "react";

type BuyBoxProps = {
  name: string;
  price: string;
  status: string;
  tag: string;
  preorderPeriod: string;
};

export default function ProductBuyBox({
  name,
  price,
  status,
  tag,
  preorderPeriod,
}: BuyBoxProps) {
  const [inWishlist, setInWishlist] = useState(false);
  const [added, setAdded] = useState(false);

  const handleCartClick = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="rounded-[2rem] bg-[#F4ECE1] p-6 shadow-xs border border-dark/10 space-y-5">
      
      {/* Title & Tag */}
      <div className="space-y-2 text-right">
        <h1 className="text-xl font-black text-dark">{name}</h1>
        <div className="flex justify-end">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EADCC9] px-3 py-1 text-[11px] font-bold text-dark">
            {tag} <span className="cursor-pointer text-dark/50 hover:text-dark">×</span>
          </span>
        </div>
      </div>

      {/* Price & Status */}
      <div className="text-right space-y-1">
        <p className="text-2xl font-black text-dark">{price}</p>
        <p className="text-xs font-bold text-brand">{status}</p>
      </div>

      {/* Pre-order Dates */}
      <div className="rounded-2xl bg-[#EADCC9] p-3 text-center text-xs text-dark/80 border border-dark/5">
        <p className="font-extrabold uppercase text-[10px] tracking-wider text-dark/60">
          Pre-order Period
        </p>
        <p className="text-[11px] font-bold text-dark mt-0.5">
          {preorderPeriod}
        </p>
      </div>

      {/* Action Buttons (Compact & Easy to Reach) */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          onClick={handleCartClick}
          className="w-full rounded-full border border-dark/30 bg-[#EADCC9] py-3 text-xs font-extrabold text-dark hover:bg-dark hover:text-white transition-all active:scale-95 shadow-xs"
        >
          {added ? "Added to Cart! ✓" : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={() => setInWishlist(!inWishlist)}
          className={`w-full rounded-full border border-dark/30 py-3 text-xs font-extrabold transition-all active:scale-95 shadow-xs ${
            inWishlist
              ? "bg-brand text-white border-brand"
              : "bg-[#EADCC9] text-dark hover:bg-dark hover:text-white"
          }`}
        >
          {inWishlist ? "Saved to Wishlist ♥" : "Add to Wishlist"}
        </button>
      </div>

    </div>
  );
}