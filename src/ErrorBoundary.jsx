import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      // ONLY clear session data so user can re-login, NEVER delete student academic records!
      localStorage.removeItem('s_current_user');
    } catch(e) {}
    // Force a full page reload
    window.location.replace(window.location.origin);
  };

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error ? String(this.state.error) : 'Error desconocido';
      const errorStack = this.state.errorInfo ? this.state.errorInfo.componentStack : '';
      
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f4f8',
          color: '#1c2b3d',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
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
            <p style={{ color: '#5d6770', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              Registro de Evaluación Digital — Nagua 14-01
            </p>
            
            {/* Show error details for debugging */}
            <details style={{ 
              textAlign: 'left', 
              marginBottom: '1.5rem', 
              backgroundColor: '#fef2f2', 
              padding: '0.75rem', 
              borderRadius: '8px',
              border: '1px solid #fecaca',
              fontSize: '0.75rem',
              color: '#991b1b',
              maxHeight: '200px',
              overflow: 'auto'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ⚠️ Detalles técnicos del error
              </summary>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>
                {errorMsg}
                {errorStack ? '\n\nComponent Stack:' + errorStack : ''}
              </pre>
            </details>

            <p style={{ color: '#334155', fontSize: '0.85rem', marginBottom: '1.5rem', backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '8px' }}>
              Se detectó un problema. Haz clic para restablecer completamente la aplicación y acceder al portal.
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
              🔑 Restablecer y Acceder al Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
