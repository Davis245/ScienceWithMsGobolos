import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface DateCard {
  id: string
  date: string
  title: string
  description: string
}

interface PdfEntry {
  id: string
  title: string
  file_url: string
  section: string
  uploaded_at: string
}

export default function Scholarship() {
  const colors = {
    background: '#F8F9FB',
    surface: '#FFFFFF',
    primary: '#3B6EA8',
    accent: '#7FB9C6',
    textPrimary: '#1F2933',
    textSecondary: '#4B5563',
  }

  const [dates, setDates] = useState<DateCard[]>([])
  const [newsletters, setNewsletters] = useState<PdfEntry[]>([])
  const [howTo, setHowTo] = useState<PdfEntry[]>([])

  useEffect(() => {
    async function fetchData() {
      const { data: datesData } = await supabase
        .from('important_dates')
        .select('*')
        .order('created_at', { ascending: true })
      if (datesData) setDates(datesData)

      const { data: newslettersData } = await supabase
        .from('pdfs')
        .select('*')
        .eq('section', 'newsletters')
        .order('uploaded_at', { ascending: true })
      if (newslettersData) setNewsletters(newslettersData)

      const { data: howToData } = await supabase
        .from('pdfs')
        .select('*')
        .eq('section', 'howTo')
        .order('uploaded_at', { ascending: true })
      if (howToData) setHowTo(howToData)
    }
    fetchData()
  }, [])

  return (
    <div style={{ padding: '40px 0' }}>
      {/* Title - centered horizontally */}
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
          Scholarships &nbsp;•&nbsp; Bursaries &nbsp;•&nbsp; Awards
        </h1>
      </div>

      {/* Important Dates Section */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: colors.primary,
          margin: '0 0 24px 0'
        }}>
          Important Dates
        </h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {dates.map((item) => (
            <div key={item.id} style={{
              flex: '1 1 220px',
              backgroundColor: colors.surface,
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              borderLeft: `4px solid ${colors.primary}`
            }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: colors.primary,
                margin: '0 0 8px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {item.date}
              </p>
              <p style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: colors.textPrimary,
                margin: '0 0 6px 0'
              }}>
                {item.title}
              </p>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary,
                margin: '0'
              }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content area below */}
      <div style={{ display: 'flex', gap: '40px', marginTop: '60px' }}>
        {/* Newsletters Section */}
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 24px 0',
            color: colors.primary
          }}>
            Newsletters
          </h3>
          <div style={{
            backgroundColor: colors.surface,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {newsletters.length === 0 && (
              <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>
                No newsletters uploaded yet.
              </p>
            )}
            {newsletters.map(entry => (
              <a key={entry.id} href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'block',
                  color: colors.primary,
                  textDecoration: 'none',
                  padding: '8px 0',
                  fontWeight: '500',
                  borderBottom: `1px solid ${colors.accent}`
                }}>
                📄 {entry.title}
              </a>
            ))}
          </div>
        </div>

        {/* How To Section */}
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 24px 0',
            color: colors.primary
          }}>
            How To
          </h3>
          <div style={{
            backgroundColor: colors.surface,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {howTo.length === 0 && (
              <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>
                No how-to guides uploaded yet.
              </p>
            )}
            {howTo.map(entry => (
              <a key={entry.id} href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'block',
                  color: colors.primary,
                  textDecoration: 'none',
                  padding: '8px 0',
                  fontWeight: '500',
                  borderBottom: `1px solid ${colors.accent}`
                }}>
                📄 {entry.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
