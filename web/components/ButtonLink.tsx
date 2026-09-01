import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

type ButtonLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    children: ReactNode
    variant?: 'primary' | 'secondary'
  }

const variantClasses = {
  primary:
    'bg-brand text-white hover:bg-blue-700 focus-visible:outline-brand border border-brand',
  secondary:
    'bg-surface text-slate-900 hover:bg-slate-50 focus-visible:outline-brand border border-border',
} as const

export default function ButtonLink({ children, className = '', variant = 'primary', ...props }: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex items-center justify-center rounded-pill px-4 py-2 text-sm font-semibold no-underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Link>
  )
}
