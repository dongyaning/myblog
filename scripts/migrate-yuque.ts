import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

interface ScannedArticle {
  sourcePath: string
  relativePath: string
  title: string
  content: string
  category: string
  tags: string[]
  assets: string[]
}

interface MigratedArticle extends ScannedArticle {
  slug: string
  date: string
  updated: string
  description: string
  duplicateOf?: string
  content: string
  outputAssets: string[]
}

interface MigrationResult {
  articles: MigratedArticle[]
  sourceMarkdownCount: number
  sourceArticleCount: number
  emptyArticles: string[]
  duplicateGroups: string[][]
  errors: string[]
  sourceAssetCount: number
  migratedAssetCount: number
}

const projectRoot = process.cwd()
const defaultInput = '/Users/dongyaning/Downloads/语雀备份'
const outputPosts = path.join(projectRoot, 'content', 'posts')
const outputImages = path.join(projectRoot, 'public', 'images', 'posts')
const reportRoot = path.join(projectRoot, 'docs', 'project-docs', 'myblog')

function parseArgs(): { input: string; write: boolean } {
  const inputIndex = process.argv.indexOf('--input')
  const input = inputIndex >= 0 ? process.argv[inputIndex + 1] : defaultInput
  return { input: input || defaultInput, write: process.argv.includes('--write') }
}

function walk(directory: string): string[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true })
  return entries.flatMap((entry) => {
    if (entry.name === '.DS_Store') {
      return []
    }
    const entryPath = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(entryPath) : [entryPath]
  })
}

function normalize(value: string): string {
  return value
    .replace(/\r\n/g, '\n')
    .replace(/^---[\s\S]*?---\s*/u, '')
    .replace(/[`*_>#()[\]!|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function safePart(value: string): string {
  const ascii = value
    .normalize('NFKD')
    .replace(/[^\u4e00-\u9fff\w]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  return ascii || `post-${crypto.createHash('sha1').update(value).digest('hex').slice(0, 8)}`
}

function getTitle(filePath: string, content: string): string {
  const fileTitle = path.basename(filePath, path.extname(filePath)).trim()
  const heading = content
    .match(/^#\s+(.+)$/mu)?.[1]
    ?.replace(/!\[[^\]]*\]\([^)]*\)/u, '')
    .trim()
  return fileTitle || heading || '未命名文章'
}

function getCategoryAndTags(relativePath: string): { category: string; tags: string[] } {
  const parts = relativePath.split(path.sep)
  const directories = parts.slice(0, -1)
  const rootIndex = directories.findIndex((part) => part === '我个人的')
  const scoped = rootIndex >= 0 ? directories.slice(rootIndex + 1) : directories
  return {
    category: scoped[0] || '未分类',
    tags: scoped.slice(1),
  }
}

function isInterview(article: ScannedArticle): boolean {
  const value = `${article.relativePath} ${article.title}`
  return /面试|面经|八股|复盘|个人总结/u.test(value)
}

function mapDate(article: ScannedArticle, index: number, total: number): string {
  if (isInterview(article)) {
    const start = new Date('2026-03-01').getTime()
    const end = new Date('2026-04-30').getTime()
    const ratio = total <= 1 ? 0 : index / (total - 1)
    const timestamp = start + Math.floor((end - start) * ratio)
    return new Date(timestamp).toISOString().slice(0, 10)
  }
  const start = new Date('2022-01-01').getTime()
  const end = new Date('2025-12-31').getTime()
  const ratio = total <= 1 ? 0 : index / (total - 1)
  const timestamp = start + Math.floor((end - start) * ratio)
  return new Date(timestamp).toISOString().slice(0, 10)
}

function uniqueSlug(article: ScannedArticle, used: Set<string>): string {
  const parts = article.relativePath.split(path.sep)
  const base = safePart(path.basename(parts.pop() || article.title, '.md'))
  const prefix = parts.slice(-2).map(safePart).filter(Boolean).join('-')
  const seed = `${prefix}-${base}`.replace(/^-+|-+$/g, '')
  let slug = seed || safePart(article.title)
  const hash = crypto.createHash('sha1').update(article.relativePath).digest('hex').slice(0, 6)
  if (used.has(slug)) {
    slug = `${slug}-${hash}`
  }
  used.add(slug)
  return slug
}

function removeRepeatedParagraphs(content: string): string {
  const blocks = content
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .split(/\n\n+/u)
  const result: string[] = []
  for (const block of blocks) {
    if (normalize(block) && normalize(block) === normalize(result.at(-1) || '')) {
      continue
    }
    result.push(block)
  }
  return result.join('\n\n')
}

function protectRawMarkup(content: string): string {
  const lines = content.split('\n')
  let fenced = false
  return lines
    .map((line) => {
      if (/^\s*(`{3,}|~{3,})/u.test(line)) {
        fenced = !fenced
        return line
      }
      if (!fenced && line.includes('<')) {
        return line.replace(/</gu, '&lt;').replace(/[{}]/gu, (char) => {
          return char === '{' ? '&#123;' : '&#125;'
        })
      }
      if (!fenced && (line.includes('{') || line.includes('}'))) {
        return line.replace(/[{}]/gu, (char) => {
          return char === '{' ? '&#123;' : '&#125;'
        })
      }
      return line
    })
    .join('\n')
}

function rewriteImages(content: string, article: ScannedArticle, slug: string): string {
  const assetNames = new Map(article.assets.map((asset) => [path.basename(asset), asset]))
  return content.replace(/!\[[^\n]*\]\([^)\n]+\)/gu, (match) => {
    const matchParts = match.match(/^(!\[[^\n]*\]\()((?:\.\/)?assets\/)([^)\n]+)(\))$/u)
    if (!matchParts) {
      return match
    }
    const [, prefix, , name, suffix] = matchParts
    if (!assetNames.has(name)) {
      return match
    }
    return `${prefix}/images/posts/${slug}/${safePart(name.replace(/\.[^.]+$/u, ''))}${path.extname(name)}${suffix}`
  })
}

function referencedAssets(content: string, article: ScannedArticle): string[] {
  const names = new Set<string>()
  const pattern =
    /!\[[^\n]*\]\((?:\.\/)?assets\/([^) \n]+)\)|\/images\/posts\/[^/]+\/([^) \n]+)\)/gu
  for (const match of content.matchAll(pattern)) {
    const name = match[1] || match[2]
    if (
      name &&
      article.assets.some((asset) => {
        const assetName = path.basename(asset)
        const safeName = `${safePart(path.basename(asset, path.extname(asset)))}${path.extname(asset)}`
        return assetName === name || safeName === name
      })
    ) {
      names.add(name)
    }
  }
  return article.assets.filter((asset) => {
    const assetName = path.basename(asset)
    const safeName = `${safePart(path.basename(asset, path.extname(asset)))}${path.extname(asset)}`
    return names.has(assetName) || names.has(safeName)
  })
}

function frontmatter(article: MigratedArticle): string {
  const tags = article.tags.length
    ? `[${article.tags.map((tag) => `'${tag.replace(/'/g, "''")}'`).join(', ')}]`
    : '[]'
  return [
    '---',
    `title: '${article.title.replace(/'/g, "''")}'`,
    `date: '${article.date}'`,
    `updated: '${article.updated}'`,
    `description: '${article.description.replace(/'/g, "''")}'`,
    'published: true',
    `category: '${article.category.replace(/'/g, "''")}'`,
    `tags: ${tags}`,
    '---',
    '',
  ].join('\n')
}

function scan(input: string): {
  articles: ScannedArticle[]
  empty: string[]
  errors: string[]
  assets: string[]
} {
  const files = walk(input)
  const empty: string[] = []
  const errors: string[] = []
  const assets = files.filter((file) => /\.(png|jpe?g|gif|webp|svg)$/iu.test(file))
  const articles = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const content = fs.readFileSync(file, 'utf8')
      const relativePath = path.relative(input, file)
      if (!content.trim()) {
        empty.push(relativePath)
      }
      const { category, tags } = getCategoryAndTags(relativePath)
      const articleAssets = assets.filter(
        (asset) => path.dirname(asset) === path.join(path.dirname(file), 'assets')
      )
      return {
        sourcePath: file,
        relativePath,
        title: getTitle(file, content),
        content,
        category,
        tags,
        assets: articleAssets,
      }
    })
    .filter((article) => article.content.trim())
  return { articles, empty, errors, assets }
}

function migrate(input: string): MigrationResult {
  const scanned = scan(input)
  const sorted = [...scanned.articles].sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath, 'zh-CN')
  )
  const used = new Set<string>()
  const seen = new Map<string, MigratedArticle>()
  const duplicateGroups: string[][] = []
  const articles: MigratedArticle[] = []

  sorted.forEach((article, index) => {
    const content = protectRawMarkup(removeRepeatedParagraphs(article.content))
    const fingerprint = normalize(content)
    const existing = seen.get(fingerprint)
    const slug = uniqueSlug(article, used)
    const date = mapDate(article, index, sorted.length)
    const migrated: MigratedArticle = {
      ...article,
      slug,
      date,
      updated: date,
      description: normalize(content).slice(0, 120),
      content: rewriteImages(content, article, slug),
      outputAssets: referencedAssets(content, article),
    }
    if (existing) {
      existing.content = `${existing.content}\n\n${rewriteImages(content, article, existing.slug)}`
      existing.updated = date > existing.updated ? date : existing.updated
      existing.outputAssets = [...new Set([...existing.outputAssets, ...migrated.outputAssets])]
      migrated.duplicateOf = existing.slug
      duplicateGroups.push([existing.relativePath, article.relativePath])
      return
    }
    seen.set(fingerprint, migrated)
    articles.push(migrated)
  })

  return {
    articles,
    sourceMarkdownCount: walk(input).filter((file) => file.endsWith('.md')).length,
    sourceArticleCount: scanned.articles.length,
    emptyArticles: scanned.empty,
    duplicateGroups,
    errors: scanned.errors,
    sourceAssetCount: scanned.assets.length,
    migratedAssetCount: new Set(
      articles.flatMap((article) =>
        article.outputAssets.map((asset) => {
          const name = `${safePart(path.basename(asset, path.extname(asset)))}${path.extname(asset)}`
          return `${article.slug}/${name}`
        })
      )
    ).size,
  }
}

function writeResult(result: MigrationResult): void {
  fs.mkdirSync(outputPosts, { recursive: true })
  fs.mkdirSync(outputImages, { recursive: true })
  fs.mkdirSync(reportRoot, { recursive: true })

  for (const file of fs.readdirSync(outputPosts)) {
    if (file.startsWith('post-') && file.endsWith('.mdx')) {
      fs.unlinkSync(path.join(outputPosts, file))
    }
  }
  for (const directory of fs.readdirSync(outputImages)) {
    fs.rmSync(path.join(outputImages, directory), { recursive: true, force: true })
  }

  for (const article of result.articles) {
    const content = `${frontmatter(article)}${article.content.trim()}\n`
    fs.writeFileSync(path.join(outputPosts, `${article.slug}.mdx`), content, 'utf8')
    for (const asset of article.outputAssets) {
      const name = `${safePart(path.basename(asset, path.extname(asset)))}${path.extname(asset)}`
      const target = path.join(outputImages, article.slug, name)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.copyFileSync(asset, target)
    }
  }

  fs.writeFileSync(
    path.join(reportRoot, 'migration-report.md'),
    [
      '# 语雀迁移报告',
      '',
      `源 Markdown：${result.sourceMarkdownCount}`,
      '',
      `源非空文章：${result.sourceArticleCount}`,
      '',
      `空文章：${result.emptyArticles.length}`,
      '',
      `完全重复组：${result.duplicateGroups.length}`,
      '',
      `最终迁移文章：${result.articles.length}`,
      '',
      `源图片：${result.sourceAssetCount}`,
      '',
      `实际迁移图片：${result.migratedAssetCount}`,
      '',
    ].join('\n'),
    'utf8'
  )
  fs.writeFileSync(
    path.join(reportRoot, 'date-mapping.md'),
    `# 日期映射\n\n${result.articles.map((article) => `| ${article.title} | ${article.date} |`).join('\n')}\n`,
    'utf8'
  )
  fs.writeFileSync(
    path.join(reportRoot, 'duplicate-groups.md'),
    `# 重复文章\n\n${result.duplicateGroups.map((group) => `* ${group.join('，')}`).join('\n') || '没有发现完全重复文章。'}\n`,
    'utf8'
  )
  fs.writeFileSync(
    path.join(reportRoot, 'migration-errors.md'),
    `# 迁移异常\n\n${result.errors.join('\n') || '没有发现扫描异常。'}\n`,
    'utf8'
  )
}

const { input, write } = parseArgs()
const result = migrate(input)

console.log(`源非空文章：${result.sourceArticleCount} 篇`)
console.log(`最终迁移文章：${result.articles.length} 篇`)
console.log(`空文章：${result.emptyArticles.length} 篇`)
console.log(`源图片：${result.sourceAssetCount} 张`)
console.log(`实际迁移图片：${result.migratedAssetCount} 张`)
console.log(`完全重复组：${result.duplicateGroups.length} 组`)

if (write) {
  writeResult(result)
  console.log('迁移文件已写入项目目录。')
} else {
  console.log('当前为预览模式，使用 --write 才会生成文章和图片。')
}
