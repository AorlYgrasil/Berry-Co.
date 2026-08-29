import Link from "next/link";

export interface Item {
  id?: string | number;
  company?: string;
  name?: string;
  description?: string;
  price?: string | number;
  imageUrl?: string;
  href?: string;
  tags?: string[];
  category?: string;
  status?: string;
}

export interface ItemCardProps {
  item: Item;
  className?: string;
}

export default function ItemCard({ item, className = "" }: ItemCardProps) {
  // #region MOCK FALLBACK DEFAULTS (Review/remove default strings once backend supplies complete item records)
  const {
    id,
    company = "Company Name",
    name = "Item Name",
    description,
    price = "₱120",
    imageUrl,
    href,
    tags = [],
    status,
  } = item;
  // #endregion MOCK FALLBACK DEFAULTS

  const safeName = name?.trim() || "Item Name";
  const safeDescription = description?.trim() || `${safeName} from the Berry Co. collection — a premium collectible with standout detail and craftsmanship.`;
  const targetHref = href ?? (id !== undefined ? `/products/${id}` : undefined);
  
  // Safe case-insensitive check for out-of-stock items
  const isOutOfStock =
    status?.toLowerCase().includes("out of stock") ||
    status?.toLowerCase().includes("sold out");

  const content = (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-dark/15 bg-paper shadow-xs transition-all duration-200 ${
        targetHref ? "hover:-translate-y-1 hover:shadow-md cursor-pointer" : ""
      } ${className}`.trim()}
    >
      {/* Main Image Wrapper */}
      <div className="relative flex h-52 w-full items-center justify-center bg-cream text-xs font-bold text-dark/30 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          // #region MOCK IMAGE PLACEHOLDER (Replace string with official fallback logo asset or default CDN image)
          "Image Placeholder"
          // #endregion MOCK IMAGE PLACEHOLDER
        )}

        {/* Tags Overlay */}
        {tags.length > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white shadow-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <span className="rounded-full bg-red-600 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="space-y-1 p-3 text-xs font-semibold text-dark">
        <p className="font-bold text-dark/80">{company}</p>
        <p className="text-sm font-black leading-snug text-dark group-hover:text-brand transition-colors">
          {safeName}
        </p>
        <p className="text-[11px] font-semibold leading-relaxed text-dark/70">
          {safeDescription}
        </p>
        <p className="pt-1 text-sm font-extrabold text-brand">{price}</p>
      </div>
    </article>
  );

  if (targetHref) {
    return (
      <Link href={targetHref} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}