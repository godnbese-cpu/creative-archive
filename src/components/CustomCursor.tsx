import { useEffect, useRef } from 'react'

/**
 * Custom cursor — a fast dot over a lagging ring. Desktop fine-pointer only;
 * disabled on touch and under reduced motion (native cursor stays).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('cursor-none')

    let mx = 0
    let my = 0
    let rx = 0
    let ry = 0
    let raf = 0

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    const loop = () => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    const isInteractive = (t: EventTarget | null) =>
      t instanceof HTMLElement && !!t.closest('a, button, [data-cursor]')

    const onOver = (e: Event) => {
      if (isInteractive(e.target)) ring.classList.add('is-active')
    }
    const onOut = (e: Event) => {
      if (isInteractive(e.target)) ring.classList.remove('is-active')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)
    raf = requestAnimationFrame(loop)

    return () => {
      document.documentElement.classList.remove('cursor-none')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
