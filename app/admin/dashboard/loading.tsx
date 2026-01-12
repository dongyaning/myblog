import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * 管理员仪表盘加载状态
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* 标题 */}
      <div>
        <Skeleton className="mb-2 h-9 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 趋势图 */}
        <Card className="p-6">
          <Skeleton className="mb-6 h-6 w-32" />
          <Skeleton className="h-[300px] w-full" />
        </Card>

        {/* 柱状图 */}
        <Card className="p-6">
          <Skeleton className="mb-6 h-6 w-32" />
          <Skeleton className="h-[300px] w-full" />
        </Card>
      </div>

      {/* 最近访问记录 */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b pb-3 last:border-0">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
