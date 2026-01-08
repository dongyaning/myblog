import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Calendar } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { getAllTags, getPostsByTag } from '@/lib/mdx'

interface TagPageProps {
  params: {
    tag: string
  }
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag.name),
  }))
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  return {
    title: `${decodedTag} - 标签 - NingBlog`,
    description: `浏览标签 ${decodedTag} 的所有文章`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = await getPostsByTag(decodedTag)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">#{decodedTag}</h1>
        <p className="text-muted-foreground mt-2">{posts.length} 篇文章</p>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  {post.category && (
                    <>
                      <span>•</span>
                      <span>{post.category}</span>
                    </>
                  )}
                </div>
              </CardHeader>
              {post.description && (
                <CardContent>
                  <p className="text-muted-foreground">{post.description}</p>
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
