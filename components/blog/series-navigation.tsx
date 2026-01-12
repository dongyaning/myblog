import Link from 'next/link'

import { ArrowLeft, ArrowRight, BookOpen, List } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { Frontmatter } from '@/lib/mdx'

interface SeriesNavigationProps {
  seriesName: string
  previous: (Frontmatter & { slug: string }) | null
  next: (Frontmatter & { slug: string }) | null
  allInSeries: Array<Frontmatter & { slug: string }>
  currentSlug: string
}

export function SeriesNavigation({
  seriesName,
  previous,
  next,
  allInSeries,
  currentSlug,
}: SeriesNavigationProps) {
  const currentIndex = allInSeries.findIndex((post) => post.slug === currentSlug)

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          系列：{seriesName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 系列进度 */}
        <div className="bg-muted rounded-lg p-4">
          <div className="text-muted-foreground mb-2 flex items-center justify-between text-sm">
            <span>系列进度</span>
            <span>
              {currentIndex + 1} / {allInSeries.length}
            </span>
          </div>
          <div className="bg-background h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${((currentIndex + 1) / allInSeries.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 上一篇/下一篇导航 */}
        <div className="grid gap-4 md:grid-cols-2">
          {previous ? (
            <Link href={`/blog/${previous.slug}`}>
              <Button variant="outline" className="h-auto w-full justify-start p-4">
                <ArrowLeft className="mr-2 h-4 w-4 shrink-0" />
                <div className="text-left">
                  <div className="text-muted-foreground text-xs">上一篇</div>
                  <div className="line-clamp-1 text-sm font-medium">{previous.title}</div>
                </div>
              </Button>
            </Link>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-muted-foreground text-center text-sm">这是第一篇</div>
            </div>
          )}

          {next ? (
            <Link href={`/blog/${next.slug}`}>
              <Button variant="outline" className="h-auto w-full justify-end p-4">
                <div className="text-right">
                  <div className="text-muted-foreground text-xs">下一篇</div>
                  <div className="line-clamp-1 text-sm font-medium">{next.title}</div>
                </div>
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
              </Button>
            </Link>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-muted-foreground text-center text-sm">这是最后一篇</div>
            </div>
          )}
        </div>

        {/* 系列目录 */}
        <details className="group">
          <summary className="flex cursor-pointer items-center gap-2 font-medium">
            <List className="h-4 w-4" />
            查看完整目录
            <span className="text-muted-foreground text-sm">（共 {allInSeries.length} 篇）</span>
          </summary>
          <ul className="mt-4 space-y-2 pl-6">
            {allInSeries.map((post, index) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={`hover:text-primary block transition-colors ${
                    post.slug === currentSlug ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  <span className="mr-2">{index + 1}.</span>
                  {post.title}
                  {post.slug === currentSlug && (
                    <span className="text-primary ml-2 text-xs">（当前）</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </CardContent>
    </Card>
  )
}
