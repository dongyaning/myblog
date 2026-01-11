import Link from 'next/link'

import { Flame } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { getAllPosts } from '@/lib/mdx'

interface PopularPost {
  slug: string
  viewCount: number
}

interface PopularPostWithMeta extends PopularPost {
  title: string
}

async function getPopularPosts(): Promise<PopularPostWithMeta[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/stats`,
      {
        next: { revalidate: 300 },
      }
    )
    if (!response.ok) return []
    const data = await response.json()
    const popularPosts: PopularPost[] = data.popularPosts || []

    // 获取所有文章的元数据
    const allPosts = await getAllPosts()
    const postsMap = new Map(allPosts.map((post) => [post.slug, post.title]))

    // 将浏览量数据与文章标题合并
    return popularPosts
      .map((post) => ({
        ...post,
        title: postsMap.get(post.slug) || post.slug, // 回退到 slug 如果找不到标题
      }))
      .filter((post) => postsMap.has(post.slug)) // 只保留存在的文章
  } catch (error) {
    console.error('Failed to fetch popular posts:', error)
    return []
  }
}

export async function PopularPosts({ limit = 5 }: { limit?: number }) {
  const posts = await getPopularPosts()
  const displayPosts = posts.slice(0, limit)

  if (displayPosts.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          🔥 热门文章
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {displayPosts.map((post, index) => (
            <li key={post.slug} className="group">
              <Link
                href={`/blog/${post.slug}`}
                className="hover:bg-accent block rounded-lg p-2 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-primary bg-primary/10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="group-hover:text-primary line-clamp-2 font-medium transition-colors">
                      {post.title}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {post.viewCount.toLocaleString()} 次阅读
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
