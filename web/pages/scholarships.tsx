import { useEffect, useState } from 'react'
import { scholarshipResourceSections } from '../data/site-config'
import { colorTokens, shadowTokens, themeColors } from '../lib/design-tokens'
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

const newslettersSection = scholarshipResourceSections.find((section) => section.sectionKey === 'newsletters')!
const howToSection = scholarshipResourceSections.find((section) => section.sectionKey === 'howTo')!

function ResourceRow({ entry, colors }: { entry: PdfEntry; colors: typeof themeColors }) {
  return (
    <a
      href={entry.file_url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 0',
        borderBottom: `1px solid ${colors.accent}`,
        color: colors.primary,
        textDecoration: 'none',
        fontWeight: '500',
        fontSize: '15px',
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.5px',
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: colorTokens.amber,
          color: colorTokens.surface,
          flexShrink: 0,
        }}
      >
        PDF
      </span>
      {entry.title}
    </a>
  )
}

export default function Scholarship() {
  const colors = themeColors
  const [dates, setDates] = useState<DateCard[]>([])
  const [newsletters, setNewsletters] = useState<PdfEntry[]>([])
  const [howTo, setHowTo] = useState<PdfEntry[]>([])
  const [loadingDates, setLoadingDates] = useState(true)
  const [loadingNewsletters, setLoadingNewsletters] = useState(true)
  const [loadingHowTo, setLoadingHowTo] = useState(true)
  const [errorDates, setErrorDates] = useState(false)
  const [errorNewsletters, setErrorNewsletters] = useState(false)
  const [errorHowTo, setErrorHowTo] = useState(false)

  useEffect(() => {
    supabase
      .from('important_dates')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) setErrorDates(true)
        else setDates(data)
        setLoadingDates(false)
      })

    supabase
      .from('pdfs')
      .select('*')
      .eq('section', newslettersSection.sectionKey)
      .order('uploaded_at', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) setErrorNewsletters(true)
        else setNewsletters(data)
        setLoadingNewsletters(false)
      })

    supabase
      .from('pdfs')
      .select('*')
      .eq('section', howToSection.sectionKey)
      .order('uploaded_at', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) setErrorHowTo(true)
        else setHowTo(data)
        setLoadingHowTo(false)
      })
  }, [])

  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: shadowTokens.soft,
  }

  return (
    <div style={{ padding: '32px 0 64px' }}>
      {/* Page header */}
      <div style={{ marginBottom: '40px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: colors.textPrimary,
            margin: '0 0 8px 0',
          }}
        >
          Scholarships, Bursaries &amp; Awards
        </h1>
        <p style={{ fontSize: '15px', color: colors.textSecondary, margin: '0' }}>
          Find upcoming deadlines, scholarship newsletters, and guides on how to apply.
        </p>
      </div>

      {/* Important Dates */}
      <section style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: colors.textPrimary,
            margin: '0 0 16px 0',
          }}
        >
          Important Dates
        </h2>
        {loadingDates && (
          <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>Loading dates…</p>
        )}
        {!loadingDates && errorDates && (
          <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>
            Dates could not be loaded right now. Please check back soon.
          </p>
        )}
        {!loadingDates && !errorDates && dates.length === 0 && (
          <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No upcoming dates at this time.</p>
        )}
        {!loadingDates && !errorDates && dates.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {dates.map((item) => (
              <div
                key={item.id}
                style={{
                  ...cardStyle,
                  borderTop: `4px solid ${colors.primary}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: colors.primary,
                    margin: '0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {item.date}
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: colors.textPrimary,
                    margin: '0',
                  }}
                >
                  {item.title}
                </p>
                {item.description && (
                  <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '0' }}>{item.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resources */}
      <section>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: colors.textPrimary,
            margin: '0 0 16px 0',
          }}
        >
          Resources
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Newsletters */}
          <div style={cardStyle}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: colors.textPrimary,
                margin: '0 0 12px 0',
              }}
            >
              {newslettersSection.displayName}
            </h3>
            {loadingNewsletters && (
              <p style={{ color: colors.textSecondary, fontStyle: 'italic', fontSize: '14px' }}>Loading…</p>
            )}
            {!loadingNewsletters && errorNewsletters && (
              <p style={{ color: colors.textSecondary, fontStyle: 'italic', fontSize: '14px' }}>
                Newsletters could not be loaded right now.
              </p>
            )}
            {!loadingNewsletters && !errorNewsletters && newsletters.length === 0 && (
              <p style={{ color: colors.textSecondary, fontStyle: 'italic', fontSize: '14px' }}>No newsletters uploaded yet.</p>
            )}
            {!loadingNewsletters && !errorNewsletters && newsletters.length > 0 && newsletters.map((entry) => (
              <ResourceRow key={entry.id} entry={entry} colors={colors} />
            ))}
          </div>

          {/* How To Apply */}
          <div style={cardStyle}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: colors.textPrimary,
                margin: '0 0 12px 0',
              }}
            >
              {howToSection.displayName}
            </h3>
            {loadingHowTo && (
              <p style={{ color: colors.textSecondary, fontStyle: 'italic', fontSize: '14px' }}>Loading…</p>
            )}
            {!loadingHowTo && errorHowTo && (
              <p style={{ color: colors.textSecondary, fontStyle: 'italic', fontSize: '14px' }}>
                Guides could not be loaded right now.
              </p>
            )}
            {!loadingHowTo && !errorHowTo && howTo.length === 0 && (
              <p style={{ color: colors.textSecondary, fontStyle: 'italic', fontSize: '14px' }}>No how-to guides uploaded yet.</p>
            )}
            {!loadingHowTo && !errorHowTo && howTo.length > 0 && howTo.map((entry) => (
              <ResourceRow key={entry.id} entry={entry} colors={colors} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
