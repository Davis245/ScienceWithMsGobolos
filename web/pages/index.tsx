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
        <section
          className="relative overflow-hidden rounded-panel border border-slate-700 bg-cover bg-center shadow-surface"
          style={{ backgroundImage: "url('/classroom-hero.jpeg')" }}
        >
          <div className="absolute inset-0 bg-slate-950/60" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex min-h-[22rem] max-w-[51rem] flex-col px-5 py-6 text-center text-white sm:min-h-[26rem] sm:px-8 sm:py-8">
            <div className="flex flex-1 items-center justify-center py-8">
              <h1 className="m-0 text-5xl font-semibold tracking-tight text-white sm:text-6xl">Ms. Gobolos</h1>
            </div>
            <div className="border-t border-white/30 pt-4">
              <dl className="flex flex-col gap-2 text-sm text-slate-100 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-4 sm:gap-y-2">
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
                    <a className="break-words text-slate-100 underline-offset-4 hover:underline focus-visible:underline" href="mailto:jeannette.gobolos@sd27.bc.ca">
                      jeannette.gobolos@sd27.bc.ca
                    </a>
                  </dd>
                </div>
                <div className="contents">
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a className="text-slate-100 underline-offset-4 hover:underline focus-visible:underline" href="tel:+12503926284">
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
