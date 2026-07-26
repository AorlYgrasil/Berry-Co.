'use client'

import { useRef, useState } from 'react'

// TODO: swap these placeholders for real report summaries / management updates
// once product and category data is connected.
const slides = [
  {
    title: 'Inventory Report',
    body: 'Low-stock alerts will appear here once your product data is connected.',
    tone: 'primary',
  },
  {
    title: 'Sales Summary',
    body: 'Weekly revenue and top-selling products will be summarized here.',
    tone: 'secondary',
  },
  {
    title: 'New Orders',
    body: 'Orders awaiting fulfillment will be highlighted in this slide.',
    tone: 'accent',
  },
  {
    title: 'User Activity',
    body: 'New customer sign-ups and account changes will be tracked here.',
    tone: 'neutral',
  },
] as const

// Static class map — Tailwind can't see dynamically-built class strings like
// `bg-${tone}/10`, so each tone's classes must exist literally somewhere.
const toneClasses: Record<(typeof slides)[number]['tone'], { box: string; label: string }> = {
  primary: { box: 'bg-primary/10 border-primary/20', label: 'text-primary' },
  secondary: { box: 'bg-secondary/10 border-secondary/20', label: 'text-secondary' },
  accent: { box: 'bg-accent/10 border-accent/20', label: 'text-accent' },
  neutral: { box: 'bg-neutral/10 border-neutral/20', label: 'text-neutral' },
}

export default function UpdatesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  function goTo(index: number) {
    const track = trackRef.current
    if (!track) return
    const slide = track.children[index] as HTMLElement | undefined
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    setActive(index)
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <div className="card-body pb-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="card-title text-base">Reports &amp; Management Updates</h2>
          <div className="join">
            <button
              type="button"
              className="btn btn-sm btn-ghost join-item"
              onClick={() => goTo(Math.max(active - 1, 0))}
              aria-label="Previous update"
            >
              ‹
            </button>
            <button
              type="button"
              className="btn btn-sm btn-ghost join-item"
              onClick={() => goTo(Math.min(active + 1, slides.length - 1))}
              aria-label="Next update"
            >
              ›
            </button>
          </div>
        </div>

        <div ref={trackRef} className="carousel w-full rounded-box gap-4">
          {slides.map((slide) => (
            <div key={slide.title} className="carousel-item w-full sm:w-1/2 lg:w-1/3">
              <div
                className={`w-full rounded-box p-5 border ${toneClasses[slide.tone].box}`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide mb-2 ${toneClasses[slide.tone].label}`}
                >
                  Placeholder
                </p>
                <h3 className="font-semibold mb-1">{slide.title}</h3>
                <p className="text-sm text-base-content/60">{slide.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-1.5 mt-3">
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to ${slide.title}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? 'w-5 bg-primary' : 'w-1.5 bg-base-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}