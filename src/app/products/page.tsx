export default function ProductsPage() {
  // Dummy Data (16 items to test container scrollbar)
  const dummyProducts = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    company: 'Company Name',
    name: 'Item Name',
    desc: 'Short Description',
    price: '$120',
  }));

  return (
    <main className="min-h-screen w-full bg-[#EAD0AA] py-6 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6">
        
        {/* Top Search Input Bar */}
        <div className="w-full max-w-md">
          <div className="flex items-center bg-[#F3E4C8] border border-[#35322E]/40 rounded-full px-4 py-2 shadow-sm focus-within:border-[#E23B2E] transition">
            <svg className="w-4 h-4 text-[#35322E] mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent outline-none text-[#35322E] placeholder-[#35322E]/60 text-sm font-medium"
            />
          </div>
        </div>

        {/* Main Layout: Grid Content + Right Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT COLUMN: Main Products Area (Cream Lightest #FBF4E4) */}
          <section className="flex-1 bg-[#FBF4E4] rounded-[2.5rem] p-6 md:p-8 shadow-sm min-h-[750px] w-full border border-[#35322E]/10">
            {/* Active Tag Chip */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#F3E4C8] border border-[#35322E]/30 rounded-lg text-xs font-bold text-[#35322E]">
                Tag name
                <button type="button" className="hover:text-[#E23B2E] font-bold">
                  ✕
                </button>
              </span>
            </div>

            <h1 className="text-xl font-extrabold text-[#35322E] mb-6">
              Results For:
            </h1>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dummyProducts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden shadow-sm flex flex-col border border-[#35322E]/15 hover:shadow-md transition bg-[#FFFDF8]"
                >
                  {/* Upper Image Placeholder (Cream Light #F3E4C8) */}
                  <div className="bg-[#F3E4C8] h-52 w-full flex items-center justify-center text-[#35322E]/30 text-xs font-bold">
                    Image Placeholder
                  </div>

                  {/* Lower Product Info (White #FFFDF8) */}
                  <div className="p-3 text-xs text-[#35322E] font-semibold space-y-0.5">
                    <p className="font-bold text-[#35322E]/80">{item.company}</p>
                    <p className="text-[11px] font-semibold text-[#35322E]">
                      {item.name} | {item.desc}
                    </p>
                    <p className="font-extrabold text-sm pt-1 text-[#E23B2E]">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT COLUMN: Filter Sidebar (Cream Lightest #FBF4E4) */}
          <aside className="w-full lg:w-72 bg-[#FBF4E4] rounded-[2.5rem] p-6 shadow-sm flex flex-col gap-6 shrink-0 border border-[#35322E]/10">
            <h2 className="text-center font-extrabold text-[#35322E] text-base leading-tight">
              Set Search Filters and <br /> Tags
            </h2>

            {/* Dropdown Filters */}
            <div className="flex flex-col gap-3">
              {['Series', 'Tags', 'Brand'].map((filterName) => (
                <div
                  key={filterName}
                  className="flex items-center justify-between border border-[#35322E]/40 rounded-full px-3.5 py-2 bg-[#F3E4C8] cursor-pointer hover:border-[#35322E] transition"
                >
                  <div className="flex items-center gap-2 text-[#35322E]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-xs font-bold">{filterName}</span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-[#35322E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Availability Checkboxes */}
            <div className="space-y-2 text-xs font-semibold text-[#35322E]">
              <p className="text-right text-[#35322E] font-bold mb-1">Availability</p>
              <div className="flex justify-end gap-3 flex-wrap">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded border-[#35322E] text-[#E23B2E] focus:ring-0" />
                  In-Stock
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded border-[#35322E] text-[#E23B2E] focus:ring-0" />
                  Pre-Order
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded border-[#35322E] text-[#E23B2E] focus:ring-0" />
                  On Sale
                </label>
              </div>
            </div>

            {/* Price Range Controls */}
            <div className="space-y-3">
              <p className="text-right text-xs font-bold text-[#35322E]">Price</p>
              
              {/* Range Line */}
              <div className="relative w-full h-1.5 bg-[#35322E] rounded-full my-2">
                <div className="absolute left-1/4 right-1/4 h-full bg-[#F2C230] rounded-full" />
                <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#FFFDF8] border-2 border-[#35322E] rotate-45" />
                <div className="absolute right-1/4 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-[#FFFDF8] border-2 border-[#35322E] rotate-45" />
              </div>

              {/* Min / Max Inputs */}
              <div className="space-y-2 text-[11px] font-semibold text-[#35322E]">
                <div>
                  <span className="block mb-0.5 font-bold">Minimum</span>
                  <input
                    type="text"
                    defaultValue="0"
                    className="w-full bg-[#F3E4C8] border border-[#35322E]/40 rounded-md px-2.5 py-1 text-xs text-[#35322E] font-bold outline-none"
                  />
                </div>
                <div>
                  <span className="block mb-0.5 font-bold">Maximum</span>
                  <input
                    type="text"
                    defaultValue="∞"
                    className="w-full bg-[#F3E4C8] border border-[#35322E]/40 rounded-md px-2.5 py-1 text-xs text-[#35322E] font-bold outline-none"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}