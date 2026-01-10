import { and, desc, eq, gte, sql } from 'drizzle-orm'

import { db } from './index'
import { pageViews, postStats } from './schema'

// 记录页面访问
export async function recordPageView(data: {
  slug: string
  visitorId: string
  ipHash?: string
  userAgent?: string
  referer?: string
  readTime?: number
}) {
  try {
    await db.insert(pageViews).values({
      slug: data.slug,
      visitorId: data.visitorId,
      ipHash: data.ipHash,
      userAgent: data.userAgent,
      referer: data.referer,
      readTime: data.readTime,
    })
    return { success: true }
  } catch (error) {
    console.error('Error recording page view:', error)
    return { success: false, error }
  }
}

// 获取文章统计信息
export async function getPostStats(slug: string) {
  try {
    const result = await db.select().from(postStats).where(eq(postStats.slug, slug)).limit(1)
    return result[0] || null
  } catch (error) {
    console.error('Error getting post stats:', error)
    return null
  }
}

// 获取热门文章（Top N）
export async function getPopularPosts(limit: number = 10) {
  try {
    const result = await db.select().from(postStats).orderBy(desc(postStats.viewCount)).limit(limit)
    return result
  } catch (error) {
    console.error('Error getting popular posts:', error)
    return []
  }
}

// 获取站点总统计
export async function getSiteStats() {
  try {
    const [totalViewsResult, totalPostsResult, uniqueVisitorsResult] = await Promise.all([
      // 总浏览量
      db.select({ total: sql<number>`sum(${postStats.viewCount})` }).from(postStats),
      // 文章总数
      db.select({ count: sql<number>`count(*)` }).from(postStats),
      // 独立访客总数
      db.select({ total: sql<number>`sum(${postStats.uniqueVisitors})` }).from(postStats),
    ])

    return {
      totalViews: Number(totalViewsResult[0]?.total || 0),
      totalPosts: Number(totalPostsResult[0]?.count || 0),
      uniqueVisitors: Number(uniqueVisitorsResult[0]?.total || 0),
    }
  } catch (error) {
    console.error('Error getting site stats:', error)
    return {
      totalViews: 0,
      totalPosts: 0,
      uniqueVisitors: 0,
    }
  }
}

// 聚合统计数据（用于定时任务）
export async function aggregateStats() {
  try {
    // 获取所有文章的 slug
    const slugs = await db.selectDistinct({ slug: pageViews.slug }).from(pageViews)

    for (const { slug } of slugs) {
      // 统计每篇文章的数据
      const stats = await db
        .select({
          viewCount: sql<number>`count(*)`,
          uniqueVisitors: sql<number>`count(distinct ${pageViews.visitorId})`,
          avgReadTime: sql<number>`avg(${pageViews.readTime})`,
          lastViewed: sql<Date>`max(${pageViews.timestamp})`,
        })
        .from(pageViews)
        .where(eq(pageViews.slug, slug))

      const stat = stats[0]

      if (stat) {
        // 确保 lastViewed 是 Date 对象（PostgreSQL 可能返回字符串）
        const lastViewedDate =
          stat.lastViewed instanceof Date ? stat.lastViewed : new Date(stat.lastViewed)

        // 更新或插入统计数据
        await db
          .insert(postStats)
          .values({
            slug,
            viewCount: Number(stat.viewCount),
            uniqueVisitors: Number(stat.uniqueVisitors),
            avgReadTime: Math.round(Number(stat.avgReadTime) || 0),
            lastViewed: lastViewedDate,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: postStats.slug,
            set: {
              viewCount: Number(stat.viewCount),
              uniqueVisitors: Number(stat.uniqueVisitors),
              avgReadTime: Math.round(Number(stat.avgReadTime) || 0),
              lastViewed: lastViewedDate,
              updatedAt: new Date(),
            },
          })
      }
    }
    return { success: true }
  } catch (error) {
    console.error('Error aggregating stats:', error)
    return { success: false, error }
  }
}

// 获取最近访问记录（用于管理员仪表盘）
export async function getRecentPageViews(limit: number = 20) {
  try {
    const result = await db.select().from(pageViews).orderBy(desc(pageViews.timestamp)).limit(limit)
    return result
  } catch (error) {
    console.error('Error getting recent page views:', error)
    return []
  }
}

// 获取时间范围内的访问统计（用于管理员仪表盘）
export async function getViewsByDateRange(startDate: Date, endDate: Date) {
  try {
    const result = await db
      .select({
        date: sql<string>`date(${pageViews.timestamp})`,
        count: sql<number>`count(*)`,
        uniqueVisitors: sql<number>`count(distinct ${pageViews.visitorId})`,
      })
      .from(pageViews)
      .where(and(gte(pageViews.timestamp, startDate), sql`${pageViews.timestamp} <= ${endDate}`))
      .groupBy(sql`date(${pageViews.timestamp})`)
      .orderBy(sql`date(${pageViews.timestamp})`)
    return result
  } catch (error) {
    console.error('Error getting views by date range:', error)
    return []
  }
}

// 获取来源统计
export async function getRefererStats(limit: number = 10) {
  try {
    const result = await db
      .select({
        referer: pageViews.referer,
        count: sql<number>`count(*)`,
      })
      .from(pageViews)
      .where(sql`${pageViews.referer} is not null and ${pageViews.referer} != ''`)
      .groupBy(pageViews.referer)
      .orderBy(desc(sql`count(*)`))
      .limit(limit)
    return result
  } catch (error) {
    console.error('Error getting referer stats:', error)
    return []
  }
}

// 检查访客是否在指定时间内访问过（防刷机制）
export async function hasRecentVisit(slug: string, visitorId: string, minutesAgo: number = 1) {
  try {
    const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000)
    const result = await db
      .select()
      .from(pageViews)
      .where(
        and(
          eq(pageViews.slug, slug),
          eq(pageViews.visitorId, visitorId),
          gte(pageViews.timestamp, cutoffTime)
        )
      )
      .limit(1)
    return result.length > 0
  } catch (error) {
    console.error('Error checking recent visit:', error)
    return false
  }
}
