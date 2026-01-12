import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * 分类列表页加载状态
 */
export default function CategoriesLoading() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-32" />
        <Skeleton className="h-6 w-48" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6 transition-all">
            <div className="mb-4 flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-6 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </Card>
        ))}
      </div>
    </div>
  )
}
