import Link from 'next/link'

import { getAllTags } from '@/lib/mdx'
import { cn } from '@/lib/utils'

export const metadata = {
  title: '标签 - NingBlog',
  description: '浏览所有文章标签',
}

export default async function TagsPage() {
  const tags = await getAllTags()

  // Calculate font sizes based on tag usage
  const maxCount = Math.max(...tags.map((t) => t.count), 1)
  const minCount = Math.min(...tags.map((t) => t.count), 1)

  const getFontSize = (count: number) => {
    if (maxCount === minCount) return 'text-base'
    const ratio = (count - minCount) / (maxCount - minCount)
    if (ratio > 0.7) return 'text-2xl'
    if (ratio > 0.4) return 'text-xl'
    if (ratio > 0.2) return 'text-lg'
    return 'text-base'
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">标签</h1>
        <p className="text-muted-foreground mt-2">共 {tags.length} 个标签</p>
      </div>

      <div className="flex flex-wrap gap-4">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${encodeURIComponent(tag.name)}`}
            className={cn(
              'border-border bg-background hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-colors',
              getFontSize(tag.count)
            )}
          >
            <span>{tag.name}</span>
            <span className="text-muted-foreground text-sm">({tag.count})</span>
          </Link>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-muted-foreground">暂无标签</p>
        </div>
      )}
    </div>
  )
}
