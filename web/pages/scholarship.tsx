export default function Scholarship() {
  const colors = {
    background: '#A0DDE6',
    surface: '#80C2AF',
    primary: '#30C5FF',
    accent: '#5C946E',
    textPrimary: '#2A2D34',
    textSecondary: '#2A2D34',
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
