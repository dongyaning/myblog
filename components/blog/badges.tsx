import Link from 'next/link'

import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: string
  className?: string
  asLink?: boolean
}

export function CategoryBadge({ category, className, asLink = true }: CategoryBadgeProps) {
  const baseClassName = cn(
    'bg-primary/10 text-primary inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors',
    asLink && 'hover:bg-primary/20 cursor-pointer',
    className
  )

  if (asLink) {
    return (
      <Link href={`/categories/${encodeURIComponent(category)}`} className={baseClassName}>
        {category}
      </Link>
    )
  }

  return <span className={baseClassName}>{category}</span>
}

interface TagBadgeProps {
  tag: string
  className?: string
  asLink?: boolean
}

export function TagBadge({ tag, className, asLink = true }: TagBadgeProps) {
  const baseClassName = cn(
    'bg-secondary text-secondary-foreground inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors',
    asLink && 'hover:bg-secondary/80 cursor-pointer',
    className
  )

  if (asLink) {
    return (
      <Link href={`/tags/${encodeURIComponent(tag)}`} className={baseClassName}>
        #{tag}
      </Link>
    )
  }

  return <span className={baseClassName}>#{tag}</span>
}

interface TagsListProps {
  tags: string[]
  className?: string
  asLink?: boolean
}

export function TagsList({ tags, className, asLink = true }: TagsListProps) {
  if (!tags || tags.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <TagBadge key={tag} tag={tag} asLink={asLink} />
      ))}
    </div>
  )
}
