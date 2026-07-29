import { use } from "react";
import Link from "next/link";
import ProductGallery from "@/components/products/product-gallery";
import ProductAccordions from "@/components/products/product-accordion";
import ProductBuyBox from "@/components/products/product-buy-box";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);

  // Dynamic / Mock product attributes
  const product = {
    id,
    name: `Deck ${id}`,      // Current Item
    category: "Cards",       // Category
    brand: "Deckdrop",       // Brand
    series: "Pokemon",      // Series
    price: "₱120",
    status: "Pre-orders Open",
    tag: "Tag name",
    preorderPeriod: "2026/04/28 ~ 2026/06/10 (JST)",
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8 text-dark">
      <div className="mx-auto max-w-6xl">
        
        {/* Breadcrumb Hierarchy: Products > Category > Brand > Series > Item */}
        <div className="breadcrumbs mb-4 text-xs font-bold text-dark/60">
          <ul>
            <li>
              <Link href="/products" className="hover:text-brand transition-colors">
                Products
              </Link>
            </li>
            <li>
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="hover:text-brand transition-colors"
              >
                {product.category}
              </Link>
            </li>
            <li>
              <Link
                href={`/products?brand=${encodeURIComponent(product.brand)}`}
                className="hover:text-brand transition-colors"
              >
                {product.brand}
              </Link>
            </li>
            <li>
              <Link
                href={`/products?series=${encodeURIComponent(product.series)}`}
                className="hover:text-brand transition-colors"
              >
                {product.series}
              </Link>
            </li>
            {/* 👈 Current Active Item */}
            <li className="font-black text-dark">
              {product.name}
            </li>
          </ul>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          
          {/* Left Side: Photo + Accordions Container */}
          <div className="lg:col-span-8 rounded-4xl bg-[#F4ECE1] p-6 shadow-xs border border-dark/10 space-y-6">
            <ProductGallery />
            <ProductAccordions />
          </div>

          {/* Right Side: Sticky Buy Box Panel */}
          <div className="lg:col-span-4 sticky top-6 sm:top-24">
            <ProductBuyBox
              name={product.name}
              price={product.price}
              status={product.status}
              tag={product.tag}
              preorderPeriod={product.preorderPeriod}
            />
          </div>

        </div>

      </div>
    </main>
  );
}