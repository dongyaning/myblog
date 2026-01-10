import { sql as vercelSql } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/vercel-postgres'

import * as schema from './schema'

// 创建 Drizzle 实例
export const db = drizzle(vercelSql, { schema })

// 导出 schema
export { schema }
