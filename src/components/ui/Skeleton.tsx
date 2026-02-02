'use client';

/**
 * Skeleton
 *
 * Animated placeholder for loading states. Uses a shimmer effect
 * via CSS animation. The component accepts width/height via className.
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-tertiary ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * CardSkeleton
 *
 * A card-shaped skeleton with internal placeholder lines,
 * suitable for replacing card-based UI during loading.
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-border bg-elevated p-5 shadow-sm ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
      <Skeleton className="h-5 w-3/4 rounded mb-2" />
      <Skeleton className="h-4 w-full rounded mb-1" />
      <Skeleton className="h-4 w-2/3 rounded" />
      <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
    </div>
  );
}

/**
 * FlashcardSkeleton
 *
 * A skeleton matching the flashcard layout for the review page loading state.
 */
export function FlashcardSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress bar skeleton */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
        <Skeleton className="h-1 w-full rounded-full" />
      </div>

      {/* Card skeleton */}
      <div className="relative" style={{ minHeight: 300 }}>
        {/* Background cards */}
        <div className="absolute inset-0" style={{ zIndex: -2, transform: 'scale(0.94) translateY(8px)' }}>
          <div className="w-full min-h-[280px] rounded-xl border border-border-secondary bg-elevated opacity-40" />
        </div>
        <div className="absolute inset-0" style={{ zIndex: -1, transform: 'scale(0.97) translateY(4px)' }}>
          <div className="w-full min-h-[280px] rounded-xl border border-border-secondary bg-elevated opacity-70" />
        </div>

        {/* Top card */}
        <div className="w-full min-h-[280px] rounded-xl border border-border-secondary bg-elevated shadow-lg">
          <div className="h-[3px] rounded-t-xl bg-surface-tertiary animate-pulse" />
          <div className="flex flex-col flex-1 p-6">
            <Skeleton className="h-3 w-12 rounded mb-4" />
            <Skeleton className="h-5 w-full rounded mb-2" />
            <Skeleton className="h-5 w-4/5 rounded mb-2" />
            <Skeleton className="h-5 w-3/5 rounded" />
            <div className="mt-auto pt-8">
              <Skeleton className="h-3 w-20 rounded mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard hint skeleton */}
      <Skeleton className="mt-4 h-3 w-32 rounded mx-auto" />
    </div>
  );
}

export default Skeleton;
