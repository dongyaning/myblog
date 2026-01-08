import type { Config } from 'tailwindcss'

const config = {
  // ... 其他配置
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}', // <--- 如果你用的是 Next.js App Router，这行必须有
    './src/**/*.{ts,tsx}', // <--- 如果你用了 src 目录，这行必须有
  ],
  theme: {
    extend: {
      // 可以在这里扩展 typography 的样式，比如配合暗色模式
    },
  },
  plugins: [],
} satisfies Config

export default config
