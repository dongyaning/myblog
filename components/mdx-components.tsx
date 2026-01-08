import Image from 'next/image'
import Link from 'next/link'

import { CodeBlock } from '@/components/blog/code-block'
import { Button } from '@/components/ui/button'

// Custom MDX components
export const mdxComponents = {
  // Shadcn components
  Button,

  // Custom code block with copy button
  pre: (props: any) => <CodeBlock {...props} />,

  // Enhanced links
  a: ({ href, children, ...props }: any) => {
    const isExternal = href?.startsWith('http')
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
          {...props}
        >
          {children}
        </a>
      )
    }
    return (
      <Link
        href={href || '#'}
        className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
        {...props}
      >
        {children}
      </Link>
    )
  },

  // Enhanced images
  img: ({ src, alt, ...props }: any) => {
    return (
      <span className="border-border block overflow-hidden rounded-lg border">
        <Image
          src={src || ''}
          alt={alt || ''}
          width={800}
          height={450}
          className="w-full object-cover"
          {...props}
        />
      </span>
    )
  },

  // Add IDs to headings for TOC
  h1: ({ children, ...props }: any) => {
    const id = generateId(children)
    return (
      <h1 id={id} {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ children, ...props }: any) => {
    const id = generateId(children)
    return (
      <h2 id={id} {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }: any) => {
    const id = generateId(children)
    return (
      <h3 id={id} {...props}>
        {children}
      </h3>
    )
  },
  h4: ({ children, ...props }: any) => {
    const id = generateId(children)
    return (
      <h4 id={id} {...props}>
        {children}
      </h4>
    )
  },
  h5: ({ children, ...props }: any) => {
    const id = generateId(children)
    return (
      <h5 id={id} {...props}>
        {children}
      </h5>
    )
  },
  h6: ({ children, ...props }: any) => {
    const id = generateId(children)
    return (
      <h6 id={id} {...props}>
        {children}
      </h6>
    )
  },
}

// Generate ID from heading text
function generateId(children: React.ReactNode): string {
  const text = extractText(children)
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as any).props.children)
  }
  return ''
}
