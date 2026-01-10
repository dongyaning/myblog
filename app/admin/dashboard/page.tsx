'use client'

import { useEffect, useState } from 'react'

import { Eye, FileText, TrendingUp, Users } from 'lucide-react'

import {
  PopularPostsChart,
  RefererChart,
  ViewsTrendChart,
} from '@/components/admin/analytics-charts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AnalyticsData {
  stats: {
    totalViews: number
    totalPosts: number
    uniqueVisitors: number
    todayViews: number
    weekViews: number
  }
  popularPosts: Array<{ slug: string; viewCount: number }>
  recentViews: Array<{
    id: number
    slug: string
    visitorId: string
    timestamp: Date
    referer?: string
  }>
  chartData: Array<{ date: string; views: number; uniqueVisitors: number }>
  refererStats: Array<{ referer: string; count: number }>
}

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/analytics?type=overview')
        if (response.ok) {
          const analyticsData = await response.json()
          setData(analyticsData)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Auto refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">无法加载数据</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">数据分析仪表盘</h1>
        <p className="text-muted-foreground mt-2">实时监控博客访问数据和用户行为</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日访问</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.todayViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本周访问</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.weekViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总访问量</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">独立访客</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.uniqueVisitors.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">文章总数</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalPosts.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-1">
        <ViewsTrendChart data={data.chartData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PopularPostsChart data={data.popularPosts} />
        <RefererChart data={data.refererStats} />
      </div>

      {/* Recent Views Table */}
      <Card>
        <CardHeader>
          <CardTitle>最近访问记录</CardTitle>
          <CardDescription>实时访问数据</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-muted-foreground pb-3 text-left font-medium">文章</th>
                  <th className="text-muted-foreground pb-3 text-left font-medium">访客ID</th>
                  <th className="text-muted-foreground pb-3 text-left font-medium">来源</th>
                  <th className="text-muted-foreground pb-3 text-left font-medium">时间</th>
                </tr>
              </thead>
              <tbody>
                {data.recentViews.map((view) => (
                  <tr key={view.id} className="border-border border-b">
                    <td className="py-3">{view.slug}</td>
                    <td className="py-3 font-mono text-xs">{view.visitorId.substring(0, 8)}...</td>
                    <td className="py-3 text-xs">
                      {view.referer ? (
                        <span className="max-w-xs truncate">{view.referer}</span>
                      ) : (
                        <span className="text-muted-foreground">直接访问</span>
                      )}
                    </td>
                    <td className="text-muted-foreground py-3 text-xs">
                      {new Date(view.timestamp).toLocaleString('zh-CN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
