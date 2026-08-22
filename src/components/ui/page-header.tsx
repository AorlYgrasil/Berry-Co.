export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-[#e9d0a8] px-6 py-14 text-center sm:py-16">
      <h1 className="text-3xl font-black tracking-tight text-[#d9483a] sm:text-4xl">{title}</h1>
      {subtitle && <p className="mx-auto mt-3 max-w-xl text-stone-700">{subtitle}</p>}
    </div>
  )
}