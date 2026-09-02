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
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="m-0 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">Ms. Gobolos</h1>
            <div className="mt-6 border-t border-border pt-5">
              <dl className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-4 sm:gap-y-2">
                <div className="contents">
                  <dt className="sr-only">School</dt>
                  <dd className="font-medium text-slate-900">Lake City Secondary School</dd>
                </div>
                <div className="contents">
                  <dt className="sr-only">Room</dt>
                  <dd>Room 110</dd>
                </div>
                <div className="contents">
                  <dt className="sr-only">Email</dt>
                  <dd>
                    <a className="break-words font-medium text-brand underline-offset-4 hover:underline focus-visible:underline" href="mailto:jeannette.gobolos@sd27.bc.ca">
                      jeannette.gobolos@sd27.bc.ca
                    </a>
                  </dd>
                </div>
                <div className="contents">
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a className="font-medium text-brand underline-offset-4 hover:underline focus-visible:underline" href="tel:+12503926284">
                      (250) 392-6284
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
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
