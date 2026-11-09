import type { ReactNode } from 'react'

interface PlateFrameProps {
  children: ReactNode
  /** Left caption, e.g. "Plate 01". */
  index?: string
  /** Right caption, e.g. "Generative study". */
  meta?: string
  className?: string
  /** Optional label pinned over the artwork (top-left). */
  overlay?: ReactNode
  /** Hide the printed caption strip. */
  bare?: boolean
}

/**
 * A framed plate: double hairline, four registration corners and an optional
 * printed caption strip. It is the site's way of presenting anything as an
 * exhibit — artwork, empty walls, portraits — so they all read as one catalogue.
 */
export default function PlateFrame({
  children,
  index,
  meta,
  className = '',
  overlay,
  bare = false,
}: PlateFrameProps) {
  return (
    <figure className={`plate relative ${className}`}>
      <div className="plate-inset" aria-hidden="true" />
      <span
        className="corner left-0 top-0 border-l border-t"
        aria-hidden="true"
      />
      <span
        className="corner right-0 top-0 border-r border-t"
        aria-hidden="true"
      />
      <span
        className="corner bottom-0 left-0 border-b border-l"
        aria-hidden="true"
      />
      <span
        className="corner bottom-0 right-0 border-b border-r"
        aria-hidden="true"
      />

      {overlay && (
        <div className="pointer-events-none absolute left-5 top-5 z-10">
          {overlay}
        </div>
      )}

      <div className="relative h-full w-full">{children}</div>

      {!bare && (index || meta) && (
        <figcaption className="flex items-center justify-between gap-6 border-t border-[var(--gilt-line)] px-5 py-3">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-gilt/80">
            {index}
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-mist">
            {meta}
          </span>
        </figcaption>
      )}
    </figure>
  )
}
