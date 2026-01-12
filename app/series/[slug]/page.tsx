import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLeft, BookOpen, Calendar, Check } from 'lucide-react'

import { PostCard } from '@/components/blog/post-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { getAllSeries, getPostsBySeries } from '@/lib/mdx'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const allSeriesNames = await getAllSeries()
  return allSeriesNames.map((seriesName) => ({
    slug: encodeURIComponent(seriesName),
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const seriesName = decodeURIComponent(slug)

  return {
    title: `${seriesName} - 系列文章 - NingBlog`,
    description: `${seriesName}系列的所有文章`,
  }
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { slug } = await params
  const seriesName = decodeURIComponent(slug)

  const posts = await getPostsBySeries(seriesName)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="container py-10">
      {/* Back Button */}
      <Link href="/series">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回系列列表
        </Button>
      </Link>

      {/* Series Header */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <BookOpen className="text-primary h-8 w-8" />
          <h1 className="text-4xl font-bold tracking-tight">{seriesName}</h1>
        </div>
        <p className="text-muted-foreground text-lg">共 {posts.length} 篇文章</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        {/* Articles List */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">系列文章</h2>
          <div className="space-y-6">
            {posts.map((post, index) => (
              <Card key={post.slug} className="overflow-hidden">
                <div className="flex">
                  {/* Order Number */}
                  <div className="bg-primary text-primary-foreground flex w-16 shrink-0 items-center justify-center text-2xl font-bold">
                    {index + 1}
                  </div>

                  {/* Post Content */}
                  <div className="flex-1">
                    <CardHeader>
                      <Link href={`/blog/${post.slug}`}>
                        <CardTitle className="hover:text-primary line-clamp-2 transition-colors">
                          {post.title}
                        </CardTitle>
                      </Link>
                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString('zh-CN')}
                        </div>
                        {post.published && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <Check className="h-3 w-3" />
                            已发布
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    {post.description && (
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-2">{post.description}</p>
                      </CardContent>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">学习进度</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">已发布</span>
                  <span className="font-medium">
                    {posts.filter((p) => p.published).length} / {posts.length}
                  </span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{
                      width: `${(posts.filter((p) => p.published).length / posts.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="border-border space-y-2 border-t pt-4">
                <p className="text-sm font-medium">推荐学习路径</p>
                <p className="text-muted-foreground text-xs">按照顺序阅读效果更佳</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">快速导航</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {posts.slice(0, 5).map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="text-muted-foreground hover:text-primary block text-sm transition-colors"
                  >
                    <span className="mr-2">{index + 1}.</span>
                    <span className="line-clamp-1">{post.title}</span>
                  </Link>
                ))}
                {posts.length > 5 && (
                  <p className="text-muted-foreground pt-2 text-xs">
                    ... 还有 {posts.length - 5} 篇
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Related Posts (optional) */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">系列预览</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
