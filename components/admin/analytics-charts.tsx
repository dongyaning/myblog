'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartData {
  date: string
  views: number
  uniqueVisitors: number
}

interface PostData {
  slug: string
  viewCount: number
}

interface RefererData {
  referer: string
  count: number
}

export function ViewsTrendChart({ data }: { data: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>访问趋势</CardTitle>
        <CardDescription>最近 30 天的访问数据</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString('zh-CN')
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#8884d8" name="浏览量" />
            <Line type="monotone" dataKey="uniqueVisitors" stroke="#82ca9d" name="独立访客" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function PopularPostsChart({ data }: { data: PostData[] }) {
  const chartData = data.slice(0, 10).map((post) => ({
    name: post.slug.length > 20 ? post.slug.substring(0, 20) + '...' : post.slug,
    views: post.viewCount,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>热门文章</CardTitle>
        <CardDescription>浏览量 Top 10</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="#8884d8" name="浏览量" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function RefererChart({ data }: { data: RefererData[] }) {
  const chartData = data.slice(0, 10).map((item) => ({
    name: item.referer.length > 30 ? item.referer.substring(0, 30) + '...' : item.referer,
    count: item.count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>访问来源</CardTitle>
        <CardDescription>Top 10 来源</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" name="访问次数" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
