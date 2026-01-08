import Link from 'next/link'

import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: string
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Link
      href={`/categories/${encodeURIComponent(category)}`}
      className={cn(
        'bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors',
        className
      )}
    >
      {category}
    </Link>
  )
}

interface TagBadgeProps {
  tag: string
  className?: string
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className={cn(
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors',
        className
      )}
    >
      #{tag}
    </Link>
  )
}

interface TagsListProps {
  tags: string[]
  className?: string
}

export function TagsList({ tags, className }: TagsListProps) {
  if (!tags || tags.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <TagBadge key={tag} tag={tag} />
      ))}
    </div>
  )
}
