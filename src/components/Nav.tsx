import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { siteConfig } from '@/data/siteConfig'
import LanguageToggle from './LanguageToggle'

const LINKS = [
  { to: '/works', key: 'nav.works' },
  { to: '/about', key: 'nav.about' },
  { to: '/lab', key: 'nav.lab' },
]

export default function Nav() {
  const { t, dict } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `link-line font-mono text-[0.68rem] uppercase tracking-[0.22em] transition-colors duration-300 ${
      isActive ? 'text-bone' : 'text-mist hover:text-bone'
    }`

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-[var(--gilt-line)] bg-ink/72 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <div className="shell flex items-center justify-between py-4">
          <Link to="/" className="group flex items-center gap-3" aria-label={siteConfig.name}>
            <span className="grid h-8 w-8 place-items-center border border-[var(--gilt-line-strong)] font-mono text-[0.6rem] tracking-[0.08em] text-gilt transition-colors duration-300 group-hover:border-gilt/70 group-hover:text-bone">
              {siteConfig.monogram}
            </span>
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.3em] text-bone">
              {siteConfig.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
                {t(l.key)}
              </NavLink>
            ))}
            <span className="h-4 w-px bg-[var(--gilt-line)]" aria-hidden="true" />
            <LanguageToggle />
          </nav>

          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-mist lg:flex">
              <span
                className="h-1 w-1 rounded-full bg-acid"
                style={{ animation: 'pulse-soft 2.8s ease-in-out infinite' }}
                aria-hidden="true"
              />
              {dict.home.contact.openLabel}
            </span>
            <button
              type="button"
              className="flex flex-col items-end gap-1.5 md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <span className="block h-px w-6 bg-bone" />
              <span className="block h-px w-4 bg-bone/60" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink/96 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="shell flex items-center justify-between py-4">
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.3em] text-bone">
                {siteConfig.name}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase tracking-[0.2em] text-bone-dim"
                aria-label="Close menu"
              >
                Close ✕
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-[var(--gutter)]">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5 }}
                >
                  <NavLink
                    to={l.to}
                    className="font-display block border-b border-[var(--gilt-line)] py-5 text-4xl text-bone"
                  >
                    {t(l.key)}
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-8">
                <LanguageToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
