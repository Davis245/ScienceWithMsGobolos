import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import Container from './Container'
import { courseConfigs } from '../data/site-config'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktopCoursesOpen, setIsDesktopCoursesOpen] = useState(false)
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false)
  const desktopCoursesId = useId()
  const mobileMenuId = useId()
  const mobileCoursesId = useId()
  const desktopCoursesRef = useRef<HTMLDivElement>(null)
  const currentYear = new Date().getFullYear()
  const isCourseRoute = courseConfigs.some((course) => router.pathname === course.route)
  const isHomeRoute = router.pathname === '/'

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsDesktopCoursesOpen(false)
    setIsMobileCoursesOpen(false)
  }, [router.asPath])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsDesktopCoursesOpen(false)
        setIsMobileCoursesOpen(false)
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (!desktopCoursesRef.current?.contains(event.target as Node)) {
        setIsDesktopCoursesOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  const primaryLinkClass =
    'inline-flex min-h-11 items-center rounded-pill px-4 text-sm font-medium no-underline transition-colors hover:bg-slate-100 hover:text-ink focus-visible:bg-slate-100'
  const activeLinkClass = 'bg-slate-100 text-ink'
  const inactiveLinkClass = 'text-muted'
  const menuPanelClass = 'rounded-2xl border border-border bg-white p-2 shadow-soft'

  return (
    <div className="flex min-h-screen flex-col bg-page text-slate-900">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-white px-3 py-2 text-sm font-medium text-ink no-underline shadow-soft focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur">
        <Container>
          <nav className="flex min-h-[4.5rem] items-center justify-between gap-4 py-3" aria-label="Primary">
            <Link href="/" className="text-lg font-semibold tracking-tight text-ink no-underline">
              Ms. Gobolos
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/"
                className={`${primaryLinkClass} ${router.pathname === '/' ? activeLinkClass : inactiveLinkClass}`}
                aria-current={router.pathname === '/' ? 'page' : undefined}
              >
                Home
              </Link>

              <div className="relative" ref={desktopCoursesRef}>
                <button
                  type="button"
                  className={`${primaryLinkClass} ${isCourseRoute ? activeLinkClass : inactiveLinkClass}`}
                  aria-expanded={isDesktopCoursesOpen}
                  aria-controls={desktopCoursesId}
                  aria-haspopup="menu"
                  onClick={() => setIsDesktopCoursesOpen((open) => !open)}
                >
                  Courses
                  <span aria-hidden="true" className="ml-2 text-xs">
                    ▾
                  </span>
                </button>

                {isDesktopCoursesOpen && (
                  <div id={desktopCoursesId} className={`absolute right-0 top-full mt-2 min-w-[15rem] ${menuPanelClass}`}>
                    <div className="flex flex-col">
                      {courseConfigs.map((course) => {
                        const isActive = router.pathname === course.route

                        return (
                          <Link
                            key={course.route}
                            href={course.route}
                            className={`rounded-xl px-3 py-3 text-sm no-underline transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 ${
                              isActive ? 'bg-slate-100 font-medium text-ink' : 'text-muted'
                            }`}
                            aria-current={isActive ? 'page' : undefined}
                            onClick={() => setIsDesktopCoursesOpen(false)}
                          >
                            {course.displayName}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/scholarships"
                className={`${primaryLinkClass} ${router.pathname === '/scholarships' ? activeLinkClass : inactiveLinkClass}`}
                aria-current={router.pathname === '/scholarships' ? 'page' : undefined}
              >
                Scholarships
              </Link>
            </div>

            <button
              type="button"
              className={`inline-flex min-h-11 items-center rounded-pill border border-border px-4 text-sm font-medium text-ink transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 md:hidden ${
                isMobileMenuOpen ? 'bg-slate-100' : 'bg-white'
              }`}
              aria-expanded={isMobileMenuOpen}
              aria-controls={mobileMenuId}
              aria-haspopup="menu"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              Menu
            </button>
          </nav>

          {isMobileMenuOpen && (
            <div id={mobileMenuId} className={`mb-3 md:hidden ${menuPanelClass}`}>
              <div className="flex flex-col">
                <Link
                  href="/"
                  className={`rounded-xl px-3 py-3 text-sm font-medium no-underline transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 ${
                    router.pathname === '/' ? 'bg-slate-100 text-ink' : 'text-muted'
                  }`}
                  aria-current={router.pathname === '/' ? 'page' : undefined}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setIsMobileCoursesOpen(false)
                  }}
                >
                  Home
                </Link>

                <button
                  type="button"
                  className={`mt-1 inline-flex min-h-11 items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 ${
                    isCourseRoute ? 'bg-slate-100 text-ink' : 'text-muted'
                  }`}
                  aria-expanded={isMobileCoursesOpen}
                  aria-controls={mobileCoursesId}
                  aria-haspopup="menu"
                  onClick={() => setIsMobileCoursesOpen((open) => !open)}
                >
                  <span>Courses</span>
                  <span aria-hidden="true" className="ml-2 text-xs">
                    {isMobileCoursesOpen ? '▴' : '▾'}
                  </span>
                </button>

                {isMobileCoursesOpen && (
                  <div id={mobileCoursesId} className="mt-1 flex flex-col gap-1 pl-2">
                    {courseConfigs.map((course) => {
                      const isActive = router.pathname === course.route

                      return (
                        <Link
                          key={course.route}
                          href={course.route}
                          className={`rounded-xl px-3 py-3 text-sm no-underline transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 ${
                            isActive ? 'bg-slate-100 font-medium text-ink' : 'text-muted'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            setIsMobileCoursesOpen(false)
                          }}
                        >
                          {course.displayName}
                        </Link>
                      )
                    })}
                  </div>
                )}

                <Link
                  href="/scholarships"
                  className={`mt-1 rounded-xl px-3 py-3 text-sm font-medium no-underline transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 ${
                    router.pathname === '/scholarships' ? 'bg-slate-100 text-ink' : 'text-muted'
                  }`}
                  aria-current={router.pathname === '/scholarships' ? 'page' : undefined}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setIsMobileCoursesOpen(false)
                  }}
                >
                  Scholarships
                </Link>
              </div>
            </div>
          )}
        </Container>
      </header>

      <main id="main-content" className={isHomeRoute ? 'flex flex-1' : 'flex-1'} tabIndex={-1}>
        <Container className={isHomeRoute ? 'flex flex-1 flex-col py-8 sm:py-10' : 'py-8 sm:py-10'}>{children}</Container>
      </main>

      {!isHomeRoute && (
        <footer className="border-t border-border bg-white/80 py-5 text-sm text-muted">
          <Container className="flex flex-col gap-1">
            <p className="m-0 font-medium text-ink">Ms. Gobolos</p>
            <p className="m-0">Lake City Secondary School</p>
            <p className="m-0">Room 110</p>
            <p className="m-0">© {currentYear}</p>
          </Container>
        </footer>
      )}
    </div>
  )
}
