import Link from 'next/link'

import { Github, Mail, Rss, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-border bg-background w-full border-t">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Left: Copyright */}
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <p className="text-muted-foreground text-sm">
              © {currentYear} NingBlog. All rights reserved.
            </p>
            <p className="text-muted-foreground text-xs">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="mailto:contact@example.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </Link>
            <Link
              href="/feed.xml"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="RSS Feed"
            >
              <Rss className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
