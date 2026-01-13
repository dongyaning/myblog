# 🖼️ 博客图片插入 - 快速指南

## 🎯 总体方案

**PicGo + 七牛云 OSS** - 图片存储在云端，博客引用链接

---

## ⚡ 快速使用（2 步）⭐

### 1. 上传图片到七牛云

使用 PicGo 上传图片（截图或文件）

### 2. 粘贴到编辑器

PicGo 自动生成 Markdown 格式并复制，直接粘贴到编辑器即可

**就这么简单！** ✨

---

## 📝 详细步骤

### 方式 1：直接粘贴 PicGo 生成的 Markdown（推荐）⭐

1. **上传图片**
   - 打开 PicGo
   - 拖拽图片或截图上传
   - 等待上传完成

2. **PicGo 自动复制 Markdown**
   - PicGo 会自动生成并复制 Markdown 格式
   - 类似：`![image.jpg](https://your-oss.com/image.jpg)`

3. **粘贴到编辑器**
   - 在编辑器中按 `Cmd/Ctrl + V`
   - 完成！

**耗时**：约 5 秒 ⚡

---

### 方式 2：手动写 Markdown

如果需要自定义描述，可以手动修改 PicGo 生成的 Markdown：

```markdown
![图片描述](图片链接)
```

**PicGo 生成的格式**：

```markdown
![image.jpg](https://xxxxx.bkt.clouddn.com/blog/image.jpg)
```

**手动优化后**：

```markdown
![项目架构图](https://xxxxx.bkt.clouddn.com/blog/architecture.png '点击查看大图')
```

---

### 方式 3：使用 HTML 标签（高级）

如果需要更多控制（如指定尺寸），可以用 HTML：

```html
<img src="https://your-oss.com/image.jpg" alt="描述" width="600" />
```

**居中显示**：

```html
<div style="text-align: center">
  <img src="https://your-oss.com/image.jpg" alt="描述" width="800" />
</div>
```

---

## 🎨 PicGo 配置

### 重要：设置自动复制 Markdown 格式

1. 打开 **PicGo 设置**
2. 找到 **上传后自动复制**
3. 勾选 **Markdown 格式** ✅

这样上传后会自动复制：

```markdown
![filename.jpg](https://your-oss.com/filename.jpg)
```

而不是纯链接：

```
https://your-oss.com/filename.jpg
```

---

## 💡 使用技巧

### 1. 截图快速上传（推荐）⭐

**工作流程**：

```
1. 截图 (Cmd/Ctrl + Shift + 3/4)
2. PicGo 快捷键上传 (Cmd/Ctrl + Shift + V)
3. Markdown 自动复制到剪贴板
4. 编辑器中粘贴 (Cmd/Ctrl + V)
```

**耗时**：约 5 秒 ⚡

**超级流畅！**

---

### 2. 批量上传图片

如果一篇文章有多张图片：

**推荐方式**：边写边传

```
写文字 → 需要图片 → PicGo 上传 → 粘贴 → 继续写
```

**批量方式**：

1. 用 PicGo 批量上传所有图片
2. 每上传一张，手动记录链接（或截图 PicGo 历史）
3. 在编辑器中手动插入每张图片

---

### 3. 图片命名建议

在 PicGo 上传前，给图片起个有意义的名字：

❌ 不好：

```
WX20240101-123456.png
Screenshot_2024_01_01.png
IMG_1234.jpg
```

✅ 推荐：

```
project-architecture.png
login-page-screenshot.png
database-diagram.jpg
```

**好处**：

- 链接更可读
- 便于管理
- SEO 友好

---

### 4. 图片描述（Alt）填写建议

Alt 文本的作用：

- **SEO 优化** - 搜索引擎理解图片内容
- **无障碍** - 屏幕阅读器读给视障用户
- **加载失败时** - 显示替代文字

**好的 Alt 文本**：

```markdown
![Next.js 项目文件结构](...)
![用户登录页面界面](...)
![MySQL 数据库 ER 图](...)
```

**不好的 Alt 文本**：

```markdown
![图片](...)
![screenshot](...)
![1](...)
```

---

## 📐 图片尺寸建议

### 推荐尺寸

**封面图**: 1200 x 630 px (OG 图尺寸)  
**文章配图**: 800 - 1200 px 宽  
**截图**: 实际尺寸或 800 px 宽  
**图标/Logo**: 200 - 400 px

### 压缩建议

在 PicGo 中安装压缩插件：

- 质量：80% (推荐)
- 格式：JPG/PNG/WebP

**或者使用七牛云图片处理**：

```
原图：
https://your-domain.com/image.jpg

压缩到 80% 质量：
https://your-domain.com/image.jpg?imageView2/2/q/80

缩小到宽度 800px：
https://your-domain.com/image.jpg?imageView2/2/w/800
```

---

## 🎯 Markdown 图片语法完整版

### 基础语法

```markdown
![描述](链接)
```

### 带 title

```markdown
![描述](链接 '鼠标悬停显示')
```

### 多行格式（更易读）

```markdown
![
  这是一张项目架构图，
  展示了系统的主要模块和交互关系
](https://your-oss.com/architecture.png '点击查看大图')
```

---

## ✅ 检查清单

在发布文章前检查：

- [ ] 所有图片都已上传到七牛云
- [ ] 图片链接都是 HTTPS
- [ ] 图片都能正常访问（点击预览）
- [ ] 图片描述（Alt）已填写
- [ ] 图片大小合适（不要太大）
- [ ] 图片清晰度足够

---

## ❓ 常见问题

### Q: 图片在编辑器预览中不显示？

**A**: 可能的原因：

1. 链接未复制完整（缺少 `https://`）
2. 七牛云空间未设置为公开
3. 链接格式错误
4. 等待编辑器刷新（800ms 延迟）

**解决**：检查链接，重新粘贴

---

### Q: 可以上传 GIF 动图吗？

**A**: 可以！

- PicGo 支持 GIF
- Markdown 语法相同
- 注意文件大小（建议 < 5MB）

---

### Q: 如何删除不用的图片？

**A**:

1. 登录七牛云控制台
2. 进入 **内容管理**
3. 找到图片并删除

**提示**：删除前确保博客中已不再使用

---

### Q: 可以引用别人的图片吗？

**A**: 技术上可以，但不推荐：

- ❌ 可能涉及版权问题
- ❌ 链接可能失效
- ❌ 拖慢你的网站速度
- ✅ 建议下载后上传到自己的 OSS

---

## 🎉 开始使用

现在你已经了解如何插入图片了！

**快速开始**：

1. 查看 `PICGO_QINIU_SETUP.md` 配置 PicGo
2. 上传一张测试图片
3. 在编辑器中点击 "插入图片"
4. 粘贴链接并插入
5. 预览效果

**享受流畅的写作体验！** ✍️✨
