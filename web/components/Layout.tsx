import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import Container from './Container'
import { primaryNavigationItems } from '../data/site-config'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col bg-page text-slate-900">
      <header className="border-b border-border bg-page/95">
        <Container>
          <nav className="flex min-h-[4.5rem] flex-wrap items-center justify-between gap-4 py-5">
            <Link href="/" className="text-lg font-semibold tracking-tight text-brand no-underline">
              Science With Ms. Gobolos
            </Link>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {primaryNavigationItems.map((item) => {
                const isActive = router.pathname === item.route

                return (
                  <Link
                    key={item.route}
                    href={item.route}
                    className={`no-underline transition-colors ${
                      isActive ? 'font-semibold text-slate-900' : 'text-slate-500 hover:text-brand'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </Container>
      </header>

      <main className="flex-1 py-8 sm:py-10">
        <Container>{children}</Container>
      </main>

      <footer className="border-t border-border bg-white/80 py-5 text-sm text-slate-500">
        <Container>© ScienceWithMsGobolos</Container>
      </footer>
    </div>
  )
}
