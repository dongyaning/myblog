import { Eye, FileText, Users } from 'lucide-react'

interface SiteStats {
  totalViews: number
  totalPosts: number
  uniqueVisitors: number
}

async function getSiteStats(): Promise<SiteStats> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/stats`,
      {
        next: { revalidate: 300 },
      }
    )
    if (!response.ok) {
      return { totalViews: 0, totalPosts: 0, uniqueVisitors: 0 }
    }
    const data = await response.json()
    return data.siteStats || { totalViews: 0, totalPosts: 0, uniqueVisitors: 0 }
  } catch (error) {
    console.error('Failed to fetch site stats:', error)
    return { totalViews: 0, totalPosts: 0, uniqueVisitors: 0 }
  }
}

/**
 * 紧凑型网站统计组件
 * 用于首页，低调展示统计数据
 */
export async function CompactStats() {
  const stats = await getSiteStats()

  return (
    <div className="border-border bg-muted/30 flex flex-wrap items-center justify-center gap-6 rounded-lg border px-6 py-4 text-sm md:gap-8">
      {/* 总访问量 */}
      <div className="flex items-center gap-2">
        <Eye className="text-muted-foreground h-4 w-4" />
        <span className="text-muted-foreground">总访问</span>
        <span className="font-semibold">{stats.totalViews.toLocaleString()}</span>
      </div>

      {/* 分隔符 */}
      <div className="border-border hidden h-4 w-px border-l md:block" />

      {/* 文章总数 */}
      <div className="flex items-center gap-2">
        <FileText className="text-muted-foreground h-4 w-4" />
        <span className="text-muted-foreground">文章</span>
        <span className="font-semibold">{stats.totalPosts.toLocaleString()}</span>
      </div>

      {/* 分隔符 */}
      <div className="border-border hidden h-4 w-px border-l md:block" />

      {/* 独立访客 */}
      <div className="flex items-center gap-2">
        <Users className="text-muted-foreground h-4 w-4" />
        <span className="text-muted-foreground">访客</span>
        <span className="font-semibold">{stats.uniqueVisitors.toLocaleString()}</span>
      </div>
    </div>
  )
}
