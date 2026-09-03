import Link from 'next/link'
import { subjectAccentColors, type SubjectAccent } from '../lib/design-tokens'

interface QuickLinkCardProps {
  title: string
  href: string
  accent: SubjectAccent
  symbol: string
  className?: string
}

export default function QuickLinkCard({ title, href, accent, symbol, className = '' }: QuickLinkCardProps) {
  return (
    <Link
      href={href}
      aria-label={`View ${title} page`}
      className={`group block h-full rounded-panel border border-border bg-white p-5 no-underline shadow-soft transition hover:border-slate-300 hover:shadow-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`.trim()}
      style={{ borderTopWidth: '4px', borderTopColor: subjectAccentColors[accent] }}
    >
      <div className="flex aspect-square h-full flex-col items-center justify-center gap-4 text-center">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-full text-3xl"
          style={{ backgroundColor: `${subjectAccentColors[accent]}14`, color: subjectAccentColors[accent] }}
        >
          {symbol}
        </span>
        <h3 className="m-0 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{title}</h3>
      </div>
    </Link>
  )
}
