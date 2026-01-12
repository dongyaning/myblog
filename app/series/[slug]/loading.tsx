import { PostCardSkeletonList } from '@/components/loading/post-card-skeleton'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * 系列详情页加载状态
 */
export default function SeriesDetailLoading() {
  return (
    <div className="container py-10">
      {/* 系列信息卡片 */}
      <Card className="mb-8 p-8">
        <div className="mb-4 flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="mt-2 h-5 w-3/4" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
      </Card>

      {/* 系列文章列表 */}
      <div className="mb-4">
        <Skeleton className="h-8 w-32" />
      </div>
      <PostCardSkeletonList count={6} />
    </div>
  )
}
