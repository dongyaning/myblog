import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * 统计卡片骨架屏
 */
export function StatsCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </Card>
  )
}

/**
 * 紧凑型统计骨架屏
 */
export function CompactStatsSkeleton() {
  return (
    <div className="bg-card inline-flex items-center gap-6 rounded-full border px-6 py-3 shadow-sm">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  )
}

/**
 * 热门文章列表骨架屏
 */
export function PopularPostsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            {i < count - 1 && <Skeleton className="mt-4 h-px w-full" />}
          </div>
        ))}
      </div>
    </Card>
  )
}
