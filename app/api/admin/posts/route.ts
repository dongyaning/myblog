import { NextRequest, NextResponse } from 'next/server'

import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

import { verifyAuth } from '@/lib/auth'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

/**
 * GET /api/admin/posts
 * 获取所有文章列表
 */
export async function GET(request: NextRequest) {
  try {
    // 验证权限
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 读取文章目录
    const files = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith('.mdx'))

    // 解析每个文件的 frontmatter
    const posts = files.map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      const filePath = path.join(POSTS_DIR, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContent)

      return {
        slug,
        title: data.title || 'Untitled',
        updatedAt: data.updated || data.date || new Date().toISOString(),
        published: data.published !== false,
        category: data.category || null,
        tags: data.tags || [],
      }
    })

    // 按更新时间排序
    posts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

/**
 * POST /api/admin/posts
 * 创建新文章
 */
export async function POST(request: NextRequest) {
  try {
    // 验证权限
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // 生成 slug
    const slug = generateSlug(title)
    const filePath = path.join(POSTS_DIR, `${slug}.mdx`)

    // 检查文件是否已存在
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File already exists' }, { status: 409 })
    }

    // 创建默认内容
    const now = new Date().toISOString().split('T')[0]
    const defaultContent = `---
title: ${title}
date: ${now}
updated: ${now}
description: 
published: false
category: 
tags: []
---

# ${title}

开始写作...
`

    // 写入文件
    fs.writeFileSync(filePath, defaultContent, 'utf8')

    return NextResponse.json({
      success: true,
      slug,
      message: '文章创建成功',
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

/**
 * 生成 slug
 */
function generateSlug(title: string): string {
  const timestamp = Date.now()
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)}-${timestamp}`
}
