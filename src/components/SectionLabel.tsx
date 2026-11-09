import type { ReactNode } from 'react'

interface SectionLabelProps {
  index?: string
  children: ReactNode
  accent?: boolean
}

/** Small mono section kicker with an optional index and trailing rule. */
export default function SectionLabel({ index, children, accent }: SectionLabelProps) {
  return (
    <div className="kicker flex items-center gap-3.5">
      {index && <span className="text-gilt/80">{index}</span>}
      <span className={accent ? 'text-bone' : ''}>{children}</span>
      <span
        className="h-px w-12 bg-[var(--gilt-line)]"
        aria-hidden="true"
      />
    </div>
  )
}
