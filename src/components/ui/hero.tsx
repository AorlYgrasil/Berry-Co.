'use client';

export default function Hero() {
  return (
    <section className="w-full bg-[#bd2a21] py-8 px-6 relative">
      <div className="max-w-6xl mx-auto relative flex items-center justify-center">
        {/* 3 Yellow Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-[#f2b828] h-56 rounded-3xl shadow-sm" />
          <div className="bg-[#f2b828] h-56 rounded-3xl shadow-sm" />
          <div className="bg-[#f2b828] h-56 rounded-3xl shadow-sm" />
        </div>

        {/* Previous Arrow Button */}
        <button
          type="button"
          aria-label="Previous Slide"
          className="absolute left-1/3 -translate-x-1/2 bg-white rounded-full p-2.5 shadow-md hover:bg-gray-100 transition"
        >
          <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Arrow Button */}
        <button
          type="button"
          aria-label="Next Slide"
          className="absolute right-1/3 translate-x-1/2 bg-white rounded-full p-2.5 shadow-md hover:bg-gray-100 transition"
        >
          <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}