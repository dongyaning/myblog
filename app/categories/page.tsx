import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { getAllCategories } from '@/lib/mdx'

export const metadata = {
  title: '分类 - NingBlog',
  description: '浏览所有文章分类',
}

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">分类</h1>
        <p className="text-muted-foreground mt-2">
          共 {categories.length} 个分类，{categories.reduce((sum, cat) => sum + cat.count, 0)}{' '}
          篇文章
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.name} href={`/categories/${encodeURIComponent(category.name)}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle className="text-xl">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{category.count} 篇文章</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-muted-foreground">暂无分类</p>
        </div>
      )}
    </div>
  )
}
