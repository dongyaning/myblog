import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // 七牛云图床域名
        protocol: 'https',
        hostname: '**.bkt.clouddn.com',
      },
      {
        // 七牛云图床域名（HTTP）
        protocol: 'http',
        hostname: '**.bkt.clouddn.com',
      },
      {
        // 七牛云自定义域名（如果你配置了）
        protocol: 'https',
        hostname: '**.qiniudn.com',
      },
      {
        // 七牛云 CDN 域名
        protocol: 'https',
        hostname: '**.clouddn.com',
      },
      {
        // 其他常见图床（可选）
        protocol: 'https',
        hostname: 'imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
}

export default nextConfig
