/**
 * PLATE ART — deterministic generative artwork for a project plate.
 *
 * The same visual family as the Prism Hall hero, rendered as static SVG so it
 * costs nothing to display. Two compositions share one drawing system:
 *
 *   default  a suspended crystal — what a finished work hangs here.
 *   bare     an empty gilt frame in a lit room — what an empty slot looks like.
 *            Used by every "nothing installed yet" state, so an empty archive
 *            still reads as a gallery rather than a failed page.
 *
 * The seed decides colour and placement, so a plate always comes back the same.
 * A real cover image always wins over this.
 */
interface PlateArtProps {
  seed: string
  hue?: number
  className?: string
  /** Draw an empty frame instead of a crystal. */
  bare?: boolean
}

function hashSeed(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(a: number): () => number {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function ProjectCover({ seed, hue, className, bare }: PlateArtProps) {
  const rng = mulberry32(hashSeed(seed))
  const H = hue ?? 200 + Math.floor(rng() * 120)
  const accent = `hsl(${H} 82% 68%)`
  const accent2 = `hsl(${(H + 52) % 360} 76% 72%)`
  const gilt = '#dbcba6'
  const id = `plate-${hashSeed(seed).toString(36)}`

  const horizon = 246 + rng() * 12
  const shardX = 200 + (rng() - 0.5) * 40
  const shardY = 152 + rng() * 16
  const shardH = 74 + rng() * 18
  const shardW = 20 + rng() * 8
  const tilt = (rng() - 0.5) * 10

  const dust = Array.from({ length: 36 }, () => ({
    x: rng() * 400,
    y: 30 + rng() * 330,
    r: 0.5 + rng() * 1.4,
    a: 0.22 + rng() * 0.6,
    warm: rng() < 0.2,
  }))

  const top = [shardX + tilt, shardY - shardH] as const
  const bottom = [shardX - tilt * 0.5, shardY + shardH] as const
  const left = [shardX - shardW, shardY + tilt * 0.6] as const
  const right = [shardX + shardW, shardY - tilt * 0.4] as const

  // Empty-slot frame: a rectangle floating in the room, drawn in one-point
  // perspective so it reads as hung on a wall in depth.
  const fx = 200 - 82
  const fy = 118
  const fw = 164
  const fh = 132
  const fs = 7 // perspective inset

  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="62%" cy="26%" r="96%">
          <stop offset="0%" stopColor="#1b1d2e" />
          <stop offset="52%" stopColor="#0c0d17" />
          <stop offset="100%" stopColor="#050507" />
        </radialGradient>

        <linearGradient id={`${id}-aur`} x1="0.1" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.62" />
          <stop offset="52%" stopColor={accent2} stopOpacity="0.26" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`${id}-aur2`} x1="1" y1="0" x2="0.2" y2="0.9">
          <stop offset="0%" stopColor={accent2} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accent2} stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`${id}-hor`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="26%" stopColor={accent} stopOpacity="0.5" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="76%" stopColor={gilt} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accent2} stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`${id}-edge`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor={accent} stopOpacity="0.95" />
          <stop offset="100%" stopColor={accent2} stopOpacity="0.45" />
        </linearGradient>

        <radialGradient id={`${id}-bloom`}>
          <stop offset="0%" stopColor={accent} stopOpacity="0.66" />
          <stop offset="52%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>

        <radialGradient id={`${id}-pool`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={gilt} stopOpacity="0.4" />
          <stop offset="100%" stopColor={gilt} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d2544" stopOpacity="0.6" />
          <stop offset="55%" stopColor="#0d1020" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#050507" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`${id}-vig`} x1="0" y1="0.3" x2="0" y2="1">
          <stop offset="0%" stopColor="#050507" stopOpacity="0" />
          <stop offset="100%" stopColor="#050507" stopOpacity="0.92" />
        </linearGradient>

        <filter id={`${id}-soft`} x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
        <filter id={`${id}-haze`} x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <rect width="400" height="400" fill={`url(#${id}-bg)`} />

      {/* colour fields */}
      <g filter={`url(#${id}-soft)`}>
        <ellipse cx={252} cy={78} rx="168" ry="120" fill={`url(#${id}-aur)`} />
        <ellipse cx={352} cy={140} rx="92" ry="128" fill={`url(#${id}-aur2)`} opacity="0.85" />
        <ellipse cx={86} cy={214} rx="124" ry="70" fill={accent} opacity="0.15" />
      </g>

      {/* vertical light shafts */}
      <g filter={`url(#${id}-haze)`} opacity="0.55">
        <rect x={156} y={-20} width="11" height="280" fill="#c6d2ff" opacity="0.11" />
        <rect x={256} y={-30} width="17" height="300" fill="#b7b6ff" opacity="0.09" />
        <rect x={86} y={-10} width="6" height="260" fill="#dfe6ff" opacity="0.08" />
      </g>

      {/* horizon + floor */}
      <ellipse cx={200} cy={horizon + 14} rx="150" ry="44" fill={`url(#${id}-bloom)`} />
      <ellipse cx={128} cy={horizon + 6} rx="82" ry="22" fill={`url(#${id}-pool)`} />
      <rect x="0" y={horizon - 0.8} width="400" height="1.6" fill={`url(#${id}-hor)`} />
      <rect x="0" y={horizon} width="400" height={400 - horizon} fill={`url(#${id}-floor)`} />

      <g stroke="rgba(160,178,255,0.16)" strokeWidth="0.5">
        {[0.24, 0.5, 0.78, 1].map((p, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={horizon + (400 - horizon) * p}
            x2="400"
            y2={horizon + (400 - horizon) * p}
          />
        ))}
        {[-2, -1, 0, 1, 2].map((i) => (
          <line
            key={`v${i}`}
            x1={200 + i * 24}
            y1={horizon}
            x2={200 + i * 74}
            y2="400"
          />
        ))}
      </g>

      {bare ? (
        /* an empty frame, hung and lit — the slot waits for the work */
        <g>
          <rect
            x={fx}
            y={fy}
            width={fw}
            height={fh}
            fill="#07070c"
            opacity="0.5"
          />
          <path
            d={`M${fx} ${fy} L${fx + fw} ${fy} L${fx + fw - fs} ${fy + fh - fs * 0.4} L${fx + fs} ${fy + fh - fs * 0.4} Z`}
            fill="none"
            stroke={`url(#${id}-edge)`}
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d={`M${fx} ${fy} L${fx + fs} ${fy + fh - fs * 0.4} M${fx + fw} ${fy} L${fx + fw - fs} ${fy + fh - fs * 0.4}`}
            fill="none"
            stroke={gilt}
            strokeWidth="0.7"
            opacity="0.35"
          />
          <rect
            x={fx + fs + 6}
            y={fy + 8}
            width={fw - fs * 2 - 12}
            height={fh - fs * 0.4 - 18}
            fill="none"
            stroke="rgba(244,240,231,0.07)"
            strokeWidth="0.6"
          />
          {/* hairline fixing marks, like a printer's registration */}
          <g stroke={gilt} strokeWidth="0.6" opacity="0.4">
            <line x1={fx - 7} y1={fy} x2={fx - 2} y2={fy} />
            <line x1={fx + fw + 2} y1={fy} x2={fx + fw + 7} y2={fy} />
            <line x1={fx - 7} y1={fy + fh - fs * 0.4} x2={fx - 2} y2={fy + fh - fs * 0.4} />
            <line
              x1={fx + fw + 2}
              y1={fy + fh - fs * 0.4}
              x2={fx + fw + 7}
              y2={fy + fh - fs * 0.4}
            />
          </g>
        </g>
      ) : (
        <g>
          <polygon
            points={`${top[0]},${top[1]} ${right[0]},${right[1]} ${bottom[0]},${bottom[1]}`}
            fill={accent}
            opacity="0.14"
          />
          <polygon
            points={`${top[0]},${top[1]} ${left[0]},${left[1]} ${bottom[0]},${bottom[1]}`}
            fill={accent2}
            opacity="0.2"
          />
          <polygon
            points={`${top[0]},${top[1]} ${right[0]},${right[1]} ${left[0]},${left[1]}`}
            fill="#ffffff"
            opacity="0.08"
          />
          <g
            fill="none"
            stroke={`url(#${id}-edge)`}
            strokeWidth="0.75"
            strokeLinejoin="round"
          >
            <polygon
              points={`${top[0]},${top[1]} ${right[0]},${right[1]} ${bottom[0]},${bottom[1]} ${left[0]},${left[1]}`}
            />
            <line x1={top[0]} y1={top[1]} x2={bottom[0]} y2={bottom[1]} opacity="0.55" />
            <line x1={left[0]} y1={left[1]} x2={right[0]} y2={right[1]} opacity="0.32" />
          </g>
          <circle cx={top[0]} cy={top[1]} r="2.2" fill="#ffffff" opacity="0.9" />
          <circle cx={top[0]} cy={top[1]} r="6.5" fill="#ffffff" opacity="0.18" />
        </g>
      )}

      {/* dust */}
      <g>
        {dust.map((d, i) => (
          <g key={i}>
            <circle
              cx={d.x}
              cy={d.y}
              r={d.r}
              fill={d.warm ? gilt : '#f4f0e7'}
              opacity={d.a}
            />
            {d.r > 1.4 && (
              <circle
                cx={d.x}
                cy={d.y}
                r={d.r * 3}
                fill={d.warm ? gilt : accent}
                opacity={d.a * 0.16}
              />
            )}
          </g>
        ))}
      </g>

      <rect width="400" height="400" fill={`url(#${id}-vig)`} />
    </svg>
  )
}
