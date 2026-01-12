# 🚀 滚动动画 - 快速开始

## 立即查看效果

```bash
pnpm dev
```

访问 http://localhost:3000 即可看到动画效果！

---

## 🎬 动画效果一览

### 首页

- ✅ Hero 标题从下方淡入
- ✅ 文章卡片依次从下方淡入（交错效果）
- ✅ 侧边栏从左侧滑入
- ✅ 平滑滚动

### 文章详情页

- ✅ 顶部彩色滚动进度条
- ✅ 文章标题和内容依次淡入
- ✅ 相关文章依次出现
- ✅ 目录从左侧滑入

### 测试建议

在浏览器 DevTools 中：

1. 打开 Network 标签
2. 选择 **Fast 3G** 网速
3. 刷新页面观察动画

或者慢慢向下滚动页面，观察元素进入视口的动画！

---

## 🎨 可用的动画组件

### 1. FadeIn - 淡入动画

```tsx
import { FadeIn } from '@/components/animation'

// 基础用法
<FadeIn>
  <h1>从下方淡入</h1>
</FadeIn>

// 从上方淡入
<FadeIn direction="down">
  <div>从上方淡入</div>
</FadeIn>

// 从左侧淡入
<FadeIn direction="left">
  <div>从左侧淡入</div>
</FadeIn>

// 延迟 + 自定义时长
<FadeIn delay={200} duration={800}>
  <div>延迟 200ms，动画 800ms</div>
</FadeIn>
```

---

### 2. SlideIn - 滑入动画

```tsx
import { SlideIn } from '@/components/animation'

// 从下方滑入
<SlideIn direction="up">
  <div>从下方滑入</div>
</SlideIn>

// 从左侧滑入，偏移 100px
<SlideIn direction="left" offset={100}>
  <aside>侧边栏</aside>
</SlideIn>
```

---

### 3. ScaleIn - 缩放动画

```tsx
import { ScaleIn } from '@/components/animation'

// 从 80% 缩放到 100%
<ScaleIn initialScale={0.8}>
  <img src="/hero.jpg" alt="Hero" />
</ScaleIn>

// 从 50% 缩放到 100%（更明显）
<ScaleIn initialScale={0.5} duration={1000}>
  <Card>卡片内容</Card>
</ScaleIn>
```

---

### 4. StaggerContainer - 交错动画

```tsx
import { StaggerContainer, FadeIn } from '@/components/animation'

// 列表项依次出现，每个间隔 100ms
<StaggerContainer staggerDelay={100}>
  {items.map(item => (
    <FadeIn key={item.id}>
      <ListItem item={item} />
    </FadeIn>
  ))}
</StaggerContainer>

// 自定义初始延迟和间隔
<StaggerContainer initialDelay={200} staggerDelay={150}>
  <FadeIn><div>项目 1</div></FadeIn>
  <FadeIn><div>项目 2</div></FadeIn>
  <FadeIn><div>项目 3</div></FadeIn>
</StaggerContainer>
```

---

### 5. ScrollProgress - 滚动进度条

```tsx
import { ScrollProgress } from '@/components/animation'

// 彩色渐变进度条（推荐）
<ScrollProgress variant="gradient" height={3} />

// 主题色进度条
<ScrollProgress variant="primary" height={2} />

// 强调色进度条
<ScrollProgress variant="accent" height={4} />
```

---

### 6. Parallax - 视差滚动

```tsx
import { Parallax } from '@/components/animation'

// 半速滚动（背景效果）
<Parallax speed={0.5}>
  <img src="/background.jpg" alt="背景" />
</Parallax>

// 更慢的滚动
<Parallax speed={0.3} direction="down">
  <div>装饰元素</div>
</Parallax>
```

---

## 💡 常见使用场景

### 场景 1: Hero 区域

```tsx
<section className="hero">
  <FadeIn>
    <h1>欢迎来到我的博客</h1>
  </FadeIn>
  <FadeIn delay={100}>
    <p>一个专注于技术分享的平台</p>
  </FadeIn>
  <ScaleIn delay={200}>
    <Button>开始阅读</Button>
  </ScaleIn>
</section>
```

---

### 场景 2: 文章列表

```tsx
<StaggerContainer staggerDelay={80} className="grid grid-cols-3 gap-6">
  {posts.map((post) => (
    <FadeIn key={post.id} direction="up">
      <PostCard post={post} />
    </FadeIn>
  ))}
</StaggerContainer>
```

---

### 场景 3: 左右布局

```tsx
<div className="grid grid-cols-2 gap-10">
  <SlideIn direction="right">
    <div>左侧内容</div>
  </SlideIn>
  <SlideIn direction="left">
    <div>右侧内容</div>
  </SlideIn>
</div>
```

---

### 场景 4: 特色卡片

```tsx
<ScaleIn initialScale={0.9} duration={800}>
  <Card className="featured-card">
    <h2>特别推荐</h2>
    <p>精选内容</p>
  </Card>
</ScaleIn>
```

---

## ⚙️ 参数说明

### 通用参数

| 参数          | 类型    | 默认值 | 说明                 |
| ------------- | ------- | ------ | -------------------- |
| `delay`       | number  | 0      | 延迟时间（毫秒）     |
| `duration`    | number  | 600    | 动画持续时间（毫秒） |
| `triggerOnce` | boolean | true   | 是否只触发一次       |
| `className`   | string  | -      | 自定义 CSS 类名      |

### FadeIn 特有

| 参数        | 类型                                          | 默认值 | 说明     |
| ----------- | --------------------------------------------- | ------ | -------- |
| `direction` | 'up' \| 'down' \| 'left' \| 'right' \| 'none' | 'up'   | 淡入方向 |

### SlideIn 特有

| 参数        | 类型                                | 默认值 | 说明             |
| ----------- | ----------------------------------- | ------ | ---------------- |
| `direction` | 'up' \| 'down' \| 'left' \| 'right' | 'up'   | 滑入方向         |
| `offset`    | number                              | 50     | 偏移距离（像素） |

### ScaleIn 特有

| 参数           | 类型   | 默认值 | 说明                |
| -------------- | ------ | ------ | ------------------- |
| `initialScale` | number | 0.8    | 初始缩放比例（0-1） |

### StaggerContainer 特有

| 参数           | 类型   | 默认值 | 说明                 |
| -------------- | ------ | ------ | -------------------- |
| `staggerDelay` | number | 100    | 每个子元素的延迟间隔 |
| `initialDelay` | number | 0      | 初始延迟             |

### ScrollProgress 特有

| 参数      | 类型                                | 默认值     | 说明         |
| --------- | ----------------------------------- | ---------- | ------------ |
| `variant` | 'gradient' \| 'primary' \| 'accent' | 'gradient' | 颜色主题     |
| `height`  | number                              | 3          | 高度（像素） |

### Parallax 特有

| 参数        | 类型           | 默认值 | 说明            |
| ----------- | -------------- | ------ | --------------- |
| `speed`     | number         | 0.5    | 视差速度（0-1） |
| `direction` | 'up' \| 'down' | 'up'   | 视差方向        |

---

## 🎯 推荐配置

### 标题动画

```tsx
<FadeIn direction="up" delay={0} duration={600}>
  <h1>标题</h1>
</FadeIn>
```

### 内容动画

```tsx
<FadeIn direction="up" delay={100} duration={600}>
  <p>内容</p>
</FadeIn>
```

### 按钮动画

```tsx
<ScaleIn delay={200} duration={400} initialScale={0.9}>
  <Button>按钮</Button>
</ScaleIn>
```

### 卡片动画

```tsx
<FadeIn direction="up" duration={600}>
  <Card>卡片内容</Card>
</FadeIn>
```

### 列表动画

```tsx
<StaggerContainer staggerDelay={80}>
  {items.map((item) => (
    <FadeIn key={item.id} direction="up">
      <ListItem item={item} />
    </FadeIn>
  ))}
</StaggerContainer>
```

---

## 🎨 自定义样式

所有组件都支持 `className` prop：

```tsx
<FadeIn className="my-custom-class">
  <div>内容</div>
</FadeIn>
```

结合 Tailwind CSS：

```tsx
<FadeIn className="rounded-lg p-6 shadow-xl">
  <Card>自定义样式的卡片</Card>
</FadeIn>
```

---

## ⚡ 性能提示

### ✅ DO（推荐）

- 为关键元素添加动画
- 使用 `triggerOnce={true}`（默认）
- 每个元素延迟 50-150ms
- 动画时长 400-800ms

### ❌ DON'T（避免）

- 给所有元素添加动画
- 过长的动画时长（> 1s）
- 过多的同时动画（> 20 个）
- 过度使用视差滚动

---

## 🐛 常见问题

### Q: 为什么看不到动画？

A: 可能加载太快。尝试：

1. 使用浏览器 DevTools 限制网速
2. 向下滚动，观察元素进入视口
3. 检查元素是否在首屏外

### Q: 动画太快/太慢？

A: 调整 `duration` 参数：

```tsx
// 更快
<FadeIn duration={400}>...</FadeIn>

// 更慢
<FadeIn duration={800}>...</FadeIn>
```

### Q: 如何让动画重复触发？

A: 设置 `triggerOnce={false}`:

```tsx
<FadeIn triggerOnce={false}>
  <div>滚动上下会重复触发</div>
</FadeIn>
```

### Q: 能否在服务端渲染？

A: 动画组件是客户端组件（'use client'），但不影响 SEO：

- 首次渲染显示完整内容
- 动画在客户端激活

---

## 📚 完整文档

查看完整技术文档：

- `SCROLL_ANIMATIONS_IMPLEMENTATION.md`

---

## 🎉 开始使用吧！

所有动画组件都已就绪，开始为你的页面添加生动的动画效果吧！

记住：**少即是多**，只为关键元素添加动画，保持页面简洁流畅。✨
