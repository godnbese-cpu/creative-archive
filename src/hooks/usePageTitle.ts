import { useEffect } from 'react'
import { siteConfig } from '@/data/siteConfig'

const BASE_TITLE = 'CREATIVE ARCHIVE — Ideas become worlds.'

/**
 * Per-page document title. Pass a page name to get "Name — CREATIVE ARCHIVE",
 * or call with no arguments to restore the site-level title. Re-runs when the
 * language changes so titles can be localized by the caller.
 */
export default function usePageTitle(name?: string) {
  useEffect(() => {
    document.title = name ? `${name} — ${siteConfig.name}` : BASE_TITLE
  }, [name])
}
