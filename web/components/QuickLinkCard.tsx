import Link from 'next/link'
import { subjectAccentColors, type SubjectAccent } from '../lib/design-tokens'

interface QuickLinkCardProps {
  title: string
  href: string
  accent: SubjectAccent
  iconSrc: string
  className?: string
}

export default function QuickLinkCard({ title, href, accent, iconSrc, className = '' }: QuickLinkCardProps) {
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
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: `${subjectAccentColors[accent]}14` }}
        >
          <img src={iconSrc} alt="" className="h-10 w-10" />
        </span>
        <h3 className="m-0 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{title}</h3>
      </div>
    </Link>
  )
}
