import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

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

export default function Admin() {
  const colors = {
    background: '#F8F9FB',
    surface: '#FFFFFF',
    primary: '#3B6EA8',
    accent: '#7FB9C6',
    textPrimary: '#1F2933',
    textSecondary: '#4B5563',
  }

  // Auth state
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Important Dates state
  const [dates, setDates] = useState<DateCard[]>([])
  const [dateForm, setDateForm] = useState({ date: '', title: '', description: '' })
  const [editingDate, setEditingDate] = useState<string | null>(null)

  // PDF state
  const [newsletters, setNewsletters] = useState<PdfEntry[]>([])
  const [howTo, setHowTo] = useState<PdfEntry[]>([])
  const [chem12Helpful, setChem12Helpful] = useState<PdfEntry[]>([])
  const [chem12Assignments, setChem12Assignments] = useState<PdfEntry[]>([])
  const [chem11Helpful, setChem11Helpful] = useState<PdfEntry[]>([])
  const [chem11Assignments, setChem11Assignments] = useState<PdfEntry[]>([])
  const [anatomyHelpful, setAnatomyHelpful] = useState<PdfEntry[]>([])
  const [anatomyAssignments, setAnatomyAssignments] = useState<PdfEntry[]>([])
  const [calc12Helpful, setCalc12Helpful] = useState<PdfEntry[]>([])
  const [calc12Assignments, setCalc12Assignments] = useState<PdfEntry[]>([])
  const [pdfTitle, setPdfTitle] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfSection, setPdfSection] = useState('newsletters')

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch data once logged in
  useEffect(() => {
    if (user) {
      fetchDates()
      fetchPdfs('newsletters')
      fetchPdfs('howTo')
      fetchPdfs('chem12_helpful')
      fetchPdfs('chem12_assignments')
      fetchPdfs('chem11_helpful')
      fetchPdfs('chem11_assignments')
      fetchPdfs('anatomy_helpful')
      fetchPdfs('anatomy_assignments')
      fetchPdfs('calc12_helpful')
      fetchPdfs('calc12_assignments')
    }
  }, [user])

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoginError(error.message)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function fetchDates() {
    const { data, error } = await supabase
      .from('important_dates')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) console.error('Error fetching dates:', error)
    else setDates(data || [])
  }

  async function fetchPdfs(section: string) {
    const { data, error } = await supabase
      .from('pdfs')
      .select('*')
      .eq('section', section)
      .order('uploaded_at', { ascending: true })
    if (error) console.error('Error fetching pdfs:', error)
    else {
      const items = data || []
      switch (section) {
        case 'newsletters': setNewsletters(items); break
        case 'howTo': setHowTo(items); break
        case 'chem12_helpful': setChem12Helpful(items); break
        case 'chem12_assignments': setChem12Assignments(items); break
        case 'chem11_helpful': setChem11Helpful(items); break
        case 'chem11_assignments': setChem11Assignments(items); break
        case 'anatomy_helpful': setAnatomyHelpful(items); break
        case 'anatomy_assignments': setAnatomyAssignments(items); break
        case 'calc12_helpful': setCalc12Helpful(items); break
        case 'calc12_assignments': setCalc12Assignments(items); break
      }
    }
  }

  // Date CRUD
  async function handleDateSubmit(e: FormEvent) {
    e.preventDefault()
    if (editingDate) {
      const { error } = await supabase
        .from('important_dates')
        .update({ date: dateForm.date, title: dateForm.title, description: dateForm.description })
        .eq('id', editingDate)
      if (error) console.error('Error updating date:', error)
      setEditingDate(null)
    } else {
      const { error } = await supabase
        .from('important_dates')
        .insert({ date: dateForm.date, title: dateForm.title, description: dateForm.description })
      if (error) console.error('Error adding date:', error)
    }
    setDateForm({ date: '', title: '', description: '' })
    fetchDates()
  }

  async function deleteDate(id: string) {
    const { error } = await supabase
      .from('important_dates')
      .delete()
      .eq('id', id)
    if (error) console.error('Error deleting date:', error)
    fetchDates()
  }

  function startEditDate(card: DateCard) {
    setEditingDate(card.id)
    setDateForm({ date: card.date, title: card.title, description: card.description })
  }

  // PDF Upload
  async function handlePdfUpload(e: FormEvent) {
    e.preventDefault()
    if (!pdfFile || !pdfTitle) return

    // Upload file to Supabase Storage
    const fileName = `${pdfSection}/${Date.now()}_${pdfFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(fileName, pdfFile)

    if (uploadError) {
      console.error('Error uploading PDF:', uploadError)
      return
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('pdfs')
      .getPublicUrl(fileName)

    // Insert metadata into pdfs table
    const { error: insertError } = await supabase
      .from('pdfs')
      .insert({
        title: pdfTitle,
        section: pdfSection,
        file_url: urlData.publicUrl,
      })

    if (insertError) console.error('Error saving PDF metadata:', insertError)

    setPdfTitle('')
    setPdfFile(null)
    fetchPdfs(pdfSection)
  }

  async function deletePdf(id: string, section: string, fileUrl: string) {
    // Extract the storage path from the public URL
    const storagePath = fileUrl.split('/storage/v1/object/public/pdfs/')[1]
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('pdfs')
        .remove([decodeURIComponent(storagePath)])
      if (storageError) console.error('Error deleting file from storage:', storageError)
    }

    // Delete metadata from table
    const { error } = await supabase
      .from('pdfs')
      .delete()
      .eq('id', id)
    if (error) console.error('Error deleting PDF record:', error)
    fetchPdfs(section)
  }

  const inputStyle = {
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1px solid ${colors.accent}`,
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box' as const,
  }

  const buttonStyle = {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: colors.primary,
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600' as const,
  }

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#d9534f',
    padding: '6px 14px',
    fontSize: '14px',
  }

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: colors.accent,
    padding: '6px 14px',
    fontSize: '14px',
  }

  return (
    <div style={{ padding: '40px 0', maxWidth: '900px', margin: '0 auto' }}>

      {/* ===== AUTH GATE ===== */}
      {authLoading ? (
        <p style={{ textAlign: 'center', color: colors.textSecondary, fontSize: '18px' }}>Loading...</p>
      ) : !user ? (
        <div style={{
          maxWidth: '400px', margin: '80px auto',
          backgroundColor: colors.surface, padding: '40px',
          borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.primary, marginBottom: '8px', textAlign: 'center' }}>
            Admin Login
          </h1>
          <p style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: '28px', fontSize: '14px' }}>
            Sign in to manage site content
          </p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              style={inputStyle}
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {loginError && (
              <p style={{ color: '#d9534f', fontSize: '14px', margin: 0 }}>{loginError}</p>
            )}
            <button type="submit" style={{ ...buttonStyle, width: '100%', textAlign: 'center' }}>
              Sign In
            </button>
          </form>
        </div>
      ) : (
      <>
      {/* ===== ADMIN PANEL (authenticated) ===== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: colors.primary, margin: 0 }}>
          Admin Panel
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: colors.textSecondary, fontSize: '14px' }}>{user.email}</span>
          <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: colors.textSecondary, padding: '8px 18px', fontSize: '14px' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* ===== IMPORTANT DATES ===== */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.textPrimary, marginBottom: '20px' }}>
          Important Dates
        </h2>

        <form onSubmit={handleDateSubmit} style={{ 
          display: 'flex', flexDirection: 'column', gap: '12px',
          backgroundColor: colors.surface, padding: '24px', borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px'
        }}>
          <input
            style={inputStyle}
            placeholder="Date (e.g. Feb 15, 2026)"
            value={dateForm.date}
            onChange={e => setDateForm({ ...dateForm, date: e.target.value })}
            required
          />
          <input
            style={inputStyle}
            placeholder="Title"
            value={dateForm.title}
            onChange={e => setDateForm({ ...dateForm, title: e.target.value })}
            required
          />
          <input
            style={inputStyle}
            placeholder="Description"
            value={dateForm.description}
            onChange={e => setDateForm({ ...dateForm, description: e.target.value })}
            required
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={buttonStyle}>
              {editingDate ? 'Update Date' : 'Add Date'}
            </button>
            {editingDate && (
              <button type="button" style={editButtonStyle} onClick={() => {
                setEditingDate(null)
                setDateForm({ date: '', title: '', description: '' })
              }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Existing date cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dates.map(card => (
            <div key={card.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: colors.surface, padding: '16px 20px', borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `4px solid ${colors.primary}`
            }}>
              <div>
                <strong style={{ color: colors.primary }}>{card.date}</strong>
                <span style={{ margin: '0 10px', color: colors.textPrimary }}>{card.title}</span>
                <span style={{ color: colors.textSecondary }}>{card.description}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={editButtonStyle} onClick={() => startEditDate(card)}>Edit</button>
                <button style={dangerButtonStyle} onClick={() => deleteDate(card.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PDF UPLOADS ===== */}
      <section>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.textPrimary, marginBottom: '20px' }}>
          PDF Uploads
        </h2>

        <form onSubmit={handlePdfUpload} style={{
          display: 'flex', flexDirection: 'column', gap: '12px',
          backgroundColor: colors.surface, padding: '24px', borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px'
        }}>
          <select
            style={inputStyle}
            value={pdfSection}
            onChange={e => setPdfSection(e.target.value)}
          >
            <optgroup label="Scholarships">
              <option value="newsletters">Newsletters</option>
              <option value="howTo">How To</option>
            </optgroup>
            <optgroup label="Chemistry 12">
              <option value="chem12_helpful">Helpful Documents</option>
              <option value="chem12_assignments">Assignments</option>
            </optgroup>
            <optgroup label="Chemistry 11">
              <option value="chem11_helpful">Helpful Documents</option>
              <option value="chem11_assignments">Assignments</option>
            </optgroup>
            <optgroup label="Anatomy &amp; Physiology">
              <option value="anatomy_helpful">Helpful Documents</option>
              <option value="anatomy_assignments">Assignments</option>
            </optgroup>
            <optgroup label="Calculus 12">
              <option value="calc12_helpful">Helpful Documents</option>
              <option value="calc12_assignments">Assignments</option>
            </optgroup>
          </select>
          <input
            style={inputStyle}
            placeholder="PDF Title"
            value={pdfTitle}
            onChange={e => setPdfTitle(e.target.value)}
            required
          />
          <input
            type="file"
            accept=".pdf"
            style={inputStyle}
            onChange={e => setPdfFile(e.target.files?.[0] || null)}
            required
          />
          <button type="submit" style={buttonStyle}>Upload PDF</button>
        </form>

        {/* Newsletters list */}
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.primary, margin: '24px 0 12px' }}>
          Scholarships — Newsletters
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {newsletters.length === 0 && (
            <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No newsletters uploaded yet.</p>
          )}
          {newsletters.map(entry => (
            <div key={entry.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: colors.surface, padding: '14px 20px', borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <a href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500' }}>
                {entry.title}
              </a>
              <button style={dangerButtonStyle} onClick={() => deletePdf(entry.id, 'newsletters', entry.file_url)}>Delete</button>
            </div>
          ))}
        </div>

        {/* How To list */}
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.primary, margin: '24px 0 12px' }}>
          Scholarships — How To
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {howTo.length === 0 && (
            <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No how-to guides uploaded yet.</p>
          )}
          {howTo.map(entry => (
            <div key={entry.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: colors.surface, padding: '14px 20px', borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <a href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500' }}>
                {entry.title}
              </a>
              <button style={dangerButtonStyle} onClick={() => deletePdf(entry.id, 'howTo', entry.file_url)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Chemistry 12 - Helpful Documents */}
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.primary, margin: '36px 0 12px' }}>
          Chem 12 — Helpful Documents
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {chem12Helpful.length === 0 && (
            <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No helpful documents uploaded yet.</p>
          )}
          {chem12Helpful.map(entry => (
            <div key={entry.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: colors.surface, padding: '14px 20px', borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <a href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500' }}>
                {entry.title}
              </a>
              <button style={dangerButtonStyle} onClick={() => deletePdf(entry.id, 'chem12_helpful', entry.file_url)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Chemistry 12 - Assignments */}
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.primary, margin: '24px 0 12px' }}>
          Chem 12 — Assignments
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {chem12Assignments.length === 0 && (
            <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No assignments uploaded yet.</p>
          )}
          {chem12Assignments.map(entry => (
            <div key={entry.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: colors.surface, padding: '14px 20px', borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <a href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500' }}>
                {entry.title}
              </a>
              <button style={dangerButtonStyle} onClick={() => deletePdf(entry.id, 'chem12_assignments', entry.file_url)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Chemistry 11 - Helpful Documents */}
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.primary, margin: '36px 0 12px' }}>
          Chem 11 — Helpful Documents
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {chem11Helpful.length === 0 && (
            <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No helpful documents uploaded yet.</p>
          )}
          {chem11Helpful.map(entry => (
            <div key={entry.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: colors.surface, padding: '14px 20px', borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <a href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500' }}>
                {entry.title}
              </a>
              <button style={dangerButtonStyle} onClick={() => deletePdf(entry.id, 'chem11_helpful', entry.file_url)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Chemistry 11 - Assignments */}
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.primary, margin: '24px 0 12px' }}>
          Chem 11 — Assignments
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {chem11Assignments.length === 0 && (
            <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No assignments uploaded yet.</p>
          )}
          {chem11Assignments.map(entry => (
            <div key={entry.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: colors.surface, padding: '14px 20px', borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <a href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500' }}>
                {entry.title}
              </a>
              <button style={dangerButtonStyle} onClick={() => deletePdf(entry.id, 'chem11_assignments', entry.file_url)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Anatomy & Physiology - Helpful Documents */}
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.primary, margin: '36px 0 12px' }}>
          Anatomy &amp; Physiology — Helpful Documents
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {anatomyHelpful.length === 0 && (
            <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No helpful documents uploaded yet.</p>
          )}
          {anatomyHelpful.map(entry => (
            <div key={entry.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: colors.surface, padding: '14px 20px', borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <a href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500' }}>
                {entry.title}
              </a>
              <button style={dangerButtonStyle} onClick={() => deletePdf(entry.id, 'anatomy_helpful', entry.file_url)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Anatomy & Physiology - Assignments */}
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.primary, margin: '24px 0 12px' }}>
          Anatomy &amp; Physiology — Assignments
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {anatomyAssignments.length === 0 && (
            <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No assignments uploaded yet.</p>
          )}
          {anatomyAssignments.map(entry => (
            <div key={entry.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: colors.surface, padding: '14px 20px', borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <a href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500' }}>
                {entry.title}
              </a>
              <button style={dangerButtonStyle} onClick={() => deletePdf(entry.id, 'anatomy_assignments', entry.file_url)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Calculus 12 - Helpful Documents */}
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.primary, margin: '36px 0 12px' }}>
          Calculus 12 — Helpful Documents
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {calc12Helpful.length === 0 && (
            <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No helpful documents uploaded yet.</p>
          )}
          {calc12Helpful.map(entry => (
            <div key={entry.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: colors.surface, padding: '14px 20px', borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <a href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500' }}>
                {entry.title}
              </a>
              <button style={dangerButtonStyle} onClick={() => deletePdf(entry.id, 'calc12_helpful', entry.file_url)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Calculus 12 - Assignments */}
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.primary, margin: '24px 0 12px' }}>
          Calculus 12 — Assignments
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {calc12Assignments.length === 0 && (
            <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No assignments uploaded yet.</p>
          )}
          {calc12Assignments.map(entry => (
            <div key={entry.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: colors.surface, padding: '14px 20px', borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <a href={entry.file_url} target="_blank" rel="noopener noreferrer"
                style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500' }}>
                {entry.title}
              </a>
              <button style={dangerButtonStyle} onClick={() => deletePdf(entry.id, 'calc12_assignments', entry.file_url)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
      </>
      )}
    </div>
  )
}
