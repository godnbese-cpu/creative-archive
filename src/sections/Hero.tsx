import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PrismHall from '@/generative/PrismHall'
import { useI18n } from '@/lib/i18n'
import { siteConfig } from '@/data/siteConfig'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Hero() {
  const { dict, lang } = useI18n()

  const lines =
    lang === 'en'
      ? [
          <>I build worlds,</>,
          <>
            stories &amp; <span className="text-iris">digital</span>
          </>,
          <span className="italic foil">experiences.</span>,
        ]
      : [
          <>我构建世界、</>,
          <>
            故事与数字<span className="foil">体验</span>。
          </>,
        ]

  const rail = [
    { k: 'plate', v: dict.hero.plateCaption },
    { k: 'system', v: dict.hero.plateSystem },
    { k: 'state', v: dict.hero.plateState },
  ]

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      {/* the house generative artwork — it lights up out of the dark */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: EASE, delay: 0.08 }}
      >
        <PrismHall className="h-full w-full" />
      </motion.div>

      {/* legibility: the hall is lit on the right, the type lives in the dark */}
      <div
        className="pointer-events-none absolute inset-0 -z-[5]"
        style={{
          background:
            'linear-gradient(96deg, rgba(5,5,7,0.97) 0%, rgba(5,5,7,0.9) 36%, rgba(5,5,7,0.44) 60%, rgba(5,5,7,0.06) 82%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-[4]"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,5,7,0.88) 0%, rgba(5,5,7,0) 24%, rgba(5,5,7,0) 56%, rgba(5,5,7,0.86) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-[3]"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 46%, rgba(5,5,7,0) 48%, rgba(5,5,7,0.7) 100%)',
        }}
      />

      <div className="shell relative z-10 w-full pb-20 pt-32 md:pb-24">
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          {/* ── statement ──────────────────────────────────────────────── */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="flex flex-wrap items-center gap-x-5 gap-y-3"
            >
              <p className="kicker kicker--gilt flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-gilt" aria-hidden="true" />
                {dict.hero.kicker}
              </p>
              <span
                className="hidden h-px w-16 bg-[var(--gilt-line-strong)] sm:block"
                aria-hidden="true"
              />
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-mist">
                {siteConfig.name} — {dict.hero.edition}
              </p>
            </motion.div>

            <h1 className="t-display mt-7 text-bone">
              {lines.map((line, i) => (
                <span
                  key={i}
                  className="-mb-[0.12em] block overflow-hidden pb-[0.12em]"
                >
                  <motion.span
                    className="block"
                    initial={{ y: '112%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.14 + i * 0.1, duration: 1.05, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="prose-lede mt-8 max-w-[32rem]"
            >
              {dict.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.8, ease: EASE }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link to="/works" className="btn btn--solid">
                {dict.hero.ctaWorks}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link to="/about" className="btn btn--ghost">
                {dict.hero.ctaAbout}
              </Link>
            </motion.div>
          </div>

          {/* ── wall label (top right, clear of the artefact) ───────────── */}
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="hidden lg:col-span-3 lg:col-start-10 lg:block lg:self-start lg:pt-1"
            aria-label={dict.hero.plateName}
            style={{ textShadow: '0 1px 24px rgba(5,5,7,0.85)' }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="h-1 w-1 rounded-full bg-acid"
                style={{ animation: 'pulse-soft 2.4s ease-in-out infinite' }}
                aria-hidden="true"
              />
              <p className="font-mono text-[0.56rem] uppercase tracking-[0.26em] text-mist">
                {dict.hero.plateState}
              </p>
            </div>
            <p className="font-display mt-4 text-[1.75rem] leading-none text-bone">
              {dict.hero.plateName}
            </p>
            <p className="mt-2 font-mono text-[0.56rem] uppercase tracking-[0.26em] text-gilt/80">
              {dict.hero.plateCaption}
            </p>
            <p className="mt-5 max-w-[17rem] font-display text-[1rem] leading-relaxed text-bone/60">
              “{dict.hero.manifesto}”
            </p>
          </motion.aside>
        </div>

        {/* ── caption rail — a museum label along the wall base ─────────── */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 1 }}
          className="absolute bottom-6 right-[var(--gutter)] hidden items-center gap-0 lg:flex"
        >
          {rail.map((m, i) => (
            <div
              key={m.k}
              className={`flex items-baseline gap-3 px-5 ${
                i === 0 ? 'pl-0' : 'border-l border-[var(--gilt-line)]'
              }`}
            >
              <dt className="font-mono text-[0.54rem] uppercase tracking-[0.24em] text-mist">
                {m.k}
              </dt>
              <dd className="font-mono text-[0.62rem] tracking-[0.06em] text-bone-dim">
                {m.v}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* scroll hint — a measured tick, not a bouncing arrow */}
      <div className="absolute bottom-7 left-[var(--gutter)] z-10 hidden sm:block">
        <div className="flex flex-col items-start gap-3">
          <span className="relative block h-12 w-px overflow-hidden bg-[var(--gilt-line)]">
            <span
              className="absolute inset-x-0 top-0 h-1/2 bg-gilt/70"
              style={{
                animation: 'scroll-hint 2.4s cubic-bezier(0.65,0,0.35,1) infinite',
              }}
            />
          </span>
          <span className="font-mono text-[0.54rem] uppercase tracking-[0.36em] text-mist">
            {dict.hero.scroll}
          </span>
        </div>
      </div>
    </section>
  )
}
