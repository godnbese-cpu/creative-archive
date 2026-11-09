import type { Project } from '@/types'

/**
 * THE ARCHIVE IS EMPTY ON PURPOSE.
 *
 * The client asked for a portfolio that is honest about its state: the walls
 * are built, the works are not finished yet. Putting invented projects here
 * would make the site look complete and be a lie. So this array stays empty
 * until real work exists — every page is designed to look intentional with
 * zero entries.
 *
 * ── HOW TO ADD A WORK ────────────────────────────────────────────────────────
 * Append one object (they render automatically on Home, Works and /works/:slug):
 *
 *   {
 *     id: 'my-project',                 // stable, never reused
 *     slug: 'my-project',               // URL segment → /works/my-project
 *     title: { en: 'My Project', zh: '我的项目' },
 *     category: 'original-worlds',      // see data/categories.ts
 *     description: {
 *       en: 'One sentence on what it is.',
 *       zh: '一句话说明它是什么。',
 *     },
 *     status: 'in-progress',            // see ProjectStatus in types/index.ts
 *     featured: true,                   // shows on the home page wall
 *     year: '2026',
 *     cover: 'images/my-project.jpg',   // optional — omit to use generated art
 *     coverHue: 220,                    // optional seed for the generated art
 *     gallery: ['images/a.jpg', 'images/b.jpg'],   // optional
 *     video: 'videos/my-project.mp4',   // optional, local file preferred
 *     tools: ['React', 'Canvas 2D'],    // optional
 *     overview: { en: '…', zh: '…' },   // optional sections
 *     concept: { en: '…', zh: '…' },
 *     process: { en: '…', zh: '…' },
 *   }
 *
 * Only include what is true. Missing fields are hidden, not filled with filler.
 * ────────────────────────────────────────────────────────────────────────────
 */
export const projects: Project[] = []

/** Works shown on the home page wall — newest / most representative first. */
export const featuredProjects: Project[] = projects.filter((p) => p.featured)

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
