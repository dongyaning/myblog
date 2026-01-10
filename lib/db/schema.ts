import { integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

// page_views 表 - 记录每次页面访问
export const pageViews = pgTable('page_views', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull(),
  visitorId: varchar('visitor_id', { length: 255 }).notNull(),
  ipHash: varchar('ip_hash', { length: 64 }),
  userAgent: text('user_agent'),
  referer: text('referer'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  readTime: integer('read_time'), // 阅读时长（秒）
})

// post_stats 表 - 文章统计汇总（定时更新）
export const postStats = pgTable('post_stats', {
  slug: varchar('slug', { length: 255 }).primaryKey(),
  viewCount: integer('view_count').default(0).notNull(),
  uniqueVisitors: integer('unique_visitors').default(0).notNull(),
  avgReadTime: integer('avg_read_time').default(0), // 平均阅读时长（秒）
  lastViewed: timestamp('last_viewed'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
