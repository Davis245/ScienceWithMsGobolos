import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface PdfEntry {
  id: string
  title: string
  file_url: string
  section: string
  uploaded_at: string
}

export default function AnatomyPhysiology() {
  const colors = {
    background: '#F8F9FB',
    surface: '#FFFFFF',
    primary: '#3B6EA8',
    accent: '#7FB9C6',
    textPrimary: '#1F2933',
    textSecondary: '#4B5563',
  }

  const [helpfulDocs, setHelpfulDocs] = useState<PdfEntry[]>([])
  const [assignments, setAssignments] = useState<PdfEntry[]>([])

  useEffect(() => {
    async function fetchData() {
      const { data: docsData } = await supabase
        .from('pdfs')
        .select('*')
        .eq('section', 'anatomy_helpful')
        .order('uploaded_at', { ascending: true })
      if (docsData) setHelpfulDocs(docsData)

      const { data: assignData } = await supabase
        .from('pdfs')
        .select('*')
        .eq('section', 'anatomy_assignments')
        .order('uploaded_at', { ascending: true })
      if (assignData) setAssignments(assignData)
    }
    fetchData()
  }, [])

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          display: 'inline-block',
          fontSize: '48px',
          fontWeight: 'bold',
          color: colors.primary,
          margin: '0',
          padding: '16px 40px',
          border: `2px solid ${colors.accent}`,
          borderRadius: '16px',
          backgroundColor: colors.accent
        }}>
          Anatomy &amp; Physiology 12
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 24px 0', color: colors.primary }}>
            Helpful Documents
          </h3>
          <div style={{
            backgroundColor: colors.surface, borderRadius: '12px', padding: '24px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {helpfulDocs.length === 0 && (
              <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No documents uploaded yet.</p>
            )}
            {helpfulDocs.map(entry => (
              <a key={entry.id} href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', color: colors.primary, textDecoration: 'none', padding: '8px 0', fontWeight: '500', borderBottom: `1px solid ${colors.accent}` }}>
                📄 {entry.title}
              </a>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 24px 0', color: colors.primary }}>
            Assignments
          </h3>
          <div style={{
            backgroundColor: colors.surface, borderRadius: '12px', padding: '24px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {assignments.length === 0 && (
              <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No assignments uploaded yet.</p>
            )}
            {assignments.map(entry => (
              <a key={entry.id} href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', color: colors.primary, textDecoration: 'none', padding: '8px 0', fontWeight: '500', borderBottom: `1px solid ${colors.accent}` }}>
                📄 {entry.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
