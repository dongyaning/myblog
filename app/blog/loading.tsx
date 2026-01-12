import { PostCardSkeletonList } from '@/components/loading/post-card-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * 博客列表页加载状态
 */
export default function BlogLoading() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-32" />
        <Skeleton className="h-6 w-40" />
      </div>

      <PostCardSkeletonList count={12} />
    </div>
  )
}
