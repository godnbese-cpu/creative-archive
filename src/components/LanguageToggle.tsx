import { useI18n } from '@/lib/i18n'

export default function LanguageToggle() {
  const { lang, setLang } = useI18n()
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-bone-dim transition-colors duration-300 hover:border-bone/30 hover:text-bone"
      aria-label={lang === 'en' ? 'Switch to Chinese' : '切换到英文'}
    >
      <span className={lang === 'en' ? 'text-electric' : ''}>EN</span>
      <span className="text-mist/40">/</span>
      <span className={lang === 'zh' ? 'text-electric' : ''}>中文</span>
    </button>
  )
}
