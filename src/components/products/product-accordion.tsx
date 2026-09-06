"use client";

import ReviewForm from "./review-form";
import type { ProductReview } from "@/lib/data/reviews";

type AccordionsProps = {
  description?: string;
  specs?: string[];
  reviews?: ProductReview[];
  productId: string;
  canReview?: boolean;
};

export default function ProductAccordions({
  description = "Detailed product description goes here...",
  specs = ["Material: 310gsm German Core Stock", "Finish: Air-Cushion Linen Finish"],
  reviews = [],
  productId,
  canReview = false,
}: AccordionsProps) {
  const reviewsCount = reviews.length;
  const rating = reviewsCount
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviewsCount
    : 0;

  return (
    <div className="space-y-2 pt-2">
      {/* 1. Product Description */}
      <details
        className="collapse collapse-arrow border-b border-dark/20 bg-transparent rounded-none"
        open
      >
        <summary className="collapse-title min-h-0 px-0 py-3 text-sm font-black uppercase text-dark">
          Product Description
        </summary>
        <div className="collapse-content px-0 pb-4">
          <div className="min-h-20 rounded-2xl bg-cream p-4 text-xs font-semibold text-dark/80">
            {description}
          </div>
        </div>
      </details>

      {/* 2. Product Specification */}
      <details
        className="collapse collapse-arrow border-b border-dark/20 bg-transparent rounded-none"
        open
      >
        <summary className="collapse-title min-h-0 px-0 py-3 text-sm font-black uppercase text-dark">
          Product Specification
        </summary>
        <div className="collapse-content px-0 pb-4">
          <div className="min-h-20 rounded-2xl bg-cream p-4 text-xs font-semibold text-dark/80">
            <ul className="list-disc list-inside space-y-1">
              {specs.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>

      {/* 3. Reviews & Rating */}
      <details
        className="collapse collapse-arrow border-b border-dark/20 bg-transparent rounded-none"
        open
      >
        <summary className="collapse-title min-h-0 px-0 py-3 text-sm font-black uppercase text-dark">
          Reviews & Rating
        </summary>
        <div className="collapse-content px-0 pb-4">
          <div className="min-h-20 rounded-2xl bg-cream p-4 text-xs font-semibold text-dark/80">
            <p className="font-extrabold text-brand">
              {reviewsCount ? `★ ${rating.toFixed(1)} / 5.0 (${reviewsCount} Reviews)` : 'No reviews yet'}
            </p>
            {reviews.length > 0 ? (
              <div className="mt-3 space-y-3">
                {reviews.map((review) => (
                  <article key={review.id} className="border-t border-dark/10 pt-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-extrabold text-brand">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                      <p className="text-[11px] text-dark/50">{review.reviewer_name}</p>
                    </div>
                    <p className="mt-1 text-dark/70">{review.comment}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-1 italic text-dark/70">Be the first to review this product.</p>
            )}
            {canReview ? (
              <ReviewForm productId={productId} />
            ) : (
              <p className="mt-4 border-t border-dark/10 pt-4 text-xs font-semibold text-dark/60">
                Sign in to share your review.
              </p>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}