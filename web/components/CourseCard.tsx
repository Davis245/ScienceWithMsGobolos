import Link from 'next/link'
import type { CourseConfig } from '../data/site-config'
import { subjectAccentColors } from '../lib/design-tokens'

interface CourseCardProps {
  course: CourseConfig
}

function getSubjectLabel(course: CourseConfig) {
  if (course.displayName.startsWith('Chemistry')) {
    return 'Chemistry'
  }

  if (course.displayName.startsWith('Anatomy')) {
    return 'Biology'
  }

  return 'Mathematics'
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={course.route}
      aria-label={`View ${course.displayName} course`}
      className="group block h-full rounded-panel border border-border bg-white p-5 no-underline shadow-soft transition hover:border-slate-300 hover:shadow-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ borderTopWidth: '4px', borderTopColor: subjectAccentColors[course.accent] }}
    >
      <div className="flex h-full flex-col">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: subjectAccentColors[course.accent] }}>
          {getSubjectLabel(course)}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{course.displayName}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{course.description}</p>
        <span className="mt-5 text-sm font-semibold text-slate-900 transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5">
          View course →
        </span>
      </div>
    </Link>
  )
}
