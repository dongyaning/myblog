import { NextRequest, NextResponse } from 'next/server'

import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

import { verifyAuth } from '@/lib/auth'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

interface RouteParams {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/admin/posts/[slug]
 * 获取单篇文章内容
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // 验证权限
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const filePath = path.join(POSTS_DIR, `${slug}.mdx`)

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data: frontmatter, content } = matter(fileContent)

    return NextResponse.json({
      slug,
      content: fileContent, // 返回完整内容（包含 frontmatter）
      frontmatter,
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/posts/[slug]
 * 更新文章内容
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // 验证权限
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const body = await request.json()
    const { frontmatter, content } = body

    if (!frontmatter || content === undefined) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const filePath = path.join(POSTS_DIR, `${slug}.mdx`)

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 更新 updated 字段
    frontmatter.updated = new Date().toISOString().split('T')[0]

    // 合并 frontmatter 和 content
    const newFileContent = matter.stringify(content, frontmatter)

    // 写入文件
    fs.writeFileSync(filePath, newFileContent, 'utf8')

    return NextResponse.json({
      success: true,
      message: '保存成功',
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/posts/[slug]
 * 删除文章
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // 验证权限
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const filePath = path.join(POSTS_DIR, `${slug}.mdx`)

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 删除文件
    fs.unlinkSync(filePath)

    return NextResponse.json({
      success: true,
      message: '删除成功',
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
