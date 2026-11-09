/**
 * Central site configuration.
 *
 * Fill in real values when available — everything here is a safe placeholder.
 * Empty strings render as "coming soon" instead of dead links, so nothing
 * breaks while the site is still being assembled.
 */
export const siteConfig = {
  name: 'CREATIVE ARCHIVE',
  monogram: 'CA',
  role: { en: 'Creative Technologist', zh: '创意技术者' },

  /**
   * Contact — leave email empty to show a "coming soon" state.
   * Fill it in and the contact area turns into a working mailto link.
   */
  contact: {
    email: '',
    /** Optional availability note, shown under the email. */
    note: {
      en: 'Currently open to collaborations & interesting experiments.',
      zh: '目前开放合作与有趣的实验项目。',
    },
  },

  /**
   * Optional social links. Empty string = hidden.
   * e.g. github: 'https://github.com/your-handle'
   */
  social: {
    github: '',
    twitter: '',
    instagram: '',
  },

  footer: {
    /** Tiny attribution line in the footer. */
    builtWith: { en: 'React · TypeScript · Vite', zh: 'React · TypeScript · Vite' },
  },
} as const

export type SiteConfig = typeof siteConfig
