import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/products/product-gallery";
import ProductAccordions from "@/components/products/product-accordion";
import ProductBuyBox from "@/components/products/product-buy-box";
import { getProductById } from "@/lib/data/data-products";
import { isProductWishlisted } from "@/lib/wishlist-service";
import { getSession } from "@/lib/session";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  const session = await getSession();
  const initialInWishlist = session ? await isProductWishlisted(session.userId, product.id) : false;

  const status = product.status === 'out_of_stock' ? 'Out of Stock' : 'In Stock';
  const productDescription =
    product.description?.trim() ||
    `${product.name} is part of the Berry Co. collection and brings premium detail, collectible quality, and standout design to fans and collectors alike.`;

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
                href={`/products?category=${encodeURIComponent(product.category_name ?? '')}`}
                className="hover:text-brand transition-colors"
              >
                {product.category_name ?? 'Uncategorized'}
              </Link>
            </li>
            <li>
              <Link
                href={`/products?category=${encodeURIComponent(product.subcategory_name ?? '')}`}
                className="hover:text-brand transition-colors"
              >
                {product.subcategory_name ?? 'Product'}
              </Link>
            </li>
            <li>
              <Link
                href={`/products?search=${encodeURIComponent(product.sku)}`}
                className="hover:text-brand transition-colors"
              >
                {product.sku}
              </Link>
            </li>
            {/* Current Active Item */}
            <li className="font-black text-dark">
              {product.name}
            </li>
          </ul>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          
          {/* 1️⃣ Photo Gallery Card (Mobile: 1st | Desktop: Top-Left) */}
          <div className="lg:col-span-8 lg:col-start-1 lg:row-start-1 rounded-4xl bg-[#F4ECE1] p-6 shadow-xs border border-dark/10">
            <ProductGallery name={product.name} imageUrl={product.image_url} />
          </div>

          {/* 2️⃣ Sticky Buy Box Panel (Mobile: 2nd | Desktop: Top-Right) */}
          <div className="lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24">
            <ProductBuyBox
              productId={product.id}
              name={product.name}
              price={`₱${Number(product.price).toLocaleString('en-PH')}`}
              status={status}
              tag={product.category_name ?? 'Berry Co.'}
              initialInWishlist={initialInWishlist}
            />
          </div>

          {/* 3️⃣ Accordions Card (Mobile: 3rd | Desktop: Bottom-Left) */}
          <div className="lg:col-span-8 lg:col-start-1 lg:row-start-2 rounded-4xl bg-[#F4ECE1] p-6 shadow-xs border border-dark/10">
            <ProductAccordions description={productDescription} specs={[`SKU: ${product.sku}`, `Stock: ${product.stock} unit(s)`]} />
          </div>

        </div>

      </div>
    </main>
  );
}