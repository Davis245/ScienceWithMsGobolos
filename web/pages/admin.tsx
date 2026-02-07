import { useState, useEffect, FormEvent } from 'react'
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

export default function Admin() {
  const colors = {
    background: '#F8F9FB',
    surface: '#FFFFFF',
    primary: '#3B6EA8',
    accent: '#7FB9C6',
    textPrimary: '#1F2933',
    textSecondary: '#4B5563',
  }

  // Important Dates state
  const [dates, setDates] = useState<DateCard[]>([])
  const [dateForm, setDateForm] = useState({ date: '', title: '', description: '' })
  const [editingDate, setEditingDate] = useState<string | null>(null)

  // PDF state
  const [newsletters, setNewsletters] = useState<PdfEntry[]>([])
  const [howTo, setHowTo] = useState<PdfEntry[]>([])
  const [pdfTitle, setPdfTitle] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfSection, setPdfSection] = useState<'newsletters' | 'howTo'>('newsletters')

  useEffect(() => {
    fetchDates()
    fetchPdfs('newsletters')
    fetchPdfs('howTo')
  }, [])

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
    else if (section === 'newsletters') setNewsletters(data || [])
    else setHowTo(data || [])
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
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: colors.primary, marginBottom: '40px' }}>
        Admin Panel
      </h1>

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
            onChange={e => setPdfSection(e.target.value as 'newsletters' | 'howTo')}
          >
            <option value="newsletters">Newsletters</option>
            <option value="howTo">How To</option>
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
          Newsletters
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
          How To
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
      </section>
    </div>
  )
}
