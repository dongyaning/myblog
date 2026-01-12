import Link from 'next/link'

import { BookOpen, FileText } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { getAllSeries, getPostsBySeries } from '@/lib/mdx'

export const metadata = {
  title: '系列文章 - NingBlog',
  description: '浏览所有文章系列',
}

export default async function SeriesListPage() {
  const allSeriesNames = await getAllSeries()

  // Get post counts for each series
  const seriesWithCounts = await Promise.all(
    allSeriesNames.map(async (seriesName) => {
      const posts = await getPostsBySeries(seriesName)
      return {
        name: seriesName,
        count: posts.length,
        posts: posts,
      }
    })
  )

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          <BookOpen className="mr-3 inline-block h-10 w-10" />
          系列文章
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          系统化学习，循序渐进掌握技术
        </p>
      </div>

      {/* Series List */}
      {seriesWithCounts.length === 0 ? (
        <div className="py-20 text-center">
          <BookOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <p className="text-muted-foreground text-lg">暂无系列文章</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {seriesWithCounts.map((series) => {
            // Generate slug from series name
            const seriesSlug = encodeURIComponent(series.name)

            return (
              <Link key={series.name} href={`/series/${seriesSlug}`}>
                <Card className="hover:border-primary h-full transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-2">
                      <span className="line-clamp-2">{series.name}</span>
                      <span className="bg-primary text-primary-foreground shrink-0 rounded-full px-2 py-1 text-xs font-normal">
                        {series.count} 篇
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {series.posts[0]?.description || '系列文章集合'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">包含文章：</p>
                      <ul className="text-muted-foreground space-y-1 text-sm">
                        {series.posts.slice(0, 3).map((post, index) => (
                          <li key={post.slug} className="flex items-start gap-2">
                            <FileText className="mt-0.5 h-3 w-3 shrink-0" />
                            <span className="line-clamp-1">
                              {index + 1}. {post.title}
                            </span>
                          </li>
                        ))}
                        {series.posts.length > 3 && (
                          <li className="text-muted-foreground text-xs">
                            ... 还有 {series.posts.length - 3} 篇文章
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
