export default function Scholarship() {
  const colors = {
    background: '#F8F9FB',
    surface: '#FFFFFF',
    primary: '#3B6EA8',
    accent: '#7FB9C6',
    textPrimary: '#1F2933',
    textSecondary: '#4B5563',
  }

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
            {/* PDF list will go here */}
            <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>
              No newsletters uploaded yet.
            </p>
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
            {/* PDF list will go here */}
            <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>
              No how-to guides uploaded yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
