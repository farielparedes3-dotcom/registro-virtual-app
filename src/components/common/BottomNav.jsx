import React from 'react';

const BottomNav = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { key: 'dashboard', label: 'Inicio', icon: '🏠' },
    { key: 'attendance', label: 'Asistencia', icon: '📅' },
    { key: 'grades', label: 'Calificaciones', icon: '📊' },
    { key: 'reports', label: 'Reportes', icon: '🚨' },
    { key: 'planning', label: 'Planificación', icon: '📝' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100vw',
      height: '60px',
      background: '#ffffff',
      borderTop: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 9999,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.06)'
    }}>
      {navItems.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setActiveTab(item.key)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              cursor: 'pointer',
              color: isActive ? '#1D4ED8' : '#64748B',
              padding: 0
            }}
          >
            <span style={{ fontSize: '1.25rem', marginBottom: '2px' }}>{item.icon}</span>
            <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 700 : 500 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
