# 快速开始指南

## 🚀 5 分钟开始使用 NingBlog

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 查看博客。

### 3. 创建第一篇文章

在 `content/posts/` 目录创建新文件 `my-first-post.mdx`：

```markdown
---
title: 我的第一篇文章
date: 2026-01-08
description: 这是一篇测试文章
published: true
category: 技术
tags: [Next.js, React]
---

# 欢迎！

这是我的第一篇博客文章。

## 代码示例

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

## 使用组件

<Button>点击我</Button>
```

保存后刷新页面，你的文章就会出现！

### 4. 自定义配置

编辑 `lib/seo.ts` 修改站点信息：

```typescript
export const siteConfig = {
  name: '你的博客名称',
  description: '你的博客描述',
  url: 'https://yourdomain.com',
  author: {
    name: '你的名字',
    email: 'your@email.com',
    twitter: '@yourtwitter',
  },
}
```

### 5. 自定义导航

编辑 `components/layout/header.tsx` 修改导航菜单：

```typescript
const navItems = [
  { name: '首页', href: '/' },
  { name: '博客', href: '/blog' },
  { name: '分类', href: '/categories' },
  { name: '标签', href: '/tags' },
  // 添加你的自定义链接
]
```

### 6. 自定义页脚

编辑 `components/layout/footer.tsx` 修改社交链接：

```typescript
<Link href="https://github.com/yourusername">
  <Github className="h-5 w-5" />
</Link>
```

### 7. 部署到 Vercel

```bash
# 1. 推送到 GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. 在 Vercel.com 导入项目
# 3. 自动部署完成！
```

---

## 📝 文章写作技巧

### Frontmatter 字段说明

```yaml
---
title: 文章标题 # 必填
date: 2026-01-08 # 必填（YYYY-MM-DD）
updated: 2026-01-09 # 可选，更新日期
description: 摘要 # 可选，用于 SEO 和卡片显示
published: true # 必填，false 时文章不显示
category: 分类名称 # 可选，单个分类
tags: [标签1, 标签2] # 可选，多个标签
cover: /images/xxx.jpg # 可选，封面图
---
```

### 使用组件

在文章中可以直接使用 React 组件：

```markdown
<Button variant="default">按钮</Button>
<Button variant="outline">轮廓按钮</Button>
```

### 代码高亮

支持多种语言的代码高亮：

````markdown
```javascript
const greeting = 'Hello'
```

```python
def hello():
    print("Hello")
```

```typescript
interface User {
  name: string
}
```
````

---

## 🎨 主题自定义

### 修改颜色

编辑 `app/globals.css`：

```css
:root {
  --primary: oklch(0.205 0 0); /* 主色 */
  --background: oklch(1 0 0); /* 背景色 */
  --foreground: oklch(0.145 0 0); /* 前景色 */
}
```

### 修改字体

编辑 `app/layout.tsx`：

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// 在 body 标签添加
<body className={inter.className}>
```

---

## 🔧 常见问题

### Q: 如何添加新页面？

在 `app/` 目录创建新文件夹和 `page.tsx`：

```typescript
// app/about/page.tsx
export default function AboutPage() {
  return <div>关于页面</div>
}
```

### Q: 如何隐藏文章？

设置 frontmatter 的 `published: false`

### Q: 如何修改每页显示的文章数？

编辑 `app/page.tsx`：

```typescript
const recentPosts = allPosts.slice(0, 6) // 改成你想要的数量
```

### Q: 如何添加图片？

1. 将图片放在 `public/images/` 目录
2. 在文章中使用：

```markdown
![描述](/images/my-image.jpg)
```

---

## 📚 更多资源

- [完整文档](./README.md)
- [实现总结](./IMPLEMENTATION_SUMMARY.md)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 组件](https://ui.shadcn.com/)

---

开始创作吧！🎉
