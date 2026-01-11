import { Eye } from 'lucide-react'

import { getPostStats } from '@/lib/db/queries'

interface PostStatsProps {
  slug: string
}

export async function PostStats({ slug }: PostStatsProps) {
  const postStats = await getPostStats(slug)
  const viewCount = postStats?.viewCount || 0

  return (
    <div className="text-muted-foreground flex items-center gap-1 text-sm">
      <Eye className="h-4 w-4" />
      <span>{viewCount.toLocaleString()} 次阅读</span>
    </div>
  )
}

export function PostStatsSkeleton() {
  return (
    <div className="text-muted-foreground flex items-center gap-1 text-sm">
      <Eye className="h-4 w-4" />
      <span className="bg-muted h-4 w-16 animate-pulse rounded" />
    </div>
  )
}
