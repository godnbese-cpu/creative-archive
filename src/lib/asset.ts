/**
 * Resolve a public asset path against the deploy base URL.
 *
 * - 'images/foo.svg'        → '<base>/images/foo.svg'
 * - '/images/foo.svg'       → '<base>/images/foo.svg'
 * - 'https://…' / 'data:…'  → returned untouched
 *
 * Using BASE_URL keeps asset paths correct both at the root (Vercel) and under
 * a sub-path (e.g. GitHub Pages project sites), and absolute resolution avoids
 * the classic SPA bug where a relative URL breaks on nested routes.
 */
export function asset(path: string): string {
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  return `${base}/${path.replace(/^\//, '')}`
}
