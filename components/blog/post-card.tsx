import Link from 'next/link'

import { Calendar, Clock } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { Frontmatter } from '@/lib/mdx'

import { CategoryBadge, TagsList } from './badges'

interface PostCardProps {
  post: Frontmatter & { slug: string; readingTime?: number }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="hover:bg-accent h-full transition-colors">
        <CardHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {post.category && <CategoryBadge category={post.category} />}
          </div>
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} 分钟阅读</span>
              </div>
            )}
          </div>
        </CardHeader>
        {(post.description || (post.tags && post.tags.length > 0)) && (
          <CardContent className="space-y-3">
            {post.description && <p className="text-muted-foreground">{post.description}</p>}
            {post.tags && post.tags.length > 0 && <TagsList tags={post.tags} />}
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
