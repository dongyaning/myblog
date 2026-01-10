import Link from 'next/link'

import { Flame } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PopularPost {
  slug: string
  viewCount: number
}

async function getPopularPosts(): Promise<PopularPost[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/stats`,
      {
        next: { revalidate: 300 },
      }
    )
    if (!response.ok) return []
    const data = await response.json()
    return data.popularPosts || []
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
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="h-5 w-5 text-orange-500" />
          热门文章
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {displayPosts.map((post, index) => (
            <li key={post.slug} className="group">
              <Link
                href={`/blog/${post.slug}`}
                className="text-muted-foreground hover:text-foreground flex items-start gap-2 text-sm transition-colors"
              >
                <span className="text-primary mt-0.5 font-bold">{index + 1}.</span>
                <div className="flex-1">
                  <div className="group-hover:text-primary line-clamp-2 transition-colors">
                    {post.slug}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {post.viewCount.toLocaleString()} 次阅读
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
