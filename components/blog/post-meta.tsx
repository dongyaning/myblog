import { Calendar, Clock, Edit, Eye } from 'lucide-react'

import type { Frontmatter } from '@/lib/mdx'

import { CategoryBadge, TagsList } from './badges'

interface PostMetaProps {
  post: Frontmatter & { slug: string; readingTime?: number; viewCount?: number }
}

export function PostMeta({ post }: PostMetaProps) {
  return (
    <div className="border-border space-y-4 border-y py-6">
      {/* Date and Reading Time */}
      <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>
            发布于{' '}
            {new Date(post.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        {post.updated && post.updated !== post.date && (
          <div className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            <time dateTime={post.updated}>
              更新于{' '}
              {new Date(post.updated).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        )}

        {post.readingTime && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime} 分钟阅读</span>
          </div>
        )}

        {post.viewCount !== undefined && (
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{post.viewCount.toLocaleString()} 次阅读</span>
          </div>
        )}
      </div>

      {/* Category */}
      {post.category && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">分类:</span>
          <CategoryBadge category={post.category} />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-start gap-2">
          <span className="text-muted-foreground mt-1 text-sm">标签:</span>
          <TagsList tags={post.tags} />
        </div>
      )}
    </div>
  )
}
