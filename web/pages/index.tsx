import Link from 'next/link'
import Head from 'next/head'
import ButtonLink from '../components/ButtonLink'
import CourseCard from '../components/CourseCard'
import SectionHeading from '../components/SectionHeading'
import { courseConfigs } from '../data/site-config'

export default function Home() {
  return (
    <>
      <Head>
        <title>Science With Ms. Gobolos</title>
        <meta
          name="description"
          content="Chemistry, biology, and calculus resources for students at Lake City Secondary School."
        />
      </Head>

      <div className="space-y-10 sm:space-y-14">
        <section className="rounded-panel border border-border bg-white px-5 py-8 shadow-surface sm:px-8">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.18em] text-brand">Science &amp; Math</p>
          <div className="mt-4 max-w-3xl">
            <h1 className="m-0 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Science With Ms. Gobolos</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Chemistry, biology and calculus resources for students at Lake City Secondary School.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="#courses">View Courses</ButtonLink>
            <ButtonLink href="/scholarships" variant="secondary">
              Scholarships
            </ButtonLink>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-border pt-5 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
            <span className="font-medium text-slate-900">Lake City Secondary School</span>
            <span>Room 110</span>
            <a className="font-medium text-brand underline-offset-4 hover:underline" href="mailto:jeannette.gobolos@sd27.bc.ca">
              jeannette.gobolos@sd27.bc.ca
            </a>
            <span>(250) 392-6284</span>
          </div>
        </section>

        <section id="courses" className="scroll-mt-24">
          <SectionHeading title="Courses" description="Notes, assignments and resources for each course." />
          <div className="grid gap-4 md:grid-cols-2">
            {courseConfigs.map((course) => (
              <CourseCard key={course.route} course={course} />
            ))}
          </div>
        </section>

        <section className="rounded-panel border border-amber-200 bg-amber-50/70 px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Scholarships &amp; Awards</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Important dates, opportunities and application resources for graduating students.
              </p>
            </div>

            <Link
              href="/scholarships"
              className="inline-flex items-center text-sm font-semibold text-slate-900 no-underline transition-colors hover:text-amber-700"
            >
              View Scholarships
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
