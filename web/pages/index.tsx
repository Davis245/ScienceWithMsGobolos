export default function Home() {
  const colors = {
    background: '#F8F9FB',
    surface: '#FFFFFF',
    primary: '#3B6EA8',
    accent: '#7FB9C6',
    textPrimary: '#1F2933',
    textSecondary: '#4B5563',
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '80vh',
      padding: '20px'
    }}>
      <div style={{
        width: '1200px',
        maxWidth: '90%',
        height: '600px',
        backgroundImage: 'url(/SWMG_home.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '0 0 20px 0',
          color: colors.primary,
          textAlign: 'center'
        }}>
          Science With Ms. Gobolos
        </h1>
        
        <p style={{
          fontSize: '24px',
          margin: '0 0 12px 0',
          color: colors.textPrimary,
          textAlign: 'center'
        }}>
          Lake City Secondary School
        </p>
        
        <p style={{
          fontSize: '18px',
          margin: '0',
          color: colors.textSecondary,
          textAlign: 'center'
        }}>
          Room #110 • jeannette.gobolos@sd27.bc.ca • (250) 392-6284
        </p>
      </div>
    </div>
  )
}
