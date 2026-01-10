import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { PopularPosts } from '@/components/analytics/popular-posts'
import { SiteStats } from '@/components/analytics/site-stats'
import { PostCard } from '@/components/blog/post-card'
import { Button } from '@/components/ui/button'

import { getAllPosts } from '@/lib/mdx'

export default async function Home() {
  const allPosts = await getAllPosts()
  const recentPosts = allPosts.slice(0, 6) // Show 6 most recent posts

  return (
    <div className="container py-10">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          欢迎来到 NingBlog
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          一个专注于 Web 开发、JavaScript 和现代框架的技术博客
        </p>
      </section>

      {/* Site Stats */}
      <section className="mb-16">
        <SiteStats />
      </section>

      {/* Recent Posts */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">最新文章</h2>
          {allPosts.length > 6 && (
            <Link href="/blog">
              <Button variant="ghost">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {recentPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex h-100 items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="text-muted-foreground text-lg">暂无文章</p>
              <p className="text-muted-foreground mt-2 text-sm">
                在 content/posts 目录下创建 .mdx 文件开始写作
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Popular Posts */}
      <section className="mt-16">
        <PopularPosts limit={5} />
      </section>
    </div>
  )
}
