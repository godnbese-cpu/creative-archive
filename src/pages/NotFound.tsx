import { Link } from 'react-router-dom'
import { useI18n } from '@/lib/i18n'
import usePageTitle from '@/hooks/usePageTitle'
import PlateFrame from '@/components/PlateFrame'
import ProjectCover from '@/components/ProjectCover'
import { siteConfig } from '@/data/siteConfig'

export default function NotFound() {
  const { t, dict, lang } = useI18n()
  usePageTitle(dict.notFound.code)

  return (
    <main className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32">
      <div
        className="bloom left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'rgba(91,132,255,0.12)' }}
        aria-hidden="true"
      />

      <div className="shell relative grid w-full gap-12 md:grid-cols-12 md:gap-x-10">
        <div className="md:col-span-6 md:self-center">
          <p className="kicker kicker--gilt">{siteConfig.name}</p>
          <p
            className="font-display mt-4 text-[clamp(4.5rem,15vw,10rem)] leading-[0.82] text-bone/[0.14]"
            style={{ WebkitTextStroke: '1px rgba(217,201,164,0.25)' }}
            aria-hidden="true"
          >
            404
          </p>
          <h1 className="t-h1 mt-6 max-w-lg text-balance text-bone">
            {dict.notFound.title}
          </h1>
          <p className="prose-lede mt-5">{dict.notFound.body}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/works" className="btn btn--solid">
              {t('project.back')}
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link to="/" className="btn btn--ghost">
              {lang === 'en' ? 'Entrance' : '回到入口'}
            </Link>
          </div>
        </div>

        <div className="hidden md:col-span-4 md:col-start-9 md:block md:self-center">
          <PlateFrame
            index={`${dict.common.plate} —`}
            meta={lang === 'en' ? 'Missing from the catalogue' : '档案中缺失'}
          >
            <div className="aspect-[4/5] w-full overflow-hidden">
              <ProjectCover seed="missing-plate" hue={210} bare className="h-full w-full" />
            </div>
          </PlateFrame>
        </div>
      </div>
    </main>
  )
}
