import { NextRequest, NextResponse } from 'next/server'

import {
  getPopularPosts,
  getRecentPageViews,
  getRefererStats,
  getSiteStats,
  getUniqueVisitorsByDateRange,
  getViewsByDateRange,
} from '@/lib/db/queries'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'overview'

    // Calculate date ranges
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const last30Days = new Date(today)
    last30Days.setDate(last30Days.getDate() - 30)
    const last7Days = new Date(today)
    last7Days.setDate(last7Days.getDate() - 7)

    if (type === 'overview') {
      const [
        siteStats,
        popularPosts,
        recentViews,
        last30DaysData,
        last7DaysData,
        refererStats,
        todayUniqueVisitors,
        weekUniqueVisitors,
      ] = await Promise.all([
        getSiteStats(),
        getPopularPosts(20),
        getRecentPageViews(20),
        getViewsByDateRange(last30Days, now),
        getViewsByDateRange(last7Days, now),
        getRefererStats(10),
        getUniqueVisitorsByDateRange(today, now),
        getUniqueVisitorsByDateRange(last7Days, now),
      ])

      // Calculate today's and this week's stats
      const todayViews = last7DaysData
        .filter((d) => d.date === today.toISOString().split('T')[0])
        .reduce((sum, d) => sum + Number(d.count), 0)

      const weekViews = last7DaysData.reduce((sum, d) => sum + Number(d.count), 0)

      return NextResponse.json(
        {
          stats: {
            ...siteStats,
            todayViews,
            weekViews,
            todayUniqueVisitors,
            weekUniqueVisitors,
          },
          popularPosts,
          recentViews,
          chartData: last30DaysData.map((d) => ({
            date: d.date,
            views: Number(d.count),
            uniqueVisitors: Number(d.uniqueVisitors),
          })),
          refererStats: refererStats.map((r) => ({
            referer: r.referer || '直接访问',
            count: Number(r.count),
          })),
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      )
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error in admin analytics API:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
  }
}
