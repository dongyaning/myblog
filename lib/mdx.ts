import { compileMDX } from 'next-mdx-remote/rsc'

import fs from 'fs'
import path from 'path'
import remarkGfm from 'remark-gfm'

// Extended Frontmatter with category, tags, and updated fields
export interface Frontmatter {
  title: string
  date: string
  updated?: string
  description?: string
  published: boolean
  category?: string
  tags?: string[]
  cover?: string
}

export interface Post {
  meta: Frontmatter & { slug: string }
  content: React.ReactElement
}

const rootDirectory = path.join(process.cwd(), 'content', 'posts')

// Get a single post by slug
export async function getPostBySlug(slug: string, components: any = {}): Promise<Post> {
  const realSlug = slug.replace(/\.mdx$/, '')
  const filePath = path.join(rootDirectory, `${realSlug}.mdx`)

  const fileContent = fs.readFileSync(filePath, 'utf8')

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source: fileContent,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: components,
  })

  return { meta: { ...frontmatter, slug: realSlug }, content }
}

// Get all posts (sorted by date, newest first)
export async function getAllPosts(): Promise<Array<Frontmatter & { slug: string }>> {
  const files = fs.readdirSync(rootDirectory)

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (file) => {
        const { meta } = await getPostBySlug(file)
        return meta
      })
  )

  // Filter only published posts and sort by date (newest first)
  return posts
    .filter((post) => post.published)
    .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
}

// Get posts by category
export async function getPostsByCategory(
  category: string
): Promise<Array<Frontmatter & { slug: string }>> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.category?.toLowerCase() === category.toLowerCase())
}

// Get posts by tag
export async function getPostsByTag(tag: string): Promise<Array<Frontmatter & { slug: string }>> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()))
}

// Get all categories with post counts
export async function getAllCategories(): Promise<Array<{ name: string; count: number }>> {
  const allPosts = await getAllPosts()
  const categoryMap = new Map<string, number>()

  allPosts.forEach((post) => {
    if (post.category) {
      const count = categoryMap.get(post.category) || 0
      categoryMap.set(post.category, count + 1)
    }
  })

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

// Get all tags with usage counts
export async function getAllTags(): Promise<Array<{ name: string; count: number }>> {
  const allPosts = await getAllPosts()
  const tagMap = new Map<string, number>()

  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => {
      const count = tagMap.get(tag) || 0
      tagMap.set(tag, count + 1)
    })
  })

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

// Get related posts based on shared tags or category
export async function getRelatedPosts(
  slug: string,
  limit: number = 3
): Promise<Array<Frontmatter & { slug: string }>> {
  const { meta } = await getPostBySlug(slug)
  const allPosts = await getAllPosts()

  // Filter out current post
  const otherPosts = allPosts.filter((post) => post.slug !== slug)

  // Calculate relevance score
  const postsWithScore = otherPosts.map((post) => {
    let score = 0

    // Same category: +3 points
    if (post.category && post.category === meta.category) {
      score += 3
    }

    // Shared tags: +1 point per tag
    if (meta.tags && post.tags) {
      const sharedTags = meta.tags.filter((tag) => post.tags?.includes(tag))
      score += sharedTags.length
    }

    return { post, score }
  })

  // Sort by score and return top N
  return postsWithScore
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)
}
