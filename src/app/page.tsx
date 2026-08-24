import SearchBar from "@/components/searchbar";
import Hero from "@/components/ui/hero";
import ItemCard from "@/components/item-card";
import { getProducts } from "@/lib/data/data-products";

export default async function HomePage() {
  const { products } = await getProducts({ page: 1, pageSize: 500 });

  return (
    <div className="flex-1 flex flex-col">
      <Hero />
      <SearchBar />

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 pb-12">
        <div className="bg-[#faf5eb] rounded-t-[3rem] p-8 shadow-sm min-h-125 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
              Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <ItemCard
                  key={product.id}
                  item={{
                    id: product.id,
                    company: "Berry Co.",
                    name: product.name,
                    description: product.description ?? product.sku,
                    price: `₱${Number(product.price).toLocaleString("en-PH")}`,
                    imageUrl: product.image_url ?? undefined,
                    status: product.status,
                  }}
                />
              ))}
            </div>

            {products.length === 0 && (
              <p className="py-12 text-center text-sm font-semibold text-dark/60">
                No products are available yet.
              </p>
            )}
          </div>

          <hr className="border-gray-400 mt-12 w-full" />
        </div>
      </div>
    </div>
  );
}