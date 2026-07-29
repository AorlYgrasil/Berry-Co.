import { use } from "react";
import ProductGallery from "@/components/products/product-gallery";
import ProductAccordions from "@/components/products/product-accordion";
import ProductBuyBox from "@/components/products/product-buy-box";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8 text-dark">
      {/* 1. items-start prevents columns from stretching each other */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        
        {/* Left Side: Photo + Accordions Container */}
        <div className="lg:col-span-8 rounded-[2rem] bg-[#F4ECE1] p-6 shadow-xs border border-dark/10 space-y-6">
          <ProductGallery />
          <ProductAccordions />
        </div>

        {/* Right Side: Sticky Buy Box Panel */}
        <div className="lg:col-span-4 sticky top-6 sm:top-24">
          <ProductBuyBox
            name={`Deck ${id}`}
            price="₱120"
            status="Pre-orders Open"
            tag="Tag name"
            preorderPeriod="2026/04/28 ~ 2026/06/10 (JST)"
          />
        </div>

      </div>
    </main>
  );
}