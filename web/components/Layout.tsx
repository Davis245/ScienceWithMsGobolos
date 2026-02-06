import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const bgColor = '#f8f9fa'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: bgColor, padding: '20px 40px' }}>
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Left-aligned logo */}
          <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#0066cc' }}>
            MsG
          </div>

          {/* Right-aligned links */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/" style={{ 
              textDecoration: 'none',
              color: router.pathname === '/' ? '#0066cc' : '#333',
              fontWeight: router.pathname === '/' ? '600' : '400'
            }}>
              Home
            </Link>
            <Link href="/scholarship" style={{ 
              textDecoration: 'none',
              color: router.pathname === '/scholarship' ? '#0066cc' : '#333',
              fontWeight: router.pathname === '/scholarship' ? '600' : '400'
            }}>
              Scholarship
            </Link>
            <Link href="/chemistry-12" style={{ 
              textDecoration: 'none',
              color: router.pathname === '/chemistry-12' ? '#0066cc' : '#333',
              fontWeight: router.pathname === '/chemistry-12' ? '600' : '400'
            }}>
              Chemistry 12
            </Link>
            <Link href="/chemistry-11" style={{ 
              textDecoration: 'none',
              color: router.pathname === '/chemistry-11' ? '#0066cc' : '#333',
              fontWeight: router.pathname === '/chemistry-11' ? '600' : '400'
            }}>
              Chemistry 11
            </Link>
            <Link href="/anatomy-physiology" style={{ 
              textDecoration: 'none',
              color: router.pathname === '/anatomy-physiology' ? '#0066cc' : '#333',
              fontWeight: router.pathname === '/anatomy-physiology' ? '600' : '400'
            }}>
              Anatomy & Physiology
            </Link>
            <Link href="/calculus-12" style={{ 
              textDecoration: 'none',
              color: router.pathname === '/calculus-12' ? '#0066cc' : '#333',
              fontWeight: router.pathname === '/calculus-12' ? '600' : '400'
            }}>
              Calculus 12
            </Link>
          </div>
        </nav>
        
        {/* Separator line - 90% width */}
        <div style={{ 
          borderBottom: '1px solid #ddd',
          width: '90%',
          margin: '16px auto 0',
          maxWidth: '1400px'
        }} />
      </header>

      <main style={{ 
        flex: 1,
        backgroundColor: bgColor,
        padding: '40px',
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto'
      }}>
        {children}
      </main>

      <footer style={{ 
        padding: '20px',
        textAlign: 'center',
        borderTop: '1px solid #eee',
        color: '#666',
        fontSize: '14px'
      }}>
        © ScienceWithMsGobolos
      </footer>
    </div>
  )
}
