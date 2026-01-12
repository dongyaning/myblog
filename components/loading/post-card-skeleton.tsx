import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * 文章卡片骨架屏
 */
export function PostCardSkeleton() {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all">
      {/* 封面图占位 */}
      <Skeleton className="aspect-video w-full rounded-b-none" />

      {/* 内容区域 */}
      <div className="flex flex-1 flex-col p-6">
        {/* 分类/标签 */}
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* 标题 */}
        <Skeleton className="mb-2 h-7 w-full" />
        <Skeleton className="mb-4 h-7 w-3/4" />

        {/* 描述 */}
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-5/6" />

        {/* 元信息 */}
        <div className="mt-auto flex items-center gap-4 pt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Card>
  )
}

/**
 * 多个文章卡片骨架屏
 */
export function PostCardSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}
