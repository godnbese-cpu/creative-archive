import Reveal from '@/components/Reveal'
import SectionLabel from '@/components/SectionLabel'
import PlateFrame from '@/components/PlateFrame'
import StatusBadge from '@/components/StatusBadge'
import ProjectCover from '@/components/ProjectCover'
import usePageTitle from '@/hooks/usePageTitle'
import { labExperiments } from '@/data/labExperiments'
import { useI18n } from '@/lib/i18n'
import type { LabStatus } from '@/types'

const LEDGER_STATUSES: LabStatus[] = [
  'idea',
  'experiment',
  'prototype',
  'in-progress',
  'completed',
]

export default function Lab() {
  const { dict, pick, lang } = useI18n()
  usePageTitle(dict.lab.title)

  return (
    <main className="relative pb-28 pt-32">
      <div
        className="bloom -left-24 top-1/2 h-[26rem] w-[26rem]"
        style={{ background: 'rgba(157,240,138,0.08)' }}
        aria-hidden="true"
      />

      <div className="shell relative">
        <Reveal>
          <SectionLabel>{dict.lab.kicker}</SectionLabel>
        </Reveal>
        <div className="mt-6 grid gap-y-8 md:grid-cols-12 md:items-end md:gap-x-10">
          <Reveal delay={0.05} className="md:col-span-7">
            <h1 className="t-h1 max-w-2xl text-balance text-bone">{dict.lab.title}</h1>
            <p className="prose-lede mt-6">{dict.lab.subtitle}</p>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
            <div className="border-t border-[var(--gilt-line)] pt-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-mist">
                {dict.lab.ledgerTitle}
              </p>
              <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-gilt/70">
                {labExperiments.length}{' '}
                {lang === 'en' ? 'entries' : '条记录'}
              </p>
              <p className="mt-3 text-[0.78rem] leading-relaxed text-mist">
                {dict.lab.note}
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-x-10">
          {/* ── ledger ─────────────────────────────────────────────── */}
          <div className="md:col-span-8">
            {labExperiments.length > 0 ? (
              <div className="border-t border-[var(--gilt-line)]">
                {labExperiments.map((e, i) => (
                  <Reveal key={e.id} delay={i * 0.04}>
                    <div className="group grid grid-cols-12 items-center gap-4 border-b border-line py-7 transition-colors duration-300 hover:bg-carbon/40">
                      <span className="col-span-2 font-mono text-[0.62rem] text-mist md:col-span-1">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="col-span-2 md:col-span-1">
                        <div className="aspect-square w-14 overflow-hidden border border-[var(--gilt-line)] transition-colors duration-300 group-hover:border-gilt/40">
                          <ProjectCover
                            seed={e.id}
                            hue={e.coverHue}
                            className="h-full w-full"
                          />
                        </div>
                      </div>
                      <div className="col-span-8 md:col-span-4">
                        <h2 className="font-display text-lg text-bone transition-colors group-hover:text-gilt md:text-xl">
                          {pick(e.title)}
                        </h2>
                        <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-mist">
                          {pick(e.type)}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        {e.description && (
                          <p className="max-w-md text-[0.8rem] leading-relaxed text-bone-dim">
                            {pick(e.description)}
                          </p>
                        )}
                      </div>
                      <div className="col-span-12 flex items-center gap-3 md:col-span-3 md:flex-col md:items-end md:gap-1.5">
                        {e.version && (
                          <span className="font-mono text-[0.6rem] text-mist">{e.version}</span>
                        )}
                        {e.date && (
                          <span className="font-mono text-[0.6rem] text-mist">{e.date}</span>
                        )}
                        <StatusBadge status={e.status} />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              /* Empty ledger: ruled paper, one honest line. */
              <Reveal>
                <div className="border-y border-[var(--gilt-line)]">
                  <div className="flex items-center justify-between border-b border-line px-1 py-3">
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-mist">
                      {lang === 'en' ? 'No.' : '序'}
                    </span>
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-mist">
                      {lang === 'en' ? 'Entry · Version · State' : '条目 · 版本 · 状态'}
                    </span>
                  </div>

                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-line/60 px-1 py-6"
                    >
                      <span className="font-mono text-[0.62rem] text-mist/40">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="h-px flex-1 mx-6 bg-line/70" aria-hidden="true" />
                      <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-mist/40">
                        —
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-3">
                  <p className="font-display text-xl text-bone">
                    {dict.lab.emptyTitle}
                  </p>
                  <p className="max-w-lg text-[0.85rem] leading-relaxed text-bone-dim">
                    {dict.lab.emptyBody}
                  </p>
                </div>
              </Reveal>
            )}

            {/* status legend — the system, not fake data */}
            <Reveal delay={0.1}>
              <div className="mt-16 border-t border-[var(--gilt-line)] pt-8">
                <p className="kicker kicker--gilt">{dict.lab.legendTitle}</p>
                <ul className="mt-6 flex flex-wrap gap-2.5">
                  {LEDGER_STATUSES.map((s) => (
                    <li key={s} className="flex items-center gap-2.5">
                      <StatusBadge status={s} />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* ── the plate ──────────────────────────────────────────── */}
          <Reveal delay={0.12} className="md:col-span-3 md:col-start-10">
            <PlateFrame
              index={`${dict.common.plate} 003`}
              meta={lang === 'en' ? 'Laboratory view' : '实验室视角'}
            >
              <div className="aspect-[3/4] w-full overflow-hidden">
                <ProjectCover seed="lab-plate" hue={150} className="h-full w-full" />
              </div>
            </PlateFrame>
            <p className="mt-4 text-[0.72rem] leading-relaxed text-mist">
              {lang === 'en'
                ? 'The lab is a notebook, not a showcase. Entries appear only when an experiment actually ran.'
                : '实验室是笔记本，不是橱窗。只有真正跑过的实验才会被记录。'}
            </p>
          </Reveal>
        </div>
      </div>
    </main>
  )
}
