import Hero from '@/components/ui/hero';

export default function HomePage() {
  const dummyProducts = [1, 2, 3, 4];

  return (
    <main className="flex-1 flex flex-col bg-[#ebd2b4]">
      {/* 1. Hero Carousel */}
      <Hero />

      {/* 2. Search & Filter Bar */}
      <div className="w-full max-w-md mx-auto my-6 px-4">
        <div className="flex items-center bg-[#e8ceae] border border-gray-600 rounded-full px-4 py-1.5 shadow-sm">
          {/* Search Icon */}
          <svg className="w-4 h-4 text-gray-800 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input
            type="text"
            placeholder=""
            className="w-full bg-transparent outline-none text-gray-800 text-sm"
          />

          {/* Filter Funnel Icon */}
          <button type="button" aria-label="Filter" className="ml-2 hover:opacity-75">
            <svg className="w-4 h-4 text-gray-800 fill-current" viewBox="0 0 24 24">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. Main Pre-Orders Card Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 pb-12">
        <div className="bg-[#faf5eb] rounded-t-[3rem] p-8 shadow-sm min-h-[500px] flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
              Pre Orders Open
            </h2>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {dummyProducts.map((id) => (
                <div key={id} className="rounded-2xl overflow-hidden shadow-sm flex flex-col">
                  {/* Upper Image Placeholder */}
                  <div className="bg-[#e8ceae] h-52 w-full" />
                  {/* Lower Card Info */}
                  <div className="bg-[#d8dcdb] p-3 text-xs text-gray-900 font-semibold space-y-0.5">
                    <p className="font-bold">Company Name</p>
                    <p className="text-[11px] font-semibold">Item Name | Short Description</p>
                    <p className="font-bold text-sm pt-1">$120</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Horizontal Divider */}
          <hr className="border-gray-400 mt-12 w-full" />
        </div>
      </div>
    </main>
  );
}