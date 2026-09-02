import Head from 'next/head'
import QuickLinkCard from '../components/QuickLinkCard'
import SectionHeading from '../components/SectionHeading'
import { courseConfigs, scholarshipQuickLinkConfig } from '../data/site-config'

function getQuickLinkAccentLabel(title: string) {
  if (title.startsWith('Chemistry')) {
    return 'Chemistry'
  }

  if (title.startsWith('Anatomy')) {
    return 'Biology'
  }

  if (title.startsWith('Calculus')) {
    return 'Mathematics'
  }

  return 'Student Support'
}

export default function Home() {
  const quickLinks = [...courseConfigs, scholarshipQuickLinkConfig]

  return (
    <>
      <Head>
        <title>Science With Ms. Gobolos</title>
        <meta
          name="description"
          content="Chemistry, anatomy, and calculus resources for students at Lake City Secondary School."
        />
      </Head>

      <div className="space-y-10 sm:space-y-14">
        <section className="rounded-panel border border-border bg-white px-5 py-8 shadow-surface sm:px-8 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div className="max-w-2xl">
              <p className="m-0 text-sm font-semibold uppercase tracking-[0.18em] text-brand">Science &amp; Math</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Ms. Gobolos</h1>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/80 bg-slate-50/70 px-4 py-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">School</dt>
                <dd className="mt-2 text-base font-medium text-slate-900">Lake City Secondary School</dd>
              </div>
              <div className="rounded-2xl border border-border/80 bg-slate-50/70 px-4 py-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Room</dt>
                <dd className="mt-2 text-base font-medium text-slate-900">Room 110</dd>
              </div>
              <div className="rounded-2xl border border-border/80 bg-slate-50/70 px-4 py-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</dt>
                <dd className="mt-2 text-base font-medium">
                  <a className="break-words text-brand underline-offset-4 hover:underline focus-visible:underline" href="mailto:jeannette.gobolos@sd27.bc.ca">
                    jeannette.gobolos@sd27.bc.ca
                  </a>
                </dd>
              </div>
              <div className="rounded-2xl border border-border/80 bg-slate-50/70 px-4 py-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Phone</dt>
                <dd className="mt-2 text-base font-medium">
                  <a className="text-brand underline-offset-4 hover:underline focus-visible:underline" href="tel:+12503926284">
                    (250) 392-6284
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="scroll-mt-24">
          <SectionHeading title="Quick Links" description="Jump directly to course pages and student opportunities." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {quickLinks.map((link, index) => (
              <QuickLinkCard
                key={link.route}
                title={link.displayName}
                description={link.description}
                href={link.route}
                accent={link.accent}
                accentLabel={getQuickLinkAccentLabel(link.displayName)}
                className={
                  index < 3
                    ? 'xl:col-span-2'
                    : index === 3
                      ? 'xl:col-span-2 xl:col-start-2'
                      : 'xl:col-span-2 xl:col-start-4'
                }
              />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
