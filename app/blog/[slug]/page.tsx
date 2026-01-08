import Link from 'next/link'
import { notFound } from 'next/navigation'

import fs from 'fs'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import path from 'path'

import { PostCard } from '@/components/blog/post-card'
import { PostMeta } from '@/components/blog/post-meta'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { mdxComponents } from '@/components/mdx-components'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/mdx'
import { calculateReadingTime } from '@/lib/reading-time'
import { generateArticleStructuredData, generateOpenGraph, generateTwitterCard } from '@/lib/seo'
import { extractTocFromContent } from '@/lib/toc'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { slug } = await params
    const { meta } = await getPostBySlug(slug, mdxComponents)

    return {
      title: `${meta.title} - NingBlog`,
      description: meta.description || meta.title,
      keywords: meta.tags?.join(', '),
      authors: [{ name: 'Ning' }],
      openGraph: {
        ...generateOpenGraph(
          meta.title,
          meta.description || meta.title,
          `/blog/${slug}`,
          meta.cover
        ),
        type: 'article',
        publishedTime: meta.date,
        modifiedTime: meta.updated || meta.date,
        authors: ['Ning'],
        tags: meta.tags,
      },
      twitter: generateTwitterCard(meta.title, meta.description || meta.title, meta.cover),
    }
  } catch {
    return {
      title: 'Not Found - NingBlog',
    }
  }
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params

  let meta: any
  let content: any
  let rawContent = ''

  try {
    const result = await getPostBySlug(slug, mdxComponents)
    meta = result.meta
    content = result.content

    // Read raw content for TOC extraction and reading time
    const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.mdx`)
    rawContent = fs.readFileSync(filePath, 'utf8')
    // Remove frontmatter
    rawContent = rawContent.replace(/^---[\s\S]*?---/, '')
  } catch (error) {
    notFound()
  }

  // Extract TOC and calculate reading time
  const tocItems = extractTocFromContent(rawContent)
  const readingTime = calculateReadingTime(rawContent)

  // Get navigation posts
  const allPosts = await getAllPosts()
  const currentIndex = allPosts.findIndex((post) => post.slug === slug)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  // Get related posts
  const relatedPosts = await getRelatedPosts(slug, 3)

  // Generate structured data
  const structuredData = generateArticleStructuredData(meta)

  return (
    <div className="container py-10">
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_250px]">
        {/* Main Content */}
        <div className="min-w-0">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回博客列表
            </Button>
          </Link>

          {/* Article Header */}
          <article>
            <header className="mb-8">
              <h1 className="mb-4 text-4xl font-bold tracking-tight">{meta.title}</h1>
              <PostMeta post={{ ...meta, readingTime }} />
            </header>

            {/* Article Content */}
            <div className="prose prose-neutral dark:prose-invert max-w-none">{content}</div>
          </article>

          {/* Navigation: Previous/Next Posts */}
          {(prevPost || nextPost) && (
            <nav className="border-border mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2">
              {prevPost ? (
                <Link href={`/blog/${prevPost.slug}`}>
                  <Card className="hover:bg-accent h-full transition-colors">
                    <CardHeader>
                      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
                        <ArrowLeft className="h-4 w-4" />
                        <span>上一篇</span>
                      </div>
                      <CardTitle className="text-lg">{prevPost.title}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ) : (
                <div />
              )}

              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`}>
                  <Card className="hover:bg-accent h-full transition-colors">
                    <CardHeader>
                      <div className="text-muted-foreground mb-2 flex items-center justify-end gap-2 text-sm">
                        <span>下一篇</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-right text-lg">{nextPost.title}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              )}
            </nav>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="border-border mt-16 border-t pt-8">
              <h2 className="mb-6 text-2xl font-bold">相关文章</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: Table of Contents */}
        {tocItems.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <TableOfContents items={tocItems} />
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
