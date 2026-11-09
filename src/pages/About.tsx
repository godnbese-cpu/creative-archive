import type { ReactNode } from 'react'
import Reveal from '@/components/Reveal'
import SectionLabel from '@/components/SectionLabel'
import PlateFrame from '@/components/PlateFrame'
import usePageTitle from '@/hooks/usePageTitle'
import PrismHall from '@/generative/PrismHall'
import { useI18n } from '@/lib/i18n'
import { siteConfig } from '@/data/siteConfig'

function Row({
  index,
  title,
  children,
}: {
  index: string
  title: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-8 border-t border-[var(--gilt-line)] py-14 md:grid-cols-12 md:gap-x-10 md:py-20">
      <div className="md:col-span-4">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-[0.6rem] tracking-[0.2em] text-gilt/70">
              {index}
            </span>
            <h2 className="kicker text-bone">{title}</h2>
          </div>
        </Reveal>
      </div>
      <div className="md:col-span-7 md:col-start-6">
        <Reveal delay={0.1}>{children}</Reveal>
      </div>
    </div>
  )
}

export default function About() {
  const { dict, lang } = useI18n()
  const a = dict.about
  usePageTitle(a.title)

  return (
    <main className="relative isolate overflow-hidden pb-28 pt-32">
      {/* room light — the same hall, turned down, so About reads as a room too */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[80vh]">
        <PrismHall
          intensity="quiet"
          className="absolute inset-0 h-full w-full opacity-[0.38]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(5,5,7,0.4) 0%, rgba(5,5,7,0.62) 44%, rgba(5,5,7,1) 100%)',
          }}
          aria-hidden="true"
        />
      </div>
      <div
        className="bloom -right-32 top-24 h-[30rem] w-[30rem]"
        style={{ background: 'rgba(157,132,255,0.14)' }}
        aria-hidden="true"
      />

      <div className="shell relative">
        <Reveal>
          <SectionLabel>{a.kicker}</SectionLabel>
        </Reveal>
        <div className="mt-6 grid gap-y-8 md:grid-cols-12 md:items-end md:gap-x-10">
          <Reveal delay={0.05} className="md:col-span-8">
            <h1 className="t-display text-bone">{a.title}</h1>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-3 md:col-start-10">
            <div className="border-t border-[var(--gilt-line)] pt-4 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-mist">
              <p>{siteConfig.role[lang]}</p>
              <p className="mt-2">{dict.hero.edition}</p>
            </div>
          </Reveal>
        </div>

        {/* opening spread: a typographic plate + statement */}
        <div className="mt-16 grid gap-10 md:grid-cols-12 md:gap-x-10">
          <Reveal className="md:col-span-4">
            <PlateFrame
              index={`${dict.common.plate} 001`}
              meta={lang === 'en' ? 'Abstract self' : '抽象自画像'}
            >
              <div
                className="relative aspect-[4/5] w-full overflow-hidden"
                style={{
                  background:
                    'linear-gradient(158deg, #161a30 0%, #101020 34%, #08080e 68%, #050507 100%)',
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(68% 46% at 64% 32%, rgba(157,132,255,0.26), transparent 72%), radial-gradient(52% 40% at 22% 78%, rgba(91,132,255,0.2), transparent 74%)',
                  }}
                  aria-hidden="true"
                />
                <div className="pointer-events-none absolute inset-[10px] border border-bone/[0.05]" aria-hidden="true" />
                <div className="relative flex h-full flex-col justify-between p-6">
                  <p className="font-mono text-[0.55rem] uppercase tracking-[0.26em] text-gilt/80">
                    Portrait — not a photograph
                  </p>
                  <div className="relative">
                    <p
                      className="font-display text-[6.5rem] leading-none tracking-[-0.04em] text-bone/[0.16]"
                      style={{ WebkitTextStroke: '1px rgba(244,240,231,0.22)' }}
                    >
                      001
                    </p>
                    <p className="mt-3 font-mono text-[0.55rem] uppercase tracking-[0.26em] text-mist">
                      Abstract self / generative
                    </p>
                  </div>
                  <div>
                    <div className="rule-ticks w-full" aria-hidden="true" />
                    <p className="mt-3 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mist">
                      {siteConfig.role[lang]} · MMXXVI
                    </p>
                  </div>
                </div>
              </div>
            </PlateFrame>
            <p className="mt-4 max-w-[19rem] text-[0.72rem] leading-relaxed text-mist">
              {a.portraitCaption}
            </p>
            <p className="mt-2 max-w-[19rem] text-[0.66rem] leading-relaxed text-mist/70">
              {a.portraitNote}
            </p>
          </Reveal>

          <div className="md:col-span-7 md:col-start-6 md:self-start">
            <Reveal delay={0.08}>
              <SectionLabel>{a.aboutMe.title}</SectionLabel>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 font-display text-[1.2rem] font-normal leading-[1.85] tracking-normal text-bone md:text-[1.35rem]">
                {a.aboutMe.body}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="rule-ticks mt-10" aria-hidden="true" />
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-8 max-w-md text-[0.78rem] leading-relaxed text-mist">
                {lang === 'en'
                  ? 'No invented degrees, clients, awards or commissions appear on this site. If a line is missing, it is because it has not happened yet.'
                  : '本站不编造学历、客户、奖项或商业成绩。若有信息缺失，是因为它还没有发生。'}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16">
          <Row index="02" title={a.philosophy.title}>
            <blockquote className="relative border-l border-[var(--gilt-line-strong)] pl-6">
              <p className="font-display text-xl italic leading-[1.5] text-bone md:text-[1.45rem]">
                {a.philosophy.body}
              </p>
            </blockquote>
          </Row>

          <Row index="03" title={a.interests.title}>
            <ul className="grid grid-cols-1 gap-0 sm:grid-cols-2">
              {a.interests.items.map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 border-b border-line py-3.5"
                >
                  <span className="font-mono text-[0.58rem] text-mist">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-base text-bone md:text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Row>

          <Row index="04" title={a.skills.title}>
            <ul className="flex flex-wrap gap-2.5">
              {a.skills.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line px-4 py-2 font-mono text-[0.7rem] tracking-[0.06em] text-bone-dim"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Row>

          <Row index="05" title={a.focus.title}>
            <p className="prose-lede text-[1.05rem]">{a.focus.body}</p>
            <p className="mt-10 font-display text-xl italic text-bone/60 md:text-2xl">
              {dict.hero.manifesto}
            </p>
          </Row>
        </div>
      </div>
    </main>
  )
}
