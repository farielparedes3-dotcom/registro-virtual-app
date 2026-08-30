import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      // Clear ALL app-specific localStorage keys to remove corrupted data
      const keysToRemove = Object.keys(localStorage).filter(k => k.startsWith('s_'));
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch(e) {}
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          backgroundColor: '#f0f4f8',
          color: '#1c2b3d',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '2.5rem 2rem',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '1px solid #cfd8dc',
            boxSizing: 'border-box'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
            <h2 style={{ color: '#003876', margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 800 }}>
              LICEO ANA ROSA CASTILLO
            </h2>
            <p style={{ color: '#5d6770', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Registro de Evaluación Digital — Nagua 14-01
            </p>
            <p style={{ color: '#334155', fontSize: '0.85rem', marginBottom: '1.5rem', backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '8px' }}>
              La sesión ha sido restablecida. Haz clic a continuación para cargar la pantalla de acceso.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#003876',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50px',
                padding: '0.85rem 1.75rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 56, 118, 0.2)'
              }}
            >
              🔑 Ir al Acceso de Usuario
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
