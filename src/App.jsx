import { useState, useEffect, useRef } from 'react';
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
    assignments: [], 
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

// 4 Grades per subject
const DEFAULT_STUDENTS = [
  { 
    id: 's1', 
    name: 'Sofía Rodriguez', 
    email: 'sofia.rod@school.edu', 
    grade: '1ro A', 
    grades: {
      math: [95, 90, 88, 92],
      science: [88, 85, 90, 80],
      language: [92, 95, 88, 90],
      history: [90, 88, 95, 92]
    },
    present: 18, 
    total: 20 
  },
  { 
    id: 's2', 
    name: 'Santiago Pérez', 
    email: 'santi.per@school.edu', 
    grade: '1ro A', 
    grades: {
      math: [85, 88, 82, 90],
      science: [92, 90, 95, 88],
      language: [88, 85, 90, 86],
      history: [85, 80, 88, 92]
    },
    present: 20, 
    total: 20 
  },
  { 
    id: 's3', 
    name: 'Carlos Mendoza', 
    email: 'carlos.men@school.edu', 
    grade: '1ro A', 
    grades: {
      math: [70, 75, 80, 72],
      science: [80, 78, 82, 80],
      language: [78, 80, 74, 82],
      history: [74, 70, 78, 75]
    },
    present: 16, 
    total: 20 
  },
  { 
    id: 's4', 
    name: 'Ana Ruiz', 
    email: 'ana.ruiz@school.edu', 
    grade: '1ro B', 
    grades: {
      math: [85, 88, 82, 90],
      science: [84, 86, 80, 90],
      language: [95, 92, 90, 98],
      history: [89, 85, 92, 90]
    },
    present: 19, 
    total: 20 
  },
  { 
    id: 's5', 
    name: 'Mateo Gómez', 
    email: 'mateo.gom@school.edu', 
    grade: '10° A', 
    grades: {
      math: [80, 82, 85, 80],
      science: [90, 88, 92, 90],
      language: [85, 80, 88, 84],
      history: [80, 78, 82, 85]
    },
    present: 19, 
    total: 20 
  }
];

const DEFAULT_EVENTS = [
  { id: 'e1', date: '2026-07-03', title: 'Reunión de Padres', desc: 'Reunión general para entrega de informes parciales.', type: 'danger' },
  { id: 'e2', date: '2026-07-10', title: 'Examen Matemáticas', desc: 'Evaluación parcial de primer grado A.', type: 'primary' },
  { id: 'e3', date: '2026-07-15', title: 'Feria de Ciencias', desc: 'Presentación de proyectos científicos para 10° grado.', type: 'success' },
  { id: 'e4', date: '2026-07-24', title: 'Entrega Proy. Historia', desc: 'Límite para cargar el informe del periodo en Historia.', type: 'warning' }
];

// Pre-populated socio-cognitive evaluation configurations per Grade + Subject (4 evaluations each)
const DEFAULT_EVALUATION_CONFIGS = {
  "1ro A_math": [
    {
      id: 0,
      activity: "Resolución de Ecuaciones",
      competence: "Pensamiento lógico y resolución de problemas algebraicos.",
      indicator: "Resuelve ecuaciones lineales y valida las soluciones en ejercicios cotidianos.",
      type: "rubrica",
      criteria: ["Planteamiento", "Proceso de despeje", "Comprobación de la respuesta"],
      levels: {
        preformal: "Tiene nociones vagas de variables, pero no logra plantear la igualdad.",
        receptivo: "Plantea la ecuación básica, pero tiene dificultades para ordenar los términos.",
        resolutivo: "Despeja la incógnita de forma ordenada y encuentra el valor numérico.",
        autonomo: "Resuelve el problema paso a paso y justifica verbalmente cada despeje.",
        estrategico: "Resuelve de forma óptima, comprueba el resultado y propone otro método."
      }
    },
    {
      id: 1,
      activity: "Fracciones y Proporciones",
      competence: "Uso del razonamiento cuantitativo en contextos variados.",
      indicator: "Utiliza fracciones equivalentes para resolver problemas de repartición.",
      type: "lista",
      criteria: ["Simplifica fracciones correctamente", "Suma fracciones con distinto denominador", "Resuelve problemas de reparto"],
      levels: {
        preformal: "Confunde el numerador y el denominador.",
        receptivo: "Sabe representar gráficamente una fracción, pero no operar.",
        resolutivo: "Opera fracciones simples.",
        autonomo: "Resuelve operaciones combinadas y simplifica el resultado.",
        estrategico: "Aplica fracciones para resolver problemas contextualizados y evalúa soluciones."
      }
    },
    {
      id: 2,
      activity: "Taller de Geometría Plana",
      competence: "Pensamiento espacial y razonamiento geométrico.",
      indicator: "Calcula perímetros y áreas de polígonos regulares.",
      type: "escala",
      criteria: ["Aplica fórmulas correctas", "Precisión en los cálculos", "Rotulado de unidades (cm² / m²)"],
      levels: {
        preformal: "Confunde área con perímetro.",
        receptivo: "Identifica la fórmula básica pero falla en la sustitución de valores.",
        resolutivo: "Calcula correctamente perímetros y áreas sencillas.",
        autonomo: "Aplica las fórmulas correctas en figuras compuestas.",
        estrategico: "Optimiza los cálculos de áreas reales y justifica la elección de la unidad."
      }
    },
    {
      id: 3,
      activity: "Examen de Razonamiento Lógico",
      competence: "Estructuración del pensamiento abstracto.",
      indicator: "Identifica patrones numéricos y de sucesiones progresivas.",
      type: "rubrica",
      criteria: ["Identificación de la regla", "Cálculo de términos futuros", "Expresión matemática general"],
      levels: {
        preformal: "No identifica la secuencia lógica.",
        receptivo: "Completa la secuencia pero no comprende el patrón subyacente.",
        resolutivo: "Identifica la regla de cambio y calcula los siguientes términos.",
        autonomo: "Genera la expresión general de la sucesión numérica.",
        estrategico: "Propone variaciones lógicas del patrón y explica su ley de formación."
      }
    }
  ]
};

// AI Suggestions Mock Databases for Gemini/Copilot simulation
const AI_DATABASE = {
  math: {
    competence: "Pensamiento matemático y resolución de problemas.",
    indicator: "Aplica algoritmos matemáticos e interpreta resultados de forma crítica.",
    criteria: ["Precisión algorítmica", "Orden en el procedimiento", "Verificación lógica del resultado"],
    levels: {
      preformal: "Realiza operaciones sencillas pero sin estructura conceptual básica.",
      receptivo: "Reconoce fórmulas y conceptos básicos al ser guiado directamente.",
      resolutivo: "Resuelve problemas estándar utilizando métodos establecidos.",
      autonomo: "Justifica de manera lógica e independiente cada paso de la solución.",
      estrategico: "Evalúa diferentes alternativas, optimiza la solución y la contextualiza."
    }
  },
  science: {
    competence: "Comprensión del entorno natural y pensamiento científico.",
    indicator: "Aplica el método científico para modelar fenómenos y extraer conclusiones.",
    criteria: ["Planteamiento de hipótesis", "Rigurosidad en el registro experimental", "Análisis crítico de conclusiones"],
    levels: {
      preformal: "Observa fenómenos pero no identifica las variables científicas en juego.",
      receptivo: "Registra datos experimentales bajo supervisión directa.",
      resolutivo: "Realiza experimentos básicos y extrae conclusiones elementales.",
      autonomo: "Relaciona de forma independiente la teoría con los resultados observados.",
      estrategico: "Diseña experimentos alternativos, evalúa errores y publica conclusiones sólidas."
    }
  },
  language: {
    competence: "Comunicación oral, escrita y comprensión lectora.",
    indicator: "Escribe y analiza textos complejos estructurando ideas con coherencia y cohesión.",
    criteria: ["Coherencia y cohesión textual", "Ortografía y gramática correctas", "Estructura narrativa o argumentativa"],
    levels: {
      preformal: "Escribe ideas aisladas con errores gramaticales frecuentes.",
      receptivo: "Produce textos básicos copiando estructuras preestablecidas.",
      resolutivo: "Redacta textos con una estructura clara y pocos errores de redacción.",
      autonomo: "Desarrolla argumentos originales con un vocabulario amplio y preciso.",
      estrategico: "Adapta el estilo de escritura al público, evalúa su impacto y revisa críticamente."
    }
  },
  history: {
    competence: "Pensamiento histórico y comprensión crítica de la sociedad.",
    indicator: "Analiza causas y consecuencias de hechos históricos mediante diversas fuentes.",
    criteria: ["Contraste de fuentes históricas", "Análisis multicausal", "Redacción con perspectiva histórica"],
    levels: {
      preformal: "Enumera fechas e hitos históricos de forma memorística sin conexión.",
      receptivo: "Identifica hechos y personajes principales de un suceso determinado.",
      resolutivo: "Describe las causas directas de un evento a través de un texto base.",
      autonomo: "Construye una postura independiente contrastando múltiples fuentes históricas.",
      estrategico: "Relaciona eventos pasados con problemáticas del presente y propone alternativas."
    }
  }
};

export default function App() {
  // --- Core States ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('s_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('s_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('s_students');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
  });

  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem('s_events');
    return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
  });

  const [evaluationConfigs, setEvaluationConfigs] = useState(() => {
    const saved = localStorage.getItem('s_eval_configs');
    return saved ? JSON.parse(saved) : DEFAULT_EVALUATION_CONFIGS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // --- Filtering States ---
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [activeAdminGrade, setActiveAdminGrade] = useState('1ro A');

  // --- Modal Assessment State ---
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState(null); // { studentId, subjectKey, evalIdx, config }
  const [selectedTobonLevel, setSelectedTobonLevel] = useState('');
  const [checklistChecks, setChecklistChecks] = useState([false, false, false]);

  // --- AI copilot simulation state ---
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiActivityPrompt, setAiActivityPrompt] = useState('');
  const [aiTypingText, setAiTypingText] = useState('');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [studentForm, setStudentForm] = useState({ name: '', email: '' });
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', password: '', role: 'teacher' });
  const [newAssignment, setNewAssignment] = useState({ grade: '1ro A', subject: 'math' });
  const [newEvent, setNewEvent] = useState({ date: '2026-07-01', title: '', desc: '', type: 'primary' });

  // Excel text import state
  const [excelImportText, setExcelImportText] = useState('');

  // Active instrument config index (0 to 3) in Instruments Tab
  const [activeInstrumentIdx, setActiveInstrumentIdx] = useState(0);

  // Form state for editing instrument in Instruments Tab
  const [instrumentEditState, setInstrumentEditState] = useState({
    activity: '',
    competence: '',
    indicator: '',
    type: 'rubrica',
    criteriaText: '' // Comma separated criteria
  });

  // File input ref for CSV import
  const fileInputRef = useRef(null);

  // --- Sync Effects ---
  useEffect(() => {
    localStorage.setItem('s_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('s_current_user', JSON.stringify(currentUser));
      const latest = users.find(u => u.id === currentUser.id);
      if (latest && JSON.stringify(latest) !== JSON.stringify(currentUser)) {
        setCurrentUser(latest);
      }
    } else {
      localStorage.removeItem('s_current_user');
    }
  }, [currentUser, users]);

  useEffect(() => {
    localStorage.setItem('s_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('s_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('s_eval_configs', JSON.stringify(evaluationConfigs));
  }, [evaluationConfigs]);

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

  // When selectedGrade changes, automatically set selectedSubject
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

  // Sync edit state in Instruments Tab
  useEffect(() => {
    if (currentUser && selectedGrade && selectedSubject) {
      const configKey = `${selectedGrade}_${selectedSubject}`;
      const configs = evaluationConfigs[configKey] || [];
      const activeConf = configs[activeInstrumentIdx];

      if (activeConf) {
        setInstrumentEditState({
          activity: activeConf.activity || '',
          competence: activeConf.competence || '',
          indicator: activeConf.indicator || '',
          type: activeConf.type || 'rubrica',
          criteriaText: (activeConf.criteria || []).join(', ')
        });
      } else {
        setInstrumentEditState({
          activity: '',
          competence: '',
          indicator: '',
          type: 'rubrica',
          criteriaText: ''
        });
      }
    }
  }, [activeInstrumentIdx, selectedGrade, selectedSubject, evaluationConfigs, currentUser]);

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
    setSelectedSubject('math');
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
      alert('Por favor llene los campos.');
      return;
    }

    const created = {
      id: 's_' + Date.now().toString(),
      name: studentForm.name,
      email: studentForm.email,
      grade: activeAdminGrade,
      grades: {
        math: [80, 80, 80, 80],
        science: [80, 80, 80, 80],
        language: [80, 80, 80, 80],
        history: [80, 80, 80, 80]
      },
      present: 20,
      total: 20
    };

    setStudents(prev => [...prev, created]);
    setStudentForm({ name: '', email: '' });
  };

  const handleDeleteStudent = (id) => {
    if (currentUser.role !== 'admin') return;
    if (window.confirm('¿Está seguro de eliminar este alumno?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  // --- Admin: Bulk Students Importer ---
  const parseAndAddStudents = (textData) => {
    const lines = textData.split('\n');
    const addedStudents = [];

    lines.forEach(line => {
      if (!line.trim()) return;

      // split by comma, tab, or semicolon
      let parts = line.split(/[,\t;]/);
      let name = parts[0]?.trim();
      let email = parts[1]?.trim();

      if (name) {
        if (!email) {
          // auto generate email if empty
          const sanitizedName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.');
          email = `${sanitizedName}@school.edu`;
        }

        addedStudents.push({
          id: 's_' + Math.random().toString(36).substr(2, 9),
          name: name,
          email: email,
          grade: activeAdminGrade,
          grades: {
            math: [80, 80, 80, 80],
            science: [80, 80, 80, 80],
            language: [80, 80, 80, 80],
            history: [80, 80, 80, 80]
          },
          present: 20,
          total: 20
        });
      }
    });

    if (addedStudents.length > 0) {
      setStudents(prev => [...prev, ...addedStudents]);
      alert(`Se importaron con éxito ${addedStudents.length} alumnos al grado ${activeAdminGrade}.`);
    } else {
      alert('No se pudo encontrar ningún dato de alumno válido. Formato: Nombre, Correo');
    }
  };

  const handleTextImportSubmit = (e) => {
    e.preventDefault();
    if (!excelImportText.trim()) return;
    parseAndAddStudents(excelImportText);
    setExcelImportText('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result;
      parseAndAddStudents(csvText);
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- Admin Teacher Management ---
  const handleCreateTeacher = (e) => {
    e.preventDefault();
    if (currentUser.role !== 'admin') return;

    if (!teacherForm.name || !teacherForm.email || !teacherForm.password) {
      alert('Por favor llene todos los campos.');
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
      assignments: [],
      active: true
    };

    setUsers(prev => [...prev, created]);
    setTeacherForm({ name: '', email: '', password: '', role: 'teacher' });
    alert('Docente registrado.');
  };

  const handleAddAssignment = (userId) => {
    if (currentUser.role !== 'admin') return;
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const exists = u.assignments.some(
          a => a.grade === newAssignment.grade && a.subject === newAssignment.subject
        );
        if (exists) {
          alert('Asignación duplicada.');
          return u;
        }
        return { ...u, assignments: [...u.assignments, { ...newAssignment }] };
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

  const handleDeleteUser = (id) => {
    if (currentUser.role !== 'admin') return;
    if (id === currentUser.id) return;
    if (window.confirm('¿Eliminar esta cuenta?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  // --- Docente: Instrument Configuration ---
  const handleSaveInstrument = (e) => {
    e.preventDefault();
    if (!selectedGrade || !selectedSubject) return;

    const configKey = `${selectedGrade}_${selectedSubject}`;
    const currentConfigs = evaluationConfigs[configKey] || [
      { id: 0, activity: '', competence: '', indicator: '', type: 'rubrica', criteria: [] },
      { id: 1, activity: '', competence: '', indicator: '', type: 'rubrica', criteria: [] },
      { id: 2, activity: '', competence: '', indicator: '', type: 'rubrica', criteria: [] },
      { id: 3, activity: '', competence: '', indicator: '', type: 'rubrica', criteria: [] }
    ];

    const parsedCriteria = instrumentEditState.criteriaText
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const generatedLevels = {
      preformal: `Desempeño pre-formal en ${instrumentEditState.activity}. No alcanza los criterios mínimos (50-59).`,
      receptivo: `Desempeño receptivo en ${instrumentEditState.activity}. Ejecuta acciones con supervisión (60-69).`,
      resolutivo: `Desempeño resolutivo en ${instrumentEditState.activity}. Resuelve de forma autónoma problemas estándar (70-79).`,
      autonomo: `Desempeño autónomo en ${instrumentEditState.activity}. Argumenta y soluciona con independencia (80-89).`,
      estrategico: `Desempeño estratégico en ${instrumentEditState.activity}. Propone mejoras creativas e innova (90-100).`
    };

    const updatedConfig = {
      id: activeInstrumentIdx,
      activity: instrumentEditState.activity,
      competence: instrumentEditState.competence,
      indicator: instrumentEditState.indicator,
      type: instrumentEditState.type,
      criteria: parsedCriteria,
      levels: generatedLevels
    };

    const nextConfigs = [...currentConfigs];
    nextConfigs[activeInstrumentIdx] = updatedConfig;

    setEvaluationConfigs(prev => ({
      ...prev,
      [configKey]: nextConfigs
    }));

    alert(`Instrumento de la Evaluación ${activeInstrumentIdx + 1} guardado correctamente.`);
  };

  // Gemini / Copilot simulation generator
  const runAiCopilotSimulation = () => {
    if (!instrumentEditState.activity) {
      alert('Escribe primero el nombre de la actividad para que la IA proponga los indicadores.');
      return;
    }

    setIsAiGenerating(true);
    setAiTypingText('Gemini está analizando la actividad...');

    // Simulate AI response delay
    setTimeout(() => {
      const template = AI_DATABASE[selectedSubject] || AI_DATABASE.math;
      setAiTypingText(`[Gemini/Copilot]:
Competencia sugerida: "${template.competence}"
Indicador sugerido: "${template.indicator}"
Criterios sugeridos: [${template.criteria.join(', ')}]`);

      setInstrumentEditState(prev => ({
        ...prev,
        competence: template.competence,
        indicator: `${template.indicator} para la actividad "${prev.activity}"`,
        criteriaText: template.criteria.join(', ')
      }));
      setIsAiGenerating(false);
    }, 1500);
  };

  // --- Grading Sheet and Attendance Handlers ---
  const handleCellGradeChange = (studentId, subject, evalIdx, value) => {
    const canEdit = currentUser.role === 'admin' || (
      currentUser.role === 'teacher' &&
      currentUser.assignments.some(a => a.grade === selectedGrade && a.subject === subject)
    );
    if (!canEdit) return;

    const numeric = Math.min(100, Math.max(0, Number(value) || 0));
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const nextGrades = { ...s.grades };
        const currentArr = [...(nextGrades[subject] || [80, 80, 80, 80])];
        currentArr[evalIdx] = numeric;
        nextGrades[subject] = currentArr;
        return { ...s, grades: nextGrades };
      }
      return s;
    }));
  };

  const handleUpdateAttendance = (studentId, type) => {
    if (!currentUser.active) return;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        let present = s.present;
        let total = s.total;
        if (type === 'present') {
          present = Math.min(total + 1, present + 1);
          total = Math.max(present, total);
        } else if (type === 'absent') {
          total += 1;
        } else if (type === 'reset') {
          present = 0;
          total = 0;
        }
        return { ...s, present, total };
      }
      return s;
    }));
  };

  // --- Modal Assessment Execution ---
  const openAssessmentModal = (studentId, subjectKey, evalIdx) => {
    const configKey = `${selectedGrade}_${subjectKey}`;
    const configs = evaluationConfigs[configKey] || [];
    const config = configs[evalIdx] || {
      id: evalIdx,
      activity: `Evaluación ${evalIdx + 1}`,
      competence: 'Competencia General',
      indicator: 'Indicador Académico',
      type: 'rubrica',
      criteria: ['Criterio General'],
      levels: {
        preformal: 'Nivel inicial preformal (55)',
        receptivo: 'Nivel básico receptivo (65)',
        resolutivo: 'Nivel resolutivo estándar (75)',
        autonomo: 'Nivel autónomo independiente (85)',
        estrategico: 'Nivel estratégico de alta excelencia (95)'
      }
    };

    const student = students.find(s => s.id === studentId);
    const currentGrade = student?.grades[subjectKey]?.[evalIdx] || 80;

    // Reset modal status
    setActiveAssessment({ studentId, subjectKey, evalIdx, config, studentName: student?.name });
    setChecklistChecks([false, false, false]);

    // pre-highlight based on current grade
    if (currentGrade >= 90) setSelectedTobonLevel('estrategico');
    else if (currentGrade >= 80) setSelectedTobonLevel('autonomo');
    else if (currentGrade >= 70) setSelectedTobonLevel('resolutivo');
    else if (currentGrade >= 60) setSelectedTobonLevel('receptivo');
    else setSelectedTobonLevel('preformal');

    setIsAssessmentModalOpen(true);
  };

  const handleApplyAssessment = () => {
    if (!activeAssessment) return;
    const { studentId, subjectKey, evalIdx, config } = activeAssessment;

    let computedScore = 80;
    if (config.type === 'rubrica' || config.type === 'escala') {
      if (selectedTobonLevel === 'preformal') computedScore = 55;
      else if (selectedTobonLevel === 'receptivo') computedScore = 65;
      else if (selectedTobonLevel === 'resolutivo') computedScore = 75;
      else if (selectedTobonLevel === 'autonomo') computedScore = 85;
      else if (selectedTobonLevel === 'estrategico') computedScore = 98;
    } else if (config.type === 'lista') {
      // checklists score calculation: 0 checks = 50, 1 check = 70, 2 checks = 85, 3 checks = 100
      const checkCount = checklistChecks.filter(c => c).length;
      if (checkCount === 0) computedScore = 50;
      else if (checkCount === 1) computedScore = 70;
      else if (checkCount === 2) computedScore = 85;
      else if (checkCount === 3) computedScore = 100;
    }

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const nextGrades = { ...s.grades };
        const currentArr = [...(nextGrades[subjectKey] || [80, 80, 80, 80])];
        currentArr[evalIdx] = computedScore;
        nextGrades[subjectKey] = currentArr;
        return { ...s, grades: nextGrades };
      }
      return s;
    }));

    setIsAssessmentModalOpen(false);
    setActiveAssessment(null);
  };

  // --- Calendar Add Event Handler ---
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (currentUser.role !== 'admin') return;

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

  // --- Calculations for stats ---
  const totalStudents = students.length;
  
  const calculateStudentAvg = (s) => {
    const math = (s.grades?.math?.reduce((a, b) => a + b, 0) / 4) || 0;
    const science = (s.grades?.science?.reduce((a, b) => a + b, 0) / 4) || 0;
    const language = (s.grades?.language?.reduce((a, b) => a + b, 0) / 4) || 0;
    const history = (s.grades?.history?.reduce((a, b) => a + b, 0) / 4) || 0;
    return (math + science + language + history) / 4;
  };

  const globalAverage = totalStudents > 0 
    ? (students.reduce((acc, s) => acc + calculateStudentAvg(s), 0) / totalStudents).toFixed(1)
    : 0;

  const averageAttendance = totalStudents > 0
    ? (students.reduce((acc, s) => acc + (s.total > 0 ? (s.present / s.total) * 100 : 0), 0) / totalStudents).toFixed(1)
    : 0;

  const passingRate = totalStudents > 0 
    ? ((students.filter(s => calculateStudentAvg(s) >= 70).length / totalStudents) * 100).toFixed(0)
    : 0;

  // Specific subject averages (averaging their 4 sub-grades across all students)
  const getSubjectAverage = (subKey) => {
    if (totalStudents === 0) return 0;
    const totalSum = students.reduce((acc, s) => {
      const arr = s.grades?.[subKey] || [80, 80, 80, 80];
      return acc + (arr.reduce((a, b) => a + b, 0) / 4);
    }, 0);
    return (totalSum / totalStudents).toFixed(1);
  };

  const mathAvg = getSubjectAverage('math');
  const scienceAvg = getSubjectAverage('science');
  const langAvg = getSubjectAverage('language');
  const historyAvg = getSubjectAverage('history');

  const teacherUniqueGrades = currentUser && currentUser.role === 'teacher'
    ? [...new Set(currentUser.assignments.map(a => a.grade))]
    : [];

  const teacherGradeSubjects = currentUser && currentUser.role === 'teacher' && selectedGrade
    ? currentUser.assignments.filter(a => a.grade === selectedGrade).map(a => a.subject)
    : [];

  const studentsFilteredByGrade = selectedGrade
    ? students.filter(s => s.grade === selectedGrade)
    : students;

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
        <div className="main-content animate-fade-in">
          <div className="dashboard-layout">
            
            {/* Sidebar */}
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

            {/* Content Area */}
            <section className="content-area">
              
              {/* Tab: Dashboard */}
              {activeTab === 'dashboard' && (
                <div>
                  <h2>Vista General del Administrador</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Métricas globales escolares.</p>

                  <div className="stats-grid">
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <h3>{totalStudents}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Alumnos</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <h3>{users.filter(u => u.role === 'teacher').length}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Profesores Registrados</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <h3>{globalAverage}/100</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rendimiento Escolar</p>
                    </div>
                  </div>

                  <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Resumen de Promedios por Asignatura (Escala de 4 Evaluaciones)</h3>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none' }}>
                      <li>Matemáticas: <strong>{mathAvg}%</strong></li>
                      <li>Ciencias: <strong>{scienceAvg}%</strong></li>
                      <li>Lenguaje: <strong>{langAvg}%</strong></li>
                      <li>Historia: <strong>{historyAvg}%</strong></li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab: Teachers */}
              {activeTab === 'teachers' && (
                <div>
                  <h2>Docentes y Asignación de Materias/Grados</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Vincula a tus docentes con las aulas.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
                    
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
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Clave: {u.password}</div>
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
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sin asignaciones.</span>
                                  )}
                                  
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

              {/* Tab: Students (With CSV and Copy-Paste Importers) */}
              {activeTab === 'students' && (
                <div>
                  <h2>Estudiantes por Grado</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Registra o importa alumnos de forma masiva a un Grado. Se replicarán en todas las asignaturas de ese grado.
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {['1ro A', '1ro B', '10° A', '10° B'].map(g => (
                      <button 
                        key={g} 
                        className={`btn-secondary ${activeAdminGrade === g ? 'btn-primary' : ''}`}
                        onClick={() => setActiveAdminGrade(g)}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  {/* Mass Importers Card */}
                  <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Importador Masivo de Alumnos (Grado: {activeAdminGrade})</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      
                      {/* Drag/Drop CSV Zone */}
                      <div>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Opción A: Subir Archivo CSV</h4>
                        <div className="import-zone" onClick={() => fileInputRef.current.click()}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Seleccionar Archivo .CSV</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Formatos aceptados: Nombre, Correo</span>
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          style={{ display: 'none' }} 
                          accept=".csv" 
                          onChange={handleFileUpload} 
                        />
                      </div>

                      {/* Excel Copy-Paste Box */}
                      <div>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Opción B: Copiar y Pegar desde Excel</h4>
                        <form onSubmit={handleTextImportSubmit}>
                          <textarea 
                            className="textarea-excel-import"
                            placeholder="Sofia Perez, sofia@correo.com&#10;Carlos Gomez, carlos@correo.com"
                            value={excelImportText}
                            onChange={(e) => setExcelImportText(e.target.value)}
                          />
                          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem' }}>
                            Procesar Listado Pegado
                          </button>
                        </form>
                      </div>

                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
                    
                    {/* Alumns table */}
                    <div className="custom-table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Contacto</th>
                            <th>Grado</th>
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
                                <button className="btn-danger" style={{ padding: '0.35rem 0.75rem' }} onClick={() => handleDeleteStudent(s.id)}>
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                          {students.filter(s => s.grade === activeAdminGrade).length === 0 && (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                No hay estudiantes inscritos en {activeAdminGrade}.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Single Student Form */}
                    <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
                      <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Inscribir Individual</h3>
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
                          Guardar Registro
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              )}

              {/* Tab: Calendar */}
              {activeTab === 'calendar' && (
                <div>
                  <h2>Calendario Escolar</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Exámenes y eventos del ciclo.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
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
                            <option value="primary">Académico</option>
                            <option value="success">Social</option>
                            <option value="warning">Urgente</option>
                            <option value="danger">Administrativo</option>
                          </select>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                          Agendar
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Instructions */}
              {activeTab === 'instructions' && (
                <div>
                  <h2>Guía del Administrador</h2>
                  <div className="glass-card instruction-card">
                    <div className="instruction-step">
                      <div className="instruction-step-num">1</div>
                      <div>
                        <strong>Crear Docentes y Asignar Grados/Materias</strong>
                        <p style={{ fontSize: '0.85rem' }}>Ve a la sección "Asignación Docentes" para registrar a los maestros e indicar en qué cursos dictan clases.</p>
                      </div>
                    </div>
                    <div className="instruction-step">
                      <div className="instruction-step-num">2</div>
                      <div>
                        <strong>Importar Estudiantes Masivamente</strong>
                        <p style={{ fontSize: '0.85rem' }}>Ve a "Estudiantes por Grado", selecciona el curso y carga un archivo CSV o pega el listado directamente desde Excel para registrarlos al instante.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </section>

          </div>
        </div>

        <footer style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <p>&copy; {new Date().getFullYear()} Control Académico - Registro Digital Virtual. Administrador.</p>
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

      {/* Main Layout */}
      <div className="main-content animate-fade-in">
        <div className="dashboard-layout">
          
          {/* Teacher Sidebar Menu */}
          <aside className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
            <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Seleccionar Grado / Curso
              </label>
              <select 
                className="form-select" 
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setActiveTab('grades');
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

          {/* Teacher Screen Area */}
          <section className="content-area">
            
            {/* TEACHER: Tab Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                <h2>Dashboard Docente</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Tus asignaturas a cargo.</p>

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

            {/* TEACHER: Tab Grades (With 4 Evaluations, Horizontal subject navigation, and Assessment Dialog Button) */}
            {activeTab === 'grades' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h2>Planilla de Notas: <span style={{ color: 'var(--primary)' }}>{selectedGrade || 'Sin Selección'}</span></h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Haz clic en el icono <svg style={{ display: 'inline', verticalAlign: 'middle' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><polyline points="10 9 9 9 8 9"/></svg> al lado de la nota para evaluar usando la Rúbrica de Tobón o Lista de Cotejo.</p>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Buscar estudiante..." 
                    className="form-input" 
                    style={{ maxWidth: '200px', padding: '0.4rem 0.75rem' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Horizontal Subjects Bar */}
                {selectedGrade && (
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
                  </div>
                )}

                {/* Spreadsheet Table */}
                {selectedGrade && selectedSubject ? (
                  <div className="custom-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Estudiante</th>
                          <th style={{ width: '130px', textAlign: 'center' }}>Ev 1</th>
                          <th style={{ width: '130px', textAlign: 'center' }}>Ev 2</th>
                          <th style={{ width: '130px', textAlign: 'center' }}>Ev 3</th>
                          <th style={{ width: '130px', textAlign: 'center' }}>Ev 4</th>
                          <th style={{ textAlign: 'center' }}>Promedio Final</th>
                          <th>Estado</th>
                          <th>Asistencia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsFilteredByGrade
                          .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(s => {
                            const studentGrades = s.grades?.[selectedSubject] || [80, 80, 80, 80];
                            const avg = (studentGrades.reduce((a, b) => a + b, 0) / 4);
                            const isPassing = avg >= 70;

                            return (
                              <tr key={s.id}>
                                <td style={{ fontWeight: 600 }}>{s.name}</td>
                                
                                {/* 4 Evaluations Columns */}
                                {[0, 1, 2, 3].map(evalIdx => (
                                  <td key={evalIdx}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <input 
                                        type="number" 
                                        className="form-input" 
                                        style={{ padding: '0.35rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}
                                        value={studentGrades[evalIdx]}
                                        onChange={(e) => handleCellGradeChange(s.id, selectedSubject, evalIdx, e.target.value)}
                                        min="0"
                                        max="100"
                                      />
                                      <button 
                                        className="btn-secondary" 
                                        style={{ padding: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => openAssessmentModal(s.id, selectedSubject, evalIdx)}
                                        title="Evaluar con Instrumento"
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                          <polyline points="14 2 14 8 20 8"/>
                                          <line x1="16" y1="13" x2="8" y2="13"/>
                                          <line x1="16" y1="17" x2="8" y2="17"/>
                                          <polyline points="10 9 9 9 8 9"/>
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                ))}

                                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '1.05rem', color: isPassing ? 'var(--success)' : 'var(--danger)' }}>
                                  {avg.toFixed(1)}
                                </td>
                                <td>
                                  <span className={`badge ${isPassing ? 'badge-success' : 'badge-danger'}`}>
                                    {isPassing ? 'Aprobado' : 'Reprobado'}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button className="btn-primary" style={{ padding: '0.25rem 0.4rem', fontSize: '0.72rem' }} onClick={() => handleUpdateAttendance(s.id, 'present')}>
                                      P
                                    </button>
                                    <button className="btn-secondary" style={{ padding: '0.25rem 0.4rem', fontSize: '0.72rem' }} onClick={() => handleUpdateAttendance(s.id, 'absent')}>
                                      A
                                    </button>
                                    <span style={{ fontSize: '0.72rem', alignSelf: 'center', fontFamily: 'var(--font-mono)', marginLeft: '0.25rem' }}>
                                      {((s.present / s.total) * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                    Por favor selecciona un Grado y Asignatura.
                  </div>
                )}
              </div>
            )}

            {/* TEACHER: Tab Calendar */}
            {activeTab === 'calendar' && (
              <div>
                <h2>Calendario Escolar</h2>
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

                  <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Eventos</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {calendarEvents.map(ev => (
                        <li key={ev.id} style={{ padding: '0.5rem', borderLeft: `3px solid ${ev.type === 'primary' ? 'var(--primary)' : 'var(--success)'}`, backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                          <strong>{ev.title}</strong> - {ev.date}
                          <p style={{ color: 'var(--text-secondary)' }}>{ev.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TEACHER: Tab Instruments (Edit Rubric, Checklist, Scale with simulated Copilot IA assistant) */}
            {activeTab === 'instruments' && (
              <div>
                <h2>Instrumentos de Evaluación Ponderada</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Define las competencias, indicadores y actividades para cada una de las 4 evaluaciones de la asignatura.
                </p>

                {selectedGrade && selectedSubject ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem' }}>
                    
                    {/* Evaluations list selector */}
                    <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'start' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                        Evaluaciones del Periodo
                      </span>
                      {[0, 1, 2, 3].map(idx => (
                        <button 
                          key={idx}
                          className={`nav-item ${activeInstrumentIdx === idx ? 'active' : ''}`}
                          onClick={() => setActiveInstrumentIdx(idx)}
                          style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                        >
                          Evaluación {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Edit form with AI button */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                        <h3>Configuración del Instrumento: Evaluación {activeInstrumentIdx + 1}</h3>
                        <button className="ai-copilot-badge" onClick={runAiCopilotSimulation} type="button">
                          ⚡ Generar con IA (Gemini/Copilot)
                        </button>
                      </div>

                      <form onSubmit={handleSaveInstrument}>
                        <div className="form-group">
                          <label>Nombre de la Actividad</label>
                          <input 
                            type="text" 
                            className="form-input"
                            value={instrumentEditState.activity}
                            onChange={(e) => setInstrumentEditState(prev => ({ ...prev, activity: e.target.value }))}
                            placeholder="Ej. Taller de ecuaciones algebraicas"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Competencia Fundamental</label>
                          <input 
                            type="text" 
                            className="form-input"
                            value={instrumentEditState.competence}
                            onChange={(e) => setInstrumentEditState(prev => ({ ...prev, competence: e.target.value }))}
                            placeholder="Ej. Pensamiento crítico y resolución de problemas"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Indicador de Logro</label>
                          <input 
                            type="text" 
                            className="form-input"
                            value={instrumentEditState.indicator}
                            onChange={(e) => setInstrumentEditState(prev => ({ ...prev, indicator: e.target.value }))}
                            placeholder="Ej. Desarrolla despejes lineales complejos en ejercicios contextualizados"
                            required
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Tipo de Instrumento</label>
                            <select 
                              className="form-select"
                              value={instrumentEditState.type}
                              onChange={(e) => setInstrumentEditState(prev => ({ ...prev, type: e.target.value }))}
                            >
                              <option value="rubrica">Rúbrica Socio-cognitiva</option>
                              <option value="lista">Lista de Cotejo</option>
                              <option value="escala">Escala Estimativa</option>
                            </select>
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Criterios de Evaluación (Separados por comas)</label>
                            <input 
                              type="text" 
                              className="form-input"
                              value={instrumentEditState.criteriaText}
                              onChange={(e) => setInstrumentEditState(prev => ({ ...prev, criteriaText: e.target.value }))}
                              placeholder="Ej. Algoritmo, Signos, Resultado"
                            />
                          </div>
                        </div>

                        {/* AI simulation text popup output */}
                        {isAiGenerating && (
                          <div className="ai-prompt-box">
                            <span className="badge" style={{ backgroundColor: 'purple', color: '#fff', alignSelf: 'start', fontSize: '0.7rem' }}>Analizando...</span>
                            <div className="ai-typing-effect">Esbozando rúbrica socio-cognitiva basada en Tobón para tu actividad...</div>
                          </div>
                        )}
                        
                        {aiTypingText && !isAiGenerating && (
                          <div className="ai-prompt-box" style={{ borderColor: 'var(--primary)' }}>
                            <span className="badge" style={{ backgroundColor: 'var(--primary)', color: '#fff', alignSelf: 'start', fontSize: '0.7rem' }}>Gemini Sugiere:</span>
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {aiTypingText}
                            </pre>
                            <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', alignSelf: 'flex-end' }} onClick={() => setAiTypingText('')}>
                              Cerrar Sugerencia
                            </button>
                          </div>
                        )}

                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                          Guardar Configuración de Instrumento
                        </button>
                      </form>
                    </div>

                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                    Por favor selecciona un Grado y Asignatura en la barra lateral.
                  </div>
                )}
              </div>
            )}

            {/* TEACHER: Tab Instructions */}
            {activeTab === 'instructions' && (
              <div>
                <h2>Manual del Docente</h2>
                <div className="glass-card instruction-card">
                  <div className="instruction-step">
                    <div className="instruction-step-num">1</div>
                    <div>
                      <strong>Establece el Instrumento Evaluativo</strong>
                      <p style={{ fontSize: '0.85rem' }}>Ve a la pestaña "Instrumentos de Eval.", selecciona la evaluación (1 a 4) y escribe la actividad, competencia y criterios. Puedes usar el botón de **Gemini/Copilot** para autocompletar.</p>
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-step-num">2</div>
                    <div>
                      <strong>Evalúa con Rúbrica o Lista de Cotejo</strong>
                      <p style={{ fontSize: '0.85rem' }}>Ve a "Planilla Calificaciones", haz clic en el icono de libreta al lado de la nota del alumno. El sistema cargará el instrumento configurado. Selecciona el nivel de desempeño del alumno y el puntaje se inyectará automáticamente en la celda.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </section>

        </div>
      </div>

      {/* ASSESSMENT MODAL WINDOW */}
      {isAssessmentModalOpen && activeAssessment && (
        <div className="modal-backdrop">
          <div className="modal-card">
            
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Evaluación del Estudiante: {activeAssessment.studentName}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Asignatura: <strong>{SUBJECTS[activeAssessment.subjectKey].name}</strong> | Grado: <strong>{selectedGrade}</strong> | Evaluación {activeAssessment.evalIdx + 1}
                </span>
              </div>
              <button 
                style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                onClick={() => setIsAssessmentModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--bg-primary)' }}>
                <p style={{ marginBottom: '0.25rem' }}><strong>Actividad:</strong> {activeAssessment.config.activity || `Taller Evaluado ${activeAssessment.evalIdx + 1}`}</p>
                <p style={{ marginBottom: '0.25rem' }}><strong>Competencia:</strong> {activeAssessment.config.competence || 'Competencia Escolar'}</p>
                <p style={{ marginBottom: '0.25rem' }}><strong>Indicador:</strong> {activeAssessment.config.indicator || 'Desempeña tareas de acuerdo a las directrices'}</p>
                <p style={{ marginBottom: 0 }}><strong>Tipo de Instrumento:</strong> <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{activeAssessment.config.type === 'rubrica' ? 'Rúbrica Socio-cognitiva' : activeAssessment.config.type === 'lista' ? 'Lista de Cotejo' : 'Escala Estimativa'}</span></p>
              </div>

              {/* View: Rubric or Rating Scale (Renders Tobon levels) */}
              {(activeAssessment.config.type === 'rubrica' || activeAssessment.config.type === 'escala') ? (
                <div>
                  <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Selecciona el Nivel de Desempeño (Taxonomía Socio-cognitiva de Tobón)</h4>
                  
                  {/* Estrategico */}
                  <div 
                    className={`tobon-level-card estrategico ${selectedTobonLevel === 'estrategico' ? 'selected' : ''}`}
                    onClick={() => setSelectedTobonLevel('estrategico')}
                  >
                    <span className="tobon-level-name">Estratégico</span>
                    <div className="tobon-level-desc">
                      {activeAssessment.config.levels?.estrategico || 'Desempeño estratégico de excelencia.'}
                      <span className="tobon-score-indicator">(90-100 pts)</span>
                    </div>
                  </div>

                  {/* Autonomo */}
                  <div 
                    className={`tobon-level-card autonomo ${selectedTobonLevel === 'autonomo' ? 'selected' : ''}`}
                    onClick={() => setSelectedTobonLevel('autonomo')}
                  >
                    <span className="tobon-level-name">Autónomo</span>
                    <div className="tobon-level-desc">
                      {activeAssessment.config.levels?.autonomo || 'Desempeño autónomo independiente.'}
                      <span className="tobon-score-indicator">(80-89 pts)</span>
                    </div>
                  </div>

                  {/* Resolutivo */}
                  <div 
                    className={`tobon-level-card resolutivo ${selectedTobonLevel === 'resolutivo' ? 'selected' : ''}`}
                    onClick={() => setSelectedTobonLevel('resolutivo')}
                  >
                    <span className="tobon-level-name">Resolutivo</span>
                    <div className="tobon-level-desc">
                      {activeAssessment.config.levels?.resolutivo || 'Desempeño resolutivo estándar.'}
                      <span className="tobon-score-indicator">(70-79 pts)</span>
                    </div>
                  </div>

                  {/* Receptivo */}
                  <div 
                    className={`tobon-level-card receptivo ${selectedTobonLevel === 'receptivo' ? 'selected' : ''}`}
                    onClick={() => setSelectedTobonLevel('receptivo')}
                  >
                    <span className="tobon-level-name">Receptivo</span>
                    <div className="tobon-level-desc">
                      {activeAssessment.config.levels?.receptivo || 'Desempeño básico receptivo.'}
                      <span className="tobon-score-indicator">(60-69 pts)</span>
                    </div>
                  </div>

                  {/* Preformal */}
                  <div 
                    className={`tobon-level-card preformal ${selectedTobonLevel === 'preformal' ? 'selected' : ''}`}
                    onClick={() => setSelectedTobonLevel('preformal')}
                  >
                    <span className="tobon-level-name">Pre-formal</span>
                    <div className="tobon-level-desc">
                      {activeAssessment.config.levels?.preformal || 'Nivel de inicio preformal.'}
                      <span className="tobon-score-indicator">(50-59 pts)</span>
                    </div>
                  </div>

                </div>
              ) : (
                /* View: Checklist */
                <div>
                  <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Lista de Cotejo: Cumplimiento de Criterios</h4>
                  <table className="eval-checklist-table">
                    <tbody>
                      {(activeAssessment.config.criteria || ['Criterio 1', 'Criterio 2', 'Criterio 3']).map((crit, idx) => (
                        <tr key={idx}>
                          <td style={{ width: '40px' }}>
                            <input 
                              type="checkbox" 
                              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                              checked={checklistChecks[idx] || false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setChecklistChecks(prev => {
                                  const next = [...prev];
                                  next[idx] = checked;
                                  return next;
                                });
                              }}
                            />
                          </td>
                          <td>
                            <strong style={{ fontSize: '0.95rem' }}>{crit}</strong>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Indicador verificado para la actividad.</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ marginTop: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                    * Calificación estimada: {
                      checklistChecks.filter(c => c).length === 0 ? '50 / 100' :
                      checklistChecks.filter(c => c).length === 1 ? '70 / 100' :
                      checklistChecks.filter(c => c).length === 2 ? '85 / 100' : '100 / 100'
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsAssessmentModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleApplyAssessment}>
                Aplicar Nota Evaluada
              </button>
            </div>

          </div>
        </div>
      )}

      <footer style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <p>&copy; {new Date().getFullYear()} Control Académico - Registro Digital Virtual. Docente Activo.</p>
      </footer>
    </div>
  );
}
