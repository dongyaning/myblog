# 📷 PicGo + 七牛云图床配置指南

## 🎯 方案概述

使用 **PicGo（图床工具）+ 七牛云（对象存储）** 管理博客图片。

**优势**：

- ✅ 图片不进 Git 仓库，保持轻量
- ✅ 自己的 OSS，完全掌控
- ✅ 免费额度充足（10GB 存储 + 10GB 流量/月）
- ✅ CDN 加速，访问快
- ✅ 截图即传，工作流顺畅

---

## 🚀 第一步：注册七牛云

### 1. 访问官网

https://www.qiniu.com/

### 2. 注册账号

- 使用手机号或邮箱注册
- 完成实名认证（个人认证即可）

### 3. 实名认证

- 进入控制台 → 个人中心 → 实名认证
- 上传身份证照片
- 等待审核（通常 1 小时内）

---

## 📦 第二步：创建存储空间（Bucket）

### 1. 进入对象存储

- 登录七牛云控制台
- 点击 **对象存储** → **空间管理**
- 点击 **新建空间**

### 2. 配置空间

```
空间名称: my-blog-images  （自定义，全局唯一）
存储区域: 华东-浙江2      （选择离你最近的）
访问控制: 公开空间        （必须选公开，否则无法访问）
```

### 3. 获取空间信息

创建成功后，记录以下信息：

- **Bucket 名称**: my-blog-images
- **外链默认域名**: xxxxx.bkt.clouddn.com
- **存储区域代号**: z2 (华东-浙江2)

**存储区域代号对照表**：

```
z0 - 华东-浙江
z1 - 华北-河北
z2 - 华东-浙江2
na0 - 北美
as0 - 东南亚
```

---

## 🔑 第三步：获取 AccessKey

### 1. 进入密钥管理

- 控制台右上角 → 头像
- 点击 **密钥管理**

### 2. 创建密钥

- 点击 **创建密钥**
- 或使用已有密钥

### 3. 记录密钥

```
AccessKey (AK): xxxxxxxxxxxxxxxxxxxx
SecretKey (SK): xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **注意**：密钥只显示一次，请妥善保存！

---

## 🖼️ 第四步：安装 PicGo

### 方法 1：官网下载（推荐）

**官网**: https://molunerfinn.com/PicGo/
**GitHub**: https://github.com/Molunerfinn/PicGo

下载对应系统的版本：

- **Windows**: PicGo-Setup-x.x.x.exe
- **macOS**: PicGo-x.x.x.dmg
- **Linux**: PicGo-x.x.x.AppImage

### 方法 2：包管理器安装

**macOS (Homebrew)**:

```bash
brew install --cask picgo
```

**Windows (Scoop)**:

```bash
scoop bucket add extras
scoop install picgo
```

**Windows (Winget)**:

```bash
winget install Molunerfinn.PicGo
```

---

## ⚙️ 第五步：配置 PicGo

### 1. 打开 PicGo

### 2. 进入图床设置

- 左侧菜单 → **图床设置**
- 选择 **七牛图床**

### 3. 填写配置

```
AccessKey (AK):     你的 AccessKey
SecretKey (SK):     你的 SecretKey
Bucket (存储空间名): my-blog-images
访问网址:            https://xxxxx.bkt.clouddn.com
存储区域:            z2 (根据你的选择)
存储路径:            blog/posts/    （可选，推荐设置）
网址后缀:            （留空）
```

**存储路径说明**：

- 留空：图片直接存在根目录
- `blog/posts/`：图片存在 blog/posts/ 目录下（推荐）
- `blog/posts/{year}/`：按年份分类
- `blog/posts/{year}/{month}/`：按年月分类

### 4. 设置为默认图床

- 点击 **确定**
- 点击 **设为默认图床**

### 5. 测试上传

- 左侧菜单 → **上传区**
- 拖拽图片或点击上传
- 如果成功，会显示图片链接

---

## 🎨 第六步：优化 PicGo 配置

### 1. 设置快捷键

- **PicGo 设置** → **快捷键设置**
- 截图上传：`Cmd/Ctrl + Shift + P`
- 剪贴板上传：`Cmd/Ctrl + Shift + V`

### 2. 自动复制链接

- **PicGo 设置** → **上传后自动复制**
- 勾选 **Markdown 格式**

### 3. 时间戳重命名

- **PicGo 设置** → **时间戳重命名**
- 勾选，避免文件名冲突

### 4. 图片压缩（可选）

- **插件设置** → 搜索 **compress**
- 安装 **picgo-plugin-compress**
- 配置压缩质量（推荐 80%）

---

## 📝 第七步：使用工作流

### 方式 1：截图直接上传（推荐）

1. **截图** (Cmd/Ctrl + Shift + 3/4)
2. 图片保存到剪贴板
3. **打开 PicGo**，点击 **剪贴板图片上传**
4. 或使用快捷键 **Cmd/Ctrl + Shift + V**
5. 自动上传并复制链接

### 方式 2：拖拽上传

1. 打开 **PicGo**
2. 拖拽图片到上传区
3. 自动上传并复制链接

### 方式 3：右键上传（Windows）

1. 选中图片文件
2. 右键 → **使用 PicGo 上传**
3. 自动上传并复制链接

---

## ✍️ 第八步：在博客中使用

### 1. 在编辑器中插入图片

#### 方法 1：使用图片插入工具（推荐）

1. 用 PicGo 上传图片
2. 复制图片链接
3. 在编辑器点击 **📷 插入图片** 按钮
4. 粘贴链接，填写描述
5. 点击 **插入图片**

#### 方法 2：直接写 Markdown

```markdown
![图片描述](https://your-domain.com/blog/posts/image.jpg)
```

#### 方法 3：使用 HTML（更多控制）

```html
<img src="https://your-domain.com/blog/posts/image.jpg" alt="描述" width="600" />
```

### 2. 图片示例

```markdown
# 我的文章

这是一张截图：

![项目截图](https://xxxxx.bkt.clouddn.com/blog/posts/screenshot.png)

这是一张配图：

![技术架构图](https://xxxxx.bkt.clouddn.com/blog/posts/architecture.jpg '点击查看大图')
```

---

## 🎯 目录结构建议

### 在七牛云 Bucket 中的结构

```
my-blog-images/
├── blog/
│   ├── posts/
│   │   ├── 2024/
│   │   │   ├── article-1-screenshot.png
│   │   │   └── article-1-diagram.jpg
│   │   └── 2025/
│   │       ├── article-2-cover.jpg
│   │       └── article-2-demo.gif
│   └── common/
│       ├── avatar.jpg
│       └── logo.png
```

### PicGo 路径模板配置

在 **图床设置 → 七牛图床 → 存储路径** 中设置：

**按年份分类**:

```
blog/posts/{year}/
```

**按年月分类**:

```
blog/posts/{year}/{month}/
```

**固定路径**:

```
blog/posts/
```

---

## 💰 成本估算

### 七牛云免费额度（个人实名用户）

```
存储空间：10GB
CDN 流量：10GB/月
GET 请求：100 万次/月
PUT 请求：10 万次/月
```

### 超出免费额度后的价格

```
存储：     0.148 元/GB/月
CDN 流量： 0.29 元/GB（国内）
```

### 个人技术博客预估

假设：

- 平均每篇文章 3 张图片
- 每张图片 200KB
- 每月发布 4 篇文章
- 每篇文章每月 1000 次访问

**每月使用量**：

- 存储：4 篇 × 3 张 × 200KB = 2.4MB ≈ 0.0024GB
- 流量：4 篇 × 3 张 × 200KB × 1000 次 = 2.4GB

**结论**：免费额度完全够用！ ✅

---

## 🔧 高级配置（可选）

### 1. 自定义域名

如果你有自己的域名，可以绑定到七牛云：

1. **七牛云控制台** → **空间管理** → 选择你的空间
2. 点击 **域名管理** → **添加域名**
3. 输入域名：`cdn.yourdomain.com`
4. 在域名 DNS 中添加 CNAME 记录
5. 等待审核和备案（国内域名需要备案）

**好处**：

- 使用自己的域名更专业
- 七牛云默认域名有过期风险

### 2. 图片样式（图片处理）

七牛云支持图片处理参数：

```
原图：
https://your-domain.com/image.jpg

缩略图（宽度 800px）：
https://your-domain.com/image.jpg?imageView2/2/w/800

压缩质量 80%：
https://your-domain.com/image.jpg?imageView2/2/q/80

WebP 格式：
https://your-domain.com/image.jpg?imageView2/2/format/webp
```

可以在 PicGo 的 **网址后缀** 中设置默认参数。

### 3. 防盗链

如果担心图片被盗用：

1. **七牛云控制台** → **空间设置** → **访问控制**
2. 开启 **Referer 防盗链**
3. 添加白名单域名（如 `yourdomain.com`）

### 4. HTTPS 支持

1. **域名管理** → 选择域名
2. **HTTPS 配置** → 申请免费 SSL 证书
3. 开启 **强制 HTTPS**

---

## ❓ 常见问题

### Q1: 图片上传失败？

**A**: 检查以下几点：

1. AccessKey 和 SecretKey 是否正确
2. Bucket 名称是否正确
3. 存储区域是否匹配
4. 空间是否设置为 **公开空间**
5. 网络是否正常

### Q2: 图片无法访问？

**A**: 可能的原因：

1. 空间未设置为公开
2. 域名未备案（使用七牛云默认域名测试）
3. 图片链接复制错误
4. CDN 刷新未生效（等待 10 分钟）

### Q3: 默认域名过期了？

**A**: 七牛云的测试域名（`xxx.bkt.clouddn.com`）有 30 天试用期。

解决方法：

1. 绑定自己的域名（推荐）
2. 或使用其他图床服务

### Q4: 如何批量上传图片？

**A**:

1. 打开 PicGo
2. 点击 **上传区**
3. 拖拽多个图片文件
4. 批量上传成功后复制链接

### Q5: 如何查看已上传的图片？

**A**:

1. 七牛云控制台 → **空间管理** → 选择空间
2. 点击 **内容管理**
3. 可以查看、下载、删除图片

---

## 🎉 完成！

现在你已经配置好了 **PicGo + 七牛云** 图床系统！

**工作流程**：

1. 📸 截图或准备图片
2. 📤 用 PicGo 上传到七牛云
3. 📋 复制图片链接
4. ✍️ 在博客编辑器中插入图片
5. 💾 保存并发布

**下一步**：

- 试试上传一张图片
- 在博客中使用图片链接
- 配置 PicGo 快捷键
- 享受流畅的写作体验！

---

## 📚 相关资源

- **PicGo 官网**: https://molunerfinn.com/PicGo/
- **PicGo GitHub**: https://github.com/Molunerfinn/PicGo
- **七牛云文档**: https://developer.qiniu.com/
- **七牛云控制台**: https://portal.qiniu.com/

---

**配置时间**: 约 15-30 分钟  
**难度**: ⭐⭐ (简单)

Happy Blogging! 🚀✨
