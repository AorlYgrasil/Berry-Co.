type ProductGalleryProps = {
  name: string;
  imageUrl: string | null;
};

export default function ProductGallery({ name, imageUrl }: ProductGalleryProps) {
  return (
    <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-[#EADCC9] border border-dark/10 p-4 text-center text-xs font-bold text-dark/60">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="h-full w-full rounded-xl object-contain" />
      ) : (
        <span>No product image available</span>
      )}
    </div>
  );
}