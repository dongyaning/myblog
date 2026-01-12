import { Skeleton } from '@/components/ui/skeleton'

/**
 * 标签列表页加载状态
 */
export default function TagsLoading() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-24" />
        <Skeleton className="h-6 w-48" />
      </div>

      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>
    </div>
  )
}
