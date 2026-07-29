"use client";

import { useState } from "react";

type BuyBoxProps = {
  name: string;
  price: string;
  status: "In Stock" | "Pre-orders Open" | "Out of Stock" | "Sold Out" | string;
  tag: string;
  preorderPeriod?: string;
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

  // Status Helper Flags
  const isOutOfStock =
    status.toLowerCase().includes("out of stock") ||
    status.toLowerCase().includes("sold out");

  const isPreOrder = status.toLowerCase().includes("pre-order");

  const handleCartClick = () => {
    if (isOutOfStock) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Status Text Color Formatting
  const getStatusColor = () => {
    if (isOutOfStock) return "text-red-600";
    if (isPreOrder) return "text-brand";
    return "text-emerald-700"; // In Stock
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
        <p className={`text-xs font-bold ${getStatusColor()}`}>
          {status}
        </p>
      </div>

      {/* 📅 Pre-order Dates (Only renders if it's a pre-order and period is provided) */}
      {isPreOrder && preorderPeriod && (
        <div className="rounded-2xl bg-[#EADCC9] p-3 text-center text-xs text-dark/80 border border-dark/5">
          <p className="font-extrabold uppercase text-[10px] tracking-wider text-dark/60">
            Pre-order Period
          </p>
          <p className="text-[11px] font-bold text-dark mt-0.5">
            {preorderPeriod}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        
        {/* Main Cart Button - Disabled if Out of Stock */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleCartClick}
          className={`w-full rounded-full border py-3 text-xs font-extrabold transition-all shadow-xs ${
            isOutOfStock
              ? "border-dark/10 bg-dark/10 text-dark/40 cursor-not-allowed"
              : "border-dark/30 bg-[#EADCC9] text-dark hover:bg-dark hover:text-white active:scale-95 cursor-pointer"
          }`}
        >
          {isOutOfStock
            ? "Out of Stock"
            : added
            ? "Added to Cart! ✓"
            : "Add to Cart"}
        </button>

        {/* Wishlist Button - ALWAYS ENABLED */}
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