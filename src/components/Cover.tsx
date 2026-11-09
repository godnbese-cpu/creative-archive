import { useState } from 'react'
import ProjectCover from './ProjectCover'
import { asset } from '@/lib/asset'

interface CoverProps {
  /** Real image path (public/...). When missing or broken, falls back to generative art. */
  src?: string
  /** Seed for the generative fallback. */
  seed: string
  /** Hue for the generative fallback, 0–360. */
  hue?: number
  alt?: string
  className?: string
}

/**
 * Cover with graceful degradation: a real image when one is configured and it
 * loads, otherwise a deterministic generative constellation cover. Nothing
 * ever renders as a broken-image icon.
 */
export default function Cover({ src, seed, hue, alt = '', className }: CoverProps) {
  const [failed, setFailed] = useState(false)
  const useImage = !!src && !failed

  if (useImage) {
    return (
      <img
        src={asset(src!)}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={className}
      />
    )
  }
  return <ProjectCover seed={seed} hue={hue} className={className} />
}
