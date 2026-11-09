export type Lang = 'en' | 'zh'

/** Bilingual text carried by content data. */
export interface LocalizedText {
  en: string
  zh: string
}

export type CategoryId =
  | 'original-worlds'
  | 'games-interactive'
  | 'ai-visual-stories'
  | 'global-creative'
  | 'technical-experiments'

export interface Category {
  id: CategoryId
  label: LocalizedText
}

export type ProjectStatus =
  | 'completed'
  | 'in-progress'
  | 'prototype'
  | 'concept'
  | 'demo'
  | 'experiment'

export interface Project {
  id: string
  slug: string
  title: LocalizedText
  category: CategoryId
  description: LocalizedText
  status: ProjectStatus
  featured: boolean
  /** Optional real cover image (public path). Falls back to a seeded generative cover. */
  cover?: string
  /** Hue seed for the generative cover, 0–360. */
  coverHue?: number
  year?: string
  /** Optional gallery images (public paths); each falls back to generative art on error. */
  gallery?: string[]
  /** Optional video (public MP4 path or replaceable URL). Rendered as a designed block. */
  video?: string
  tools?: string[]
  overview?: LocalizedText
  concept?: LocalizedText
  process?: LocalizedText
}

export type LabStatus = 'idea' | 'experiment' | 'prototype' | 'in-progress' | 'completed'

export interface LabExperiment {
  id: string
  title: LocalizedText
  type: LocalizedText
  status: LabStatus
  description?: LocalizedText
  version?: string
  date?: string
  coverHue?: number
}
