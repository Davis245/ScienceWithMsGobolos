import Link from 'next/link'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <header style={{ padding: 20, borderBottom: '1px solid #ddd' }}>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link href="/">Home</Link>
          <Link href="/scholarship">Scholarship</Link>
          <Link href="/chemistry-12">Chemistry 12</Link>
          <Link href="/chemistry-11">Chemistry 11</Link>
          <Link href="/anatomy-physiology">Anatomy & Physiology</Link>
          <Link href="/calculus-12">Calculus 12</Link>
        </nav>
      </header>
      <main style={{ padding: 20 }}>{children}</main>
      <footer style={{ padding: 20, borderTop: '1px solid #eee', marginTop: 40 }}>
        © ScienceWithMsGobolos
      </footer>
    </div>
  )
}
