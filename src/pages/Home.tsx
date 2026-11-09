import { Link } from 'react-router-dom'
import Hero from '@/sections/Hero'
import PrismHall from '@/generative/PrismHall'
import Reveal from '@/components/Reveal'
import SectionLabel from '@/components/SectionLabel'
import PlateFrame from '@/components/PlateFrame'
import ProjectCard from '@/components/ProjectCard'
import ProjectCover from '@/components/ProjectCover'
import StatusBadge from '@/components/StatusBadge'
import usePageTitle from '@/hooks/usePageTitle'
import { splitHeading } from '@/lib/text'
import { featuredProjects } from '@/data/projects'
import { labExperiments } from '@/data/labExperiments'
import { siteConfig } from '@/data/siteConfig'
import { useI18n } from '@/lib/i18n'

const SPANS = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7']

export default function Home() {
  const { dict, pick, lang } = useI18n()
  usePageTitle()
  const featured = featuredProjects.slice(0, 4)
  const email = siteConfig.contact.email

  return (
    <main>
      <Hero />

      {/* ── 01 — Selected Works ───────────────────────────────────────── */}
      <section className="relative border-t border-line">
        <div className="shell py-24 md:py-32">
          <Reveal>
            <SectionLabel index="01">{dict.home.selectedWorks.kicker}</SectionLabel>
          </Reveal>

          <div className="mt-7 grid gap-y-8 md:grid-cols-12 md:gap-x-10">
            <Reveal delay={0.05} className="md:col-span-6">
              <h2 className="t-h1 text-bone">
                {splitHeading(dict.home.selectedWorks.title).map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </Reveal>
            <Reveal delay={0.12} className="md:col-span-5 md:col-start-8 md:self-end">
              <p className="prose-lede">{dict.home.selectedWorks.body}</p>
              <Link
                to="/works"
                className="btn btn--ghost mt-7 inline-flex"
              >
                {dict.home.selectedWorks.viewAll}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          {featured.length > 0 ? (
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-12">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06} className={SPANS[i]}>
                  <div className={i % 2 === 1 ? 'md:translate-y-14' : ''}>
                    <ProjectCard
                      project={p}
                      index={`0${i + 1}`}
                      tall={i === 0 || i === 3}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            /* The wall, built but not yet hung. It is shown as an exhibit of
               its own so an empty archive reads as a stage, not a failure. */
            <div className="mt-16 grid gap-10 md:grid-cols-12 md:gap-x-10">
              <Reveal className="md:col-span-4 md:self-center">
                <p className="kicker kicker--gilt">
                  {dict.home.selectedWorks.emptyLabel}
                </p>
                <h3 className="font-display mt-4 text-2xl leading-tight text-bone md:text-[1.9rem]">
                  {dict.home.selectedWorks.emptyTitle}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-dim">
                  {dict.home.selectedWorks.emptyBody}
                </p>
                <div className="rule-ticks mt-8 w-24" aria-hidden="true" />
              </Reveal>

              <Reveal delay={0.1} className="md:col-span-7 md:col-start-6">
                <PlateFrame
                  index={`${dict.common.plate} 01`}
                  meta={lang === 'en' ? 'Awaiting work — 2026' : '等待作品 — 2026'}
                >
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <ProjectCover
                      seed="empty-wall-home"
                      hue={228}
                      bare
                      className="h-full w-full"
                    />
                  </div>
                </PlateFrame>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* ── 02 — About the creator ────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-line">
        <div
          className="bloom -left-24 top-1/3 h-[26rem] w-[26rem]"
          style={{ background: 'rgba(91,132,255,0.16)' }}
          aria-hidden="true"
        />
        <div className="shell relative grid gap-14 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-4">
            <Reveal>
              <SectionLabel index="02">{dict.home.aboutTeaser.kicker}</SectionLabel>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="t-h1 mt-6 text-bone">{dict.home.aboutTeaser.title}</h2>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-12 hidden items-center gap-5 md:flex">
                <span className="grid h-11 w-11 place-items-center border border-[var(--gilt-line-strong)] font-mono text-[0.7rem] tracking-[0.08em] text-gilt">
                  {siteConfig.monogram}
                </span>
                <div className="border-l border-[var(--gilt-line)] pl-5">
                  <p className="font-mono text-[0.56rem] uppercase tracking-[0.24em] text-mist">
                    {siteConfig.role[lang]}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.56rem] uppercase tracking-[0.24em] text-gilt/70">
                    {dict.hero.edition}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.1}>
              <p className="prose-lede text-[1.08rem]">
                {dict.home.aboutTeaser.body}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <blockquote className="relative mt-10 border-l border-[var(--gilt-line-strong)] pl-6">
                <p className="font-display text-xl leading-[1.45] text-bone md:text-[1.5rem]">
                  {dict.home.aboutTeaser.principle}
                </p>
              </blockquote>
            </Reveal>
            <Reveal delay={0.26}>
              <Link to="/about" className="btn mt-10">
                {dict.home.aboutTeaser.cta}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 03 — Experiments ──────────────────────────────────────────── */}
      <section className="border-t border-line">
        <div className="shell py-24 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <SectionLabel index="03">{dict.home.experiments.kicker}</SectionLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="t-h1 mt-6 text-bone">{dict.home.experiments.title}</h2>
              </Reveal>
            </div>
            <Reveal delay={0.14}>
              <Link to="/lab" className="btn hidden md:inline-flex">
                {dict.home.experiments.viewAll}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="prose-lede mt-6">{dict.home.experiments.body}</p>
          </Reveal>

          {labExperiments.length > 0 ? (
            <div className="mt-14 border-t border-line">
              {labExperiments.slice(0, 3).map((e, i) => (
                <Reveal key={e.id} delay={i * 0.05}>
                  <div className="group grid grid-cols-12 items-center gap-4 border-b border-line py-6 transition-colors duration-300 hover:bg-carbon/50">
                    <span className="col-span-2 font-mono text-xs text-mist md:col-span-1">
                      0{i + 1}
                    </span>
                    <h3 className="col-span-7 font-display text-xl text-bone transition-colors group-hover:text-electric md:col-span-5 md:text-2xl">
                      {pick(e.title)}
                    </h3>
                    <span className="col-span-3 font-mono text-xs uppercase tracking-[0.14em] text-mist md:col-span-4">
                      {pick(e.type)}
                    </span>
                    <span className="col-span-12 flex justify-end md:col-span-2">
                      <StatusBadge status={e.status} />
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-14 grid gap-8 border-t border-[var(--gilt-line)] pt-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="font-display text-xl text-bone/90">
                  {dict.home.experiments.emptyTitle}
                </p>
              </div>
              <div className="md:col-span-6 md:col-start-6">
                <p className="text-sm leading-relaxed text-bone-dim">
                  {dict.home.experiments.emptyBody}
                </p>
                <Link to="/lab" className="link-line mt-5 inline-block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-gilt">
                  {dict.home.experiments.viewAll} →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 04 — Contact ──────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-t border-line">
        <PrismHall intensity="quiet" className="absolute inset-0 -z-10 h-full w-full opacity-70" />
        <div
          className="pointer-events-none absolute inset-0 -z-[5]"
          style={{
            background:
              'linear-gradient(180deg, rgba(5,5,7,0.92) 0%, rgba(5,5,7,0.5) 45%, rgba(5,5,7,0.95) 100%)',
          }}
        />
        <div className="shell relative flex flex-col items-center py-28 text-center md:py-40">
          <Reveal>
            <SectionLabel index="04">{dict.home.contact.kicker}</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="t-h1 mt-9 max-w-3xl text-bone">
              {splitHeading(dict.home.contact.title).map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="prose-lede mx-auto mt-6 text-center">{dict.home.contact.body}</p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {email ? (
                <a href={`mailto:${email}`} className="btn btn--solid">
                  {dict.home.contact.cta}
                  <span className="btn-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              ) : (
                <span className="btn btn--ghost pointer-events-none text-mist">
                  {dict.home.contact.comingSoon}
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gilt-line)] px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gilt/80">
                <span
                  className="h-1 w-1 rounded-full bg-acid"
                  style={{ animation: 'pulse-soft 2.4s ease-in-out infinite' }}
                  aria-hidden="true"
                />
                {dict.home.contact.openLabel}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-9 max-w-sm text-sm leading-relaxed text-mist">
              {siteConfig.contact.note[lang]}
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
