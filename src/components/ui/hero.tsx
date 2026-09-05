'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero() {
  const cards = [
    { id: 1, title: 'Pokemon TCG', image: '/Pokemon TCG.png' },
    { id: 2, title: 'Magic: The Gathering', image: '/Magic.png' },
    { id: 3, title: 'One Piece', image: '/One Piece.png' },
    { id: 4, title: 'Figurines and Collectibles', image: '/Fig.png' },
    { id: 5, title: 'Card Accessories', image: '/Card Acc.png' },
    { id: 6, title: 'Promos', image: '/Promos.png' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  // Dynamically update items per page based on viewport size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1); // 1 card on mobile
      } else {
        setItemsPerPage(3); // 3 cards on desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, cards.length - itemsPerPage);

  const activeIndex = Math.min(currentIndex, maxIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  useEffect(() => {
    if (isPaused) return;

    const autoplay = window.setInterval(() => {
      setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 2500);
    return () => window.clearInterval(autoplay);
  }, [isPaused, maxIndex]);

  // Calculate pixel-accurate translation string based on screen layout
  const getTranslateX = () => {
    if (itemsPerPage === 1) {
      // Mobile: Shift by 100% card width + gap (1.5rem / 24px)
      return `calc(-${activeIndex} * (100% + 1.5rem))`;
    }
    // Desktop: Shift by 1/3 width + 1/3 gap adjustment
    return `calc(-${activeIndex} * (100% / 3 + 0.5rem))`;
  };

  return (
    <section
      className="w-full bg-brand-dark py-8 px-6 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="max-w-6xl mx-auto relative flex items-center justify-center">
        {/* Carousel Viewport */}
        <div className="w-full overflow-hidden px-1 py-2" aria-live="polite">
          {/* Sliding Track */}
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(${getTranslateX()})`,
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className="relative w-full md:w-[calc((100%-3rem)/3)] shrink-0 overflow-hidden rounded-3xl border-2 border-gold bg-gold shadow-md select-none aspect-[12/7]"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover"
                  priority={card.id <= 3}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Previous Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute -left-2 md:left-2 top-1/2 -translate-y-1/2 bg-white text-dark rounded-full p-3 shadow-lg hover:bg-highlights hover:scale-110 active:scale-95 transition z-10"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Next Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute -right-2 md:right-2 top-1/2 -translate-y-1/2 bg-white text-dark rounded-full p-3 shadow-lg hover:bg-highlights hover:scale-110 active:scale-95 transition z-10"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Slide Indicators / Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              activeIndex === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}