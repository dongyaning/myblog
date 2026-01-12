import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { CompactStats } from '@/components/analytics/compact-stats'
import { PopularPosts } from '@/components/analytics/popular-posts'
import { FadeIn, SlideIn, StaggerContainer } from '@/components/animation'
import { PostCard } from '@/components/blog/post-card'
import { Button } from '@/components/ui/button'

import { getAllPosts } from '@/lib/mdx'

export default async function Home() {
  const allPosts = await getAllPosts()
  const recentPosts = allPosts.slice(0, 9) // Show 9 most recent posts

  return (
    <div className="container py-10">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <FadeIn>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            欢迎来到 NingBlog
          </h1>
        </FadeIn>
        <FadeIn delay={100}>
          <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
            一个专注于 Web 开发、JavaScript 和现代框架的技术博客
          </p>
        </FadeIn>

        {/* Compact Site Stats - 紧凑型统计 */}
        <FadeIn delay={200}>
          <div className="flex justify-center">
            <CompactStats />
          </div>
        </FadeIn>
      </section>

      {/* Main Content: Recent Posts + Sidebar */}
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        {/* Recent Posts - 主内容区 */}
        <section>
          <SlideIn direction="up">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">📝 最新文章</h2>
              {allPosts.length > 9 && (
                <Link href="/blog">
                  <Button variant="ghost" size="sm">
                    查看全部
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </SlideIn>

          {recentPosts.length > 0 ? (
            <StaggerContainer
              staggerDelay={80}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {recentPosts.map((post) => (
                <FadeIn key={post.slug} direction="up">
                  <PostCard post={post} />
                </FadeIn>
              ))}
            </StaggerContainer>
          ) : (
            <FadeIn>
              <div className="border-border flex h-60 items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <p className="text-muted-foreground text-lg">暂无文章</p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    在 content/posts 目录下创建 .mdx 文件开始写作
                  </p>
                </div>
              </div>
            </FadeIn>
          )}
        </section>

        {/* Sidebar - 侧边栏（桌面端显示） */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-6">
            {/* Popular Posts */}
            <SlideIn direction="left" delay={100}>
              <PopularPosts limit={5} />
            </SlideIn>
          </div>
        </aside>
      </div>
    </div>
  )
}
