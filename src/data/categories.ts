import type { Category, CategoryId, Lang } from '@/types'

export const categories: Category[] = [
  {
    id: 'original-worlds',
    label: { en: 'Original Worlds', zh: '原创世界观' },
  },
  {
    id: 'games-interactive',
    label: { en: 'Games & Interactive', zh: '游戏与交互' },
  },
  {
    id: 'ai-visual-stories',
    label: { en: 'AI Visual Stories', zh: 'AI 视觉故事' },
  },
  {
    id: 'global-creative',
    label: { en: 'Global Creative', zh: '跨文化创意' },
  },
  {
    id: 'technical-experiments',
    label: { en: 'Technical Experiments', zh: '技术实验' },
  },
]

export function getCategory(id: CategoryId): Category {
  return categories.find((c) => c.id === id) ?? categories[categories.length - 1]
}

export function categoryLabel(id: CategoryId, lang: Lang): string {
  return getCategory(id).label[lang]
}
