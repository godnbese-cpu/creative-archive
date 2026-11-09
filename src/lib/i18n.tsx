import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { Lang, LocalizedText } from '@/types'
import { translations } from '@/data/translations'
import type { Dict } from '@/data/translations'

interface I18nContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  /** Look up a UI string by dot path, e.g. t('nav.works'). */
  t: (path: string) => string
  /** Pick the current language from a LocalizedText. */
  pick: (obj: LocalizedText) => string
  /** The full dictionary for the current language. */
  dict: Dict
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = 'ca-lang'

function initialLang(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') return stored
    // The archive opens in English for an international audience; the switcher
    // is one tap away and the choice is remembered.
    return 'en'
  } catch {
    return 'en'
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* storage unavailable — ignore */
    }
  }, [])

  const t = useCallback(
    (path: string): string => {
      const parts = path.split('.')
      let node: unknown = translations[lang]
      for (const part of parts) {
        if (node && typeof node === 'object') {
          node = (node as Record<string, unknown>)[part]
        } else {
          return path
        }
      }
      return typeof node === 'string' ? node : path
    },
    [lang],
  )

  const pick = useCallback(
    (obj: LocalizedText): string => obj[lang],
    [lang],
  )

  const value: I18nContextValue = {
    lang,
    setLang,
    t,
    pick,
    dict: translations[lang],
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
