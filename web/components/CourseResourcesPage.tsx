import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import SectionHeading from './SectionHeading'
import { getCourseConfig, type CourseConfig } from '../data/site-config'
import { supabase } from '../lib/supabase'

interface PdfEntry {
  id: string
  title: string
  file_url: string
}

interface ResourceSectionProps {
  title: string
  entries: PdfEntry[]
  loading: boolean
  hasError: boolean
  emptyMessage: string
  errorMessage: string
}

function ResourceSection({ title, entries, loading, hasError, emptyMessage, errorMessage }: ResourceSectionProps) {
  return (
    <div className="rounded-panel border border-border bg-white p-5 shadow-soft sm:p-6">
      <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
      {loading && <p className="mt-3 text-sm italic text-slate-500">Loading…</p>}
      {!loading && hasError && <p className="mt-3 text-sm italic text-slate-500">{errorMessage}</p>}
      {!loading && !hasError && entries.length === 0 && <p className="mt-3 text-sm italic text-slate-500">{emptyMessage}</p>}
      {!loading && !hasError && entries.length > 0 && (
        <ul className="m-0 mt-4 list-none space-y-2 p-0">
          {entries.map((entry) => (
            <li key={entry.id}>
              <a
                href={entry.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-ink no-underline transition-colors hover:border-border hover:bg-slate-50 focus-visible:border-border focus-visible:bg-slate-50"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex shrink-0 items-center rounded-md bg-slate-900 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white"
                >
                  PDF
                </span>
                <span className="min-w-0 break-words">{entry.title}</span>
                <span aria-hidden="true" className="text-xs text-slate-500">
                  ↗
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface CourseResourcesPageProps {
  route: CourseConfig['route']
}

export default function CourseResourcesPage({ route }: CourseResourcesPageProps) {
  const course = useMemo(() => getCourseConfig(route), [route])
  const [helpfulDocs, setHelpfulDocs] = useState<PdfEntry[]>([])
  const [assignments, setAssignments] = useState<PdfEntry[]>([])
  const [loadingHelpful, setLoadingHelpful] = useState(true)
  const [loadingAssignments, setLoadingAssignments] = useState(true)
  const [helpfulError, setHelpfulError] = useState(false)
  const [assignmentError, setAssignmentError] = useState(false)

  useEffect(() => {
    if (!course) return

    setLoadingHelpful(true)
    setLoadingAssignments(true)
    setHelpfulError(false)
    setAssignmentError(false)

    supabase
      .from('pdfs')
      .select('id, title, file_url')
      .eq('section', course.helpfulSectionKey)
      .order('uploaded_at', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) setHelpfulError(true)
        else setHelpfulDocs(data)
        setLoadingHelpful(false)
      })

    supabase
      .from('pdfs')
      .select('id, title, file_url')
      .eq('section', course.assignmentSectionKey)
      .order('uploaded_at', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) setAssignmentError(true)
        else setAssignments(data)
        setLoadingAssignments(false)
      })
  }, [course])

  if (!course) return null

  return (
    <>
      <Head>
        <title>{`${course.displayName} | Science With Ms. Gobolos`}</title>
        <meta name="description" content={course.description ?? 'Notes, assignments, and resources for this course.'} />
      </Head>

      <div className="space-y-8 sm:space-y-10">
        <section className="rounded-panel border border-border bg-white px-5 py-8 shadow-surface sm:px-8 sm:py-10">
          <SectionHeading
            as="h1"
            title={course.displayName}
            description="Helpful documents, assignments, and downloadable PDFs for this course."
            accent={course.accent}
          />
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <ResourceSection
            title="Helpful Documents"
            entries={helpfulDocs}
            loading={loadingHelpful}
            hasError={helpfulError}
            emptyMessage="No documents uploaded yet."
            errorMessage="Helpful documents could not be loaded right now. Please check back soon."
          />
          <ResourceSection
            title="Assignments"
            entries={assignments}
            loading={loadingAssignments}
            hasError={assignmentError}
            emptyMessage="No assignments uploaded yet."
            errorMessage="Assignments could not be loaded right now. Please check back soon."
          />
        </div>
      </div>
    </>
  )
}
