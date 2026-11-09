import { Link, useParams } from 'react-router-dom'
import Reveal from '@/components/Reveal'
import SectionLabel from '@/components/SectionLabel'
import StatusBadge from '@/components/StatusBadge'
import Cover from '@/components/Cover'
import PlateFrame from '@/components/PlateFrame'
import ProjectCard from '@/components/ProjectCard'
import ProjectCover from '@/components/ProjectCover'
import usePageTitle from '@/hooks/usePageTitle'
import { asset } from '@/lib/asset'
import { getProjectBySlug, projects } from '@/data/projects'
import { categoryLabel } from '@/data/categories'
import { useI18n } from '@/lib/i18n'

/** Editorial gallery cadence — alternating widths keep the wall irregular. */
const GALLERY_SPANS = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7']

/**
 * The frame exists, the label exists, nothing is hanging on it. Every project
 * address that has no work behind it lands here instead of a generic 404, so
 * an unfinished archive still feels curated.
 */
function EmptyPlate({ slug }: { slug?: string }) {
  const { dict, lang } = useI18n()
  usePageTitle(dict.project.notInstalled.title)

  return (
    <main className="pb-28 pt-32">
      <div className="shell">
        <Reveal>
          <Link
            to="/works"
            className="link-line font-mono text-[0.62rem] uppercase tracking-[0.22em] text-mist hover:text-bone"
          >
            ← {dict.project.back}
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-x-10">
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
                    {dict.project.notInstalled.kicker}
                  </span>
                </div>
              }
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <ProjectCover
                  seed={`plate-${slug ?? 'unknown'}`}
                  hue={236}
                  bare
                  className="h-full w-full"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/85 to-transparent px-5 pb-5 pt-14">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gilt/80">
                  /works/{slug}
                </p>
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-mist">
                  {lang === 'en' ? 'Plate — empty' : '展板 — 空'}
                </p>
              </div>
            </PlateFrame>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-center">
            <SectionLabel>{dict.project.notInstalled.kicker}</SectionLabel>
            <h1 className="font-display mt-5 text-[clamp(1.75rem,2.6vw,2.35rem)] leading-[1.25] tracking-tight text-bone">
              {dict.project.notInstalled.title}
            </h1>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-bone-dim">
              {dict.project.notInstalled.body}
            </p>
            <div className="rule-ticks mt-8" aria-hidden="true" />
            <Link to="/works" className="btn btn--ghost mt-7 inline-flex">
              {dict.project.notInstalled.hint}
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </main>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t, pick, lang } = useI18n()
  const project = slug ? getProjectBySlug(slug) : undefined
  usePageTitle(project ? pick(project.title) : undefined)

  if (!project) return <EmptyPlate slug={slug} />

  const related = projects
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 2)
  const fallback = projects.filter((p) => p.id !== project.id).slice(0, 2)
  const finalRelated = related.length > 0 ? related : fallback

  const sections: { title: string; body: string }[] = []
  if (project.overview) {
    sections.push({ title: t('project.overview'), body: pick(project.overview) })
  }
  if (project.concept) {
    sections.push({ title: t('project.concept'), body: pick(project.concept) })
  }
  if (project.process) {
    sections.push({ title: t('project.process'), body: pick(project.process) })
  }

  const gallery = project.gallery ?? []
  const title = pick(project.title)

  return (
    <main className="pb-28 pt-28">
      <div className="shell">
        <Reveal>
          <Link
            to="/works"
            className="link-line font-mono text-[0.62rem] uppercase tracking-[0.22em] text-mist hover:text-bone"
          >
            ← {t('project.back')}
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-8">
            <Reveal>
              <h1 className="t-h1 max-w-3xl text-balance text-bone">{title}</h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="prose-lede mt-6 max-w-2xl">{pick(project.description)}</p>
            </Reveal>
          </div>

          <div className="md:col-span-3 md:col-start-10 md:pt-2">
            <Reveal delay={0.12}>
              <dl className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-[var(--gilt-line)] pb-3">
                  <dt className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-mist">
                    {t('project.status')}
                  </dt>
                  <dd>
                    <StatusBadge status={project.status} />
                  </dd>
                </div>
                {project.year && (
                  <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                    <dt className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-mist">
                      {t('project.year')}
                    </dt>
                    <dd className="font-mono text-xs text-bone-dim">{project.year}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                  <dt className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-mist">
                    {t('project.category')}
                  </dt>
                  <dd className="text-right font-mono text-xs text-bone-dim">
                    {categoryLabel(project.category, lang)}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1} className="mt-12">
          <PlateFrame
            index={`${t('common.plate')} 001`}
            meta={project.year ?? categoryLabel(project.category, lang)}
          >
            <div className="aspect-[16/9] w-full overflow-hidden">
              <Cover
                src={project.cover}
                seed={project.slug}
                hue={project.coverHue}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
          </PlateFrame>
        </Reveal>

        {sections.length > 0 ? (
          <div className="mt-20 grid md:grid-cols-12 md:gap-x-10">
            <div className="space-y-16 md:col-span-8 md:col-start-3">
              {sections.map((s, i) => (
                <Reveal key={s.title}>
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono text-[0.6rem] tracking-[0.2em] text-gilt/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <SectionLabel>{s.title}</SectionLabel>
                  </div>
                  <p className="prose-lede mt-5">{s.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <Reveal className="mt-20">
            <div className="border-t border-[var(--gilt-line)] pt-8">
              <p className="kicker kicker--gilt">{t('project.inProduction')}</p>
            </div>
          </Reveal>
        )}

        {gallery.length > 0 && (
          <div className="mt-20">
            <Reveal>
              <SectionLabel>{t('project.gallery')}</SectionLabel>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
              {gallery.map((src, i) => (
                <Reveal
                  key={src + i}
                  delay={(i % 2) * 0.08}
                  className={GALLERY_SPANS[i % GALLERY_SPANS.length]}
                >
                  <div
                    className={`overflow-hidden border border-[var(--gilt-line)] ${
                      i % 2 === 0 ? 'aspect-[16/10]' : 'aspect-[4/5] md:aspect-[3/4]'
                    }`}
                  >
                    <Cover
                      src={src}
                      seed={`${project.slug}-${i}`}
                      hue={project.coverHue}
                      alt={`${title} — ${t('project.gallery')} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {project.video && (
          <Reveal className="mt-20">
            <div>
              <SectionLabel>{t('project.video')}</SectionLabel>
              <div className="mt-10 overflow-hidden border border-[var(--gilt-line)] bg-carbon">
                <video
                  className="aspect-video w-full"
                  src={asset(project.video)}
                  controls
                  preload="metadata"
                  playsInline
                />
              </div>
            </div>
          </Reveal>
        )}

        {project.tools && project.tools.length > 0 && (
          <Reveal className="mt-20">
            <div className="border-t border-[var(--gilt-line)] pt-10">
              <SectionLabel>{t('project.tools')}</SectionLabel>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-line px-4 py-1.5 font-mono text-xs text-bone-dim"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {finalRelated.length > 0 && (
          <div className="mt-20 border-t border-line pt-12">
            <Reveal>
              <SectionLabel>{t('project.related')}</SectionLabel>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {finalRelated.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
