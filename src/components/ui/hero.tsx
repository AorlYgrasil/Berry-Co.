'use client';

import { useState } from 'react';

export default function Hero() {
  // 6 dummy cards so you can clearly see the carousel slide
  const cards = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Showing 3 cards at a time on desktop (max index is total - 3)
  const maxIndex = cards.length - 3;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <section className="w-full bg-[#bd2a21] py-8 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative flex items-center justify-center">
        {/* Carousel Viewport */}
        <div className="w-full overflow-hidden px-1 py-2">
          {/* Sliding Track */}
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(-${currentIndex} * (100% / 3 + 0.5rem)))`,
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className="w-full md:w-[calc((100%-3rem)/3)] shrink-0 bg-[#f2b828] h-56 rounded-3xl shadow-md flex items-center justify-center text-gray-900 font-black text-xl border-2 border-[#dca01e] select-none"
              >
                {card.title}
              </div>
            ))}
          </div>
        </div>

        {/* Previous Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute -left-2 md:left-2 top-1/2 -translate-y-1/2 bg-white text-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-100 hover:scale-110 active:scale-95 transition z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute -right-2 md:right-2 top-1/2 -translate-y-1/2 bg-white text-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-100 hover:scale-110 active:scale-95 transition z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Slide Indicators / Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}