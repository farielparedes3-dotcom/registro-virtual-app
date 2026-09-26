import React from 'react';
import './BottomNav.css';

const BottomNav = ({ activeTab, setActiveTab, currentUser, alertLogs = [], grades = [] }) => {
  // Calculate unread incident alerts for guidance / counselor staff
  const counselorGrades = (currentUser?.role === 'counselor' && currentUser?.assignedGrades && currentUser.assignedGrades.length > 0)
    ? currentUser.assignedGrades
    : grades;
    
  const relevantLogs = (alertLogs || []).filter(log => {
    if (currentUser?.role === 'admin') return true;
    if (currentUser?.role === 'counselor') return counselorGrades.includes(log.grade);
    return true;
  });
  
  const unreadCount = relevantLogs.filter(log => !log.readByCounselor).length;

  const navItems = [
    { key: 'dashboard', label: 'Inicio', icon: '🏠' },
    { key: 'classroom', label: 'Registros', icon: '📖' },
    { key: 'counselor', label: 'Orientación', icon: '🧠' },
    { key: 'incidents', label: 'Reportes', icon: '⚠️', badge: unreadCount },
    { key: 'profile', label: 'Perfil', icon: '👤' },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            type="button"
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.key)}
          >
            <div className="bottom-nav-icon-wrapper">
              <span className="bottom-nav-icon">{item.icon}</span>
              {Boolean(item.badge && item.badge > 0) && (
                <span className="bottom-nav-badge">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
