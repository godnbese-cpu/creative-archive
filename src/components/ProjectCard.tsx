import { Link } from 'react-router-dom'
import type { Project } from '@/types'
import { useI18n } from '@/lib/i18n'
import { categoryLabel } from '@/data/categories'
import Cover from './Cover'
import StatusBadge from './StatusBadge'

interface ProjectCardProps {
  project: Project
  /** Optional plate number, e.g. "01". */
  index?: string
  /** Taller cover ratio for featured / varied grid cells. */
  tall?: boolean
}

/**
 * A hung work: framed cover, printed label underneath. The frame is a hairline
 * with registration corners — the same language as every other plate on the
 * site, so a real work and an empty wall read as part of one catalogue.
 */
export default function ProjectCard({ project, index, tall }: ProjectCardProps) {
  const { pick, lang, dict } = useI18n()
  const title = pick(project.title)

  return (
    <Link to={`/works/${project.slug}`} className="group block" aria-label={title}>
      <div
        className={`relative overflow-hidden border border-[var(--gilt-line)] transition-colors duration-500 group-hover:border-[var(--gilt-line-strong)] ${
          tall ? 'aspect-[3/4]' : 'aspect-[4/3]'
        }`}
      >
        <Cover
          src={project.cover}
          seed={project.slug}
          hue={project.coverHue}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
        />

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

        <div className="absolute right-3.5 top-3.5 z-10">
          <StatusBadge status={project.status} />
        </div>

        {index && (
          <span className="absolute bottom-3.5 left-4 z-10 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-bone/45">
            {dict.common.plate} {index}
          </span>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-x-4 bottom-3 z-10 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-bone/75">
            {lang === 'en' ? 'Open the work →' : '进入作品 →'}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg leading-snug tracking-tight text-bone transition-colors duration-300 group-hover:text-gilt sm:text-xl">
          {title}
        </h3>
        {project.year && (
          <span className="shrink-0 font-mono text-[0.62rem] tracking-[0.14em] text-mist">
            {project.year}
          </span>
        )}
      </div>
      <p className="kicker mt-2">{categoryLabel(project.category, lang)}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-bone-dim">
        {pick(project.description)}
      </p>
    </Link>
  )
}
