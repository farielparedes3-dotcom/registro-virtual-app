import { useState, useEffect } from 'react';
import './App.css';

// Global configuration
const SUBJECTS = {
  math: { name: 'Matemáticas', color: 'var(--primary)', bg: 'var(--primary-glow)' },
  science: { name: 'Ciencias', color: 'var(--success)', bg: 'var(--success-bg)' },
  language: { name: 'Lenguaje', color: 'var(--warning)', bg: 'var(--warning-bg)' },
  history: { name: 'Historia', color: 'hsl(170, 75%, 40%)', bg: 'rgba(20, 184, 166, 0.1)' }
};

const DEFAULT_USERS = [
  { 
    id: 'u1', 
    name: 'Administrador Principal', 
    email: 'admin@school.edu', 
    password: 'admin123', 
    role: 'admin', 
    assignments: [], // Admin bypasses assignments (has access to all)
    active: true 
  },
  { 
    id: 'u2', 
    name: 'Prof. Mateo Gómez', 
    email: 'profesor.mate@school.edu', 
    password: 'profe123', 
    role: 'teacher', 
    assignments: [
      { grade: '1ro A', subject: 'math' },
      { grade: '10° A', subject: 'math' },
      { grade: '1ro A', subject: 'history' }
    ],
    active: true 
  },
  { 
    id: 'u3', 
    name: 'Prof. Clara Ruiz', 
    email: 'profesor.ciencias@school.edu', 
    password: 'profe123', 
    role: 'teacher', 
    assignments: [
      { grade: '1ro A', subject: 'science' },
      { grade: '10° B', subject: 'science' }
    ], 
    active: true 
  },
  { 
    id: 'u4', 
    name: 'Prof. Luis Castro', 
    email: 'profesor.lengua@school.edu', 
    password: 'profe123', 
    role: 'teacher', 
    assignments: [
      { grade: '1ro B', subject: 'language' },
      { grade: '10° A', subject: 'language' }
    ], 
    active: true 
  }
];

const DEFAULT_STUDENTS = [
  // 1ro A
  { id: 's1', name: 'Sofía Rodriguez', email: 'sofia.rod@school.edu', grade: '1ro A', math: 95, science: 88, language: 92, history: 90, present: 18, total: 20 },
  { id: 's2', name: 'Santiago Pérez', email: 'santi.per@school.edu', grade: '1ro A', math: 89, science: 92, language: 88, history: 85, present: 20, total: 20 },
  { id: 's3', name: 'Carlos Mendoza', email: 'carlos.men@school.edu', grade: '1ro A', math: 75, science: 80, language: 78, history: 74, present: 16, total: 20 },
  
  // 1ro B
  { id: 's4', name: 'Ana Ruiz', email: 'ana.ruiz@school.edu', grade: '1ro B', math: 88, science: 84, language: 95, history: 89, present: 19, total: 20 },
  
  // 10° A
  { id: 's5', name: 'Mateo Gómez', email: 'mateo.gom@school.edu', grade: '10° A', math: 82, science: 90, language: 85, history: 80, present: 19, total: 20 },
  { id: 's6', name: 'Juan Castro', email: 'juan.cas@school.edu', grade: '10° A', math: 65, science: 70, language: 72, history: 68, present: 15, total: 20 },

  // 10° B
  { id: 's7', name: 'Valentina Martínez', email: 'val.mar@school.edu', grade: '10° B', math: 71, science: 75, language: 80, history: 85, present: 15, total: 20 },
  { id: 's8', name: 'Lucía Fernández', email: 'lucia.fer@school.edu', grade: '10° B', math: 60, science: 70, language: 68, history: 72, present: 17, total: 20 }
];

const DEFAULT_EVENTS = [
  { id: 'e1', date: '2026-07-03', title: 'Reunión de Padres', desc: 'Reunión general para entrega de informes parciales.', type: 'danger' },
  { id: 'e2', date: '2026-07-10', title: 'Examen Matemáticas', desc: 'Evaluación parcial de primer grado A.', type: 'primary' },
  { id: 'e3', date: '2026-07-15', title: 'Feria de Ciencias', desc: 'Presentación de proyectos científicos para 10° grado.', type: 'success' },
  { id: 'e4', date: '2026-07-24', title: 'Entrega Proy. Historia', desc: 'Límite para cargar el informe del periodo en Historia.', type: 'warning' }
];

export default function App() {
  // --- Core States ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('school_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('school_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('school_students');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
  });

  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem('school_events');
    return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // --- Teacher UI Filter States ---
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // --- Admin UI Filter States ---
  const [activeAdminGrade, setActiveAdminGrade] = useState('1ro A');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  // --- Add Student Form Inputs (Admin) ---
  const [studentForm, setStudentForm] = useState({ name: '', email: '' });

  // --- Add Teacher/User Form Inputs (Admin) ---
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', password: '', role: 'teacher' });
  const [newAssignment, setNewAssignment] = useState({ grade: '1ro A', subject: 'math' });

  // --- Add Event Form Inputs (Admin) ---
  const [newEvent, setNewEvent] = useState({ date: '2026-07-01', title: '', desc: '', type: 'primary' });

  // --- Evaluation Weights State ---
  const [weights, setWeights] = useState({ exam: 40, project: 30, homework: 20, attendance: 10 });
  const [weightErrors, setWeightErrors] = useState('');
  
  // Weighted calculator temporary state
  const [calcScores, setCalcScores] = useState({ exam: '', project: '', homework: '', attendance: '' });
  const [calcResult, setCalcResult] = useState(null);

  // --- Sync Effects ---
  useEffect(() => {
    localStorage.setItem('school_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('school_current_user', JSON.stringify(currentUser));
      // Refresh current user if modified in main list
      const latestUser = users.find(u => u.id === currentUser.id);
      if (latestUser && JSON.stringify(latestUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(latestUser);
      }
    } else {
      localStorage.removeItem('school_current_user');
    }
  }, [currentUser, users]);

  useEffect(() => {
    localStorage.setItem('school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('school_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Set default selected grade/subject for teacher when logged in
  useEffect(() => {
    if (currentUser && currentUser.role === 'teacher') {
      const uniqueGrades = [...new Set(currentUser.assignments.map(a => a.grade))];
      if (uniqueGrades.length > 0) {
        setSelectedGrade(uniqueGrades[0]);
      }
    }
  }, [currentUser]);

  // When selectedGrade changes, automatically set selectedSubject to the first subject available in that grade
  useEffect(() => {
    if (currentUser && currentUser.role === 'teacher' && selectedGrade) {
      const gradeSubjects = currentUser.assignments
        .filter(a => a.grade === selectedGrade)
        .map(a => a.subject);
      if (gradeSubjects.length > 0) {
        setSelectedSubject(gradeSubjects[0]);
      }
    }
  }, [selectedGrade, currentUser]);

  // --- Handlers ---
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (e) => {
    e.preventDefault();
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
    setSelectedGrade('');
    setSelectedSubject('');
    setActiveTab('dashboard');
  };

  const handleQuickLogin = (email, password) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setCurrentUser(foundUser);
      setActiveTab('dashboard');
    }
  };

  // --- Admin Student Registration ---
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (currentUser.role !== 'admin') return;

    if (!studentForm.name || !studentForm.email) {
      alert('Por favor llene los campos requeridos.');
      return;
    }

    const created = {
      id: 's_' + Date.now().toString(),
      name: studentForm.name,
      email: studentForm.email,
      grade: activeAdminGrade,
      math: 80,
      science: 80,
      language: 80,
      history: 80,
      present: 20,
      total: 20
    };

    setStudents(prev => [...prev, created]);
    setStudentForm({ name: '', email: '' });
    alert(`Alumno agregado exitosamente a ${activeAdminGrade}. Se replicará en todas las materias.`);
  };

  const handleDeleteStudent = (id) => {
    if (currentUser.role !== 'admin') return;
    if (window.confirm('¿Está seguro de eliminar este alumno?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  // --- Admin Teacher Management ---
  const handleCreateTeacher = (e) => {
    e.preventDefault();
    if (currentUser.role !== 'admin') return;

    if (!teacherForm.name || !teacherForm.email || !teacherForm.password) {
      alert('Por favor llene todos los campos del docente.');
      return;
    }

    const exists = users.some(u => u.email.toLowerCase() === teacherForm.email.toLowerCase());
    if (exists) {
      alert('Este correo electrónico ya está en uso.');
      return;
    }

    const created = {
      id: 'u_' + Date.now().toString(),
      name: teacherForm.name,
      email: teacherForm.email,
      password: teacherForm.password,
      role: teacherForm.role,
      assignments: [], // start empty
      active: true
    };

    setUsers(prev => [...prev, created]);
    setTeacherForm({ name: '', email: '', password: '', role: 'teacher' });
    alert('Usuario creado con éxito. Ahora puedes añadir asignaciones.');
  };

  const handleAddAssignment = (userId) => {
    if (currentUser.role !== 'admin') return;

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        // Avoid duplicate assignments
        const exists = u.assignments.some(
          a => a.grade === newAssignment.grade && a.subject === newAssignment.subject
        );
        if (exists) {
          alert('Este docente ya tiene asignada esta materia en este grado.');
          return u;
        }
        return {
          ...u,
          assignments: [...u.assignments, { ...newAssignment }]
        };
      }
      return u;
    }));
  };

  const handleRemoveAssignment = (userId, indexToRemove) => {
    if (currentUser.role !== 'admin') return;
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          assignments: u.assignments.filter((_, idx) => idx !== indexToRemove)
        };
      }
      return u;
    }));
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
    if (id === currentUser.id) return;
    if (window.confirm('¿Eliminar esta cuenta permanentemente?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  // --- Grade Updates ---
  const handleUpdateGrade = (studentId, subject, value) => {
    // Permission check: admin has total access, teacher must have the matching assignment
    const canEdit = currentUser.role === 'admin' || (
      currentUser.role === 'teacher' && 
      currentUser.assignments.some(a => a.grade === selectedGrade && a.subject === subject)
    );

    if (!canEdit) return;

    const numeric = Math.min(100, Math.max(0, Number(value) || 0));
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, [subject]: numeric };
      }
      return s;
    }));
  };

  // --- Calendar Event Management ---
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (currentUser.role !== 'admin') return;

    if (!newEvent.title) {
      alert('Por favor especifica un título.');
      return;
    }

    const created = {
      id: 'ev_' + Date.now().toString(),
      date: newEvent.date,
      title: newEvent.title,
      desc: newEvent.desc,
      type: newEvent.type
    };

    setCalendarEvents(prev => [...prev, created]);
    setNewEvent({ date: '2026-07-01', title: '', desc: '', type: 'primary' });
    alert('Evento escolar agendado.');
  };

  const handleDeleteEvent = (id) => {
    if (currentUser.role !== 'admin') return;
    setCalendarEvents(prev => prev.filter(ev => ev.id !== id));
  };

  // --- Instruments Weighing Calculation ---
  const handleUpdateWeights = (e) => {
    e.preventDefault();
    const sum = Number(weights.exam) + Number(weights.project) + Number(weights.homework) + Number(weights.attendance);
    if (sum !== 100) {
      setWeightErrors(`La suma de los porcentajes debe ser exactamente 100%. Actualmente es ${sum}%.`);
      return;
    }
    setWeightErrors('');
    alert('Ponderaciones guardadas correctamente para la sesión.');
  };

  const handleCalculatorRun = (e) => {
    e.preventDefault();
    const examRaw = Number(calcScores.exam) || 0;
    const projectRaw = Number(calcScores.project) || 0;
    const homeworkRaw = Number(calcScores.homework) || 0;
    const attendanceRaw = Number(calcScores.attendance) || 0;

    const result = (
      (examRaw * (weights.exam / 100)) +
      (projectRaw * (weights.project / 100)) +
      (homeworkRaw * (weights.homework / 100)) +
      (attendanceRaw * (weights.attendance / 100))
    ).toFixed(1);

    setCalcResult(result);
  };

  // --- Filter Logic helper arrays ---
  const teacherUniqueGrades = currentUser && currentUser.role === 'teacher'
    ? [...new Set(currentUser.assignments.map(a => a.grade))]
    : [];

  const teacherGradeSubjects = currentUser && currentUser.role === 'teacher' && selectedGrade
    ? currentUser.assignments.filter(a => a.grade === selectedGrade).map(a => a.subject)
    : [];

  const studentsFilteredByGrade = selectedGrade
    ? students.filter(s => s.grade === selectedGrade)
    : students;

  // --- Global Stats counts ---
  const adminStudentCount = students.length;
  const adminStudentAvg = adminStudentCount > 0 
    ? (students.reduce((acc, s) => acc + ((s.math + s.science + s.language + s.history) / 4), 0) / adminStudentCount).toFixed(1)
    : 0;

  // --- VIEW: Login ---
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

          <div className="demo-box">
            <div className="demo-title">Cuentas de prueba rápida</div>
            <div className="demo-buttons">
              <button className="btn-demo" onClick={() => handleQuickLogin('admin@school.edu', 'admin123')}>
                <span className="role">Administrador</span>
                <span className="email">Acceso Total</span>
              </button>
              <button className="btn-demo" onClick={() => handleQuickLogin('profesor.mate@school.edu', 'profe123')}>
                <span className="role">Prof. Mateo (Mate)</span>
                <span className="email">Mate/Historia en 1roA</span>
              </button>
              <button className="btn-demo" onClick={() => handleQuickLogin('profesor.ciencias@school.edu', 'profe123')}>
                <span className="role">Prof. Clara (Ciencias)</span>
                <span className="email">Ciencias 1roA / 10°B</span>
              </button>
              <button className="btn-demo" onClick={() => handleQuickLogin('profesor.lengua@school.edu', 'profe123')}>
                <span className="role">Prof. Luis (Lengua)</span>
                <span className="email">Lengua 1roB / 10°A</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: Admin Dashboard ---
  if (currentUser.role === 'admin') {
    return (
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
            </svg>
            <div>Control<span>Académico</span> <span className="read-only-badge" style={{ verticalAlign: 'middle', marginLeft: '0.5rem' }}>Admin</span></div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button className="theme-toggle" onClick={toggleTheme} title="Cambiar Tema">
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                </svg>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.25rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                AD
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 650 }}>{currentUser.name}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Administrador Principal</span>
              </div>
              <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', marginLeft: '0.5rem' }} onClick={handleLogout}>
                Salir
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Layout */}
        <div className="main-content">
          <div className="dashboard-layout">
            
            {/* Admin Sidebar */}
            <aside className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
              <div className="sidebar-nav">
                <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                  Dashboard Global
                </div>
                <div className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>
                  Asignación Docentes
                </div>
                <div className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
                  Estudiantes por Grado
                </div>
                <div className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
                  Calendario Escolar
                </div>
                <div className={`nav-item ${activeTab === 'instructions' ? 'active' : ''}`} onClick={() => setActiveTab('instructions')}>
                  Manual / Instructivo
                </div>
              </div>
            </aside>

            {/* Admin Content Area */}
            <section className="content-area animate-fade-in">
              
              {/* ADMIN: Tab Dashboard */}
              {activeTab === 'dashboard' && (
                <div>
                  <h2>Vista General del Administrador</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Estadísticas globales de la escuela.</p>

                  <div className="stats-grid">
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <h3>{adminStudentCount}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Alumnos</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <h3>{users.filter(u => u.role === 'teacher').length}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Profesores Registrados</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <h3>{adminStudentAvg}%</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rendimiento Promedio</p>
                    </div>
                  </div>

                  <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Resumen por Asignatura</h3>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none' }}>
                      <li>Matemáticas: <strong>{mathAvg}%</strong></li>
                      <li>Ciencias: <strong>{scienceAvg}%</strong></li>
                      <li>Lenguaje: <strong>{langAvg}%</strong></li>
                      <li>Historia: <strong>{langAvg}%</strong></li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ADMIN: Tab Teachers (Docentes y Asignaciones) */}
              {activeTab === 'teachers' && (
                <div>
                  <h2>Docentes y Asignación de Materias/Grados</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Administra la planilla de profesores y vincula en qué grados y materias dictan clases.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
                    
                    {/* List of Teachers */}
                    <div className="custom-table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Docente</th>
                            <th>Estado</th>
                            <th>Grados y Asignaturas Asignadas</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.filter(u => u.role === 'teacher').map(u => (
                            <tr key={u.id}>
                              <td>
                                <div style={{ fontWeight: 600 }}>{u.name}</div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Contraseña: {u.password}</div>
                              </td>
                              <td>
                                <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }} onClick={() => toggleUserActive(u.id)}>
                                  {u.active ? 'Activo' : 'Inactivo'}
                                </button>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                  {u.assignments.length > 0 ? (
                                    u.assignments.map((a, idx) => (
                                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                                        <span><strong>{a.grade}</strong> - {SUBJECTS[a.subject].name}</span>
                                        <button 
                                          style={{ border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 'bold' }}
                                          onClick={() => handleRemoveAssignment(u.id, idx)}
                                          title="Remover"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sin asignaciones de materias.</span>
                                  )}
                                  
                                  {/* Add assignment inline */}
                                  <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
                                    <select 
                                      className="form-select" 
                                      style={{ padding: '0.25rem', fontSize: '0.78rem' }}
                                      value={newAssignment.grade}
                                      onChange={(e) => setNewAssignment(prev => ({ ...prev, grade: e.target.value }))}
                                    >
                                      <option value="1ro A">1ro A</option>
                                      <option value="1ro B">1ro B</option>
                                      <option value="10° A">10° A</option>
                                      <option value="10° B">10° B</option>
                                    </select>
                                    <select 
                                      className="form-select" 
                                      style={{ padding: '0.25rem', fontSize: '0.78rem' }}
                                      value={newAssignment.subject}
                                      onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}
                                    >
                                      <option value="math">Matemáticas</option>
                                      <option value="science">Ciencias</option>
                                      <option value="language">Lenguaje</option>
                                      <option value="history">Historia</option>
                                    </select>
                                    <button 
                                      className="btn-primary" 
                                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                      onClick={() => handleAddAssignment(u.id)}
                                    >
                                      Asignar
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <button className="btn-danger" onClick={() => handleDeleteUser(u.id)}>Eliminar</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Create Teacher Form */}
                    <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
                      <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Registrar Docente</h3>
                      <form onSubmit={handleCreateTeacher}>
                        <div className="form-group">
                          <label>Nombre del Docente</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={teacherForm.name} 
                            onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>Correo Electrónico</label>
                          <input 
                            type="email" 
                            className="form-input" 
                            value={teacherForm.email} 
                            onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>Contraseña</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={teacherForm.password} 
                            onChange={(e) => setTeacherForm(prev => ({ ...prev, password: e.target.value }))}
                            required 
                          />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                          Crear Cuenta
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              )}

              {/* ADMIN: Tab Students (Inscripción por Grados y replicación automática) */}
              {activeTab === 'students' && (
                <div>
                  <h2>Planilla de Estudiantes por Grado</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Agrega los alumnos a un Grado/Curso. Automáticamente pertenecerán a todas las asignaturas de ese grado.
                  </p>

                  {/* Filter grade bar */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {['1ro A', '1ro B', '10° A', '10° B'].map(g => (
                      <button 
                        key={g} 
                        className={`btn-secondary ${activeAdminGrade === g ? 'btn-primary' : ''}`}
                        style={{ padding: '0.5rem 1rem', fontWeight: 600 }}
                        onClick={() => setActiveAdminGrade(g)}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
                    
                    {/* Students list */}
                    <div className="custom-table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Correo de Contacto</th>
                            <th>Grado</th>
                            <th>Materias Habilitadas en Grado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.filter(s => s.grade === activeAdminGrade).map(s => (
                            <tr key={s.id}>
                              <td style={{ fontWeight: 600 }}>{s.name}</td>
                              <td style={{ color: 'var(--text-secondary)' }}>{s.email}</td>
                              <td><span className="badge badge-success">{s.grade}</span></td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                  {Object.keys(SUBJECTS).map(subKey => (
                                    <span key={subKey} className="badge" style={{ backgroundColor: SUBJECTS[subKey].bg, color: SUBJECTS[subKey].color, fontSize: '0.72rem' }}>
                                      {SUBJECTS[subKey].name}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <button className="btn-danger" style={{ padding: '0.35rem 0.75rem' }} onClick={() => handleDeleteStudent(s.id)}>
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                          {students.filter(s => s.grade === activeAdminGrade).length === 0 && (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                No hay estudiantes inscritos en {activeAdminGrade}.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Add student to current grade */}
                    <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
                      <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        Inscribir en {activeAdminGrade}
                      </h3>
                      <form onSubmit={handleAddStudent}>
                        <div className="form-group">
                          <label>Nombre Completo del Alumno</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={studentForm.name} 
                            onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>Correo Electrónico</label>
                          <input 
                            type="email" 
                            className="form-input" 
                            value={studentForm.email} 
                            onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                            required 
                          />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                          Inscribir Alumno
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              )}

              {/* ADMIN: Tab Calendar */}
              {activeTab === 'calendar' && (
                <div>
                  <h2>Calendario Escolar</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Configura exámenes y eventos de la institución.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                      <div className="calendar-grid">
                        {/* Day headers */}
                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                          <div key={d} className="calendar-day-header">{d}</div>
                        ))}
                        {/* Simple rendering for July 2026 (Starts on Wed=index 3) */}
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="calendar-day-cell other-month"></div>
                        ))}
                        {Array.from({ length: 31 }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const dateString = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                          const dayEvents = calendarEvents.filter(ev => ev.date === dateString);

                          return (
                            <div key={dayNum} className="calendar-day-cell">
                              <span className="calendar-day-number">{dayNum}</span>
                              <div className="calendar-day-events">
                                {dayEvents.map(ev => (
                                  <div key={ev.id} className={`calendar-event-dot ${ev.type}`} title={ev.desc}>
                                    {ev.title}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Add Event Form */}
                    <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
                      <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Agendar Evento</h3>
                      <form onSubmit={handleAddEvent}>
                        <div className="form-group">
                          <label>Fecha</label>
                          <input 
                            type="date" 
                            className="form-input" 
                            value={newEvent.date} 
                            onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>Título del Evento</label>
                          <input 
                            type="text" 
                            placeholder="Ej. Parcial de Matemáticas" 
                            className="form-input" 
                            value={newEvent.title} 
                            onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>Descripción</label>
                          <textarea 
                            className="form-input" 
                            style={{ height: '70px', resize: 'none' }} 
                            value={newEvent.desc} 
                            onChange={(e) => setNewEvent(prev => ({ ...prev, desc: e.target.value }))}
                          />
                        </div>
                        <div className="form-group">
                          <label>Categoría</label>
                          <select 
                            className="form-select" 
                            value={newEvent.type} 
                            onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                          >
                            <option value="primary">Académico (Azul)</option>
                            <option value="success">Evento Social (Verde)</option>
                            <option value="warning">Urgente (Amarillo)</option>
                            <option value="danger">Administrativo (Rojo)</option>
                          </select>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                          Registrar en Calendario
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN: Tab Instructions (Instructivo) */}
              {activeTab === 'instructions' && (
                <div>
                  <h2>Manual de Uso del Administrador</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Guía rápida para la configuración completa de la plataforma.</p>

                  <div className="glass-card instruction-card">
                    <div className="instruction-step">
                      <div className="instruction-step-num">1</div>
                      <div>
                        <strong>Crear Cuentas de Docentes</strong>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Ve a la pestaña <em>Asignación Docentes</em> y registra a los profesores de la institución.
                        </p>
                      </div>
                    </div>
                    <div className="instruction-step">
                      <div className="instruction-step-num">2</div>
                      <div>
                        <strong>Asignar Grados y Materias por Docente</strong>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          En la misma pestaña, selecciona el grado y la materia en el selector de cada docente y haz clic en "Asignar". Un docente puede tener múltiples asignaciones (por ejemplo, dictar Matemáticas en 1ro A y Ciencias en 10° B).
                        </p>
                      </div>
                    </div>
                    <div className="instruction-step">
                      <div className="instruction-step-num">3</div>
                      <div>
                        <strong>Inscribir Alumnos por Grados</strong>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Ve a <em>Estudiantes por Grado</em>, selecciona el grado deseado (ej. 1ro A) e inscribe a los alumnos. Estos alumnos se replicarán automáticamente en todas las materias de ese grado. El docente verá a estos alumnos de inmediato al ingresar.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </section>

          </div>
        </div>

        <footer style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <p>&copy; {new Date().getFullYear()} Control Académico - Registro Digital Virtual. Administrador Principal.</p>
        </footer>
      </div>
    );
  }

  // --- VIEW: Teacher Dashboard ---
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
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              </svg>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.25rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'var(--success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {currentUser.name.slice(0,2).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 650 }}>{currentUser.name}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Docente</span>
            </div>
            <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', marginLeft: '0.5rem' }} onClick={handleLogout}>
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Layout content */}
      <div className="main-content">
        <div className="dashboard-layout">
          
          {/* Teacher Sidebar Menu (Left Sidebar) */}
          <aside className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
            <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Seleccionar Curso / Grado
              </label>
              <select 
                className="form-select" 
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setActiveTab('grades'); // auto switch to grades view
                }}
              >
                {teacherUniqueGrades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
                {teacherUniqueGrades.length === 0 && (
                  <option value="">Sin grados asignados</option>
                )}
              </select>
            </div>

            <div className="sidebar-nav">
              <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                Dashboard Docente
              </div>
              <div className={`nav-item ${activeTab === 'grades' ? 'active' : ''}`} onClick={() => setActiveTab('grades')}>
                Planilla Calificaciones
              </div>
              <div className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
                Calendario Escolar
              </div>
              <div className={`nav-item ${activeTab === 'instruments' ? 'active' : ''}`} onClick={() => setActiveTab('instruments')}>
                Instrumentos de Eval.
              </div>
              <div className={`nav-item ${activeTab === 'instructions' ? 'active' : ''}`} onClick={() => setActiveTab('instructions')}>
                Instructivo de Uso
              </div>
            </div>
          </aside>

          {/* Teacher Content Area */}
          <section className="content-area animate-fade-in">
            
            {/* TEACHER: Tab Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                <h2>Dashboard Docente</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Información general y asignaturas a tu cargo.</p>

                <div className="stats-grid">
                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3>{teacherUniqueGrades.length}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Grados a cargo</p>
                  </div>
                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3>{currentUser.assignments.length}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Clases totales</p>
                  </div>
                </div>

                <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Tus Materias Asignadas</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {currentUser.assignments.map((a, idx) => (
                      <div key={idx} className="glass-panel" style={{ padding: '1rem', borderLeft: `4px solid ${SUBJECTS[a.subject].color}` }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{SUBJECTS[a.subject].name}</h4>
                        <span className="badge badge-success">{a.grade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEACHER: Tab Grades (Planilla Calificaciones con Barra Horizontal de Asignaturas) */}
            {activeTab === 'grades' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h2>Planilla de Notas: <span style={{ color: 'var(--primary)' }}>{selectedGrade || 'Sin Selección'}</span></h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Usa los inputs para cargar o modificar notas del periodo.</p>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Buscar estudiante..." 
                    className="form-input" 
                    style={{ maxWidth: '200px', padding: '0.4rem 0.75rem', fontSize: '0.88rem' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* HORIZONTAL SUBJECTS BAR FOR CURRENT GRADE */}
                {selectedGrade ? (
                  <div className="subject-tabs-container">
                    {teacherGradeSubjects.map(subKey => (
                      <button 
                        key={subKey} 
                        className={`subject-tab ${selectedSubject === subKey ? 'active' : ''}`}
                        onClick={() => setSelectedSubject(subKey)}
                      >
                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: SUBJECTS[subKey].color }}></span>
                        {SUBJECTS[subKey].name}
                      </button>
                    ))}
                    {teacherGradeSubjects.length === 0 && (
                      <span style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>No dictas materias en este grado.</span>
                    )}
                  </div>
                ) : null}

                {/* Grades Table */}
                {selectedGrade && selectedSubject ? (
                  <div className="custom-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Estudiante</th>
                          <th>Correo</th>
                          <th style={{ width: '150px' }}>Calificación ({SUBJECTS[selectedSubject].name})</th>
                          <th>Estado</th>
                          <th>Asistencia Acumulada</th>
                          <th>Registrar Asistencia Hoy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsFilteredByGrade
                          .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(s => {
                            const gradeValue = s[selectedSubject];
                            const isPassing = gradeValue >= 70;
                            const attPercent = s.total > 0 ? ((s.present / s.total) * 100).toFixed(0) : 0;

                            return (
                              <tr key={s.id}>
                                <td style={{ fontWeight: 600 }}>{s.name}</td>
                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.email}</td>
                                <td>
                                  <input 
                                    type="number" 
                                    className="form-input" 
                                    style={{ padding: '0.4rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}
                                    value={gradeValue}
                                    onChange={(e) => handleUpdateGrade(s.id, selectedSubject, e.target.value)}
                                    min="0"
                                    max="100"
                                  />
                                </td>
                                <td>
                                  <span className={`badge ${isPassing ? 'badge-success' : 'badge-danger'}`}>
                                    {isPassing ? 'Aprobado' : 'Reprobado'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${attPercent >= 85 ? 'badge-success' : 'badge-warning'}`} style={{ fontFamily: 'var(--font-mono)' }}>
                                    {s.present}/{s.total} ({attPercent}%)
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                                    <button className="btn-primary" style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleUpdateAttendance(s.id, 'present')}>
                                      Presente
                                    </button>
                                    <button className="btn-secondary" style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleUpdateAttendance(s.id, 'absent')}>
                                      Ausente
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        {studentsFilteredByGrade.length === 0 && (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                              No hay alumnos matriculados en {selectedGrade}. Contacta al administrador para agregarlos.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                    Por favor selecciona un Curso y una Asignatura para ver la planilla.
                  </div>
                )}
              </div>
            )}

            {/* TEACHER: Tab Calendar */}
            {activeTab === 'calendar' && (
              <div>
                <h2>Calendario Escolar</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Cronograma de actividades escolares y evaluaciones.</p>

                <div className="calendar-wrapper">
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="calendar-grid">
                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                        <div key={d} className="calendar-day-header">{d}</div>
                      ))}
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="calendar-day-cell other-month"></div>
                      ))}
                      {Array.from({ length: 31 }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dateString = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                        const dayEvents = calendarEvents.filter(ev => ev.date === dateString);

                        return (
                          <div key={dayNum} className="calendar-day-cell">
                            <span className="calendar-day-number">{dayNum}</span>
                            <div className="calendar-day-events">
                              {dayEvents.map(ev => (
                                <div key={ev.id} className={`calendar-event-dot ${ev.type}`} title={ev.desc}>
                                  {ev.title}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* List of Calendar Events */}
                  <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Eventos Programados</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {calendarEvents.map(ev => (
                        <li key={ev.id} style={{ padding: '0.75rem', borderLeft: `4px solid ${ev.type === 'primary' ? 'var(--primary)' : ev.type === 'success' ? 'var(--success)' : ev.type === 'warning' ? 'var(--warning)' : 'var(--danger)'}`, backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{ev.date}</span>
                            <span className={`badge badge-${ev.type}`} style={{ fontSize: '0.65rem' }}>{ev.type}</span>
                          </div>
                          <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-primary)' }}>{ev.title}</strong>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{ev.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TEACHER: Tab Evaluation Instruments */}
            {activeTab === 'instruments' && (
              <div>
                <h2>Instrumentos de Evaluación Ponderada</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Establece los porcentajes de ponderación para calcular la nota acumulada de las asignaturas.</p>

                <div className="instruments-layout">
                  {/* Weights Settings Form */}
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Configuración de Ponderación</h3>
                    <form onSubmit={handleUpdateWeights}>
                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <div className="weight-input-card">
                          <label>Examen Escrito / Evaluaciones</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input 
                              type="number" 
                              className="form-input" 
                              style={{ width: '80px', textAlign: 'center' }} 
                              value={weights.exam}
                              onChange={(e) => setWeights(prev => ({ ...prev, exam: Number(e.target.value) || 0 }))}
                              required 
                            />
                            <span className="weight-percentage">%</span>
                          </div>
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <div className="weight-input-card">
                          <label>Proyectos / Exposiciones</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input 
                              type="number" 
                              className="form-input" 
                              style={{ width: '80px', textAlign: 'center' }} 
                              value={weights.project}
                              onChange={(e) => setWeights(prev => ({ ...prev, project: Number(e.target.value) || 0 }))}
                              required 
                            />
                            <span className="weight-percentage">%</span>
                          </div>
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <div className="weight-input-card">
                          <label>Tareas / Taller Escrito</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input 
                              type="number" 
                              className="form-input" 
                              style={{ width: '80px', textAlign: 'center' }} 
                              value={weights.homework}
                              onChange={(e) => setWeights(prev => ({ ...prev, homework: Number(e.target.value) || 0 }))}
                              required 
                            />
                            <span className="weight-percentage">%</span>
                          </div>
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <div className="weight-input-card">
                          <label>Asistencia y Participación</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input 
                              type="number" 
                              className="form-input" 
                              style={{ width: '80px', textAlign: 'center' }} 
                              value={weights.attendance}
                              onChange={(e) => setWeights(prev => ({ ...prev, attendance: Number(e.target.value) || 0 }))}
                              required 
                            />
                            <span className="weight-percentage">%</span>
                          </div>
                        </div>
                      </div>

                      {weightErrors && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.82rem', marginBottom: '1rem', fontWeight: 600 }}>
                          ⚠️ {weightErrors}
                        </div>
                      )}

                      <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        Actualizar Ponderaciones
                      </button>
                    </form>
                  </div>

                  {/* Calculator Widget */}
                  <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Calculadora de Nota Ponderada</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      Ingresa las notas parciales (escala 0-100) para calcular la nota acumulada definitiva según las ponderaciones activas.
                    </p>

                    <form onSubmit={handleCalculatorRun}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div className="form-group">
                          <label>Examen ({weights.exam}%)</label>
                          <input 
                            type="number" 
                            className="form-input" 
                            value={calcScores.exam} 
                            onChange={(e) => setCalcScores(prev => ({ ...prev, exam: e.target.value }))}
                          />
                        </div>
                        <div className="form-group">
                          <label>Proyecto ({weights.project}%)</label>
                          <input 
                            type="number" 
                            className="form-input" 
                            value={calcScores.project} 
                            onChange={(e) => setCalcScores(prev => ({ ...prev, project: e.target.value }))}
                          />
                        </div>
                        <div className="form-group">
                          <label>Tareas ({weights.homework}%)</label>
                          <input 
                            type="number" 
                            className="form-input" 
                            value={calcScores.homework} 
                            onChange={(e) => setCalcScores(prev => ({ ...prev, homework: e.target.value }))}
                          />
                        </div>
                        <div className="form-group">
                          <label>Asistencia ({weights.attendance}%)</label>
                          <input 
                            type="number" 
                            className="form-input" 
                            value={calcScores.attendance} 
                            onChange={(e) => setCalcScores(prev => ({ ...prev, attendance: e.target.value }))}
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        Calcular Nota Final
                      </button>
                    </form>

                    {calcResult !== null && (
                      <div className="glass-panel" style={{ marginTop: '1.25rem', padding: '1rem', textAlign: 'center', backgroundColor: 'var(--primary-glow)', borderColor: 'var(--primary)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Calificación Definitiva</span>
                        <strong style={{ fontSize: '2rem', color: 'var(--primary)' }}>{calcResult} / 100</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TEACHER: Tab Instructions */}
            {activeTab === 'instructions' && (
              <div>
                <h2>Manual de Uso del Docente</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Guía paso a paso sobre el manejo de la planilla.</p>

                <div className="glass-card instruction-card">
                  <div className="instruction-step">
                    <div className="instruction-step-num">1</div>
                    <div>
                      <strong>Seleccionar Curso / Grado</strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        En el panel lateral izquierdo, selecciona el curso que deseas evaluar (ej. 1ro A).
                      </p>
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-step-num">2</div>
                    <div>
                      <strong>Seleccionar Asignatura Horizontal</strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        En la parte superior verás las asignaturas que tienes asignadas en ese grado. Haz clic en una de ellas (ej. Matemáticas).
                      </p>
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-step-num">3</div>
                    <div>
                      <strong>Ingresar o Modificar Calificaciones</strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Modifica el número en la columna "Calificación". La planilla guardará el resultado de inmediato en el sistema.
                      </p>
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-step-num">4</div>
                    <div>
                      <strong>Tomar Asistencia Diaria</strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Usa los botones rápidos de "Presente" o "Ausente" para llevar la cuenta de la participación diaria de los estudiantes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </section>

        </div>
      </div>

      <footer style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <p>&copy; {new Date().getFullYear()} Control Académico - Registro Digital Virtual. Docente Activo.</p>
      </footer>
    </div>
  );
}
