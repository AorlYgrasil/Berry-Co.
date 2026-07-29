import Link from "next/link";

type ItemCardData = {
  id: string | number;
  company?: string;
  name: string;
  description?: string;
  price?: string | number;
  imageUrl?: string;
  href?: string;
};

type ItemCardProps = {
  item: ItemCardData;
  className?: string;
};

export default function ItemCard({ item, className = "" }: ItemCardProps) {
  const {
    company = "Company Name",
    name = "Item Name",
    description = "Short Description",
    price = "₱120",
    imageUrl,
    href,
  } = item;

  const content = (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-dark/15 bg-paper shadow-sm transition hover:shadow-md ${className}`.trim()}
    >
      <div className="flex h-52 w-full items-center justify-center bg-cream text-xs font-bold text-dark/30">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          "Image Placeholder"
        )}
      </div>

      <div className="space-y-0.5 p-3 text-xs font-semibold text-dark">
        <p className="font-bold text-dark/80">{company}</p>
        <p className="text-[11px] font-semibold text-dark">
          {name} | {description}
        </p>
        <p className="pt-1 text-sm font-extrabold text-brand">{price}</p>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}