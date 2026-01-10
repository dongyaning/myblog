import { Eye, FileText, Users } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

interface SiteStats {
  totalViews: number
  totalPosts: number
  uniqueVisitors: number
}

async function getSiteStats(): Promise<SiteStats> {
  try {
    // console.log('Fetching site stats from:', process.env.NEXT_PUBLIC_SITE_URL)
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

export async function SiteStats() {
  const stats = await getSiteStats()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-3 p-6">
          <div className="bg-primary/10 text-primary rounded-full p-3">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">总访问量</p>
            <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-6">
          <div className="bg-primary/10 text-primary rounded-full p-3">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">文章总数</p>
            <p className="text-2xl font-bold">{stats.totalPosts.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-6">
          <div className="bg-primary/10 text-primary rounded-full p-3">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">独立访客</p>
            <p className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
