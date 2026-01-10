import { NextResponse } from 'next/server'

import { getPopularPosts, getSiteStats } from '@/lib/db/queries'

export const revalidate = 300 // 缓存 5 分钟

export async function GET() {
  try {
    const [popularPosts, siteStats] = await Promise.all([getPopularPosts(10), getSiteStats()])

    return NextResponse.json(
      {
        popularPosts,
        siteStats,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('Error in stats API:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
