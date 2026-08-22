'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: string
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white">
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
            >
              <span className="font-medium text-stone-900">{item.question}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>
            {open && <p className="px-5 pb-4 text-sm leading-relaxed text-stone-600">{item.answer}</p>}
          </div>
        )
      })}
    </div>
  )
}