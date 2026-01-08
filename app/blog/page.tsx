import { PostCard } from '@/components/blog/post-card'

import { getAllPosts } from '@/lib/mdx'

export const metadata = {
  title: '博客 - NingBlog',
  description: '浏览所有技术文章',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">博客</h1>
        <p className="text-muted-foreground mt-2">共 {posts.length} 篇文章</p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">暂无文章</p>
            <p className="text-muted-foreground mt-2 text-sm">
              在 content/posts 目录下创建 .mdx 文件开始写作
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
