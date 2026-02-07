export default function Home() {
  const colors = {
    background: '#A0DDE6',
    surface: '#80C2AF',
    primary: '#30C5FF',
    accent: '#5C946E',
    textPrimary: '#2A2D34',
    textSecondary: '#2A2D34',
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
