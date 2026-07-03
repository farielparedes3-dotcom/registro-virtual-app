import { useState, useEffect } from 'react';
import './App.css';

const DEFAULT_USERS = [
  { id: 'u1', name: 'Administrador Principal', email: 'admin@school.edu', password: 'admin123', role: 'admin', permissions: ['math', 'science', 'language'], active: true },
  { id: 'u2', name: 'Prof. Mateo (Matemáticas)', email: 'profesor.mate@school.edu', password: 'profe123', role: 'teacher', permissions: ['math'], active: true },
  { id: 'u3', name: 'Prof. Clara (Ciencias)', email: 'profesor.ciencias@school.edu', password: 'profe123', role: 'teacher', permissions: ['science'], active: true },
  { id: 'u4', name: 'Prof. Luis (Lenguaje)', email: 'profesor.lengua@school.edu', password: 'profe123', role: 'teacher', permissions: ['language'], active: true }
];

const DEFAULT_STUDENTS = [
  { id: '1', name: 'Sofía Rodriguez', email: 'sofia.rod@school.edu', grade: '10° A', math: 95, science: 88, language: 92, present: 18, total: 20 },
  { id: '2', name: 'Mateo Gómez', email: 'mateo.gom@school.edu', grade: '10° A', math: 82, science: 90, language: 85, present: 19, total: 20 },
  { id: '3', name: 'Valentina Martínez', email: 'val.mar@school.edu', grade: '10° B', math: 71, science: 75, language: 80, present: 15, total: 20 },
  { id: '4', name: 'Santiago Pérez', email: 'santi.per@school.edu', grade: '10° A', math: 89, science: 92, language: 88, present: 20, total: 20 },
  { id: '5', name: 'Lucía Fernández', email: 'lucia.fer@school.edu', grade: '10° B', math: 60, science: 70, language: 68, present: 17, total: 20 }
];

export default function App() {
  // --- States ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('control_academico_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('control_academico_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('control_academico_students');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Login form inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for creating a student (Admin only)
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    grade: '10° A',
    math: 80,
    science: 80,
    language: 80,
    present: 20,
    total: 20
  });

  // Form state for creating a user (Admin only)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    permissions: [] // math, science, language
  });

  // --- Effects for Syncing with Storage ---
  useEffect(() => {
    localStorage.setItem('control_academico_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('control_academico_current_user', JSON.stringify(currentUser));
      // If current user is modified, update in users list as well
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
      }
    } else {
      localStorage.removeItem('control_academico_current_user');
    }
  }, [currentUser, users]);

  useEffect(() => {
    localStorage.setItem('control_academico_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Handlers ---
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setLoginError('');

    const foundUser = users.find(u => u.email.toLowerCase().trim() === loginEmail.toLowerCase().trim());
    
    if (!foundUser) {
      setLoginError('El correo electrónico no está registrado.');
      return;
    }

    if (foundUser.password !== loginPassword) {
      setLoginError('Contraseña incorrecta.');
      return;
    }

    if (!foundUser.active) {
      setLoginError('Esta cuenta ha sido desactivada por el administrador.');
      return;
    }

    setCurrentUser(foundUser);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleQuickLogin = (email, password) => {
    setLoginEmail(email);
    setLoginPassword(password);
    // Set immediate state change to prevent form submit lag
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setCurrentUser(foundUser);
      setActiveTab('dashboard');
    }
  };

  // --- Student CRUD (Admin only) ---
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (currentUser.role !== 'admin') return;

    if (!newStudent.name || !newStudent.email) {
      alert('Por favor complete el nombre y el correo.');
      return;
    }

    const created = {
      id: Date.now().toString(),
      name: newStudent.name,
      email: newStudent.email,
      grade: newStudent.grade,
      math: Number(newStudent.math) || 0,
      science: Number(newStudent.science) || 0,
      language: Number(newStudent.language) || 0,
      present: Number(newStudent.present) || 0,
      total: Number(newStudent.total) || 0
    };

    setStudents(prev => [...prev, created]);
    setNewStudent({
      name: '',
      email: '',
      grade: '10° A',
      math: 80,
      science: 80,
      language: 80,
      present: 20,
      total: 20
    });
    alert('Estudiante registrado con éxito.');
  };

  const handleDeleteStudent = (id) => {
    if (currentUser.role !== 'admin') return;
    if (window.confirm('¿Está seguro de que desea eliminar este estudiante?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  // --- User / Permissions Management (Admin only) ---
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (currentUser.role !== 'admin') return;

    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Por favor llene todos los campos requeridos.');
      return;
    }

    const emailExists = users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (emailExists) {
      alert('Este correo electrónico ya está registrado.');
      return;
    }

    const createdUser = {
      id: 'u_' + Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      permissions: newUser.role === 'admin' ? ['math', 'science', 'language'] : newUser.permissions,
      active: true
    };

    setUsers(prev => [...prev, createdUser]);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'teacher',
      permissions: []
    });
    alert('Usuario registrado con éxito.');
  };

  const toggleUserActive = (id) => {
    if (currentUser.role !== 'admin') return;
    if (id === currentUser.id) {
      alert('No puedes desactivarte a ti mismo.');
      return;
    }
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, active: !u.active };
      }
      return u;
    }));
  };

  const handleDeleteUser = (id) => {
    if (currentUser.role !== 'admin') return;
    if (id === currentUser.id) {
      alert('No puedes eliminar tu propia cuenta de administrador.');
      return;
    }
    if (window.confirm('¿Está seguro de eliminar a este usuario? Perderá acceso inmediato.')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleUserPermissionChange = (userId, subject) => {
    if (currentUser.role !== 'admin') return;
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const hasPermission = u.permissions.includes(subject);
        const updatedPermissions = hasPermission
          ? u.permissions.filter(p => p !== subject)
          : [...u.permissions, subject];
        return { ...u, permissions: updatedPermissions };
      }
      return u;
    }));
  };

  // --- Grade Updates (Permission Restrained) ---
  const handleUpdateGrade = (studentId, subject, value) => {
    // Check permission
    const hasPermission = currentUser.role === 'admin' || currentUser.permissions.includes(subject);
    if (!hasPermission) return;

    const numericValue = Math.min(100, Math.max(0, Number(value) || 0));
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, [subject]: numericValue };
      }
      return s;
    }));
  };

  const handleUpdateAttendance = (studentId, type) => {
    // Attendance editing: active users only.
    if (!currentUser.active) return;
    
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        let currentPresent = s.present;
        let currentTotal = s.total;

        if (type === 'present') {
          currentPresent = Math.min(currentTotal + 1, currentPresent + 1);
          currentTotal = Math.max(currentPresent, currentTotal);
        } else if (type === 'absent') {
          currentTotal += 1;
        } else if (type === 'reset') {
          currentPresent = 0;
          currentTotal = 0;
        }

        return { ...s, present: currentPresent, total: currentTotal };
      }
      return s;
    }));
  };

  // --- Global Stats Calculations ---
  const totalStudents = students.length;
  const calculateStudentAvg = (s) => ((s.math + s.science + s.language) / 3);

  const globalAverage = totalStudents > 0 
    ? (students.reduce((acc, s) => acc + calculateStudentAvg(s), 0) / totalStudents).toFixed(1)
    : 0;

  const averageAttendance = totalStudents > 0
    ? (students.reduce((acc, s) => acc + (s.total > 0 ? (s.present / s.total) * 100 : 0), 0) / totalStudents).toFixed(1)
    : 0;

  const passingStudents = students.filter(s => calculateStudentAvg(s) >= 70).length;
  const passingRate = totalStudents > 0 ? ((passingStudents / totalStudents) * 100).toFixed(0) : 0;

  const mathAvg = totalStudents > 0 ? (students.reduce((acc, s) => acc + s.math, 0) / totalStudents).toFixed(1) : 0;
  const scienceAvg = totalStudents > 0 ? (students.reduce((acc, s) => acc + s.science, 0) / totalStudents).toFixed(1) : 0;
  const langAvg = totalStudents > 0 ? (students.reduce((acc, s) => acc + s.language, 0) / totalStudents).toFixed(1) : 0;

  // Search filter
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- VIEW: Login Screen ---
  if (!currentUser) {
    return (
      <div className="login-container">
        <div className="login-bg-decor"></div>
        <div className="login-bg-decor-2"></div>
        <div className="glass-panel login-card animate-fade-in">
          <div className="login-header">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
              <span>Control<span>Académico</span></span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Iniciar sesión en el Registro Virtual</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                placeholder="ejemplo@school.edu" 
                className="form-input"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="form-input"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            {loginError && (
              <div style={{ color: 'var(--danger)', fontSize: '0.82rem', marginBottom: '1rem', fontWeight: 550 }}>
                ⚠️ {loginError}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Entrar
            </button>
          </form>

          {/* Quick login / Demo Box */}
          <div className="demo-box">
            <div className="demo-title">Cuentas de prueba rápida</div>
            <div className="demo-buttons">
              <button className="btn-demo" onClick={() => handleQuickLogin('admin@school.edu', 'admin123')}>
                <span className="role">Administrador</span>
                <span className="email">Acceso Total</span>
              </button>
              <button className="btn-demo" onClick={() => handleQuickLogin('profesor.mate@school.edu', 'profe123')}>
                <span className="role">Prof. Matemáticas</span>
                <span className="email">Permiso: Mate</span>
              </button>
              <button className="btn-demo" onClick={() => handleQuickLogin('profesor.ciencias@school.edu', 'profe123')}>
                <span className="role">Prof. Ciencias</span>
                <span className="email">Permiso: Ciencias</span>
              </button>
              <button className="btn-demo" onClick={() => handleQuickLogin('profesor.lengua@school.edu', 'profe123')}>
                <span className="role">Prof. Lenguaje</span>
                <span className="email">Permiso: Lengua</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: Dashboard and App Panels ---
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
          </svg>
          <div>Control<span>Académico</span></div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button className="theme-toggle" onClick={toggleTheme} title="Cambiar Tema">
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>

          {/* User profile / Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.25rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: currentUser.role === 'admin' ? 'var(--primary)' : 'var(--success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 650 }}>{currentUser.name}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {currentUser.role === 'admin' ? 'Administrador' : 'Docente'}
              </span>
            </div>
            <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', marginLeft: '0.5rem' }} onClick={handleLogout}>
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Metric Cards */}
        <div className="stats-grid animate-fade-in">
          <div className="glass-panel stat-card" style={{ padding: '1.25rem' }}>
            <div className="stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{totalStudents}</div>
              <div className="stat-label">Alumnos Registrados</div>
            </div>
          </div>
          <div className="glass-panel stat-card" style={{ padding: '1.25rem' }}>
            <div className="stat-icon" style={{ color: 'var(--warning)', backgroundColor: 'var(--warning-bg)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{globalAverage}/100</div>
              <div className="stat-label">Promedio General</div>
            </div>
          </div>
          <div className="glass-panel stat-card" style={{ padding: '1.25rem' }}>
            <div className="stat-icon" style={{ color: 'var(--success)', backgroundColor: 'var(--success-bg)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{averageAttendance}%</div>
              <div className="stat-label">Asistencia Promedio</div>
            </div>
          </div>
          <div className="glass-panel stat-card" style={{ padding: '1.25rem' }}>
            <div className="stat-icon" style={{ color: 'hsl(170, 75%, 40%)', backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{passingRate}%</div>
              <div className="stat-label">Tasa de Aprobación</div>
            </div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="dashboard-layout">
          
          {/* Navigation Sidebar */}
          <aside className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
            <div className="sidebar-nav">
              <div 
                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                Dashboard
              </div>
              <div 
                className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                Estudiantes
              </div>
              <div 
                className={`nav-item ${activeTab === 'grades' ? 'active' : ''}`}
                onClick={() => setActiveTab('grades')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Calificaciones
              </div>
              <div 
                className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={() => setActiveTab('attendance')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Asistencia
              </div>

              {/* USER MANAGEMENT TAB: Admin Only */}
              {currentUser.role === 'admin' && (
                <div 
                  className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                  style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.5rem', paddingTop: '0.75rem' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <circle cx="12" cy="11" r="3"/>
                    <path d="M8 17a5 5 0 0 1 8 0"/>
                  </svg>
                  Gestión de Usuarios
                </div>
              )}
            </div>
          </aside>

          {/* Tab Screen Display */}
          <section className="content-area animate-fade-in">
            
            {/* 1. Dashboard View */}
            {activeTab === 'dashboard' && (
              <div>
                <h2>Resumen Académico</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Visualización global e indicadores generales del centro.</p>

                <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Rendimiento Promedio por Asignatura</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Matemáticas</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{mathAvg}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${mathAvg}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Ciencias</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{scienceAvg}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${scienceAvg}%`, height: '100%', backgroundColor: 'var(--success)', borderRadius: '4px' }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Lenguaje</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{langAvg}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${langAvg}%`, height: '100%', backgroundColor: 'var(--warning)', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-summary-grid">
                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Estado de Conexión y Rol</h3>
                    <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <p><strong>Usuario Activo:</strong> {currentUser.name}</p>
                      <p><strong>Permisos de Edición:</strong> {
                        currentUser.role === 'admin' 
                          ? <span className="badge badge-success">Acceso Completo (Admin)</span>
                          : currentUser.permissions.map(p => (
                              <span key={p} className="badge badge-success" style={{ marginRight: '0.25rem' }}>
                                {p === 'math' ? 'Matemáticas' : p === 'science' ? 'Ciencias' : 'Lenguaje'}
                              </span>
                            ))
                      }</p>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Exportar Base de Datos</h3>
                    <button className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }} onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ students, users }, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", "Registro_Virtual_Completo.json");
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}>
                      Guardar Copia JSON
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Students Tab */}
            {activeTab === 'students' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h2>Control de Alumnos</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Ficha de inscripción académica.</p>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Buscar estudiante..." 
                    className="form-input" 
                    style={{ maxWidth: '240px', padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: currentUser.role === 'admin' ? '1fr 340px' : '1fr', gap: '1.5rem' }}>
                  
                  {/* Students table */}
                  <div className="custom-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Curso</th>
                          <th>Contacto</th>
                          {currentUser.role === 'admin' && <th>Acción</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map(s => (
                            <tr key={s.id}>
                              <td style={{ fontWeight: 600 }}>{s.name}</td>
                              <td><span className="badge badge-success">{s.grade}</span></td>
                              <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{s.email}</td>
                              {currentUser.role === 'admin' && (
                                <td>
                                  <button className="btn-danger" onClick={() => handleDeleteStudent(s.id)}>
                                    Eliminar
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={currentUser.role === 'admin' ? 4 : 3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                              No hay estudiantes registrados.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Student Form (Admin Only) */}
                  {currentUser.role === 'admin' && (
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                      <h3 style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Inscribir Alumno</h3>
                      <form onSubmit={handleAddStudent}>
                        <div className="form-group">
                          <label>Nombre Completo</label>
                          <input 
                            type="text" 
                            className="form-input"
                            value={newStudent.name}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Correo Electrónico</label>
                          <input 
                            type="email" 
                            className="form-input"
                            value={newStudent.email}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Grado / Curso</label>
                          <select 
                            className="form-select"
                            value={newStudent.grade}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, grade: e.target.value }))}
                          >
                            <option value="10° A">10° A</option>
                            <option value="10° B">10° B</option>
                            <option value="11° A">11° A</option>
                          </select>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                          Guardar Registro
                        </button>
                      </form>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* 3. Grades Tab (Permission Controlled) */}
            {activeTab === 'grades' && (
              <div>
                <h2>Control de Notas</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {currentUser.role === 'admin' 
                    ? 'Acceso total de edición académica.' 
                    : 'Solo puedes modificar las asignaturas asignadas a tu cuenta de docente.'
                  }
                </p>

                <div className="custom-table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th>Grado</th>
                        <th>
                          Matemáticas 
                          {!(currentUser.role === 'admin' || currentUser.permissions.includes('math')) && ' (Bloqueado)'}
                        </th>
                        <th>
                          Ciencias 
                          {!(currentUser.role === 'admin' || currentUser.permissions.includes('science')) && ' (Bloqueado)'}
                        </th>
                        <th>
                          Lenguaje 
                          {!(currentUser.role === 'admin' || currentUser.permissions.includes('language')) && ' (Bloqueado)'}
                        </th>
                        <th>Promedio</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const avg = calculateStudentAvg(s);
                        const isPassing = avg >= 70;
                        
                        const canEditMath = currentUser.role === 'admin' || currentUser.permissions.includes('math');
                        const canEditScience = currentUser.role === 'admin' || currentUser.permissions.includes('science');
                        const canEditLanguage = currentUser.role === 'admin' || currentUser.permissions.includes('language');

                        return (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                            <td><span className="badge badge-success">{s.grade}</span></td>
                            
                            {/* Math Column */}
                            <td>
                              <input 
                                type="number" 
                                className="form-input" 
                                style={{ padding: '0.4rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                value={s.math}
                                disabled={!canEditMath}
                                onChange={(e) => handleUpdateGrade(s.id, 'math', e.target.value)}
                              />
                            </td>

                            {/* Science Column */}
                            <td>
                              <input 
                                type="number" 
                                className="form-input" 
                                style={{ padding: '0.4rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                value={s.science}
                                disabled={!canEditScience}
                                onChange={(e) => handleUpdateGrade(s.id, 'science', e.target.value)}
                              />
                            </td>

                            {/* Language Column */}
                            <td>
                              <input 
                                type="number" 
                                className="form-input" 
                                style={{ padding: '0.4rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                value={s.language}
                                disabled={!canEditLanguage}
                                onChange={(e) => handleUpdateGrade(s.id, 'language', e.target.value)}
                              />
                            </td>

                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{avg.toFixed(1)}</td>
                            <td>
                              <span className={`badge ${isPassing ? 'badge-success' : 'badge-danger'}`}>
                                {isPassing ? 'Aprobado' : 'Reprobado'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Attendance Tab */}
            {activeTab === 'attendance' && (
              <div>
                <h2>Control de Asistencia Diario</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Registro de días presenciales sobre el ciclo.</p>

                <div className="custom-table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th>Grado</th>
                        <th>Días Presente</th>
                        <th>Días Totales</th>
                        <th>Asistencia</th>
                        <th>Registro Rápido Hoy</th>
                        <th>Reset</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const percent = s.total > 0 ? ((s.present / s.total) * 100).toFixed(0) : 0;
                        return (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                            <td><span className="badge badge-success">{s.grade}</span></td>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>{s.present} días</td>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>{s.total} días</td>
                            <td>
                              <span className={`badge ${percent >= 85 ? 'badge-success' : 'badge-warning'}`}>
                                {percent}%
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleUpdateAttendance(s.id, 'present')}>
                                  Presente
                                </button>
                                <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleUpdateAttendance(s.id, 'absent')}>
                                  Ausente
                                </button>
                              </div>
                            </td>
                            <td>
                              <button className="btn-danger" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }} onClick={() => handleUpdateAttendance(s.id, 'reset')}>
                                Reiniciar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. User & Permissions Management (Admin Only) */}
            {activeTab === 'users' && currentUser.role === 'admin' && (
              <div>
                <h2>Gestión de Usuarios y Permisos</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Crea accesos y define a qué materias puede ingresar cada docente.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem' }}>
                  
                  {/* Users table */}
                  <div className="custom-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Nombre y Correo</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th>Materias Habilitadas</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{u.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clave: {u.password}</div>
                            </td>
                            <td>
                              <span className="badge" style={{ backgroundColor: u.role === 'admin' ? 'var(--primary-glow)' : 'var(--border-color)', color: 'var(--text-primary)' }}>
                                {u.role === 'admin' ? 'Administrador' : 'Docente'}
                              </span>
                            </td>
                            <td>
                              <button 
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                onClick={() => toggleUserActive(u.id)}
                              >
                                {u.active ? (
                                  <span className="user-status-active">
                                    <span className="user-status-dot" style={{ backgroundColor: 'var(--success)' }}></span>
                                    Activo
                                  </span>
                                ) : (
                                  <span className="user-status-inactive">
                                    <span className="user-status-dot" style={{ backgroundColor: 'var(--text-muted)' }}></span>
                                    Inactivo
                                  </span>
                                )}
                              </button>
                            </td>
                            <td>
                              {u.role === 'admin' ? (
                                <span className="read-only-badge">Acceso Completo</span>
                              ) : (
                                <div className="permissions-container" style={{ margin: 0, padding: '0.4rem' }}>
                                  <label className="permission-checkbox-label">
                                    <input 
                                      type="checkbox" 
                                      checked={u.permissions.includes('math')}
                                      onChange={() => handleUserPermissionChange(u.id, 'math')}
                                    />
                                    <span>Matemáticas</span>
                                  </label>
                                  <label className="permission-checkbox-label">
                                    <input 
                                      type="checkbox" 
                                      checked={u.permissions.includes('science')}
                                      onChange={() => handleUserPermissionChange(u.id, 'science')}
                                    />
                                    <span>Ciencias</span>
                                  </label>
                                  <label className="permission-checkbox-label">
                                    <input 
                                      type="checkbox" 
                                      checked={u.permissions.includes('language')}
                                      onChange={() => handleUserPermissionChange(u.id, 'language')}
                                    />
                                    <span>Lenguaje</span>
                                  </label>
                                </div>
                              )}
                            </td>
                            <td>
                              <button 
                                className="btn-danger" 
                                disabled={u.id === currentUser.id}
                                onClick={() => handleDeleteUser(u.id)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add User Form */}
                  <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
                    <h3 style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Agregar Nuevo Usuario</h3>
                    <form onSubmit={handleCreateUser}>
                      <div className="form-group">
                        <label>Nombre del Docente</label>
                        <input 
                          type="text" 
                          placeholder="Ej. Prof. Carmen" 
                          className="form-input"
                          value={newUser.name}
                          onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input 
                          type="email" 
                          placeholder="carmen@school.edu" 
                          className="form-input"
                          value={newUser.email}
                          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Contraseña</label>
                        <input 
                          type="text" 
                          placeholder="clave123" 
                          className="form-input"
                          value={newUser.password}
                          onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Rol de Usuario</label>
                        <select 
                          className="form-select"
                          value={newUser.role}
                          onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value, permissions: [] }))}
                        >
                          <option value="teacher">Docente (Permisos limitados)</option>
                          <option value="admin">Administrador (Acceso total)</option>
                        </select>
                      </div>

                      {newUser.role === 'teacher' && (
                        <div className="form-group">
                          <label>Materias Iniciales Habilitadas</label>
                          <div className="permissions-container">
                            <label className="permission-checkbox-label">
                              <input 
                                type="checkbox" 
                                checked={newUser.permissions.includes('math')}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setNewUser(prev => ({
                                    ...prev,
                                    permissions: checked ? [...prev.permissions, 'math'] : prev.permissions.filter(p => p !== 'math')
                                  }));
                                }}
                              />
                              <span>Matemáticas</span>
                            </label>
                            <label className="permission-checkbox-label">
                              <input 
                                type="checkbox" 
                                checked={newUser.permissions.includes('science')}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setNewUser(prev => ({
                                    ...prev,
                                    permissions: checked ? [...prev.permissions, 'science'] : prev.permissions.filter(p => p !== 'science')
                                  }));
                                }}
                              />
                              <span>Ciencias</span>
                            </label>
                            <label className="permission-checkbox-label">
                              <input 
                                type="checkbox" 
                                checked={newUser.permissions.includes('language')}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setNewUser(prev => ({
                                    ...prev,
                                    permissions: checked ? [...prev.permissions, 'language'] : prev.permissions.filter(p => p !== 'language')
                                  }));
                                }}
                              />
                              <span>Lenguaje</span>
                            </label>
                          </div>
                        </div>
                      )}

                      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.25rem' }}>
                        Crear Cuenta
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            )}

          </section>

        </div>

      </main>

      <footer style={{ marginTop: 'auto', padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <p>&copy; {new Date().getFullYear()} Control Académico - Registro Digital Virtual. Diseñado con tecnologías Web Premium.</p>
      </footer>
    </div>
  );
}
