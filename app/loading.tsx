import { PostCardSkeletonList } from '@/components/loading/post-card-skeleton'
import { CompactStatsSkeleton } from '@/components/loading/stats-skeleton'
import { PopularPostsSkeleton } from '@/components/loading/stats-skeleton'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * 首页加载状态
 */
export default function HomeLoading() {
  return (
    <div className="container py-10">
      {/* Hero Section Skeleton */}
      <section className="mb-12 text-center">
        <Skeleton className="mx-auto mb-4 h-14 w-3/4 md:w-2/3" />
        <Skeleton className="mx-auto mb-2 h-6 w-2/3 md:w-1/2" />
        <Skeleton className="mx-auto mb-6 h-6 w-1/2 md:w-1/3" />

        {/* Compact Stats Skeleton */}
        <div className="flex justify-center">
          <CompactStatsSkeleton />
        </div>
      </section>

      {/* Main Content: Recent Posts + Sidebar */}
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        {/* Recent Posts Skeleton */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Button variant="ghost" size="sm" disabled>
              <Skeleton className="h-4 w-16" />
            </Button>
          </div>

          <PostCardSkeletonList count={9} />
        </section>

        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-6">
            <PopularPostsSkeleton limit={5} />
          </div>
        </aside>
      </div>
    </div>
  )
}
