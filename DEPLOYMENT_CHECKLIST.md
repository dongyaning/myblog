# 部署清单

在部署到生产环境之前，请完成以下检查项：

## ✅ 配置检查

- [ ] 修改 `lib/seo.ts` 中的站点配置
  - [ ] `name` - 站点名称
  - [ ] `description` - 站点描述
  - [ ] `url` - 生产环境 URL
  - [ ] `author.name` - 作者名称
  - [ ] `author.email` - 联系邮箱
  - [ ] `author.twitter` - Twitter 账号
  - [ ] `links.github` - GitHub 链接
  - [ ] `links.twitter` - Twitter 链接

- [ ] 设置环境变量（Vercel 或 `.env.local`）
  - [ ] `NEXT_PUBLIC_SITE_URL` - 生产环境 URL

- [ ] 修改 `components/layout/footer.tsx` 中的社交链接
  - [ ] GitHub 链接
  - [ ] Twitter 链接
  - [ ] Email 地址

- [ ] 修改 `components/layout/header.tsx` 中的 Logo 和导航
  - [ ] 站点 Logo/名称
  - [ ] 导航菜单项

## ✅ 内容检查

- [ ] 删除或更新示例文章
  - [ ] `content/posts/hello-world.mdx`
  - [ ] `content/posts/welcome-to-ningblog.mdx`

- [ ] 添加至少 3-5 篇真实文章

- [ ] 确保所有文章的 frontmatter 正确
  - [ ] `published: true` 用于已发布文章
  - [ ] 正确的日期格式 `YYYY-MM-DD`
  - [ ] 有意义的 description（用于 SEO）
  - [ ] 合适的 category 和 tags

## ✅ SEO 检查

- [ ] 更新 `app/layout.tsx` 中的全局元数据
  - [ ] 关键词列表
  - [ ] Open Graph 图片（可选）

- [ ] 为网站添加 favicon
  - [ ] 替换 `app/favicon.ico`
  - [ ] 可选：添加其他尺寸的图标

- [ ] 验证 sitemap.xml 生成
  - [ ] 访问 `/sitemap.xml` 确认正常

- [ ] 验证 RSS feed 生成
  - [ ] 访问 `/feed.xml` 确认正常

- [ ] 验证 robots.txt
  - [ ] 访问 `/robots.txt` 确认正常

## ✅ 性能检查

- [ ] 运行生产构建测试

  ```bash
  pnpm build
  pnpm start
  ```

- [ ] 检查构建输出
  - [ ] 所有页面成功生成
  - [ ] 没有构建警告或错误

- [ ] 优化图片（如果有）
  - [ ] 使用 WebP 格式
  - [ ] 合适的尺寸和质量

## ✅ 功能测试

- [ ] 测试所有页面
  - [ ] 首页正常显示
  - [ ] 博客列表页正常
  - [ ] 文章详情页正常
  - [ ] 分类页面正常
  - [ ] 标签页面正常

- [ ] 测试导航
  - [ ] 所有链接可点击
  - [ ] 移动端菜单正常工作

- [ ] 测试主题切换
  - [ ] 深色/浅色模式切换正常
  - [ ] 刷新后主题保持

- [ ] 测试响应式
  - [ ] 移动端显示正常
  - [ ] 平板显示正常
  - [ ] 桌面端显示正常

- [ ] 测试文章功能
  - [ ] 目录导航正常
  - [ ] 代码复制功能正常
  - [ ] 上一篇/下一篇导航正常
  - [ ] 相关文章显示正常

## ✅ Git 和部署

- [ ] 提交所有更改

  ```bash
  git add .
  git commit -m "feat: initial blog setup"
  ```

- [ ] 推送到 GitHub

  ```bash
  git push origin main
  ```

- [ ] 在 Vercel 部署
  - [ ] 导入 GitHub 仓库
  - [ ] 配置环境变量
  - [ ] 部署成功

- [ ] 验证生产环境
  - [ ] 访问生产 URL
  - [ ] 所有功能正常
  - [ ] 性能良好

## ✅ SEO 和分析（可选）

- [ ] 添加 Google Analytics
- [ ] 提交 sitemap 到 Google Search Console
- [ ] 提交 sitemap 到 Bing Webmaster Tools
- [ ] 设置社交媒体 Open Graph 验证
- [ ] 测试富媒体结果（Rich Results Test）

## ✅ 安全检查

- [ ] 确保没有敏感信息泄露
  - [ ] 检查 `.env.local` 不在 git 仓库中
  - [ ] 检查 API 密钥等敏感信息

- [ ] 更新依赖
  ```bash
  pnpm update
  ```

## ✅ 文档

- [ ] 更新 README.md（如果需要）
- [ ] 记录自定义配置
- [ ] 写下部署日期和版本

---

## 部署后

部署成功后，别忘了：

1. 📝 写第一篇博客文章
2. 📢 在社交媒体分享
3. 🔄 定期更新内容
4. 📊 监控网站性能和访问情况
5. 🐛 收集用户反馈并改进

---

**祝部署顺利！🚀**
