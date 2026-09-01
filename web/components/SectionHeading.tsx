import { subjectAccentColors, type SubjectAccent } from '../lib/design-tokens'

interface SectionHeadingProps {
  title: string
  description?: string
  accent?: SubjectAccent
  as?: 'h1' | 'h2' | 'h3'
}

export default function SectionHeading({ title, description, accent = 'blue', as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <div className="mb-6">
      <Tag className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </Tag>
      {description ? (
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500" style={{ borderLeft: `3px solid ${subjectAccentColors[accent]}`, paddingLeft: '0.875rem' }}>
          {description}
        </p>
      ) : null}
    </div>
  )
}
