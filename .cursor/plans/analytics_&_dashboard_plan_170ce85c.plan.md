---
name: Analytics & Dashboard Plan
overview: 为技术博客添加数据分析与管理功能，包括公开的阅读统计展示（读者可见）和后台管理仪表盘（管理员可见），使用 Vercel Postgres + Drizzle ORM 作为数据存储方案。
todos:
  - id: setup-database
    content: 配置 Drizzle ORM 和 Vercel Postgres，创建 Schema 和迁移脚本
    status: completed
  - id: build-tracking-api
    content: 实现访问追踪 API 和公开统计 API
    status: completed
    dependencies:
      - setup-database
  - id: frontend-public-stats
    content: 在文章页和首页添加阅读统计和热门文章展示
    status: completed
    dependencies:
      - build-tracking-api
  - id: admin-auth
    content: 实现管理员认证系统和路由保护
    status: completed
    dependencies:
      - setup-database
  - id: admin-dashboard
    content: 创建管理员仪表盘和详细分析页面
    status: completed
    dependencies:
      - admin-auth
      - build-tracking-api
  - id: optimization
    content: 添加数据聚合定时任务、缓存策略和性能优化
    status: completed
    dependencies:
      - admin-dashboard
---

# 数据分析与管理功能开发计划

## 架构概览

```mermaid
graph TB
    subgraph frontend [前端展示层]
        BlogPost[文章详情页]
        Homepage[首页/侧边栏]
        AdminDash[管理员仪表盘]
    end

    subgraph api [API路由层]
        TrackAPI[/api/analytics/track]
        StatsAPI[/api/analytics/stats]
        AdminAPI[/api/admin/analytics]
    end

    subgraph db [数据库层_Vercel_Postgres]
        PageViews[page_views表]
        PostStats[post_stats表]
    end

    BlogPost -->|记录访问| TrackAPI
    Homepage -->|获取热门| StatsAPI
    AdminDash -->|获取详细数据| AdminAPI

    TrackAPI --> PageViews
    StatsAPI --> PostStats
    AdminAPI --> PageViews
    AdminAPI --> PostStats
```

## 实现步骤

### Phase 1: 数据库架构设计（使用 Drizzle ORM）

**创建数据库 Schema 文件**新建 `lib/db/schema.ts`，定义两个核心表：

1. **`page_views` 表** - 记录每次页面访问

- `id`: 主键
- `slug`: 文章 slug
- `visitor_id`: 访客唯一标识（使用 cookie/localStorage）
- `ip_hash`: IP 地址哈希（隐私保护）
- `user_agent`: 浏览器信息
- `referer`: 来源页面
- `timestamp`: 访问时间
- `read_time`: 阅读时长（可选）

2. **`post_stats` 表** - 文章统计汇总（定时更新）

- `slug`: 文章 slug（主键）
- `view_count`: 总浏览量
- `unique_visitors`: 独立访客数
- `avg_read_time`: 平均阅读时长
- `last_viewed`: 最后访问时间
- `updated_at`: 更新时间

**创建数据库配置文件**新建 `lib/db/index.ts`，配置 Drizzle 连接和 Vercel Postgres 客户端。**生成数据库迁移脚本**使用 Drizzle Kit 生成迁移文件：

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

---

### Phase 2: 访问追踪 API（后端）

**创建 API 路由** `app/api/analytics/track/route.ts`功能：

- 接收前端发送的访问记录（POST 请求）
- 插入数据到 `page_views` 表
- 使用 Vercel Edge Runtime 提升性能
- 实现防刷机制（同一访客 1 分钟内重复访问不计数）

**创建公开统计 API** `app/api/analytics/stats/route.ts`功能：

- 返回热门文章 Top 10（按浏览量排序）
- 返回站点总访问量、总文章数、总访客数
- 查询 `post_stats` 表（已聚合数据，查询快速）
- 响应缓存（Revalidate 5 分钟）

---

### Phase 3: 前端公开展示（读者可见）

**1. 文章详情页显示阅读次数**修改 [`app/blog/[slug]/page.tsx`](app/blog/[slug]/page.tsx)：

- 在文章元信息区域（[`components/blog/post-meta.tsx`](components/blog/post-meta.tsx)）添加"👁️ 123 次阅读"
- 从 `post_stats` 表获取数据（服务端组件）
- 页面加载时调用 `/api/analytics/track` 记录访问（客户端组件）

**2. 首页/侧边栏显示热门文章**创建 `components/analytics/popular-posts.tsx`：

- 显示"🔥 热门文章"列表（Top 5）
- 使用服务端组件获取数据（SSR）
- 在 [`app/page.tsx`](app/page.tsx) 或侧边栏集成

**3. 站点统计面板**创建 `components/analytics/site-stats.tsx`：

- 显示总访问量、文章数、访客数
- 使用 shadcn/ui Card 组件展示
- 可选：添加简单的访问趋势图表（使用 Recharts）

---

### Phase 4: 后台管理仪表盘（管理员可见）

**1. 简单认证系统**创建 `app/admin/page.tsx`（管理员登录页）：

- 使用环境变量 `ADMIN_PASSWORD` 进行简单密码验证
- 登录后存储 JWT token 到 cookie
- 使用 middleware.ts 保护 `/admin/*` 路由

**2. 管理员仪表盘首页**创建 `app/admin/dashboard/page.tsx`：

- 概览卡片：今日访问、本周访问、总访问、独立访客
- 访问趋势图表（最近 30 天）
- 热门文章排行（Top 20）
- 最近访问记录（实时数据）

**3. 详细分析 API**创建 `app/api/admin/analytics/route.ts`（需认证）：

- 按时间范围查询访问数据
- 按文章分组统计
- 访客地理位置分析（基于 IP）
- 来源分析（referer 统计）

**4. 可视化图表组件**创建 `components/admin/analytics-charts.tsx`：

- 访问趋势折线图
- 文章浏览量柱状图
- 来源分布饼图
- 使用 Recharts 或 Chart.js

---

### Phase 5: 性能优化与用户体验

**1. 客户端访问追踪组件**创建 `components/analytics/page-view-tracker.tsx`（客户端组件）：

- 使用 `useEffect` 在页面加载时发送追踪请求
- 使用 `navigator.sendBeacon` 确保请求发送
- 生成唯一访客 ID（使用 `crypto.randomUUID` + localStorage）
- 记录阅读时长（监听页面停留时间）

**2. 数据聚合任务**创建 `app/api/cron/aggregate-stats/route.ts`（Vercel Cron Job）：

- 定时任务（每小时执行一次）
- 从 `page_views` 表聚合数据到 `post_stats` 表
- 使用 Vercel Cron 配置文件 `vercel.json`

**3. 缓存策略**

- 公开统计 API 使用 Next.js ISR（5 分钟 revalidate）
- 后台仪表盘使用客户端轮询（30 秒刷新）
- 使用 Vercel KV 缓存热门数据（可选）

**4. 隐私保护**

- IP 地址仅存储哈希值（SHA-256）
- 不收集个人身份信息
- 添加"隐私声明"页面（可选）

---

## 技术栈总结

- **数据库**: Vercel Postgres
- **ORM**: Drizzle ORM
- **认证**: 简单密码 + JWT（可升级为 NextAuth.js）
- **图表**: Recharts
- **API**: Next.js App Router API Routes
- **部署**: Vercel（支持 Edge Runtime 和 Cron Jobs）

---

## 文件结构

```javascript
lib/
  db/
    schema.ts          # Drizzle 数据库 Schema
    index.ts           # 数据库连接配置
    queries.ts         # 数据库查询函数
  auth.ts              # JWT 认证工具

app/
  api/
    analytics/
      track/route.ts   # 记录访问 API
      stats/route.ts   # 公开统计 API
    admin/
      analytics/route.ts  # 管理员详细分析 API
    cron/
      aggregate-stats/route.ts  # 数据聚合定时任务
  admin/
    page.tsx           # 管理员登录页
    dashboard/
      page.tsx         # 管理员仪表盘
      layout.tsx       # 后台布局

components/
  analytics/
    page-view-tracker.tsx   # 客户端访问追踪
    popular-posts.tsx       # 热门文章组件
    site-stats.tsx          # 站点统计面板
  admin/
    analytics-charts.tsx    # 图表组件
    auth-form.tsx          # 登录表单

middleware.ts          # 路由保护中间件
vercel.json            # Vercel Cron Jobs 配置
```

---

## 关键决策

1. **为什么使用 Vercel Postgres？**

- 与 Vercel 部署无缝集成
- 自动扩展，无需管理服务器
- Drizzle ORM 提供类型安全的数据库操作

2. **为什么分离 `page_views` 和 `post_stats`？**

- `page_views` 记录原始数据（写入频繁）
- `post_stats` 存储聚合数据（查询频繁）
- 提升查询性能，减少计算开销

3. **为什么使用简单密码认证而非 NextAuth.js？**

- 个人博客只需单管理员登录
- 减少复杂度和依赖
- 如需多用户管理，可后续升级

---

## 部署注意事项

1. 配置环境变量：

   ```env
                  POSTGRES_URL=your_vercel_postgres_url
                  ADMIN_PASSWORD=your_secure_password
                  JWT_SECRET=your_jwt_secret
   ```

2. 运行数据库迁移：

   ```bash
                  pnpm drizzle-kit generate
                  pnpm drizzle-kit migrate
   ```

3. 配置 Vercel Cron Jobs（在 `vercel.json` 中）：

   ```json
   {
     "crons": [
       {
         "path": "/api/cron/aggregate-stats",
         "schedule": "0 * * * *"
       }
     ]
   }
   ```
