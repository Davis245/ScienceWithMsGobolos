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
      {/* Top section with image and titles */}
      <div style={{ 
        display: 'flex', 
        gap: '40px',
        alignItems: 'flex-end',
        marginBottom: '40px'
      }}>
        {/* Left side - Image */}
        <div style={{
          width: '300px',
          height: '300px',
          backgroundColor: colors.accent,
          borderRadius: '12px',
          flexShrink: 0,
          backgroundImage: 'url(/scholarship-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />

        {/* Right side - Titles */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1 style={{ 
            fontSize: '48px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            color: colors.primary,
            lineHeight: '1.2'
          }}>
            Scholarships
          </h1>
          <h2 style={{ 
            fontSize: '48px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            color: colors.primary,
            lineHeight: '1.2'
          }}>
            Bursaries
          </h2>
          <h2 style={{ 
            fontSize: '48px',
            fontWeight: 'bold',
            margin: '0',
            color: colors.primary,
            lineHeight: '1.2'
          }}>
            Awards
          </h2>
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
