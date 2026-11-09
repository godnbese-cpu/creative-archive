import { useEffect, useRef } from 'react'

/**
 * PRISM HALL — the house generative artwork.
 *
 * The hall is built in five depths:
 *
 *   1. LIGHT FIELD  wide, soft colour fields (blue / violet / champagne) that
 *                   give the black room a sense of air and distance.
 *   2. AURORA       two slow curtains of coloured light, pre-rendered to sprites
 *                   and drifted on long sine paths. They breathe, never pulse.
 *   3. SHAFTS       three volumetric beams raking down from the upper left, as
 *                   if light were entering through a clerestory.
 *   4. FLOOR        a horizon line at the lower third, an elliptical bloom, a
 *                   perspective grid at 5% opacity and a reflected relic.
 *   5. RELIC        a suspended crystal shard, slowly turning. Faces are shaded
 *                   by their normal against a fixed key light; edges are drawn
 *                   twice (soft halo + bright filament) so it reads as glass.
 *   6. DUST         particulate air in three depth planes, with a faint pointer
 *                   lens that lifts the particles it passes over.
 *
 * Everything is Canvas 2D + additive blending over pre-rendered sprites. No
 * WebGL, no shaders, no dependency. The camera reacts to pointer and scroll,
 * the loop is cancelled on unmount, and prefers-reduced-motion renders one
 * still frame instead of animating.
 */

interface PrismHallProps {
  className?: string
  /** `quiet` lowers the exposure for use behind copy on secondary pages. */
  intensity?: 'hero' | 'quiet'
}

const TAU = Math.PI * 2
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rand = (a: number, b: number) => a + Math.random() * (b - a)

interface Dust {
  x: number
  y: number
  z: number
  r: number
  vx: number
  vy: number
  hue: number
  tw: number
  ts: number
}

type Vec3 = [number, number, number]

/** Soft radial sprite used for dust, glows and the pointer lens. */
function makeGlow(r: number, g: number, b: number, size = 64): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')
  if (!ctx) return c
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`)
  grad.addColorStop(0.22, `rgba(${r},${g},${b},0.45)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return c
}

/**
 * An aurora curtain: vertical, softly blurred streaks of light. Rendering this
 * once to a sprite costs a blur; drawing it per frame costs one image blit.
 */
function makeCurtain(
  top: [number, number, number],
  bottom: [number, number, number],
  streaks = 34,
): HTMLCanvasElement {
  const s = 640
  const c = document.createElement('canvas')
  c.width = s
  c.height = s
  const ctx = c.getContext('2d')
  if (!ctx) return c

  for (let i = 0; i < streaks; i++) {
    const x = rand(0.04, 0.96) * s
    const w = rand(0.02, 0.1) * s
    const lean = rand(-0.16, 0.16) * s
    const y0 = rand(-0.15, 0.12) * s
    const y1 = rand(0.72, 1.08) * s
    const a = rand(0.08, 0.26)
    const mix = Math.random()
    const r = Math.round(lerp(top[0], bottom[0], mix))
    const g = Math.round(lerp(top[1], bottom[1], mix))
    const b = Math.round(lerp(top[2], bottom[2], mix))
    const grad = ctx.createLinearGradient(x, y0, x + lean, y1)
    grad.addColorStop(0, `rgba(${r},${g},${b},0)`)
    grad.addColorStop(0.32, `rgba(${r},${g},${b},${a})`)
    grad.addColorStop(0.72, `rgba(${r},${g},${b},${a * 0.5})`)
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.moveTo(x, y0)
    ctx.lineTo(x + w, y0 + lean * 0.2)
    ctx.lineTo(x + w + lean, y1)
    ctx.lineTo(x + lean, y1)
    ctx.closePath()
    ctx.fill()
  }

  // Blur once, here — never in the frame loop.
  try {
    const out = document.createElement('canvas')
    out.width = s
    out.height = s
    const octx = out.getContext('2d')
    if (octx) {
      octx.filter = 'blur(16px)'
      octx.drawImage(c, 0, 0)
      return out
    }
  } catch {
    /* filter unsupported — the soft gradients still read as curtains */
  }
  return c
}

export default function PrismHall({ className, intensity = 'hero' }: PrismHallProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const small = window.matchMedia('(max-width: 820px)').matches
    const quiet = intensity === 'quiet'
    const exposure = quiet ? 0.5 : 1

    // ---- sprites -----------------------------------------------------------
    const glowBone = makeGlow(244, 240, 231, 64)
    const glowBlue = makeGlow(91, 132, 255, 64)
    const glowIris = makeGlow(157, 132, 255, 64)
    const glowGilt = makeGlow(217, 201, 164, 64)
    const lens = makeGlow(120, 150, 255, 256)
    const glowRose = makeGlow(255, 138, 178, 64)

    const curtains = [
      makeCurtain([46, 82, 210], [126, 96, 216], small ? 24 : 36),
      makeCurtain([128, 96, 220], [214, 214, 176], small ? 18 : 28),
      makeCurtain([54, 102, 232], [42, 64, 158], small ? 14 : 22),
    ]

    // ---- geometry ----------------------------------------------------------
    let w = 0
    let h = 0
    let dpr = 1

    const resize = () => {
      w = canvas.clientWidth || 1
      h = canvas.clientHeight || 1
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.6 : 2)
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
    }

    // Guard against mobile URL-bar resizes thrashing the canvas.
    let lastW = 0
    let lastH = 0
    const resizeIfNeeded = () => {
      const cw = canvas.clientWidth
      const ch = canvas.clientHeight
      if (cw !== lastW || ch !== lastH) {
        lastW = cw
        lastH = ch
        resize()
      }
    }

    // ---- dust --------------------------------------------------------------
    const dustCount = small ? 96 : quiet ? 130 : 190
    const dust: Dust[] = Array.from({ length: dustCount }, () => {
      const z = Math.random()
      return {
        x: Math.random(),
        y: Math.random(),
        z,
        r: rand(0.5, 2.1) * (0.55 + z * 0.9),
        vx: rand(0.00004, 0.00016) * (0.4 + z),
        vy: rand(-0.00006, 0.00002),
        hue: Math.random(),
        tw: Math.random() * TAU,
        ts: rand(0.0004, 0.0016),
      }
    })

    // ---- pointer -----------------------------------------------------------
    let px = 0
    let py = 0
    let sx = 0
    let sy = 0
    let hasPointer = false
    let lensX = 0
    let lensY = 0

    const onPointer = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth - 0.5) * 2
      py = (e.clientY / window.innerHeight - 0.5) * 2
      lensX = e.clientX
      lensY = e.clientY
      hasPointer = true
    }
    const onLeave = () => {
      px = 0
      py = 0
      hasPointer = false
    }

    // ---- shard geometry ----------------------------------------------------
    // A stretched octahedron: two apexes and a square waist.
    const ring: Vec3[] = [0, 1, 2, 3].map((k) => {
      const a = (k / 4) * TAU + Math.PI / 4
      return [Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5]
    })
    const apexTop: Vec3 = [0, 1.55, 0]
    const apexBottom: Vec3 = [0, -1.52, 0]

    const faces: { pts: Vec3[]; tint: number }[] = []
    for (let i = 0; i < 4; i++) {
      const a = ring[i]
      const b = ring[(i + 1) % 4]
      faces.push({ pts: [apexTop, a, b], tint: i })
      faces.push({ pts: [apexBottom, b, a], tint: i + 1 })
    }

    const edgePairs: [Vec3, Vec3][] = []
    for (let i = 0; i < 4; i++) {
      const a = ring[i]
      const b = ring[(i + 1) % 4]
      edgePairs.push([a, b])
      edgePairs.push([apexTop, a])
      edgePairs.push([apexBottom, b])
    }

    // ---- render ------------------------------------------------------------
    let raf = 0
    let running = true
    let last = performance.now()

    const draw = (now: number) => {
      const dt = clamp(now - last, 16, 48)
      last = now

      if (w === 0 || h === 0) return
      resizeIfNeeded()

      // Fade is relative to the canvas's own position in the viewport, not to
      // the page scroll — the same component is used in the hero and again in
      // the contact section, far down the page.
      const rect = canvas.getBoundingClientRect()
      const vh = window.innerHeight
      const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
      const span = Math.min(rect.height, vh * 0.92)
      const fade = clamp(visible / Math.max(1, span), 0, 1) * 1.08
      const camT = clamp((vh - rect.top) / (vh + rect.height), 0, 1)

      if (fade <= 0.02) {
        ctx.clearRect(0, 0, w, h)
        return
      }

      // inertia
      sx = lerp(sx, px, 0.04)
      sy = lerp(sy, py, 0.04)
      if (!hasPointer) {
        px = lerp(px, 0, 0.008)
        py = lerp(py, 0, 0.008)
      }

      const t = reduced ? 4200 : now
      const min = Math.min(w, h)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      const zoom = 1 - camT * 0.18
      const horizon = h * (0.745 - camT * 0.04)

      // --- 0. light field -------------------------------------------------
      // Three enormous, almost invisible colour fields. They are what stops a
      // black page from reading as an empty rectangle.
      ctx.globalAlpha = fade * 0.14 * exposure
      ctx.drawImage(glowIris, w * 0.62 - w * 1.1, -h * 0.5, w * 2.2, h * 1.7)
      ctx.globalAlpha = fade * 0.11 * exposure
      ctx.drawImage(glowBlue, -w * 0.7, h * 0.1, w * 1.7, h * 1.3)
      ctx.globalAlpha = fade * 0.14 * exposure
      ctx.drawImage(glowGilt, w * 0.42, horizon - h * 0.34, w * 1.1, h * 0.72)

      // --- 1. aurora ------------------------------------------------------
      const curtainDefs = [
        { x: 0.66, y: 0.26, s: 1.55, rot: -0.06, a: 0.46, phase: 0 },
        { x: 0.24, y: 0.34, s: 1.2, rot: 0.06, a: 0.26, phase: 1.7 },
        { x: 0.95, y: 0.52, s: 0.95, rot: -0.12, a: 0.2, phase: 3.1 },
      ]
      curtainDefs.forEach((c, i) => {
        const sprite = curtains[i % curtains.length]
        const aspect = w / Math.max(1, h)
        const size = Math.max(w, h) * c.s
        const drift = Math.sin(t * 0.00007 + c.phase) * 0.028
        const sway = Math.cos(t * 0.00005 + c.phase) * 0.022
        const cx =
          w * (c.x + drift) + sx * 16 * (0.6 + i * 0.3) - (aspect - 1) * size * 0.12
        const cy = horizon - size * 0.44 + Math.sin(t * 0.00008 + c.phase) * h * 0.025

        ctx.save()
        ctx.globalAlpha = fade * c.a * exposure
        ctx.translate(cx, cy)
        ctx.rotate(c.rot + sway + sy * 0.01)
        const breathe = 1 + Math.sin(t * 0.00009 + c.phase) * 0.035
        ctx.drawImage(sprite, (-size * aspect) / 2, -size / 2, size * aspect, size * breathe)
        ctx.restore()
      })

      // --- 2. volumetric shafts -------------------------------------------
      // Three wide beams raking from the upper left. Rotated gradient bands,
      // very low alpha: they read as architecture, not as graphics.
      if (!small) {
        const shaftDefs = [
          { x: 0.14, a: 0.055, rot: 0.42, wdt: 0.3 },
          { x: 0.42, a: 0.04, rot: 0.5, wdt: 0.44 },
          { x: 0.64, a: 0.03, rot: 0.36, wdt: 0.56 },
        ]
        shaftDefs.forEach((s, i) => {
          const bx = w * s.x + Math.sin(t * 0.00004 + i) * 20 + sx * 8
          const bw = w * s.wdt
          const g = ctx.createLinearGradient(bx, 0, bx + bw, 0)
          g.addColorStop(0, 'rgba(178,198,255,0)')
          g.addColorStop(0.32, `rgba(178,198,255,${s.a * exposure})`)
          g.addColorStop(0.68, `rgba(146,160,235,${s.a * 0.45 * exposure})`)
          g.addColorStop(1, 'rgba(120,140,220,0)')
          ctx.globalAlpha = fade
          ctx.save()
          ctx.translate(bx, 0)
          ctx.rotate(-0.12)
          ctx.fillStyle = g
          ctx.fillRect(0, 0, bw, h * 1.2)
          ctx.restore()
        })
      }

      // --- 3. floor -------------------------------------------------------
      const mistGrad = ctx.createLinearGradient(0, horizon - h * 0.18, 0, horizon + h * 0.08)
      mistGrad.addColorStop(0, 'rgba(8,10,20,0)')
      mistGrad.addColorStop(0.55, `rgba(124,152,255,${0.16 * exposure})`)
      mistGrad.addColorStop(1, 'rgba(10,14,28,0)')
      ctx.globalAlpha = fade
      ctx.fillStyle = mistGrad
      ctx.fillRect(0, horizon - h * 0.18, w, h * 0.26)

      // horizon filament — a single bright line, like the edge of a lit stage
      ctx.globalAlpha = fade * 0.3 * exposure
      ctx.fillStyle = 'rgba(196,210,255,0.9)'
      ctx.fillRect(0, horizon - 0.5, w, 0.8)

      // floor bloom
      const bloomR = min * 0.82
      const bloomX = w * 0.66 + sx * 26
      ctx.globalAlpha = fade * 0.62 * exposure
      ctx.drawImage(
        glowBlue,
        bloomX - bloomR,
        horizon - bloomR * 0.36,
        bloomR * 2,
        bloomR * 0.72,
      )
      ctx.globalAlpha = fade * 0.36 * exposure
      ctx.drawImage(
        glowGilt,
        w * 0.3 + sx * 12 - bloomR * 0.55,
        horizon - bloomR * 0.16,
        bloomR * 1.1,
        bloomR * 0.36,
      )

      // floor tint
      const floorGrad = ctx.createLinearGradient(0, horizon, 0, h)
      floorGrad.addColorStop(0, `rgba(26,30,62,${0.2 * exposure})`)
      floorGrad.addColorStop(0.5, `rgba(10,12,26,${0.06 * exposure})`)
      floorGrad.addColorStop(1, 'rgba(4,4,8,0)')
      ctx.globalAlpha = fade
      ctx.fillStyle = floorGrad
      ctx.fillRect(0, horizon, w, h - horizon)

      // perspective floor grid
      if (!small) {
        ctx.globalAlpha = fade * 0.075 * exposure
        ctx.strokeStyle = 'rgba(150,168,230,1)'
        ctx.lineWidth = 1
        for (let i = 1; i <= 7; i++) {
          const p = i / 8
          const yy = horizon + (h - horizon) * p * p
          ctx.beginPath()
          ctx.moveTo(0, yy)
          ctx.lineTo(w, yy)
          ctx.stroke()
        }
        for (let i = -6; i <= 6; i++) {
          ctx.beginPath()
          ctx.moveTo(w / 2 + i * w * 0.035, horizon)
          ctx.lineTo(w / 2 + i * w * 0.26, h)
          ctx.stroke()
        }
      }

      // --- 4. relic -------------------------------------------------------
      // In the quiet variant the relic sits low and to the right so it can never
      // collide with a centred statement.
      const shardCx =
        w * (quiet ? 0.82 : small ? 0.62 : 0.655) + sx * 26
      const shardCy = horizon - min * (quiet ? 0.05 : 0.215) + Math.sin(t * 0.00022) * 9
      const baseScale = min * (quiet ? 0.085 : small ? 0.12 : 0.138) * zoom

      const rotY = t * 0.00013 + sx * 0.42
      const rotX = -0.1 + sy * 0.14 + Math.sin(t * 0.00012) * 0.035

      const drawShard = (
        cx: number,
        cy: number,
        scale: number,
        alpha: number,
        squash = 1,
        withCaustics = false,
      ) => {
        const project = (v: Vec3): { x: number; y: number; z: number } => {
          let [x, y, z] = v
          const cy1 = Math.cos(rotY)
          const sy1 = Math.sin(rotY)
          const x1 = x * cy1 - z * sy1
          const z1 = x * sy1 + z * cy1
          const cx1 = Math.cos(rotX)
          const sx1 = Math.sin(rotX)
          const y1 = y * cx1 - z1 * sx1
          const z2 = y * sx1 + z1 * cx1
          const persp = 1 / (1 + z2 * 0.42)
          return {
            x: cx + x1 * scale * persp,
            y: cy + y1 * scale * persp * squash,
            z: z2,
          }
        }

        const lightDir: Vec3 = [-0.42, 0.62, 0.66]
        const normalOf = (a: Vec3, b: Vec3, c: Vec3): Vec3 => {
          const u: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
          const v: Vec3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
          const n: Vec3 = [
            u[1] * v[2] - u[2] * v[1],
            u[2] * v[0] - u[0] * v[2],
            u[0] * v[1] - u[1] * v[0],
          ]
          const len = Math.hypot(n[0], n[1], n[2]) || 1
          return [n[0] / len, n[1] / len, n[2] / len]
        }
        const rotateNormal = (n: Vec3): Vec3 => {
          const cy1 = Math.cos(rotY)
          const sy1 = Math.sin(rotY)
          const x1 = n[0] * cy1 - n[2] * sy1
          const z1 = n[0] * sy1 + n[2] * cy1
          const cx1 = Math.cos(rotX)
          const sx1 = Math.sin(rotX)
          return [x1, n[1] * cx1 - z1 * sx1, n[1] * sx1 + z1 * cx1]
        }

        // halo
        ctx.globalAlpha = alpha * 0.5
        const haloR = scale * 2.1
        ctx.drawImage(glowIris, cx - haloR, cy - haloR, haloR * 2, haloR * 2)

        // prism dispersion — faint coloured caustics thrown out by the shard
        if (withCaustics) {
          const causticDefs = [
            { ang: 0.5, dist: 1.55, sprite: glowRose, r: 1.0, a: 0.16 },
            { ang: 2.1, dist: 1.9, sprite: glowIris, r: 1.25, a: 0.14 },
            { ang: 3.9, dist: 1.45, sprite: glowBlue, r: 0.95, a: 0.12 },
            { ang: 5.2, dist: 2.15, sprite: glowGilt, r: 0.8, a: 0.1 },
          ]
          for (const c of causticDefs) {
            const ang = t * 0.00016 + c.ang
            const dx = Math.cos(ang) * scale * c.dist
            const dy = Math.sin(ang) * scale * c.dist * 0.72
            const cr = scale * c.r
            ctx.globalAlpha = alpha * c.a
            ctx.drawImage(c.sprite, cx + dx - cr, cy + dy - cr, cr * 2, cr * 2)
          }
        }

        // faces, back to front
        const faceDraws = faces.map((f) => {
          const n = rotateNormal(normalOf(f.pts[0], f.pts[1], f.pts[2]))
          const depth = (f.pts[0][2] + f.pts[1][2] + f.pts[2][2]) / 3
          const light = Math.abs(
            n[0] * lightDir[0] + n[1] * lightDir[1] + n[2] * lightDir[2],
          )
          return { f, depth, light }
        })
        faceDraws.sort((a, b) => a.depth - b.depth)

        for (const fd of faceDraws) {
          const pts = fd.f.pts.map((v) => project(v))
          ctx.beginPath()
          ctx.moveTo(pts[0].x, pts[0].y)
          ctx.lineTo(pts[1].x, pts[1].y)
          ctx.lineTo(pts[2].x, pts[2].y)
          ctx.closePath()
          const a = (0.05 + fd.light * 0.2) * alpha
          ctx.globalAlpha = 1
          ctx.fillStyle =
            fd.light > 0.55
              ? `rgba(203,190,255,${a})`
              : `rgba(96,132,255,${a * 0.9})`
          ctx.fill()
        }

        // edges — soft halo pass, then bright filament
        ctx.globalAlpha = alpha * 0.3
        ctx.lineWidth = 3.2
        ctx.strokeStyle = 'rgba(120,150,255,1)'
        for (const [a, b] of edgePairs) {
          const pa = project(a)
          const pb = project(b)
          ctx.beginPath()
          ctx.moveTo(pa.x, pa.y)
          ctx.lineTo(pb.x, pb.y)
          ctx.stroke()
        }

        ctx.globalAlpha = alpha * 0.95
        ctx.lineWidth = 0.85
        for (const [a, b] of edgePairs) {
          const pa = project(a)
          const pb = project(b)
          const depthT = clamp((pa.z + pb.z) * 0.5 + 0.5, 0, 1)
          const r = Math.round(lerp(228, 150, depthT))
          const g = Math.round(lerp(238, 170, depthT))
          const b2 = 255
          ctx.strokeStyle = `rgba(${r},${g},${b2},${0.45 + depthT * 0.55})`
          ctx.beginPath()
          ctx.moveTo(pa.x, pa.y)
          ctx.lineTo(pb.x, pb.y)
          ctx.stroke()
        }

        // apex spark
        const apex = project(apexTop)
        ctx.globalAlpha = alpha * 0.9
        const sparkR = 22 * (scale / 140) + 8
        ctx.drawImage(glowBone, apex.x - sparkR, apex.y - sparkR, sparkR * 2, sparkR * 2)
      }

      // an echo of the relic, set back in the dark left of the hall
      if (!quiet) {
        drawShard(
          shardCx - min * 0.3,
          shardCy - min * 0.28,
          baseScale * 0.34,
          fade * 0.16,
        )
      }

      drawShard(shardCx, shardCy, baseScale, fade * 0.95, 1, true)

      // reflection: the shard again, mirrored into the floor and squashed
      if (!small) {
        const mirrored = horizon + (horizon - shardCy) * 0.62
        const reflAlpha = fade * 0.1 * exposure
        drawShard(shardCx, mirrored, baseScale * 0.92, reflAlpha, 0.62)
      }

      // --- 5. dust --------------------------------------------------------
      for (const d of dust) {
        d.x += d.vx * dt
        d.y += d.vy * dt
        if (d.x > 1.05) d.x -= 1.1
        if (d.x < -0.05) d.x += 1.1
        if (d.y > 1.05) d.y -= 1.1
        if (d.y < -0.05) d.y += 1.1

        const depth = 0.3 + d.z * 0.7
        const dx = d.x * w + sx * 26 * depth
        const dy = d.y * h + sy * 18 * depth - camT * h * 0.05 * depth
        const twinkle = 0.62 + 0.38 * Math.sin(t * d.ts + d.tw)

        let boost = 0
        if (hasPointer) {
          const lensDist = Math.hypot(dx - lensX, dy - lensY)
          if (lensDist < 200) boost = (1 - lensDist / 200) * 0.6
        }

        const alpha = clamp((0.14 + d.z * 0.34) * twinkle * fade + boost * fade, 0, 1)
        const size = d.r * 8 * (0.6 + d.z)

        ctx.globalAlpha = alpha * exposure
        const sprite = d.hue > 0.94 ? glowGilt : d.hue > 0.78 ? glowBlue : glowBone
        ctx.drawImage(sprite, dx - size / 2, dy - size / 2, size, size)
      }

      // pointer lens
      if (hasPointer && !coarse) {
        ctx.globalAlpha = fade * 0.12 * exposure
        const lr = 220
        ctx.drawImage(lens, lensX - lr, lensY - lr, lr * 2, lr * 2)
      }

      // --- 6. light sweep -------------------------------------------------
      const sweepPeriod = 16000
      const sweepT = (t % sweepPeriod) / sweepPeriod
      if (sweepT < 0.42 && !reduced) {
        const p = sweepT / 0.42
        const bandW = w * 0.34
        const bx = lerp(-bandW, w, p)
        const g = ctx.createLinearGradient(bx, 0, bx + bandW, 0)
        g.addColorStop(0, 'rgba(180,200,255,0)')
        g.addColorStop(0.5, `rgba(190,205,255,${0.08 * Math.sin(p * Math.PI) * exposure})`)
        g.addColorStop(1, 'rgba(180,200,255,0)')
        ctx.globalAlpha = fade
        ctx.fillStyle = g
        ctx.fillRect(bx, horizon - h * 0.2, bandW, h * 0.62)
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (now: number) => {
      if (!running) return
      draw(now)
      raf = requestAnimationFrame(loop)
    }

    // Pause the loop when the hero is off-screen — no work behind the fold.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true
        if (!visible) {
          running = false
          cancelAnimationFrame(raf)
        } else if (!reduced && !running) {
          running = true
          last = performance.now()
          raf = requestAnimationFrame(loop)
        }
      },
      { threshold: 0.02 },
    )
    io.observe(canvas)

    resizeIfNeeded()
    if (reduced) {
      draw(performance.now())
    } else {
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resizeIfNeeded)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerleave', onLeave)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resizeIfNeeded)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [intensity])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
