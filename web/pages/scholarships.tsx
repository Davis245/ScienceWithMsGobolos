import Head from 'next/head'
import { useEffect, useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import { scholarshipResourceSections } from '../data/site-config'
import { supabase } from '../lib/supabase'

interface DateCard {
  id: string
  date: string
  title: string
  description: string
}

interface PdfEntry {
  id: string
  title: string
  file_url: string
}

const newslettersSection = scholarshipResourceSections.find((section) => section.sectionKey === 'newsletters')!
const howToSection = scholarshipResourceSections.find((section) => section.sectionKey === 'howTo')!

function ResourceRow({ entry }: { entry: PdfEntry }) {
  return (
    <li>
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
  )
}

export default function Scholarships() {
  const [dates, setDates] = useState<DateCard[]>([])
  const [newsletters, setNewsletters] = useState<PdfEntry[]>([])
  const [howTo, setHowTo] = useState<PdfEntry[]>([])
  const [loadingDates, setLoadingDates] = useState(true)
  const [loadingNewsletters, setLoadingNewsletters] = useState(true)
  const [loadingHowTo, setLoadingHowTo] = useState(true)
  const [errorDates, setErrorDates] = useState(false)
  const [errorNewsletters, setErrorNewsletters] = useState(false)
  const [errorHowTo, setErrorHowTo] = useState(false)

  useEffect(() => {
    supabase
      .from('important_dates')
      .select('id, date, title, description')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) setErrorDates(true)
        else setDates(data)
        setLoadingDates(false)
      })

    supabase
      .from('pdfs')
      .select('id, title, file_url')
      .eq('section', newslettersSection.sectionKey)
      .order('uploaded_at', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) setErrorNewsletters(true)
        else setNewsletters(data)
        setLoadingNewsletters(false)
      })

    supabase
      .from('pdfs')
      .select('id, title, file_url')
      .eq('section', howToSection.sectionKey)
      .order('uploaded_at', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) setErrorHowTo(true)
        else setHowTo(data)
        setLoadingHowTo(false)
      })
  }, [])

  return (
    <>
      <Head>
        <title>Scholarships | Science With Ms. Gobolos</title>
        <meta
          name="description"
          content="Scholarship, bursary, and award deadlines with newsletters and application guides for graduating students."
        />
      </Head>

      <div className="space-y-8 sm:space-y-10">
        <section className="rounded-panel border border-border bg-white px-5 py-8 shadow-surface sm:px-8 sm:py-10">
          <SectionHeading
            as="h1"
            title="Scholarships, Bursaries & Awards"
            description="Find upcoming deadlines, scholarship newsletters, and guides on how to apply."
            accent="amber"
          />
        </section>

        <section className="space-y-4">
          <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Important Dates</h2>
          {loadingDates && <p className="m-0 text-sm italic text-slate-500">Loading dates…</p>}
          {!loadingDates && errorDates && (
            <p className="m-0 text-sm italic text-slate-500">Dates could not be loaded right now. Please check back soon.</p>
          )}
          {!loadingDates && !errorDates && dates.length === 0 && (
            <p className="m-0 text-sm italic text-slate-500">No upcoming dates at this time.</p>
          )}
          {!loadingDates && !errorDates && dates.length > 0 && (
            <ul className="m-0 grid list-none gap-3 p-0 sm:gap-4 md:grid-cols-2">
              {dates.map((item) => (
                <li
                  key={item.id}
                  className="rounded-panel border border-border border-t-4 border-t-scholarships bg-white p-4 shadow-soft sm:p-5"
                >
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-brand">{item.date}</p>
                  <h3 className="mb-0 mt-2 text-lg font-semibold tracking-tight text-slate-900 break-words">{item.title}</h3>
                  {item.description && <p className="mb-0 mt-2 text-sm leading-6 text-slate-600 break-words">{item.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-panel border border-border bg-white p-5 shadow-soft sm:p-6">
              <h3 className="m-0 text-xl font-semibold tracking-tight text-slate-900">{newslettersSection.displayName}</h3>
              {loadingNewsletters && <p className="mb-0 mt-3 text-sm italic text-slate-500">Loading…</p>}
              {!loadingNewsletters && errorNewsletters && (
                <p className="mb-0 mt-3 text-sm italic text-slate-500">Newsletters could not be loaded right now.</p>
              )}
              {!loadingNewsletters && !errorNewsletters && newsletters.length === 0 && (
                <p className="mb-0 mt-3 text-sm italic text-slate-500">No newsletters uploaded yet.</p>
              )}
              {!loadingNewsletters && !errorNewsletters && newsletters.length > 0 && (
                <ul className="m-0 mt-3 list-none space-y-2 p-0">
                  {newsletters.map((entry) => (
                    <ResourceRow key={entry.id} entry={entry} />
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-panel border border-border bg-white p-5 shadow-soft sm:p-6">
              <h3 className="m-0 text-xl font-semibold tracking-tight text-slate-900">{howToSection.displayName}</h3>
              {loadingHowTo && <p className="mb-0 mt-3 text-sm italic text-slate-500">Loading…</p>}
              {!loadingHowTo && errorHowTo && (
                <p className="mb-0 mt-3 text-sm italic text-slate-500">Guides could not be loaded right now.</p>
              )}
              {!loadingHowTo && !errorHowTo && howTo.length === 0 && (
                <p className="mb-0 mt-3 text-sm italic text-slate-500">No how-to guides uploaded yet.</p>
              )}
              {!loadingHowTo && !errorHowTo && howTo.length > 0 && (
                <ul className="m-0 mt-3 list-none space-y-2 p-0">
                  {howTo.map((entry) => (
                    <ResourceRow key={entry.id} entry={entry} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
