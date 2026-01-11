import { NextRequest, NextResponse } from 'next/server'

import { getAllPosts } from '@/lib/mdx'

// export const dynamic = 'force-static'
// export const revalidate = 3600 // 缓存 1 小时

/**
 * 搜索 API
 * GET /api/search?q=关键词
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')?.toLowerCase().trim()

    console.log('request.nextUrl: ' + request.nextUrl.toString())

    console.log('search PARAMS:', searchParams.toString())

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    // 获取所有文章
    const allPosts = await getAllPosts()

    // 执行搜索（标题、描述、标签、分类）
    const results = allPosts
      .map((post) => {
        let score = 0
        const titleMatch = post.title.toLowerCase().includes(query)
        const descMatch = post.description?.toLowerCase().includes(query)
        const tagMatch = post.tags?.some((tag) => tag.toLowerCase().includes(query))
        const categoryMatch = post.category?.toLowerCase().includes(query)

        // 计算相关性得分
        if (titleMatch) score += 10
        if (descMatch) score += 5
        if (tagMatch) score += 3
        if (categoryMatch) score += 2

        return { post, score, titleMatch, descMatch }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // 最多返回 10 个结果
      .map((item) => ({
        slug: item.post.slug,
        title: item.post.title,
        description: item.post.description || '',
        category: item.post.category,
        tags: item.post.tags,
        date: item.post.date,
        titleMatch: item.titleMatch,
      }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
