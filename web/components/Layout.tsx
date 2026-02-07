import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const colors = {
    background: '#A0DDE6',
    surface: '#80C2AF',
    primary: '#30C5FF',
    accent: '#5C946E',
    textPrimary: '#2A2D34',
    textSecondary: '#2A2D34',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: colors.background, padding: '20px 40px' }}>
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Left-aligned logo */}
          <div style={{ fontWeight: 'bold', fontSize: '18px', color: colors.primary }}>
            Gobs
          </div>

          {/* Right-aligned links */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/" style={{ 
              textDecoration: 'none',
              color: router.pathname === '/' ? colors.primary : colors.textSecondary,
              fontWeight: router.pathname === '/' ? '600' : '400'
            }}>
              Home
            </Link>
            <Link href="/scholarship" style={{ 
              textDecoration: 'none',
              color: router.pathname === '/scholarships' ? colors.primary : colors.textSecondary,
              fontWeight: router.pathname === '/scholarships' ? '600' : '400'
            }}>
              Scholarships
            </Link>
            <Link href="/chemistry-12" style={{ 
              textDecoration: 'none',
              color: router.pathname === '/chemistry-12' ? colors.primary : colors.textSecondary,
              fontWeight: router.pathname === '/chemistry-12' ? '600' : '400'
            }}>
              Chemistry 12
            </Link>
            <Link href="/chemistry-11" style={{ 
              textDecoration: 'none',
              color: router.pathname === '/chemistry-11' ? colors.primary : colors.textSecondary,
              fontWeight: router.pathname === '/chemistry-11' ? '600' : '400'
            }}>
              Chemistry 11
            </Link>
            <Link href="/anatomy-physiology" style={{ 
              textDecoration: 'none',
              color: router.pathname === '/anatomy-physiology' ? colors.primary : colors.textSecondary,
              fontWeight: router.pathname === '/anatomy-physiology' ? '600' : '400'
            }}>
              Anatomy & Physiology
            </Link>
            <Link href="/calculus-12" style={{ 
              textDecoration: 'none',
              color: router.pathname === '/calculus-12' ? colors.primary : colors.textSecondary,
              fontWeight: router.pathname === '/calculus-12' ? '600' : '400'
            }}>
              Calculus 12
            </Link>
          </div>
        </nav>
      </header>

      {/* Separator line - full width */}
      <div style={{ 
        borderBottom: `1px solid ${colors.accent}`,
        width: '100%'
      }} />

      <main style={{ 
        flex: 1,
        backgroundColor: colors.background,
        padding: '0px 40px',
        maxWidth: '2000px',
        width: '100%',
        margin: '0 auto'
      }}>
        {children}
      </main>

      <footer style={{ 
        padding: '20px',
        textAlign: 'center',
        borderTop: `1px solid ${colors.accent}`,
        color: colors.textSecondary,
        fontSize: '14px'
      }}>
        © ScienceWithMsGobolos
      </footer>
    </div>
  )
}
