import { Skeleton } from '@/components/ui/skeleton'

/**
 * 文章详情页骨架屏
 */
export function PostDetailSkeleton() {
  return (
    <div className="container py-10">
      <article className="mx-auto max-w-4xl">
        {/* 文章头部 */}
        <header className="mb-8">
          {/* 分类标签 */}
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>

          {/* 标题 */}
          <Skeleton className="mb-4 h-12 w-full" />
          <Skeleton className="mb-6 h-12 w-3/4" />

          {/* 描述 */}
          <Skeleton className="mb-6 h-6 w-full" />
          <Skeleton className="mb-6 h-6 w-4/5" />

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-20" />
          </div>

          {/* 分隔线 */}
          <Skeleton className="mt-8 h-px w-full" />
        </header>

        {/* 文章内容 */}
        <div className="space-y-4">
          {/* 模拟段落 */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mb-6 h-4 w-4/5" />
            </div>
          ))}

          {/* 模拟代码块 */}
          <Skeleton className="h-48 w-full rounded-lg" />

          {/* 更多段落 */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i + 10} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}
