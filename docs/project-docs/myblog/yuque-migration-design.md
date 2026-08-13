# 语雀笔记迁移设计

## 目标

将 `/Users/dongyaning/Downloads/语雀备份` 中的语雀 Markdown 笔记迁移到 NingBlog，生成可由 Next.js SSG 构建的 MDX 文章和静态图片。

## 已确认范围

- 迁移 129 篇笔记中的 126 篇非空文章。
- 空文章保留在迁移报告中，不发布。
- 一级目录转换为 `category`，下级目录转换为 `tags`。
- 重复段落和完全重复文章自动处理，高度相似文章保留并记录候选关系。
- 普通文章日期映射到 2022 至 2025 年。
- 面试复盘、面经总结和八股内容映射到 2026 年 3 月至 4 月。
- 报告只展示最终日期，不标记日期为推断所得。
- 图片复制到 `public/images/posts/<slug>/`，正文引用改写为站内绝对路径。
- 原始语雀备份只读，不修改。

## 输出

```text
content/posts/
public/images/posts/
docs/project-docs/myblog/
```

迁移脚本位于 `scripts/migrate-yuque.ts`，默认执行预览模式，使用明确参数后才写入目标目录。

## 文章处理

每篇文章生成项目兼容的 Frontmatter：

```yaml
---
title: '文章标题'
date: '2024-06-18'
updated: '2024-06-18'
description: '文章摘要'
published: true
category: '后端学习'
tags: ['Java', '数据库']
---
```

slug 根据目录和文件名生成，使用稳定的安全字符，目录前缀用于避免同名文章冲突。

## 内容处理

- 保留代码块、GFM 表格、列表和普通链接。
- 删除导出产生的重复空行和重复段落。
- 图片相对路径改写为 `/images/posts/<slug>/...`。
- HTML、iframe、公式、未闭合代码块和无法解析的链接写入异常报告，不静默删除。
- 文章间相对链接在生成后根据 slug 映射表改写，无法匹配的链接保留并报告。

## 日期处理

日期生成必须确定性可复现。普通文章按分类、目录顺序和文件名稳定排序，在 2022 至 2025 年间分布。面试相关文章单独按稳定排序分布在 2026 年 3 月至 4 月。

## 报告

生成以下报告：

- `migration-report.md`，总量、分类、图片和最终结果。
- `date-mapping.md`，文章与最终日期映射。
- `duplicate-groups.md`，重复和相似文章关系。
- `migration-errors.md`，需要人工处理的内容。

## 验证

迁移完成后执行：

```bash
pnpm lint
pnpm build
```

验证重点是 MDX 编译、slug 唯一性、图片引用存在性和文章列表数量。
