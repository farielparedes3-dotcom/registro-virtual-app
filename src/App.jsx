import { useState, useEffect } from 'react';
import './App.css';

const DEFAULT_STUDENTS = [
  { id: '1', name: 'Sofía Rodriguez', email: 'sofia.rod@school.edu', grade: '10° A', math: 95, science: 88, language: 92, present: 18, total: 20 },
  { id: '2', name: 'Mateo Gómez', email: 'mateo.gom@school.edu', grade: '10° A', math: 82, science: 90, language: 85, present: 19, total: 20 },
  { id: '3', name: 'Valentina Martínez', email: 'val.mar@school.edu', grade: '10° B', math: 71, science: 75, language: 80, present: 15, total: 20 },
  { id: '4', name: 'Santiago Pérez', email: 'santi.per@school.edu', grade: '10° A', math: 89, science: 92, language: 88, present: 20, total: 20 },
  { id: '5', name: 'Lucía Fernández', email: 'lucia.fer@school.edu', grade: '10° B', math: 60, science: 70, language: 68, present: 17, total: 20 }
];

export default function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('control_academico_students');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for adding student
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

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('control_academico_students', JSON.stringify(students));
  }, [students]);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Student CRUD operations
  const handleAddStudent = (e) => {
    e.preventDefault();
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
    if (window.confirm('¿Está seguro de que desea eliminar este estudiante?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleUpdateGrade = (id, subject, value) => {
    const numericValue = Math.min(100, Math.max(0, Number(value) || 0));
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, [subject]: numericValue };
      }
      return s;
    }));
  };

  const handleUpdateAttendance = (id, type) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
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

  // Calculations for stats
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

  // Filtered Students
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
          </svg>
          <div>Control<span>Académico</span></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button className="theme-toggle" onClick={toggleTheme} title="Cambiar Tema">
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
              AD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }} className="mobile-hide">
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Administrador</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Director Académico</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Metric Summary Grid */}
        <div className="stats-grid">
          <div className="glass-panel stat-card" style={{ padding: '1.25rem' }}>
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{totalStudents}</div>
              <div className="stat-label">Alumnos Registrados</div>
            </div>
          </div>
          <div className="glass-panel stat-card" style={{ padding: '1.25rem' }}>
            <div className="stat-icon" style={{ color: 'var(--warning)', backgroundColor: 'var(--warning-bg)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{globalAverage}/100</div>
              <div className="stat-label">Promedio General</div>
            </div>
          </div>
          <div className="glass-panel stat-card" style={{ padding: '1.25rem' }}>
            <div className="stat-icon" style={{ color: 'var(--success)', backgroundColor: 'var(--success-bg)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{averageAttendance}%</div>
              <div className="stat-label">Asistencia Promedio</div>
            </div>
          </div>
          <div className="glass-panel stat-card" style={{ padding: '1.25rem' }}>
            <div className="stat-icon" style={{ color: 'hsl(170, 75%, 40%)', backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{passingRate}%</div>
              <div className="stat-label">Tasa de Aprobación</div>
            </div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="dashboard-layout">
          
          {/* Sidebar */}
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
                Control de Asistencia
              </div>
            </div>
          </aside>

          {/* Tab Contents */}
          <section className="content-area animate-fade-in">
            {activeTab === 'dashboard' && (
              <div>
                <h2 style={{ marginBottom: '0.5rem' }}>Vista General de la Institución</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Estadísticas de rendimiento en tiempo real e información clave.</p>
                
                <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Rendimiento Promedio por Asignatura</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Math Progress */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Matemáticas</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{mathAvg}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${mathAvg}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
                      </div>
                    </div>

                    {/* Science Progress */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Ciencias</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{scienceAvg}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${scienceAvg}%`, height: '100%', backgroundColor: 'var(--success)', borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
                      </div>
                    </div>

                    {/* Language Progress */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Lenguaje</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{langAvg}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${langAvg}%`, height: '100%', backgroundColor: 'var(--warning)', borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="dashboard-summary-grid">
                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Últimas Actividades</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                      <li style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
                        <span>Se actualizó el registro de asistencia global.</span>
                      </li>
                      <li style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>+</span>
                        <span>Se agregó un nuevo estudiante a 10° A.</span>
                      </li>
                      <li style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>!</span>
                        <span>Promedio de Ciencias subió 2.4% este periodo.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContents: 'center', marginBottom: '0.75rem' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: 'auto' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Generar Reporte Completo</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Exporta la base de datos de control académico a JSON.</p>
                    <button className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }} onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(students, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href",     dataStr);
                      downloadAnchor.setAttribute("download", `Reporte_Control_Academico_${new Date().toISOString().slice(0, 10)}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}>
                      Exportar Datos
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h2>Listado de Estudiantes</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Administrar matrículas, grados e información personal.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input 
                      type="text" 
                      placeholder="Buscar por nombre, correo..." 
                      className="form-input" 
                      style={{ maxWidth: '240px', padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
                  {/* Students list */}
                  <div className="custom-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Grado</th>
                          <th>Correo</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map(s => (
                            <tr key={s.id}>
                              <td style={{ fontWeight: 600 }}>{s.name}</td>
                              <td><span className="badge badge-success">{s.grade}</span></td>
                              <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{s.email}</td>
                              <td>
                                <button className="btn-danger" onClick={() => handleDeleteStudent(s.id)}>
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                              No se encontraron estudiantes.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Student Form */}
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Registrar Alumno</h3>
                    <form onSubmit={handleAddStudent}>
                      <div className="form-group">
                        <label>Nombre Completo</label>
                        <input 
                          type="text" 
                          placeholder="Ej. Sofía Rodriguez" 
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
                          placeholder="Ej. sofia@escuela.com" 
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
                          <option value="10° A">10° Grado - Sección A</option>
                          <option value="10° B">10° Grado - Sección B</option>
                          <option value="11° A">11° Grado - Sección A</option>
                          <option value="11° B">11° Grado - Sección B</option>
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label>Cal. Inicial</label>
                          <input 
                            type="number" 
                            className="form-input" 
                            min="0" 
                            max="100"
                            value={newStudent.math}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, math: e.target.value, science: e.target.value, language: e.target.value }))}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label>Asistencia Inicial</label>
                          <input 
                            type="number" 
                            className="form-input"
                            min="0"
                            max="20"
                            value={newStudent.present}
                            onChange={(e) => setNewStudent(prev => ({ ...prev, present: e.target.value }))}
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        Registrar Estudiante
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'grades' && (
              <div>
                <h2>Control de Calificaciones (Escala 0-100)</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Edita las notas directamente. El promedio escolar general se recalcula al instante.</p>

                <div className="custom-table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th>Grado</th>
                        <th style={{ width: '120px' }}>Matemáticas</th>
                        <th style={{ width: '120px' }}>Ciencias</th>
                        <th style={{ width: '120px' }}>Lenguaje</th>
                        <th>Promedio</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const avg = calculateStudentAvg(s);
                        const isPassing = avg >= 70;
                        return (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                            <td><span className="badge badge-success">{s.grade}</span></td>
                            <td>
                              <input 
                                type="number" 
                                className="form-input" 
                                style={{ padding: '0.4rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                value={s.math}
                                onChange={(e) => handleUpdateGrade(s.id, 'math', e.target.value)}
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-input" 
                                style={{ padding: '0.4rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                value={s.science}
                                onChange={(e) => handleUpdateGrade(s.id, 'science', e.target.value)}
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-input" 
                                style={{ padding: '0.4rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                value={s.language}
                                onChange={(e) => handleUpdateGrade(s.id, 'language', e.target.value)}
                              />
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                              {avg.toFixed(1)}
                            </td>
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

            {activeTab === 'attendance' && (
              <div>
                <h2>Control de Asistencia Diario</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Registra las asistencias/faltas de cada estudiante. El porcentaje de participación se actualiza automáticamente.</p>

                <div className="custom-table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th>Grado</th>
                        <th>Días Presente</th>
                        <th>Días Totales</th>
                        <th>Porcentaje</th>
                        <th>Registrar Hoy</th>
                        <th>Reestablecer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const percent = s.total > 0 ? ((s.present / s.total) * 100).toFixed(0) : 0;
                        const isGood = percent >= 85;
                        return (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                            <td><span className="badge badge-success">{s.grade}</span></td>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>{s.present} días</td>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>{s.total} días</td>
                            <td>
                              <span className={`badge ${isGood ? 'badge-success' : 'badge-warning'}`} style={{ fontFamily: 'var(--font-mono)' }}>
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
          </section>

        </div>

      </main>

      <footer style={{ marginTop: 'auto', padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <p>&copy; {new Date().getFullYear()} Control Académico - Registro Digital Virtual. Diseñado con tecnologías Web Premium.</p>
      </footer>
    </div>
  );
}
