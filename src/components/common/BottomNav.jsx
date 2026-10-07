import React from 'react';

const BottomNav = ({ activeTab, setActiveTab, onMoreClick }) => {
  const navItems = [
    { key: 'dashboard', label: 'Inicio', icon: '🏠' },
    { key: 'profile', label: 'Perfil', icon: '👤' },
    { key: 'attendance', label: 'Asistencia', icon: '📝' },
    { key: 'grades', label: 'Calificaciones', icon: '📊' },
    { key: 'more', label: 'Más', icon: '⋯' },
  ];

  return (
    <nav className="bottom-nav mobile-only-nav">
      {navItems.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              if (item.key === 'more') {
                if (onMoreClick) onMoreClick();
                else setActiveTab('planning');
              } else {
                setActiveTab(item.key);
              }
            }}
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
              color: isActive ? '#0F2A4A' : '#64748B',
              padding: 0
            }}
          >
            <span style={{ fontSize: '1.25rem', marginBottom: '2px' }}>{item.icon}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: isActive ? 700 : 500 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
