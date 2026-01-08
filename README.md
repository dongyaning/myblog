# NingBlog

一个基于 Next.js 16、TypeScript 和 Tailwind CSS 构建的现代化个人技术博客平台。

## ✨ 特性

### 内容管理

- 📝 **MDX 支持**：在 Markdown 中使用 React 组件
- 🏷️ **分类与标签**：灵活的内容组织系统
- 📑 **自动目录**：文章自动生成导航目录
- ⏱️ **阅读时间**：自动计算预计阅读时间
- 🔗 **相关文章**：基于标签和分类的智能推荐

### 用户体验

- 🎨 **响应式设计**：完美适配桌面端和移动端
- 🌓 **深色模式**：支持亮色/深色主题切换
- 🎯 **极简设计**：专注于内容本身
- ♿ **可访问性**：符合 WCAG 2.1 AA 标准

### SEO 优化

- 🔍 **元数据管理**：动态生成页面 meta 信息
- 📱 **Open Graph**：社交媒体分享优化
- 🏷️ **结构化数据**：JSON-LD 格式的文章信息
- 🗺️ **站点地图**：自动生成 sitemap.xml
- 📡 **RSS Feed**：支持 RSS 订阅

### 性能优化

- ⚡ **静态生成**：所有页面预渲染
- 🖼️ **图片优化**：Next.js Image 自动优化
- 📦 **代码分割**：按需加载组件
- 🚀 **快速加载**：优化的资源加载策略

## 🛠️ 技术栈

- **框架**：Next.js 16 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS 4 + @tailwindcss/typography
- **UI 组件**：shadcn/ui (基于 Radix UI)
- **图标**：Lucide React
- **MDX**：next-mdx-remote
- **主题**：next-themes
- **动画**：Motion (framer-motion)
- **包管理**：pnpm

## 📦 安装

```bash
# 克隆仓库
git clone <repository-url>
cd myblog

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

开发服务器将在 http://localhost:3000 启动。

## 📝 创建文章

在 `content/posts` 目录下创建 `.mdx` 文件：

```markdown
---
title: 文章标题
date: 2026-01-08
updated: 2026-01-08
description: 文章描述（可选）
published: true
category: 分类名称
tags: [标签1, 标签2, 标签3]
cover: /images/cover.jpg （可选）
---

# 文章内容

这里是正文内容...

## 代码示例

\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

## 使用组件

可以在文章中使用 React 组件：

<Button>点击我</Button>
```

## 📂 项目结构

```
myblog/
├── app/                      # Next.js App Router
│   ├── blog/                # 博客页面
│   │   ├── page.tsx        # 博客列表页
│   │   └── [slug]/         # 文章详情页
│   ├── categories/          # 分类页面
│   ├── tags/               # 标签页面
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── sitemap.ts          # 站点地图
│   ├── robots.ts           # robots.txt
│   └── feed.xml/           # RSS Feed
├── components/              # React 组件
│   ├── blog/               # 博客相关组件
│   ├── layout/             # 布局组件
│   ├── ui/                 # UI 基础组件 (shadcn)
│   └── mdx-components.tsx  # MDX 自定义组件
├── content/                 # 内容文件
│   └── posts/              # 博客文章 (.mdx)
├── lib/                     # 工具函数
│   ├── mdx.ts              # MDX 处理
│   ├── reading-time.ts     # 阅读时间计算
│   ├── toc.ts              # 目录提取
│   ├── seo.ts              # SEO 工具
│   └── utils.ts            # 通用工具
└── public/                  # 静态资源
```

## 🎨 自定义

### 站点配置

编辑 `lib/seo.ts` 修改站点配置：

```typescript
export const siteConfig = {
  name: 'NingBlog',
  description: '你的博客描述',
  url: 'https://yourdomain.com',
  author: {
    name: '你的名字',
    email: 'your@email.com',
    twitter: '@yourtwitter',
  },
  links: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },
}
```

### 主题颜色

编辑 `app/globals.css` 自定义颜色方案：

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... 更多颜色变量 */
}
```

### 导航菜单

编辑 `components/layout/header.tsx` 修改导航链接：

```typescript
const navItems = [
  { name: '首页', href: '/' },
  { name: '博客', href: '/blog' },
  { name: '分类', href: '/categories' },
  { name: '标签', href: '/tags' },
  // 添加更多导航项...
]
```

## 🚀 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. Vercel 会自动检测 Next.js 项目并配置
4. 部署完成！

### 其他平台

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 📜 可用脚本

```bash
pnpm dev       # 启动开发服务器
pnpm build     # 构建生产版本
pnpm start     # 启动生产服务器
pnpm lint      # 运行 ESLint
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

Built with ❤️ by Ning
