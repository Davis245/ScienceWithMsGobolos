import { useState, useEffect, useRef, type FormEvent, type ChangeEvent, type CSSProperties } from 'react'
import Head from 'next/head'
import type { User } from '@supabase/supabase-js'
import {
  courseConfigs,
  scholarshipResourceSections,
  type CourseConfig,
  type ResourceSectionConfig,
} from '../data/site-config'
import { themeColors } from '../lib/design-tokens'
import { supabase } from '../lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

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

type PdfSection =
  | ResourceSectionConfig['sectionKey']
  | CourseConfig['helpfulSectionKey']
  | CourseConfig['assignmentSectionKey']

// ─── Section configuration ────────────────────────────────────────────────────

interface PdfGroup {
  groupLabel: string
  sections: { key: PdfSection; label: string }[]
}

const pdfGroups: PdfGroup[] = [
  {
    groupLabel: 'Scholarships',
    sections: scholarshipResourceSections.map((s) => ({
      key: s.sectionKey as PdfSection,
      label: s.displayName,
    })),
  },
  ...courseConfigs.map((course) => ({
    groupLabel: course.displayName,
    sections: [
      { key: course.helpfulSectionKey as PdfSection, label: 'Helpful Documents' },
      { key: course.assignmentSectionKey as PdfSection, label: 'Assignments' },
    ],
  })),
]

const allSectionKeys: PdfSection[] = pdfGroups.flatMap((g) => g.sections.map((s) => s.key))

function sectionLabel(key: PdfSection): string {
  for (const group of pdfGroups) {
    for (const section of group.sections) {
      if (section.key === key) return `${group.groupLabel} — ${section.label}`
    }
  }
  return key
}

function emptyPdfMap(): Record<PdfSection, PdfEntry[]> {
  return Object.fromEntries(allSectionKeys.map((k) => [k, []])) as unknown as Record<PdfSection, PdfEntry[]>
}

function safePdfUrl(url: string): string {
  // Restrict to https:// to prevent javascript: URI injection. All Supabase Storage
  // public URLs are https, so legitimate entries are unaffected.
  return url.startsWith('https://') ? url : '#'
}


const colors = themeColors

const inputStyle: CSSProperties = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: `1px solid ${colors.accent}`,
  fontSize: '16px',
  width: '100%',
  boxSizing: 'border-box',
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 600,
  color: colors.textPrimary,
  marginBottom: '4px',
}

const buttonStyle: CSSProperties = {
  padding: '10px 24px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: colors.primary,
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 600,
}

const dangerButtonStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#d9534f',
  padding: '6px 14px',
  fontSize: '14px',
}

const editButtonStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: colors.accent,
  padding: '6px 14px',
  fontSize: '14px',
  color: colors.textPrimary,
}

const disabledStyle: CSSProperties = { opacity: 0.6, cursor: 'not-allowed' }

function FeedbackMessage({ message, isError }: { message: string; isError: boolean }) {
  if (!message) return null
  return (
    <p
    role={isError ? 'alert' : 'status'}
    aria-live={isError ? 'assertive' : 'polite'}
      style={{
        margin: '8px 0 0',
        fontSize: '14px',
        color: isError ? '#d9534f' : '#16a34a',
        fontWeight: 500,
      }}
    >
      {message}
    </p>
  )
}

// ─── AdminLogin ───────────────────────────────────────────────────────────────

interface AdminLoginProps {
  onLogin: () => void
}

function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoginError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setLoginError(error.message)
    } else {
      onLogin()
    }
  }

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '80px auto',
        backgroundColor: colors.surface,
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: colors.primary,
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        Admin Login
      </h1>
      <p
        style={{
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: '28px',
          fontSize: '14px',
        }}
      >
        Sign in to manage site content
      </p>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label htmlFor="login-email" style={labelStyle}>
            Email
          </label>
          <input
            id="login-email"
            style={inputStyle}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="login-password" style={labelStyle}>
            Password
          </label>
          <input
            id="login-password"
            style={inputStyle}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {loginError && (
          <p role="alert" style={{ color: '#d9534f', fontSize: '14px', margin: 0 }}>
            {loginError}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{ ...buttonStyle, width: '100%', textAlign: 'center', ...(loading ? disabledStyle : {}) }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

// ─── ImportantDatesManager ────────────────────────────────────────────────────

interface ImportantDatesManagerProps {
  dates: DateCard[]
  onRefresh: () => void
}

function ImportantDatesManager({ dates, onRefresh }: ImportantDatesManagerProps) {
  const [dateForm, setDateForm] = useState({ date: '', title: '', description: '' })
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null)

  function showFeedback(message: string, isError: boolean) {
    setFeedback({ message, isError })
    setTimeout(() => setFeedback(null), 5000)
  }

  async function handleDateSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (editingDate) {
      const { error } = await supabase
        .from('important_dates')
        .update({ date: dateForm.date, title: dateForm.title, description: dateForm.description })
        .eq('id', editingDate)
      setLoading(false)
      if (error) {
        showFeedback(`Error updating date: ${error.message}`, true)
        return
      }
      showFeedback('Date updated successfully.', false)
      setEditingDate(null)
    } else {
      const { error } = await supabase
        .from('important_dates')
        .insert({ date: dateForm.date, title: dateForm.title, description: dateForm.description })
      setLoading(false)
      if (error) {
        showFeedback(`Error adding date: ${error.message}`, true)
        return
      }
      showFeedback('Date added successfully.', false)
    }
    setDateForm({ date: '', title: '', description: '' })
    onRefresh()
  }

  async function deleteDate(id: string, title: string) {
    if (!confirm(`Delete date "${title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('important_dates').delete().eq('id', id)
    if (error) {
      showFeedback(`Error deleting date: ${error.message}`, true)
      return
    }
    onRefresh()
  }

  function startEditDate(card: DateCard) {
    setEditingDate(card.id)
    setDateForm({ date: card.date, title: card.title, description: card.description })
    setFeedback(null)
  }

  return (
    <section style={{ marginBottom: '60px' }}>
      <h2
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: colors.textPrimary,
          marginBottom: '20px',
        }}
      >
        Important Dates
      </h2>

      <form
        onSubmit={handleDateSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: colors.surface,
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '24px',
        }}
      >
        <div>
          <label htmlFor="date-field" style={labelStyle}>
            Date <span style={{ fontWeight: 400, color: colors.textSecondary }}>(optional)</span>
          </label>
          <input
            id="date-field"
            style={inputStyle}
            placeholder="e.g. Feb 15, 2026"
            value={dateForm.date}
            onChange={(e) => setDateForm({ ...dateForm, date: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="date-title" style={labelStyle}>
            Title <span style={{ fontWeight: 400, color: colors.textSecondary }}>(optional)</span>
          </label>
          <input
            id="date-title"
            style={inputStyle}
            value={dateForm.title}
            onChange={(e) => setDateForm({ ...dateForm, title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="date-description" style={labelStyle}>
            Description <span style={{ fontWeight: 400, color: colors.textSecondary }}>(optional)</span>
          </label>
          <input
            id="date-description"
            style={inputStyle}
            value={dateForm.description}
            onChange={(e) => setDateForm({ ...dateForm, description: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={loading}
            style={{ ...buttonStyle, ...(loading ? disabledStyle : {}) }}
          >
            {loading ? 'Saving…' : editingDate ? 'Update Date' : 'Add Date'}
          </button>
          {editingDate && (
            <button
              type="button"
              style={editButtonStyle}
              onClick={() => {
                setEditingDate(null)
                setDateForm({ date: '', title: '', description: '' })
                setFeedback(null)
              }}
            >
              Cancel
            </button>
          )}
        </div>
        {feedback && <FeedbackMessage message={feedback.message} isError={feedback.isError} />}
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {dates.map((card) => (
          <div
            key={card.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '12px',
              backgroundColor: colors.surface,
              padding: '16px 20px',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${colors.primary}`,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <strong style={{ color: colors.primary, wordBreak: 'break-word' }}>{card.date}</strong>
              <span style={{ margin: '0 10px', color: colors.textPrimary, wordBreak: 'break-word' }}>
                {card.title}
              </span>
              <span style={{ color: colors.textSecondary, wordBreak: 'break-word' }}>{card.description}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button style={editButtonStyle} onClick={() => startEditDate(card)}>
                Edit
              </button>
              <button style={dangerButtonStyle} onClick={() => deleteDate(card.id, card.title)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── PdfUploadForm ────────────────────────────────────────────────────────────

interface PdfUploadFormProps {
  onUploaded: (section: PdfSection) => void
}

function PdfUploadForm({ onUploaded }: PdfUploadFormProps) {
  const [pdfSection, setPdfSection] = useState<PdfSection>('newsletters')
  const [pdfTitle, setPdfTitle] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function showFeedback(message: string, isError: boolean) {
    setFeedback({ message, isError })
    setTimeout(() => setFeedback(null), 6000)
  }

  async function handlePdfUpload(e: FormEvent) {
    e.preventDefault()
    if (!pdfFile) return

    setLoading(true)

    const displayTitle = pdfTitle.trim() || pdfFile.name.replace(/\.pdf$/i, '')
    const fileName = `${pdfSection}/${Date.now()}_${pdfFile.name}`
    const { error: uploadError } = await supabase.storage.from('pdfs').upload(fileName, pdfFile)

    if (uploadError) {
      setLoading(false)
      showFeedback(`Upload failed: ${uploadError.message}`, true)
      return
    }

    const { data: urlData } = supabase.storage.from('pdfs').getPublicUrl(fileName)

    const { error: insertError } = await supabase.from('pdfs').insert({
      title: displayTitle,
      section: pdfSection,
      file_url: urlData.publicUrl,
    })

    setLoading(false)

    if (insertError) {
      showFeedback(`Metadata save failed: ${insertError.message}`, true)
      return
    }

    showFeedback(`"${displayTitle}" uploaded successfully to ${sectionLabel(pdfSection)}.`, false)
    setPdfTitle('')
    setPdfFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    onUploaded(pdfSection)
  }

  return (
    <form
      onSubmit={handlePdfUpload}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: colors.surface,
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '24px',
      }}
    >
      <div>
        <label htmlFor="pdf-section" style={labelStyle}>
          Upload destination
        </label>
        <select
          id="pdf-section"
          style={inputStyle}
          value={pdfSection}
          onChange={(e) => setPdfSection(e.target.value as PdfSection)}
        >
          {pdfGroups.map((group) => (
            <optgroup key={group.groupLabel} label={group.groupLabel}>
              {group.sections.map((section) => (
                <option key={section.key} value={section.key}>
                  {section.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: colors.textSecondary }}>
          Selected: <strong>{sectionLabel(pdfSection)}</strong>
        </p>
      </div>
      <div>
        <label htmlFor="pdf-title" style={labelStyle}>
          PDF title <span style={{ fontWeight: 400, color: colors.textSecondary }}>(optional)</span>
        </label>
        <input
          id="pdf-title"
          style={inputStyle}
          value={pdfTitle}
          onChange={(e) => setPdfTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="pdf-file" style={labelStyle}>
          PDF file
        </label>
        <input
          id="pdf-file"
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          style={inputStyle}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPdfFile(e.target.files?.[0] ?? null)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{ ...buttonStyle, ...(loading ? disabledStyle : {}) }}
      >
        {loading ? 'Uploading…' : 'Upload PDF'}
      </button>
      {feedback && <FeedbackMessage message={feedback.message} isError={feedback.isError} />}
    </form>
  )
}

// ─── ResourceManager ─────────────────────────────────────────────────────────

interface ResourceManagerProps {
  pdfs: Record<PdfSection, PdfEntry[]>
  onDeleted: (section: PdfSection) => void
}

function ResourceManager({ pdfs, onDeleted }: ResourceManagerProps) {
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null)

  function showFeedback(message: string, isError: boolean) {
    setFeedback({ message, isError })
    setTimeout(() => setFeedback(null), 5000)
  }

  async function deletePdf(id: string, section: PdfSection, fileUrl: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return

    const storagePath = fileUrl.split('/storage/v1/object/public/pdfs/')[1]
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('pdfs')
        .remove([decodeURIComponent(storagePath)])
      if (storageError) {
        showFeedback(`Storage deletion error: ${storageError.message}`, true)
        return
      }
    }

    const { error } = await supabase.from('pdfs').delete().eq('id', id)
    if (error) {
      showFeedback(`Metadata deletion error: ${error.message}`, true)
      return
    }

    onDeleted(section)
  }

  return (
    <div>
      {feedback && (
        <div style={{ marginBottom: '16px' }}>
          <FeedbackMessage message={feedback.message} isError={feedback.isError} />
        </div>
      )}
      {pdfGroups.map((group) => (
        <div key={group.groupLabel} style={{ marginBottom: '36px' }}>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: colors.primary,
              margin: '0 0 12px',
            }}
          >
            {group.groupLabel}
          </h3>
          {group.sections.map((section) => {
            const entries = pdfs[section.key] ?? []
            return (
              <div key={section.key} style={{ marginBottom: '20px' }}>
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: colors.textSecondary,
                    margin: '0 0 8px',
                  }}
                >
                  {section.label}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {entries.length === 0 && (
                    <p style={{ color: colors.textSecondary, fontStyle: 'italic', margin: 0 }}>
                      No files uploaded yet.
                    </p>
                  )}
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '12px',
                        backgroundColor: colors.surface,
                        padding: '14px 20px',
                        borderRadius: '10px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <a
                        href={safePdfUrl(entry.file_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: colors.primary,
                          textDecoration: 'none',
                          fontWeight: 500,
                          wordBreak: 'break-word',
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        {entry.title}
                      </a>
                      <button
                        style={{ ...dangerButtonStyle, flexShrink: 0 }}
                        onClick={() => deletePdf(entry.id, section.key, entry.file_url, entry.title)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ─── Admin page ───────────────────────────────────────────────────────────────

export default function Admin() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [dates, setDates] = useState<DateCard[]>([])
  const [pdfs, setPdfs] = useState<Record<PdfSection, PdfEntry[]>>(emptyPdfMap)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchDates()
      allSectionKeys.forEach(fetchPdfs)
    }
  }, [user])

  async function fetchDates() {
    const { data, error } = await supabase
      .from('important_dates')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error) setDates(data ?? [])
  }

  async function fetchPdfs(section: PdfSection) {
    const { data, error } = await supabase
      .from('pdfs')
      .select('*')
      .eq('section', section)
      .order('uploaded_at', { ascending: true })
    if (!error) {
      setPdfs((prev) => ({ ...prev, [section]: data ?? [] }))
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (authLoading) {
    return (
      <>
        <Head>
          <title>Admin | Ms. Gobolos</title>
          <meta name="description" content="Admin dashboard for managing Science With Ms. Gobolos site content." />
          <meta name="robots" content="noindex,nofollow" />
        </Head>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <h1 style={{ color: colors.primary, fontSize: '32px', margin: '0 0 12px' }}>Admin</h1>
          <p style={{ color: colors.textSecondary, fontSize: '18px', margin: 0 }}>Loading…</p>
        </div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Head>
          <title>Admin | Ms. Gobolos</title>
          <meta name="description" content="Admin dashboard for managing Science With Ms. Gobolos site content." />
          <meta name="robots" content="noindex,nofollow" />
        </Head>
        <AdminLogin onLogin={() => {}} />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Admin | Ms. Gobolos</title>
        <meta name="description" content="Admin dashboard for managing Science With Ms. Gobolos site content." />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div style={{ padding: '40px 16px', maxWidth: '900px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: colors.primary, margin: 0 }}>
            Admin Panel
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span
              style={{
                color: colors.textSecondary,
                fontSize: '14px',
                wordBreak: 'break-all',
                maxWidth: '240px',
              }}
            >
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                ...buttonStyle,
                backgroundColor: colors.textSecondary,
                padding: '8px 18px',
                fontSize: '14px',
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        <ImportantDatesManager dates={dates} onRefresh={fetchDates} />

        <section>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: colors.textPrimary,
              marginBottom: '20px',
            }}
          >
            PDF Uploads
          </h2>
          <PdfUploadForm onUploaded={fetchPdfs} />
          <ResourceManager pdfs={pdfs} onDeleted={fetchPdfs} />
        </section>
      </div>
    </>
  )
}
