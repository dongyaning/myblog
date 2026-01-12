import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * 文章编辑器加载状态
 */
export default function EditorLoading() {
  return (
    <div className="grid h-[calc(100vh-12rem)] gap-6 lg:grid-cols-2">
      {/* 编辑器区域 */}
      <Card className="flex flex-col overflow-hidden">
        <div className="border-b p-4">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex-1 p-4">
          <Skeleton className="h-full w-full" />
        </div>
      </Card>

      {/* 预览区域 */}
      <Card className="flex flex-col overflow-hidden">
        <div className="border-b p-4">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex-1 space-y-4 p-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="mt-6 h-40 w-full rounded-lg" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>
      </Card>
    </div>
  )
}
