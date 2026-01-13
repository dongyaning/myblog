# 🖼️ 图片配置修复说明

## 问题

在编辑器中使用 Markdown 图片语法时报错：

```
Invalid src prop on `next/image`, hostname "xxx.bkt.clouddn.com" is not configured
```

---

## 原因

Next.js 的 `Image` 组件出于安全考虑，要求在配置文件中明确声明允许的外部图片域名。

---

## 解决方案

### 1. 配置 Next.js 允许的图片域名

在 `next.config.ts` 中添加了 `images.remotePatterns` 配置：

```typescript
images: {
  remotePatterns: [
    {
      // 七牛云图床域名（HTTPS）
      protocol: 'https',
      hostname: '**.bkt.clouddn.com',
    },
    {
      // 七牛云图床域名（HTTP）
      protocol: 'http',
      hostname: '**.bkt.clouddn.com',
    },
    {
      // 七牛云自定义域名
      protocol: 'https',
      hostname: '**.qiniudn.com',
    },
    {
      // 七牛云 CDN 域名
      protocol: 'https',
      hostname: '**.clouddn.com',
    },
    // 其他常见图床...
  ],
}
```

**通配符说明**：

- `**` 匹配任何子域名
- `**.bkt.clouddn.com` 可以匹配：
  - `abc123.bkt.clouddn.com`
  - `t8rav49pj.hn-bkt.clouddn.com`
  - 等任何七牛云域名

---

### 2. 编辑器预览使用普通 `<img>` 标签

在 `mdx-components-client.tsx` 中，将编辑器预览的图片组件改为普通 `<img>` 标签：

**之前**（使用 Next.js Image）：

```tsx
<Image src={src} alt={alt} width={800} height={450} />
```

**现在**（使用普通 img）：

```tsx
<img src={src} alt={alt} loading="lazy" />
```

**原因**：

- 编辑器预览不需要 Next.js Image 的优化
- 避免域名配置问题
- 更快的预览响应

---

## 支持的图床域名

目前配置已支持以下域名：

### 七牛云

- ✅ `*.bkt.clouddn.com` (标准域名)
- ✅ `*.qiniudn.com` (自定义域名)
- ✅ `*.clouddn.com` (CDN 域名)
- ✅ HTTP 和 HTTPS 都支持

### 其他图床（已配置）

- ✅ `imgur.com`
- ✅ `i.imgur.com`

---

## 如何添加新的图床域名

如果你使用其他图床服务，可以在 `next.config.ts` 中添加：

```typescript
{
  protocol: 'https',
  hostname: 'your-domain.com',
}
```

**通配符示例**：

```typescript
{
  // 匹配所有子域名
  hostname: '**.example.com',
}

{
  // 精确匹配
  hostname: 'cdn.example.com',
}

{
  // 匹配特定路径
  hostname: 'example.com',
  pathname: '/images/**',
}
```

---

## 重启开发服务器

修改 `next.config.ts` 后，**必须重启开发服务器**：

```bash
# 停止当前服务器（Ctrl + C）
# 然后重新启动
pnpm dev
```

---

## 验证配置

### 1. 测试编辑器预览

在编辑器中输入：

```markdown
![测试图片](https://your-oss-domain.com/test.jpg)
```

应该能在预览中正常显示图片。

### 2. 测试正式渲染

保存文章后，访问文章页面，图片应该正常显示。

---

## 正式渲染中的图片组件

在正式的文章页面（非编辑器预览），MDX 会使用优化的图片组件。

查看 `components/mdx-components.tsx` 了解正式渲染的配置。

---

## 常见问题

### Q: 修改配置后还是报错？

**A**: 确保：

1. 重启了开发服务器
2. 清除浏览器缓存（`Cmd/Ctrl + Shift + R`）
3. 检查图片链接是否正确（包含 http:// 或 https://）

---

### Q: 图片在编辑器中显示，但文章页不显示？

**A**: 可能是正式渲染组件的问题。检查：

1. `components/mdx-components.tsx` 中的 img 组件
2. 确保域名在 `next.config.ts` 中已配置

---

### Q: 可以用相对路径的图片吗？

**A**: 可以，但需要放在 `public/` 目录：

```markdown
![本地图片](/images/posts/local.jpg)
```

对应文件路径：`public/images/posts/local.jpg`

---

### Q: 支持 GIF 动图吗？

**A**: 完全支持！

- 七牛云支持 GIF
- Next.js Image 会自动处理 GIF
- 编辑器预览也正常显示

---

### Q: 图片加载很慢？

**A**: 可能的原因：

1. 图片文件太大（建议 < 2MB）
2. 七牛云 CDN 未生效（刚上传的图片）
3. 网络问题

**优化建议**：

- 使用 PicGo 压缩插件
- 或使用七牛云图片处理参数：
  ```
  https://your-domain.com/image.jpg?imageView2/2/w/800/q/80
  ```

---

## 技术说明

### remotePatterns vs domains

Next.js 15+ 推荐使用 `remotePatterns` 而不是旧的 `domains`：

**旧方式（不推荐）**：

```typescript
images: {
  domains: ['example.com', 'cdn.example.com'],
}
```

**新方式（推荐）**：

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.example.com',
    },
  ],
}
```

**优势**：

- 支持通配符
- 更细粒度的控制
- 可以限制协议和路径

---

## 安全性

### 为什么需要配置域名？

Next.js 这样做是出于安全考虑：

1. **防止 SSRF 攻击**
   - 限制可访问的外部域名
   - 避免服务器被用作代理

2. **防止资源滥用**
   - 限制图片优化的来源
   - 避免 CDN 流量被滥用

3. **性能考虑**
   - 只优化可信来源的图片
   - 避免处理恶意图片

---

## 总结

✅ **已修复**：图片域名配置问题  
✅ **已支持**：七牛云所有域名  
✅ **已优化**：编辑器预览使用普通 img  
✅ **已配置**：常见图床域名

**记得重启开发服务器！** 🔄

---

**修复完成时间**: 2026-01-12  
**状态**: ✅ 已解决
