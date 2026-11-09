import { useEffect, useRef } from 'react'

/**
 * CONSTELLATION ARCHIVE — the generative hero field.
 *
 * A few hundred stars drift around a handful of slowly-moving "worlds"; the
 * worlds are joined by a sparse constellation network. The cursor bends the
 * field with gentle parallax, a soft repulsion lens, and a following halo of
 * light. Behind the stars, two or three nebula clouds drift on slow sine
 * paths to give the space real depth. Rare comets streak node-to-node with
 * fading tails. Scrolling pulls the camera back and drifts the field upward
 * — a traversal, not just a fade. Canvas 2D only, additive blending,
 * pre-rendered glow sprites. No WebGL.
 */
interface StarfieldProps {
  className?: string
}

interface Node3 {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
}

interface Star {
  node: number
  dx: number
  dy: number
  dz: number
  tw: number
  ts: number
  size: number
  color: number
  alpha: number
}

interface Shooter {
  from: number
  to: number
  t: number
  speed: number
  life: number
  maxLife: number
  trail: { x: number; y: number }[]
}

interface Nebula {
  x: number
  y: number
  r: number
  color: number
  phase: number
  driftAmp: number
  driftSpeed: number
}

const PALETTE = [
  { r: 236, g: 233, b: 226 }, // bone
  { r: 91, g: 132, b: 255 }, // electric
  { r: 134, g: 239, b: 110 }, // acid
  { r: 143, g: 123, b: 255 }, // violet
]

const NEBULA_COLORS = [1, 3, 2] // electric, violet, acid — in that order
const COLOR_WEIGHTS = [0.84, 0.09, 0.035, 0.035]

function makeGlow(r: number, g: number, b: number, size = 64): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')!
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`)
  grad.addColorStop(0.25, `rgba(${r},${g},${b},0.32)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return c
}

/** A large, very soft cloud sprite for the nebula layer. */
function makeCloud(r: number, g: number, b: number): HTMLCanvasElement {
  const s = 384
  const c = document.createElement('canvas')
  c.width = s
  c.height = s
  const ctx = c.getContext('2d')!
  const grad = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  grad.addColorStop(0, `rgba(${r},${g},${b},0.62)`)
  grad.addColorStop(0.4, `rgba(${r},${g},${b},0.24)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, s, s)
  return c
}

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function pickColor(): number {
  let r = Math.random()
  for (let i = 0; i < COLOR_WEIGHTS.length; i++) {
    r -= COLOR_WEIGHTS[i]
    if (r <= 0) return i
  }
  return 0
}

export default function Starfield({ className }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    // --- sprites ---
    const glows = PALETTE.map((c) => makeGlow(c.r, c.g, c.b))
    const clouds = NEBULA_COLORS.map((ci) => {
      const c = PALETTE[ci]
      return makeCloud(c.r, c.g, c.b)
    })
    // cursor halo sprite — wide, soft electric
    const halo = makeGlow(91, 132, 255, 256)

    // --- world nodes ---
    const nodeCount = isMobile ? 7 : 10
    const nodes: Node3[] = Array.from({ length: nodeCount }, () => ({
      x: rand(-1, 1),
      y: rand(-1, 1),
      z: rand(0.15, 1),
      vx: rand(-0.00022, 0.00022),
      vy: rand(-0.00022, 0.00022),
      vz: rand(-0.00008, 0.00008),
    }))

    // --- stars ---
    const starCount = isMobile ? 240 : 640
    const stars: Star[] = Array.from({ length: starCount }, () => {
      const node = Math.floor(Math.random() * nodeCount)
      const spread = rand(0.22, 0.46)
      const ang = Math.random() * Math.PI * 2
      const rad = spread * (0.12 + 0.88 * Math.sqrt(Math.random()))
      return {
        node,
        dx: Math.cos(ang) * rad,
        dy: Math.sin(ang) * rad * 0.68,
        dz: (Math.random() - 0.5) * spread * 0.9,
        tw: Math.random() * Math.PI * 2,
        ts: rand(0.002, 0.012),
        size: rand(0.55, 1.35),
        color: pickColor(),
        alpha: rand(0.18, 0.62),
      }
    })

    // --- nebula clouds (background depth) ---
    const nebulae: Nebula[] = (isMobile ? [0, 1] : [0, 1, 2]).map((ci) => ({
      x: rand(-0.5, 0.5),
      y: rand(-0.4, 0.4),
      r: rand(0.5, 0.9),
      color: ci,
      phase: rand(0, Math.PI * 2),
      driftAmp: rand(0.12, 0.22),
      driftSpeed: rand(0.00006, 0.00012),
    }))

    // --- sizing ---
    let w = 0
    let h = 0
    let dpr = 1

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
    }
    resize()

    // --- pointer (smoothed) ---
    let tx = 0
    let ty = 0
    let sx = 0
    let sy = 0
    let mxScreen = 0
    let myScreen = 0
    let hx = 0
    let hy = 0
    let hasPointer = false

    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
      mxScreen = e.clientX
      myScreen = e.clientY
      hasPointer = true
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      hasPointer = false
    }

    // --- shooter (rare "idea" traveling the network, with a comet tail) ---
    let shooter: Shooter | null = null
    let nextShoot = performance.now() + rand(4000, 9000)

    // --- render ---
    let raf = 0
    let running = true
    let lastNow = performance.now()

    const project = (x: number, y: number, z: number, zoom: number) => {
      const persp = 0.5 + 0.5 * clamp(z, 0, 1)
      const fit = Math.min(w, h) * 0.62 * zoom
      const px = sx * 34 * persp
      const py = sy * 26 * persp
      return {
        x: w / 2 + x * fit * persp + px,
        y: h / 2 + y * fit * persp + py,
        size: (0.7 + 1.7 * clamp(z, 0, 1)) * (0.7 + 0.3 * clamp(z, 0, 1)),
        persp,
      }
    }

    const draw = (now: number) => {
      const scroll = clamp(window.scrollY / window.innerHeight, 0, 1)
      // traversal: pull camera back + drift field upward as you descend
      const fade = 1 - scroll * 1.05
      if (fade <= 0.01) {
        ctx.clearRect(0, 0, w, h)
        return
      }
      const zoom = 1 - scroll * 0.26
      const driftY = scroll * 0.12

      // inertia
      sx = lerp(sx, tx, 0.045)
      sy = lerp(sy, ty, 0.045)
      hx = lerp(hx, mxScreen, 0.12)
      hy = lerp(hy, myScreen, 0.12)
      if (!hasPointer) {
        tx = lerp(tx, 0, 0.01)
        ty = lerp(ty, 0, 0.01)
      }

      ctx.clearRect(0, 0, w, h)
      ctx.save()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = 'lighter'

      // --- nebula clouds: slow drifting depth ---
      for (const neb of nebulae) {
        const cx = w / 2 + (neb.x + Math.sin(now * neb.driftSpeed + neb.phase) * neb.driftAmp) * w * 0.5
        const cy = h / 2 + (neb.y - driftY + Math.cos(now * neb.driftSpeed * 0.8 + neb.phase) * neb.driftAmp) * h * 0.5
        const radius = Math.min(w, h) * neb.r
        const cloud = clouds[neb.color]
        ctx.globalAlpha = fade * (isMobile ? 0.26 : 0.38)
        ctx.drawImage(cloud, cx - radius, cy - radius, radius * 2, radius * 2)
      }

      // drift nodes
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        n.z += n.vz
        if (n.x > 1.2 || n.x < -1.2) n.vx *= -1
        if (n.y > 1.2 || n.y < -1.2) n.vy *= -1
        if (n.z > 1 || n.z < 0.15) n.vz *= -1
      }

      const mouseX = w / 2 + sx * w * 0.5
      const mouseY = h / 2 + sy * h * 0.5
      const lens = isMobile ? 90 : 150

      // --- constellation lines ---
      ctx.globalAlpha = fade * 0.5
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dz = a.z - b.z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (dist < 0.82) {
            const pa = project(a.x, a.y, a.z, zoom)
            const pb = project(b.x, b.y, b.z, zoom)
            const lineAlpha = (1 - dist / 0.82) * 0.18
            ctx.strokeStyle = `rgba(150,160,220,${lineAlpha})`
            ctx.beginPath()
            ctx.moveTo(pa.x, pa.y)
            ctx.lineTo(pb.x, pb.y)
            ctx.stroke()
          }
        }
      }

      // --- stars ---
      for (const s of stars) {
        const n = nodes[s.node]
        const x = n.x + s.dx
        const y = n.y + s.dy - driftY
        const z = clamp(n.z + s.dz, 0.02, 1)
        const p = project(x, y, z, zoom)

        // repulsion lens
        const ddx = p.x - mouseX
        const ddy = p.y - mouseY
        const d = Math.sqrt(ddx * ddx + ddy * ddy)
        let ox = p.x
        let oy = p.y
        let boost = 0
        if (d < lens && d > 0.001 && z > 0.35) {
          const f = (1 - d / lens) * 20
          ox = p.x + (ddx / d) * f
          oy = p.y + (ddy / d) * f
          boost = (1 - d / lens) * 0.3
        }

        const twinkle = 0.78 + 0.22 * Math.sin(now * s.ts + s.tw)
        const alpha = clamp(s.alpha * twinkle * fade + boost, 0, 1)
        const sz = p.size * s.size * 5

        ctx.globalAlpha = alpha
        const glow = glows[s.color]
        const half = sz / 2
        ctx.drawImage(glow, ox - half, oy - half, sz, sz)
      }

      // --- cursor halo (desktop, fine pointer only) ---
      if (hasPointer && !isMobile) {
        const haloR = 150
        ctx.globalAlpha = fade * 0.5
        ctx.drawImage(halo, hx - haloR, hy - haloR, haloR * 2, haloR * 2)
      }

      // --- shooter with comet tail ---
      if (shooter && shooter.life > 0) {
        const a = nodes[shooter.from]
        const b = nodes[shooter.to]
        const t = clamp(shooter.t, 0, 1)
        const pa = project(a.x, a.y, a.z, zoom)
        const pb = project(b.x, b.y, b.z, zoom)
        const px = lerp(pa.x, pb.x, t)
        const py = lerp(pa.y, pb.y, t)

        // record trail
        shooter.trail.push({ x: px, y: py })
        if (shooter.trail.length > 16) shooter.trail.shift()

        const lifeRatio = shooter.life / shooter.maxLife
        const sa = Math.sin(lifeRatio * Math.PI)

        // draw fading tail
        for (let k = 1; k < shooter.trail.length; k++) {
          const p0 = shooter.trail[k - 1]
          const p1 = shooter.trail[k]
          const tailAlpha = (k / shooter.trail.length) * sa * fade * 0.6
          ctx.globalAlpha = tailAlpha
          ctx.strokeStyle = `rgba(150,170,255,1)`
          ctx.lineWidth = (k / shooter.trail.length) * 2.2
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.stroke()
        }
        // head glow
        ctx.globalAlpha = sa * fade
        ctx.drawImage(glows[1], px - 16, py - 16, 32, 32)

        shooter.t += shooter.speed
        shooter.life -= now - lastNow
        if (shooter.life <= 0) shooter = null
      } else if (now > nextShoot && nodes.length > 1) {
        const from = Math.floor(Math.random() * nodes.length)
        let to = Math.floor(Math.random() * nodes.length)
        if (to === from) to = (to + 1) % nodes.length
        shooter = {
          from,
          to,
          t: 0,
          speed: rand(0.005, 0.011),
          life: 1100,
          maxLife: 1100,
          trail: [],
        }
        nextShoot = now + rand(5000, 11000)
      }

      ctx.restore()
      lastNow = now
    }

    const loop = (now: number) => {
      if (!running) return
      draw(now)
      raf = requestAnimationFrame(loop)
    }

    if (reduced) {
      draw(performance.now())
    } else {
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerleave', onLeave)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  )
}
