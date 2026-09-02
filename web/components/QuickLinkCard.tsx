import Link from 'next/link'
import { subjectAccentColors, type SubjectAccent } from '../lib/design-tokens'

interface QuickLinkCardProps {
  title: string
  description: string
  href: string
  accent: SubjectAccent
  accentLabel: string
  className?: string
}

export default function QuickLinkCard({ title, description, href, accent, accentLabel, className = '' }: QuickLinkCardProps) {
  return (
    <Link
      href={href}
      aria-label={`View ${title} page`}
      className={`group block h-full rounded-panel border border-border bg-white p-5 no-underline shadow-soft transition hover:border-slate-300 hover:shadow-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`.trim()}
      style={{ borderTopWidth: '4px', borderTopColor: subjectAccentColors[accent] }}
    >
      <div className="flex h-full flex-col">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: subjectAccentColors[accent] }}>
          {accentLabel}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <span className="mt-5 text-sm font-semibold text-slate-900 transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5">
          View page →
        </span>
      </div>
    </Link>
  )
}
