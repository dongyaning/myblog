import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 启用 Shimmer 闪光效果（默认 true）
   */
  shimmer?: boolean
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-muted/50 dark:bg-muted/30 rounded-md',
        shimmer ? 'skeleton-shimmer' : 'animate-pulse',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
