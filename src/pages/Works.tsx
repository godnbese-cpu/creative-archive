import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '@/components/Reveal'
import SectionLabel from '@/components/SectionLabel'
import PlateFrame from '@/components/PlateFrame'
import ProjectCard from '@/components/ProjectCard'
import ProjectCover from '@/components/ProjectCover'
import usePageTitle from '@/hooks/usePageTitle'
import { projects } from '@/data/projects'
import { categories } from '@/data/categories'
import { useI18n } from '@/lib/i18n'
import type { CategoryId } from '@/types'

type Filter = CategoryId | 'all'

/**
 * Exhibition grid rhythm — spans and cover ratios repeat in a cadence rather
 * than a uniform column, so the page reads like a gallery wall, not a grid
 * of cards. Odd items sit slightly lower on desktop for a staggered hang.
 */
const SPANS = [
  'lg:col-span-7',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-7',
  'lg:col-span-6',
  'lg:col-span-6',
]
const TALL = [true, false, false, true, false, false]

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] transition-all duration-300 ${
        active
          ? 'border-[var(--gilt-line-strong)] bg-bone/[0.06] text-bone'
          : 'border-line text-bone-dim hover:border-[var(--gilt-line)] hover:text-bone'
      }`}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

export default function Works() {
  const { dict, pick, lang } = useI18n()
  const [active, setActive] = useState<Filter>('all')
  usePageTitle(dict.works.title)

  const filtered = useMemo(
    () =>
      active === 'all'
        ? projects
        : projects.filter((p) => p.category === active),
    [active],
  )

  const activeLabel =
    active === 'all'
      ? dict.works.filterAll
      : pick(categories.find((c) => c.id === active)?.label ?? categories[0].label)

  const countLabel = (n: number) =>
    lang === 'en' ? `${n} ${dict.works.count}` : `${n} ${dict.works.count}`

  return (
    <main className="relative pb-28 pt-32">
      {/* letterhead */}
      <div className="shell">
        <Reveal>
          <SectionLabel>{dict.works.kicker}</SectionLabel>
        </Reveal>

        <div className="mt-6 grid gap-y-6 md:grid-cols-12 md:items-end md:gap-x-10">
          <Reveal delay={0.05} className="md:col-span-7">
            <h1 className="t-display text-bone">{dict.works.title}</h1>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
            <div className="border-t border-[var(--gilt-line)] pt-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-mist">
                {dict.common.index}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-bone-dim">
                {dict.works.subtitle}
              </p>
              <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gilt/70">
                {filtered.length} {dict.works.count}
              </p>
            </div>
          </Reveal>
        </div>

        {/* filters */}
        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap gap-2.5">
            <FilterPill active={active === 'all'} onClick={() => setActive('all')}>
              {dict.works.filterAll}
            </FilterPill>
            {categories.map((c) => (
              <FilterPill
                key={c.id}
                active={active === c.id}
                onClick={() => setActive(c.id)}
              >
                {pick(c.label)}
              </FilterPill>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ── the floor ─────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="shell mt-14">
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20 lg:grid-cols-12">
            {filtered.map((p, i) => {
              const k = i % SPANS.length
              return (
                <Reveal key={p.id} delay={(i % 3) * 0.06} className={SPANS[k]}>
                  <div className={k % 2 === 1 ? 'lg:translate-y-16' : ''}>
                    <ProjectCard project={p} tall={TALL[k]} />
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="mt-14">
          <div className="shell">
            <div className="grid gap-10 md:grid-cols-12 md:gap-x-10">
              {/* the empty wall */}
              <Reveal className="md:col-span-7">
                <PlateFrame
                  bare
                  overlay={
                    <div className="flex items-center gap-2.5 rounded-full border border-[var(--gilt-line)] bg-ink/70 px-3.5 py-1.5 backdrop-blur-sm">
                      <span
                        className="h-1 w-1 rounded-full bg-gilt/80"
                        style={{ animation: 'pulse-soft 3s ease-in-out infinite' }}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-bone-dim">
                        {dict.works.emptyKicker}
                      </span>
                    </div>
                  }
                >
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <ProjectCover
                      seed={`empty-${active}`}
                      hue={active === 'all' ? 226 : 210 + categories.findIndex((c) => c.id === active) * 26}
                      bare
                      className="h-full w-full"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/85 to-transparent px-5 pb-5 pt-14">
                    <p className="font-display text-lg leading-tight text-bone md:text-2xl">
                      {active === 'all'
                        ? dict.works.emptyTitle
                        : dict.works.categoryEmptyTitle}
                    </p>
                    <p className="shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-gilt/80">
                      {active === 'all'
                        ? `${dict.common.plate} 000`
                        : `${dict.common.plate} 000 · ${activeLabel}`}
                    </p>
                  </div>
                </PlateFrame>
              </Reveal>

              {/* the label */}
              <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-center">
                <p className="kicker kicker--gilt">{dict.works.emptyKicker}</p>
                <p className="mt-5 text-[0.95rem] leading-relaxed text-bone-dim">
                  {active === 'all'
                    ? dict.works.emptyBody
                    : dict.works.categoryEmptyBody}
                </p>
                <div className="rule-ticks mt-8" aria-hidden="true" />
                <Link
                  to="/"
                  className="link-line mt-6 inline-block font-mono text-[0.62rem] uppercase tracking-[0.2em] text-bone-dim hover:text-bone"
                >
                  ← {dict.works.emptyCta}
                </Link>
              </Reveal>
            </div>

            {/* category index — a acquisition register, honest about zero */}
            <div className="mt-20 grid gap-8 md:grid-cols-12 md:gap-x-10">
              <div className="md:col-span-3">
                <p className="kicker kicker--gilt">{dict.works.indexTitle}</p>
                <p className="mt-3 max-w-[18rem] text-[0.82rem] leading-relaxed text-mist">
                  {dict.works.indexHint}
                </p>
              </div>
              <div className="md:col-span-8 md:col-start-5">
                <ul className="border-t border-[var(--gilt-line)]">
                  {categories.map((c, i) => {
                    const n = projects.filter((p) => p.category === c.id).length
                    const isActive = active === c.id
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => setActive(c.id)}
                          className={`group flex w-full items-center gap-4 border-b border-line px-1 py-4 text-left transition-colors duration-300 hover:bg-bone/[0.03] ${
                            isActive ? 'bg-bone/[0.04]' : ''
                          }`}
                          aria-pressed={isActive}
                        >
                          <span className="w-8 shrink-0 font-mono text-[0.62rem] text-mist">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-display flex-1 text-base text-bone transition-colors group-hover:text-gilt md:text-lg">
                            {pick(c.label)}
                          </span>
                          <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mist">
                            {countLabel(n)}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
