import { useI18n } from '@/lib/i18n'
import { statusLabel } from '@/data/translations'

interface StatusBadgeProps {
  status: string
  className?: string
}

const DOT: Record<string, string> = {
  completed: 'bg-acid',
  'in-progress': 'bg-electric',
  prototype: 'bg-iris',
  concept: 'bg-gilt',
  demo: 'bg-gilt',
  idea: 'bg-mist',
  experiment: 'bg-iris',
}

/** Small pill showing a project / lab status. */
export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { lang } = useI18n()
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--gilt-line)] bg-ink/70 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-bone-dim backdrop-blur-sm ${className}`}
    >
      <span
        className={`h-1 w-1 rounded-full ${DOT[status] ?? 'bg-electric'}`}
        aria-hidden="true"
      />
      {statusLabel(status, lang)}
    </span>
  )
}
