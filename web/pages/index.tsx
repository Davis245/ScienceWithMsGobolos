import Head from 'next/head'
import QuickLinkCard from '../components/QuickLinkCard'
import { courseConfigs, scholarshipQuickLinkConfig } from '../data/site-config'

function getQuickLinkSymbol(title: string) {
  if (title === 'Chemistry 11') {
    return '⚗'
  }

  if (title === 'Chemistry 12') {
    return '🧪'
  }

  if (title.startsWith('Anatomy')) {
    return '♥'
  }

  if (title.startsWith('Calculus')) {
    return '∫'
  }

  return '★'
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

      <div className="flex flex-1 flex-col">
        <section className="rounded-panel border border-border bg-white px-5 pb-0 pt-5 shadow-surface sm:px-8 sm:pb-0 sm:pt-6">
          <div className="mx-auto flex min-h-[9rem] max-w-[51rem] flex-col text-center sm:min-h-[10rem]">
            <div className="flex flex-1 items-center justify-center">
              <h1 className="m-0 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">Ms. Gobolos</h1>
            </div>
            <div className="border-t border-border py-3">
              <dl className="flex flex-col gap-1.5 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-4 sm:gap-y-1.5">
                <div className="contents">
                  <dt className="sr-only">School</dt>
                  <dd>Lake City Secondary School</dd>
                </div>
                <div className="contents">
                  <dt className="sr-only">Room</dt>
                  <dd>Room 110</dd>
                </div>
                <div className="contents">
                  <dt className="sr-only">Email</dt>
                  <dd>
                    <a className="break-words text-slate-600 underline-offset-4 hover:underline focus-visible:underline" href="mailto:jeannette.gobolos@sd27.bc.ca">
                      jeannette.gobolos@sd27.bc.ca
                    </a>
                  </dd>
                </div>
                <div className="contents">
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a className="text-slate-600 underline-offset-4 hover:underline focus-visible:underline" href="tel:+12503926284">
                      (250) 392-6284
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="mt-auto scroll-mt-24 pt-10 sm:pt-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {quickLinks.map((link) => (
              <QuickLinkCard
                key={link.route}
                title={link.displayName}
                href={link.route}
                accent={link.accent}
                symbol={getQuickLinkSymbol(link.displayName)}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
