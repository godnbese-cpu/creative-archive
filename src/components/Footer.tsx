import { Link } from 'react-router-dom'
import { useI18n } from '@/lib/i18n'
import { siteConfig } from '@/data/siteConfig'

const NAV = [
  { to: '/works', key: 'nav.works' },
  { to: '/about', key: 'nav.about' },
  { to: '/lab', key: 'nav.lab' },
]

export default function Footer() {
  const { t, dict, lang } = useI18n()
  const year = new Date().getFullYear()
  const email = siteConfig.contact.email
  const socials = Object.entries(siteConfig.social).filter(
    ([, url]) => url !== '',
  ) as [string, string][]

  return (
    <footer className="relative mt-24 border-t border-[var(--gilt-line)]">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-6">
            <p className="font-display max-w-xl text-xl leading-snug text-bone md:text-[1.6rem]">
              {dict.footer.tagline}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist">
              {siteConfig.contact.note[lang]}
            </p>
            <div className="rule-ticks mt-8 max-w-xs" aria-hidden="true" />
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <p className="kicker mb-5">{dict.footer.navigate}</p>
            <nav className="flex flex-col items-start gap-3">
              {NAV.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="link-line font-mono text-[0.66rem] uppercase tracking-[0.2em] text-bone-dim hover:text-bone"
                >
                  {t(l.key)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3 md:col-start-10">
            <p className="kicker mb-5">{dict.footer.contact}</p>
            {email ? (
              <a
                href={`mailto:${email}`}
                className="link-line font-mono text-[0.66rem] tracking-[0.1em] text-bone-dim hover:text-bone"
              >
                {email}
              </a>
            ) : (
              <span className="font-mono text-[0.66rem] tracking-[0.1em] text-mist">
                {t('home.contact.comingSoon')}
              </span>
            )}
            {socials.length > 0 && (
              <nav className="mt-5 flex flex-col items-start gap-3" aria-label="Social">
                {socials.map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-line font-mono text-[0.66rem] uppercase tracking-[0.18em] text-bone-dim hover:text-bone"
                  >
                    {name}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[0.62rem] tracking-[0.14em] text-mist">
            © {year} {siteConfig.name}. {dict.footer.rights}
          </p>
          <p className="font-mono text-[0.62rem] tracking-[0.14em] text-mist">
            {dict.footer.edition} · {siteConfig.footer.builtWith[lang]}
          </p>
        </div>
      </div>

      {/* signature: the name set as an engraved footer plate */}
      <div className="overflow-hidden border-t border-[var(--gilt-line)]">
        <div className="shell py-8">
          <p className="font-display select-none text-center text-[clamp(2rem,9vw,8rem)] leading-none tracking-[-0.02em] text-bone/[0.07]">
            {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
