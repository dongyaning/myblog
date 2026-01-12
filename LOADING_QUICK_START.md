# 🚀 页面加载状态 - 快速开始

## 立即查看效果

启动开发服务器后，访问以下页面即可看到加载动画：

```bash
pnpm dev
```

### 🎯 测试页面

1. **首页**: http://localhost:3000
   - 顶部彩色进度条
   - Hero 区域骨架屏
   - 文章卡片骨架屏
   - 统计信息骨架屏

2. **博客列表**: http://localhost:3000/blog
   - 文章网格骨架屏

3. **文章详情**: http://localhost:3000/blog/[任意文章]
   - 完整文章布局骨架屏

4. **分类/标签页面**:
   - http://localhost:3000/categories
   - http://localhost:3000/tags

5. **管理后台**: http://localhost:3000/admin/dashboard
   - 仪表盘骨架屏
   - 图表占位符

---

## 💡 如何触发加载状态

### 方法 1: 页面导航

点击导航栏的链接，观察：

- ✅ 页面顶部出现彩色进度条
- ✅ 页面内容显示骨架屏
- ✅ 加载完成后平滑过渡

### 方法 2: 模拟慢速网络

在浏览器开发者工具中：

1. 打开 DevTools (F12)
2. 切换到 **Network** 标签
3. 选择 **Slow 3G** 或 **Fast 3G**
4. 刷新页面或导航

这样可以更清楚地看到加载动画效果。

---

## 🎨 组件使用示例

### 1. 使用基础 Skeleton 组件

```typescript
import { Skeleton } from '@/components/ui/skeleton'

export function MyComponent() {
  const [isLoading, setIsLoading] = useState(true)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />  {/* 标题 */}
        <Skeleton className="h-4 w-full" /> {/* 内容行1 */}
        <Skeleton className="h-4 w-full" /> {/* 内容行2 */}
        <Skeleton className="h-4 w-3/4" /> {/* 内容行3 */}
      </div>
    )
  }

  return <div>真实内容</div>
}
```

### 2. 使用预制骨架屏组件

```typescript
import {
  PostCardSkeleton,
  PostCardSkeletonList
} from '@/components/loading/post-card-skeleton'

// 单个骨架屏
<PostCardSkeleton />

// 多个骨架屏（网格布局）
<PostCardSkeletonList count={9} />
```

### 3. 为新页面添加加载状态

在页面目录下创建 `loading.tsx`:

```typescript
// app/my-page/loading.tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function MyPageLoading() {
  return (
    <div className="container py-10">
      <Skeleton className="mb-6 h-10 w-48" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  )
}
```

---

## 🔧 自定义配置

### 修改进度条颜色

编辑 `components/loading/loading-bar.tsx`:

```typescript
// 第 45 行左右
<div
  className="... bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
  // 改为你喜欢的颜色
  className="... bg-gradient-to-r from-green-500 to-blue-500"
/>
```

### 修改骨架屏样式

编辑 `components/ui/skeleton.tsx`:

```typescript
// 默认样式
className = 'animate-pulse rounded-md bg-muted/50'

// 自定义样式
className = 'animate-pulse rounded-lg bg-gray-200'
```

---

## 📱 响应式效果

所有骨架屏组件都已适配：

- ✅ 桌面端（大屏）
- ✅ 平板端（中屏）
- ✅ 移动端（小屏）

在不同设备上测试：

```typescript
// Tailwind 响应式类
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  <PostCardSkeleton />
</div>
```

---

## 🌓 深色模式支持

所有组件自动适配深色模式：

```typescript
// 自动适配的颜色
bg - muted / 50 // 浅色模式
dark: bg - muted / 30 // 深色模式
```

切换主题（右上角）观察效果变化。

---

## ✅ 检查清单

测试以下功能确保一切正常：

- [ ] 页面顶部进度条正常显示
- [ ] 首页骨架屏布局正确
- [ ] 博客列表骨架屏正常
- [ ] 文章详情页骨架屏完整
- [ ] 管理后台骨架屏显示
- [ ] 响应式布局正常（测试不同屏幕尺寸）
- [ ] 深色模式下显示正常
- [ ] 页面切换流畅无抖动

---

## 🐛 常见问题

### Q: 为什么看不到加载动画？

A: 本地开发时加载可能太快。尝试：

1. 使用浏览器 DevTools 限制网络速度
2. 在 page 组件中添加 `await new Promise(r => setTimeout(r, 2000))`（仅用于测试）

### Q: 如何调整加载动画时长？

A: 编辑 `components/loading/loading-bar.tsx` 中的 timeout 值：

```typescript
const timer1 = setTimeout(() => setProgress(40), 100) // 增大数值
const timer2 = setTimeout(() => setProgress(60), 300)
const timer3 = setTimeout(() => setProgress(80), 600)
```

### Q: 能否禁用某个页面的骨架屏？

A: 删除对应的 `loading.tsx` 文件即可。

---

## 📊 性能影响

加载状态组件对性能的影响：

- **Bundle 增加**: ~2KB (gzipped)
- **运行时开销**: 几乎为零
- **首次渲染**: 更快（骨架屏比真实内容轻量）
- **用户体验**: 显著提升

---

## 🎉 完成！

你的博客现在拥有：

✅ 专业的页面加载动画  
✅ 完整的骨架屏系统  
✅ 流畅的页面切换体验  
✅ 生产级的加载状态管理

开始使用吧！🚀
