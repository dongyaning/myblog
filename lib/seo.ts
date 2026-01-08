import type { Frontmatter } from './mdx'

export const siteConfig = {
  name: 'NingBlog',
  description:
    'A personal technical blog focused on web development, JavaScript, and modern frameworks',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ningblog.com',
  author: {
    name: 'Ning',
    email: 'contact@example.com',
    twitter: '@ningblog',
  },
  links: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
  },
}

/**
 * Generate structured data for blog posts (JSON-LD)
 */
export function generateArticleStructuredData(post: Frontmatter & { slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description || post.title,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${post.slug}`,
    },
    ...(post.cover && {
      image: `${siteConfig.url}${post.cover}`,
    }),
    ...(post.tags && {
      keywords: post.tags.join(', '),
    }),
  }
}

/**
 * Generate Open Graph metadata
 */
export function generateOpenGraph(
  title: string,
  description: string,
  path: string,
  image?: string
) {
  return {
    title,
    description,
    url: `${siteConfig.url}${path}`,
    siteName: siteConfig.name,
    images: image
      ? [
          {
            url: `${siteConfig.url}${image}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ]
      : [],
    locale: 'zh_CN',
    type: 'website',
  }
}

/**
 * Generate Twitter Card metadata
 */
export function generateTwitterCard(title: string, description: string, image?: string) {
  return {
    card: 'summary_large_image',
    title,
    description,
    creator: siteConfig.author.twitter,
    ...(image && {
      images: [`${siteConfig.url}${image}`],
    }),
  }
}
