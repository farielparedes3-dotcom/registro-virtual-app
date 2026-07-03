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

const INITIAL_CRITERIA_MATH = [
  {
    name: "Claridad",
    levels: {
      estrategico: "Analiza y explica los pasos algebraicos de manera clara y precisa.",
      autonomo: "Describe los pasos matemáticos con claridad con mínimas ambigüedades.",
      resolutivo: "Identifica los pasos básicos aunque a veces es difícil de entender.",
      receptivo: "Menciona nociones aisladas de forma confusa."
    }
  },
  {
    name: "Organización",
    levels: {
      estrategico: "Muestra orden lógico riguroso en los despejes paso a paso.",
      autonomo: "Organiza las ecuaciones de forma adecuada con transiciones fluidas.",
      resolutivo: "Estructura el despeje básico pero salta pasos clave.",
      receptivo: "Presenta el problema de forma desorganizada y difícil de seguir."
    }
  },
  {
    name: "Cálculo y Precisión",
    levels: {
      estrategico: "Obtiene resultados exactos and verifica la solución con soltura.",
      autonomo: "Opera números y variables con precisión con errores mínimos.",
      resolutivo: "Aplica fórmulas bien pero comete fallos aritméticos recurrentes.",
      receptivo: "Confunde signos y reglas básicas de la aritmética."
    }
  },
  {
    name: "Uso de Recursos",
    levels: {
      estrategico: "Aplica de forma innovadora herramientas didácticas o gráficas.",
      autonomo: "Emplea gráficos y esquemas matemáticos de forma correcta.",
      resolutivo: "Usa recursos básicos para ilustrar el problema.",
      receptivo: "Utiliza recursos de forma inadecuada o errónea."
    }
  },
  {
    name: "Dominio del Tema",
    levels: {
      estrategico: "Explica y fundamenta la ley matemática con solidez.",
      autonomo: "Describe la ley matemática con buena comprensión.",
      resolutivo: "Comprende el tema de manera superficial.",
      receptivo: "Repite información limitada sin entender el concepto."
    }
  }
];

const DEFAULT_EVALUATION_CONFIGS = {
  "1ro A_math": [
    {
      id: 0,
      activity: "Álgebra y Ecuaciones",
      competence: "Resolución de problemas cotidianos usando herramientas algebraicas.",
      indicator: "Resuelve ecuaciones lineales aplicando propiedades de la igualdad.",
      type: "rubrica",
      criteria: INITIAL_CRITERIA_MATH
    },
    {
      id: 1,
      activity: "Geometría del Triángulo",
      competence: "Pensamiento espacial y modelamiento geométrico.",
      indicator: "Calcula perímetros y áreas aplicando teoremas básicos.",
      type: "rubrica",
      criteria: INITIAL_CRITERIA_MATH
    },
    {
      id: 2,
      activity: "Sistemas de Fracciones",
      competence: "Razonamiento cuantitativo y operaciones fraccionarias.",
      indicator: "Resuelve problemas de reparto aplicando sumas de fracciones.",
      type: "lista",
      criteria: [
        { name: "Simplifica fracciones", levels: { cumple: "Sí simplifica", nocumple: "No simplifica" } },
        { name: "Suma con distinto denominador", levels: { cumple: "Sí suma", nocumple: "No suma" } },
        { name: "Resuelve problemas de reparto", levels: { cumple: "Sí resuelve", nocumple: "No resuelve" } }
      ]
    },
    {
      id: 3,
      activity: "Examen de Razonamiento",
      competence: "Estructuración lógica abstracta.",
      indicator: "Completa secuencias numéricas justificando la ley de cambio.",
      type: "rubrica",
      criteria: INITIAL_CRITERIA_MATH
    }
  ]
};

const normalizeCriteria = (criteriaArray, type = 'rubrica') => {
  if (!Array.isArray(criteriaArray)) return [];
  return criteriaArray.map(crit => {
    if (!crit) return { name: "Criterio", levels: {} };
    if (typeof crit === 'string') {
      return {
        name: crit,
        levels: type === 'lista' ? { cumple: "Sí cumple de forma clara", nocumple: "No cumple con el criterio" } : {
          estrategico: `Demuestra alta excelencia en el criterio de ${crit.toLowerCase()}.`,
          autonomo: `Desempeña de forma autónoma y lógica el criterio de ${crit.toLowerCase()}.`,
          resolutivo: `Resuelve y aplica el criterio de ${crit.toLowerCase()} de forma correcta.`,
          receptivo: `Muestra nociones básicas y limitadas sobre ${crit.toLowerCase()}.`
        }
      };
    }
    const name = crit.name || "Criterio";
    const levels = crit.levels || {};
    if (type === 'lista') {
      return {
        name,
        levels: {
          cumple: levels.cumple || "Sí cumple",
          nocumple: levels.nocumple || "No cumple"
        }
      };
    } else {
      return {
        name,
        levels: {
          estrategico: levels.estrategico || "Desempeño excelente",
          autonomo: levels.autonomo || "Desempeño muy bueno",
          resolutivo: levels.resolutivo || "Desempeño bueno",
          receptivo: levels.receptivo || "Desempeño regular"
        }
      };
    }
  });
};

const getWeekdaysForMonth = (monthName) => {
  const monthMap = {
    'Agosto': { index: 7, year: 2025 },
    'Septiembre': { index: 8, year: 2025 },
    'Octubre': { index: 9, year: 2025 },
    'Noviembre': { index: 10, year: 2025 },
    'Diciembre': { index: 11, year: 2025 },
    'Enero': { index: 0, year: 2026 },
    'Febrero': { index: 1, year: 2026 },
    'Marzo': { index: 2, year: 2026 },
    'Abril': { index: 3, year: 2026 },
    'Mayo': { index: 4, year: 2026 },
    'Junio': { index: 5, year: 2026 }
  };
  
  const config = monthMap[monthName];
  if (!config) return [];
  
  const daysInMonth = new Date(config.year, config.index + 1, 0).getDate();
  const weekdays = [];
  const weekdayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(config.year, config.index, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Mon to Fri
      weekdays.push({
        dayNum: day,
        dayName: weekdayNames[dayOfWeek],
        dateString: `${config.year}-${String(config.index + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      });
    }
  }
  return weekdays;
};

const normalizeStudentGrades = (grades) => {
  const normalized = {};
  const subjectsList = ['math', 'science', 'language', 'history'];
  
  subjectsList.forEach(sub => {
    const raw = grades?.[sub];
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      normalized[sub] = {
        bloque1: Array.isArray(raw.bloque1) ? [...raw.bloque1] : [80, 80, 80, 80],
        bloque2: Array.isArray(raw.bloque2) ? [...raw.bloque2] : [80, 80, 80, 80],
        bloque3: Array.isArray(raw.bloque3) ? [...raw.bloque3] : [80, 80, 80, 80],
        bloque4: Array.isArray(raw.bloque4) ? [...raw.bloque4] : [80, 80, 80, 80]
      };
    } else {
      const baseArray = Array.isArray(raw) ? [...raw] : [80, 80, 80, 80];
      normalized[sub] = {
        bloque1: baseArray,
        bloque2: [80, 80, 80, 80],
        bloque3: [80, 80, 80, 80],
        bloque4: [80, 80, 80, 80]
      };
    }
  });
  return normalized;
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
    const parsed = saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
    return parsed.map(s => ({
      ...s,
      grades: normalizeStudentGrades(s.grades)
    }));
  });

  const [studentRpGrades, setStudentRpGrades] = useState(() => {
    const saved = localStorage.getItem('s_student_rp_grades');
    return saved ? JSON.parse(saved) : {};
  });

  const [studentAttendanceDetail, setStudentAttendanceDetail] = useState(() => {
    const saved = localStorage.getItem('s_student_attendance_detail');
    return saved ? JSON.parse(saved) : {};
  });

  const [monthlyWorkedDays, setMonthlyWorkedDays] = useState(() => {
    const saved = localStorage.getItem('s_monthly_worked_days');
    return saved ? JSON.parse(saved) : {};
  });

  const [attendanceDayDates, setAttendanceDayDates] = useState(() => {
    const saved = localStorage.getItem('s_attendance_day_dates');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeBloque, setActiveBloque] = useState('bloque1');
  const [selectedAttendanceMonth, setSelectedAttendanceMonth] = useState('Agosto');

  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem('s_events');
    return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
  });

  const [evaluationConfigs, setEvaluationConfigs] = useState(() => {
    const saved = localStorage.getItem('s_eval_configs');
    return saved ? JSON.parse(saved) : DEFAULT_EVALUATION_CONFIGS;
  });

  const [studentAssessments, setStudentAssessments] = useState(() => {
    const saved = localStorage.getItem('s_student_assessments');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // --- Filtering States ---
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [activeAdminGrade, setActiveAdminGrade] = useState('1ro A');

  // Spreadsheet view mode: 'resumen' (summary of 4 evals) OR 'ev_0', 'ev_1', 'ev_2', 'ev_3' (criterios of Ev X)
  const [spreadsheetViewMode, setSpreadsheetViewMode] = useState('resumen');

  // --- Modal Assessment State ---
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState(null); // { studentId, subjectKey, evalIdx, config, studentName }
  const [tempCriteriaRatings, setTempCriteriaRatings] = useState({}); // { [criterionName]: 'autonomo' | ... }

  // --- Real AI Integration Credentials ---
  const [aiProvider, setAiProvider] = useState(() => {
    return localStorage.getItem('s_ai_provider') || 'gemini';
  });
  const [aiApiKey, setAiApiKey] = useState(() => {
    return localStorage.getItem('s_ai_api_key') || '';
  });
  const [showAiConfig, setShowAiConfig] = useState(false);

  // --- Interactive AI Assistant States ---
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([
    {
      sender: 'ai',
      text: '¡Hola! Soy tu asistente de Inteligencia Artificial (Gemini/Copilot). Escríbeme qué instrumento necesitas, la materia, la actividad y qué criterios te gustaría incluir, y yo diseñaré la configuración perfecta para ti.'
    }
  ]);
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const [latestAiGeneratedInstrument, setLatestAiGeneratedInstrument] = useState(null);

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
    topic: '',
    competence: '',
    indicator: '',
    type: 'rubrica',
    criteria: [] // Array of criteria objects
  });

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
    localStorage.setItem('s_student_rp_grades', JSON.stringify(studentRpGrades));
  }, [studentRpGrades]);

  useEffect(() => {
    localStorage.setItem('s_student_attendance_detail', JSON.stringify(studentAttendanceDetail));
  }, [studentAttendanceDetail]);

  useEffect(() => {
    localStorage.setItem('s_monthly_worked_days', JSON.stringify(monthlyWorkedDays));
  }, [monthlyWorkedDays]);

  useEffect(() => {
    localStorage.setItem('s_attendance_day_dates', JSON.stringify(attendanceDayDates));
  }, [attendanceDayDates]);

  useEffect(() => {
    localStorage.setItem('s_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('s_eval_configs', JSON.stringify(evaluationConfigs));
  }, [evaluationConfigs]);

  useEffect(() => {
    localStorage.setItem('s_student_assessments', JSON.stringify(studentAssessments));
  }, [studentAssessments]);

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
      const configKey = `${selectedGrade}_${selectedSubject}_${activeBloque}`;
      const configs = evaluationConfigs[configKey] || [];
      const activeConf = configs[activeInstrumentIdx];

      if (activeConf) {
        setInstrumentEditState({
          activity: activeConf.activity || '',
          topic: activeConf.topic || '',
          competence: activeConf.competence || '',
          indicator: activeConf.indicator || '',
          type: activeConf.type || 'rubrica',
          criteria: activeConf.criteria ? normalizeCriteria(activeConf.criteria, activeConf.type) : []
        });
      } else {
        setInstrumentEditState({
          activity: '',
          topic: '',
          competence: '',
          indicator: '',
          type: 'rubrica',
          criteria: []
        });
      }
    }
  }, [activeInstrumentIdx, selectedGrade, selectedSubject, activeBloque, evaluationConfigs, currentUser]);

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
        math: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
        science: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
        language: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
        history: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] }
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

      let parts = line.split(/[,\t;]/);
      let name = parts[0]?.trim();
      let email = parts[1]?.trim();

      if (name) {
        if (!email) {
          const sanitizedName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.');
          email = `${sanitizedName}@school.edu`;
        }

        addedStudents.push({
          id: 's_' + Math.random().toString(36).substr(2, 9),
          name: name,
          email: email,
          grade: activeAdminGrade,
          grades: {
            math: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
            science: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
            language: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
            history: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] }
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
    if (e) e.preventDefault();
    if (!selectedGrade || !selectedSubject) return;

    if (!instrumentEditState.activity.trim() || !instrumentEditState.topic.trim() || !instrumentEditState.competence.trim() || !instrumentEditState.indicator.trim()) {
      alert("Por favor complete todos los campos obligatorios: Nombre de la Actividad, Tema/Contenido, Competencia Fundamental e Indicador de Logro.");
      return;
    }

    const configKey = `${selectedGrade}_${selectedSubject}_${activeBloque}`;
    const currentConfigs = evaluationConfigs[configKey] || [
      { id: 0, activity: '', topic: '', competence: '', indicator: '', type: 'rubrica', criteria: [] },
      { id: 1, activity: '', topic: '', competence: '', indicator: '', type: 'rubrica', criteria: [] },
      { id: 2, activity: '', topic: '', competence: '', indicator: '', type: 'rubrica', criteria: [] },
      { id: 3, activity: '', topic: '', competence: '', indicator: '', type: 'rubrica', criteria: [] }
    ];

    const updatedConfig = {
      id: activeInstrumentIdx,
      activity: instrumentEditState.activity,
      topic: instrumentEditState.topic,
      competence: instrumentEditState.competence,
      indicator: instrumentEditState.indicator,
      type: instrumentEditState.type,
      criteria: instrumentEditState.criteria.length > 0 ? instrumentEditState.criteria : [
        {
          name: "Criterio General",
          levels: {
            estrategico: "Desempeño estratégico excelente.",
            autonomo: "Desempeño autónomo muy bueno.",
            resolutivo: "Desempeño resolutivo bueno.",
            receptivo: "Desempeño receptivo regular."
          }
        }
      ]
    };

    const nextConfigs = [...currentConfigs];
    nextConfigs[activeInstrumentIdx] = updatedConfig;

    setEvaluationConfigs(prev => ({
      ...prev,
      [configKey]: nextConfigs
    }));

    alert(`Instrumento de la Evaluación ${activeInstrumentIdx + 1} guardado correctamente.`);
  };

  const handleAddCriterionRow = () => {
    const isList = instrumentEditState.type === 'lista';
    const newCrit = {
      name: `Criterio ${instrumentEditState.criteria.length + 1}`,
      levels: isList ? { cumple: "Sí cumple", nocumple: "No cumple" } : {
        estrategico: "Descripción nivel estratégico (Excelente)",
        autonomo: "Descripción nivel autónomo (Muy bueno)",
        resolutivo: "Descripción nivel resolutivo (Bueno)",
        receptivo: "Descripción nivel receptivo (Regular)"
      }
    };
    setInstrumentEditState(prev => ({
      ...prev,
      criteria: [...prev.criteria, newCrit]
    }));
  };

  const handleRemoveCriterionRow = (idxToRemove) => {
    setInstrumentEditState(prev => ({
      ...prev,
      criteria: prev.criteria.filter((_, idx) => idx !== idxToRemove)
    }));
  };

  const handleEditCriterionName = (idx, nameVal) => {
    setInstrumentEditState(prev => {
      const nextList = [...prev.criteria];
      nextList[idx].name = nameVal;
      return { ...prev, criteria: nextList };
    });
  };

  const handleEditCriterionLevel = (critIdx, levelKey, textVal) => {
    setInstrumentEditState(prev => {
      const nextList = [...prev.criteria];
      nextList[critIdx].levels[levelKey] = textVal;
      return { ...prev, criteria: nextList };
    });
  };

  // --- Real / Offline AI chatbot prompt processing ---
  const saveAiCredentials = (e) => {
    e.preventDefault();
    localStorage.setItem('s_ai_provider', aiProvider);
    localStorage.setItem('s_ai_api_key', aiApiKey);
    setShowAiConfig(false);
    alert('Credenciales de IA guardadas localmente.');
  };

  const handleSendAiMessage = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userMsg = { sender: 'user', text: aiPrompt };
    setAiChatHistory(prev => [...prev, userMsg]);
    const promptText = aiPrompt;
    setAiPrompt('');
    setAiIsTyping(true);

    // If real Gemini provider configured with an API Key, run actual HTTP request!
    if (aiProvider === 'gemini' && aiApiKey.trim()) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${aiApiKey}`;
        const instructionsPrompt = `Eres un asistente de Inteligencia Artificial de excelencia académica.
Genera un instrumento de evaluación estructurado para la siguiente petición: "${promptText}".
Debes clasificarlo según sea 'rubrica', 'lista' (lista de cotejo) o 'escala' (escala estimativa).
Devuelve estrictamente un objeto JSON. No agregues etiquetas markdown de bloques de código como \`\`\`json, solo devuelve el objeto JSON plano para poder parsearlo directamente con JSON.parse.
El formato del objeto JSON a retornar debe ser:
{
  "activity": "Nombre descriptivo de la actividad académica en base al prompt",
  "competence": "Definición clara y concisa de la competencia fundamental implicada (1 sola frase)",
  "indicator": "Definición clara y pedagógica del indicador de logro (1 sola frase)",
  "type": "rubrica" o "lista" o "escala",
  "criteria": [
    {
      "name": "Nombre del Criterio 1",
      "levels": {
        "estrategico": "Descripción pedagógica detallada del nivel estratégico (Excelente / 4 puntos)",
        "autonomo": "Descripción pedagógica detallada del nivel autónomo (Muy bueno / 3 puntos)",
        "resolutivo": "Descripción pedagógica del nivel resolutivo (Bueno / 2 puntos)",
        "receptivo": "Descripción del nivel receptivo (Regular / 1 punto)",
        "preformal": "Descripción del nivel preformal (Insuficiente / 0 puntos)"
      }
    },
    ... genera al menos 3 o 4 criterios en el arreglo de criterios
  ]
}

En caso de que el tipo sea "lista", el objeto levels solo debe tener las propiedades "cumple" y "nocumple".
Petición del docente: "${promptText}"`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: instructionsPrompt }]
            }]
          })
        });

        if (!response.ok) {
          throw new Error(`Error API (${response.status})`);
        }

        const resData = await response.json();
        let rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // Clean markdown JSON wrapper if the model outputted it
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsedResult = JSON.parse(rawText);

        setLatestAiGeneratedInstrument(parsedResult);

        const aiResponse = {
          sender: 'ai',
          text: `[Gemini Live API]: ¡Perfecto! He generado un instrumento en tiempo real para tu actividad: **"${parsedResult.activity}"**.
          
* **Competencia:** ${parsedResult.competence}
* **Indicador de Logro:** ${parsedResult.indicator}
* **Tipo:** Rúbrica Matricial (${parsedResult.criteria.length} criterios).

Puedes presionar el botón **"Aplicar este instrumento"** abajo para cargarlo directamente en tu grilla editable de evaluación.`
        };

        setAiChatHistory(prev => [...prev, aiResponse]);
        setAiIsTyping(false);
        return;

      } catch (err) {
        console.error("API error, falling back to smart simulation", err);
        // If real fetch fails, fall back to offline simulation
      }
    }

    // --- Offline Smart Parser Simulator ---
    setTimeout(() => {
      const lowerPrompt = promptText.toLowerCase();
      let type = 'rubrica';
      if (lowerPrompt.includes('cotejo') || lowerPrompt.includes('lista') || lowerPrompt.includes('check')) {
        type = 'lista';
      } else if (lowerPrompt.includes('escala')) {
        type = 'escala';
      }

      // Dynamic activity extraction: e.g. "embarazo en la adolescencia"
      let activity = 'Proyecto de Investigación';
      let extractedConcept = 'la actividad escolar';

      // Simple regex parser
      const activityKeywords = promptText.match(/(?:para|sobre|evaluar|valuar)\s+([^.,\n?]+)/i);
      if (activityKeywords && activityKeywords[1]) {
        activity = activityKeywords[1].trim();
        activity = activity.charAt(0).toUpperCase() + activity.slice(1);
        extractedConcept = activity;
      }

      let competence = 'Comprende críticamente y analiza temáticas de relevancia social y científica.';
      let indicator = `Investiga, argumenta y expone conclusiones sobre ${extractedConcept}.`;
      
      let criteriaNames = ['Claridad conceptual', 'Organización de ideas', 'Lenguaje y expresión', 'Uso de evidencias', 'Dominio general'];

      if (lowerPrompt.includes('embarazo')) {
        competence = 'Analiza críticamente factores biológicos y socioculturales de la salud reproductiva.';
        indicator = 'Identifica causas y consecuencias socio-comunitarias del embarazo adolescente.';
        criteriaNames = ['Comprensión del problema', 'Análisis sociocultural', 'Argumentación ética', 'Propuestas de prevención', 'Expresión oral'];
      } else if (lowerPrompt.includes('debate') || lowerPrompt.includes('panel')) {
        competence = 'Argumenta de forma oral expresando ideas lógicas basadas en fuentes contrastadas.';
        indicator = 'Debate respetuosamente fundamentando su posición en datos concretos.';
        criteriaNames = ['Argumentación', 'Respeto al oponente', 'Uso de datos/fuentes', 'Fluidez oral', 'Refutación lógica'];
      }

      const generatedCriteria = criteriaNames.map(name => {
        if (type === 'lista') {
          return {
            name: name,
            levels: { cumple: "Sí cumple de forma clara", nocumple: "No cumple con el criterio" }
          };
        }
        return {
          name: name,
          levels: {
            estrategico: `Demuestra alta excelencia y dominio integral en ${name.toLowerCase()} sobre ${extractedConcept}.`,
            autonomo: `Desempeña de forma autónoma, lógica y correcta el criterio de ${name.toLowerCase()}.`,
            resolutivo: `Resuelve y expone el criterio de ${name.toLowerCase()} de forma adecuada aunque con algunas omisiones.`,
            receptivo: `Muestra nociones básicas pero limitadas y repetitivas sobre ${name.toLowerCase()}.`
          }
        };
      });

      const parsedResult = {
        activity: activity,
        competence: competence,
        indicator: indicator,
        type: type,
        criteria: generatedCriteria
      };

      setLatestAiGeneratedInstrument(parsedResult);

      const aiResponse = {
        sender: 'ai',
        text: `[Gemini Offline Simulator]: He diseñado este instrumento personalizado en base a tu prompt para: **"${activity}"**.
        
* **Competencia:** ${competence}
* **Indicador:** ${indicator}
* **Tipo:** Rúbrica (${type}) con ${generatedCriteria.length} criterios.

Haz clic en el botón **"Aplicar este instrumento"** para cargarlo en tu panel matricial editable.`
      };

      setAiChatHistory(prev => [...prev, aiResponse]);
      setAiIsTyping(false);
    }, 1200);
  };

  const handleApplyAiInstrument = () => {
    if (!latestAiGeneratedInstrument) return;

    setInstrumentEditState({
      activity: latestAiGeneratedInstrument.activity,
      competence: latestAiGeneratedInstrument.competence,
      indicator: latestAiGeneratedInstrument.indicator,
      type: latestAiGeneratedInstrument.type,
      criteria: latestAiGeneratedInstrument.criteria
    });

    setLatestAiGeneratedInstrument(null);
    alert('Instrumento cargado en la grilla. ¡Presiona "Guardar Configuración de Instrumento" para registrarlo en el sistema!');
  };

  const handleCellGradeChange = (studentId, subjectKey, evalIdx, newValue) => {
    const numericVal = Math.min(100, Math.max(0, Number(newValue) || 0));
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const nextGrades = { ...s.grades };
        const subjectBlocks = nextGrades[subjectKey] ? { ...nextGrades[subjectKey] } : {};
        const currentArr = [...(subjectBlocks[activeBloque] || [80, 80, 80, 80])];
        currentArr[evalIdx] = numericVal;
        subjectBlocks[activeBloque] = currentArr;
        nextGrades[subjectKey] = subjectBlocks;
        return { ...s, grades: nextGrades };
      }
      return s;
    }));
  };

  const handleRpGradeChange = (studentId, subjectKey, bloqueKey, evalIdx, value) => {
    const student = students.find(s => s.id === studentId);
    const originalGrade = student?.grades?.[subjectKey]?.[bloqueKey]?.[evalIdx] || 0;
    
    if (value !== '' && Number(value) < originalGrade) {
      alert(`La nota de recuperación RP${evalIdx+1} (${value}) no puede ser menor a la nota original P${evalIdx+1} (${originalGrade}).`);
      return;
    }

    const rpKey = `${studentId}_${subjectKey}_${bloqueKey}`;
    const currentRp = studentRpGrades[rpKey] ? [...studentRpGrades[rpKey]] : [null, null, null, null];
    currentRp[evalIdx] = value === '' ? null : Math.min(100, Math.max(0, Number(value)));

    setStudentRpGrades(prev => ({
      ...prev,
      [rpKey]: currentRp
    }));
  };

  const handleUpdateAttendance = (studentId, type) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          present: type === 'present' ? Math.min(s.total, s.present + 1) : Math.max(0, s.present - 1)
        };
      }
      return s;
    }));
  };

  // --- Detailed Grading Spreadsheet Cells handlers ---
  const handleUpdateStudentCriterionScore = (studentId, subjectKey, evalIdx, critName, scoreValue) => {
    // Save detailed score
    const assessmentKey = `${studentId}_${subjectKey}_${activeBloque}_${evalIdx}`;
    const studentAssessment = studentAssessments[assessmentKey] || {};
    const nextAssessment = { ...studentAssessment, [critName]: Number(scoreValue) || 0 };

    setStudentAssessments(prev => ({
      ...prev,
      [assessmentKey]: nextAssessment
    }));

    // Calculate sum of all criteria and update student grades
    const configKey = `${selectedGrade}_${subjectKey}_${activeBloque}`;
    const config = evaluationConfigs[configKey]?.[evalIdx] || { criteria: [] };
    const criteriaList = normalizeCriteria(config.criteria, config.type);
    
    let sum = 0;
    criteriaList.forEach(c => {
      // Check if it's currently being updated, otherwise fetch from state
      if (c.name === critName) {
        sum += Number(scoreValue) || 0;
      } else {
        sum += Number(studentAssessment[c.name]) || 0;
      }
    });

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const nextGrades = { ...s.grades };
        const subjectBlocks = nextGrades[subjectKey] ? { ...nextGrades[subjectKey] } : {};
        const currentArr = [...(subjectBlocks[activeBloque] || [80, 80, 80, 80])];
        currentArr[evalIdx] = Math.min(100, Math.max(0, sum));
        subjectBlocks[activeBloque] = currentArr;
        nextGrades[subjectKey] = subjectBlocks;
        return { ...s, grades: nextGrades };
      }
      return s;
    }));
  };

  // --- Modal Assessment Execution ---
  const openAssessmentModal = (studentId, subjectKey, evalIdx) => {
    const configKey = `${selectedGrade}_${subjectKey}_${activeBloque}`;
    const configs = evaluationConfigs[configKey] || [];
    const config = configs[evalIdx] || {
      id: evalIdx,
      activity: `Evaluación ${evalIdx + 1}`,
      competence: 'Competencia General',
      indicator: 'Indicador Académico',
      type: 'rubrica',
      criteria: INITIAL_CRITERIA_MATH
    };

    const student = students.find(s => s.id === studentId);
    const assessmentKey = `${studentId}_${subjectKey}_${activeBloque}_${evalIdx}`;
    const savedAssessment = studentAssessments[assessmentKey] || {};

    const initialTemp = {};
    const normalizedCriteria = normalizeCriteria(config.criteria, config.type);
    normalizedCriteria.forEach(c => {
      if (config.type === 'lista') {
        initialTemp[c.name] = savedAssessment[c.name] === true;
      } else {
        // if saved value is a number (e.g. 15), map it back to level label
        const numeric = Number(savedAssessment[c.name]) || 15;
        if (numeric >= 18) initialTemp[c.name] = 'estrategico';
        else if (numeric >= 14) initialTemp[c.name] = 'autonomo';
        else if (numeric >= 10) initialTemp[c.name] = 'resolutivo';
        else if (numeric >= 5) initialTemp[c.name] = 'receptivo';
        else initialTemp[c.name] = 'preformal';
      }
    });

    setActiveAssessment({ studentId, subjectKey, evalIdx, config: { ...config, criteria: normalizedCriteria }, studentName: student?.name });
    setTempCriteriaRatings(initialTemp);
    setIsAssessmentModalOpen(true);
  };

  const handleApplyAssessment = () => {
    if (!activeAssessment) return;
    const { studentId, subjectKey, evalIdx, config } = activeAssessment;

    const normalizedCriteria = normalizeCriteria(config.criteria, config.type);
    const criteriaCount = normalizedCriteria.length;
    const maxCritScore = criteriaCount > 0 ? Math.floor(100 / criteriaCount) : 100;

    const nextAssessmentValues = {};
    let totalSum = 0;

    normalizedCriteria.forEach(c => {
      const val = tempCriteriaRatings[c.name];
      let score = 0;
      if (config.type === 'rubrica' || config.type === 'escala') {
        // distribute scores out of max score per criterion
        if (val === 'preformal') score = Math.floor(maxCritScore * 0.55);
        else if (val === 'receptivo') score = Math.floor(maxCritScore * 0.65);
        else if (val === 'resolutivo') score = Math.floor(maxCritScore * 0.75);
        else if (val === 'autonomo') score = Math.floor(maxCritScore * 0.85);
        else score = maxCritScore; // estrategico gets 100% of criterion weight
      } else if (config.type === 'lista') {
        score = val === true ? maxCritScore : Math.floor(maxCritScore * 0.5);
      }
      nextAssessmentValues[c.name] = score;
      totalSum += score;
    });

    const assessmentKey = `${studentId}_${subjectKey}_${activeBloque}_${evalIdx}`;
    setStudentAssessments(prev => ({
      ...prev,
      [assessmentKey]: nextAssessmentValues
    }));

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const nextGrades = { ...s.grades };
        const subjectBlocks = nextGrades[subjectKey] ? { ...nextGrades[subjectKey] } : {};
        const currentArr = [...(subjectBlocks[activeBloque] || [80, 80, 80, 80])];
        currentArr[evalIdx] = Math.min(100, Math.max(0, totalSum));
        subjectBlocks[activeBloque] = currentArr;
        nextGrades[subjectKey] = subjectBlocks;
        return { ...s, grades: nextGrades };
      }
      return s;
    }));

    setIsAssessmentModalOpen(false);
    setActiveAssessment(null);
  };

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

  const getEffectiveGrade = (studentId, subjectKey, bloqueKey, evalIdx, originalGrade) => {
    const rpKey = `${studentId}_${subjectKey}_${bloqueKey}`;
    const rpArray = studentRpGrades[rpKey] || [null, null, null, null];
    const rpVal = rpArray[evalIdx];
    if (originalGrade < 70 && rpVal !== null && rpVal !== undefined && rpVal !== '') {
      return Math.max(originalGrade, Number(rpVal));
    }
    return originalGrade;
  };

  const calculateBlockAvg = (studentId, subjectKey, bloqueKey, studentGradesObject) => {
    const subjectData = studentGradesObject?.[subjectKey] || {};
    const baseGrades = subjectData[bloqueKey] || [80, 80, 80, 80];
    let sum = 0;
    baseGrades.forEach((g, idx) => {
      sum += getEffectiveGrade(studentId, subjectKey, bloqueKey, idx, g);
    });
    return sum / 4;
  };

  const calculateSubjectAvg = (studentId, subjectKey, studentGradesObject) => {
    const b1 = calculateBlockAvg(studentId, subjectKey, 'bloque1', studentGradesObject);
    const b2 = calculateBlockAvg(studentId, subjectKey, 'bloque2', studentGradesObject);
    const b3 = calculateBlockAvg(studentId, subjectKey, 'bloque3', studentGradesObject);
    const b4 = calculateBlockAvg(studentId, subjectKey, 'bloque4', studentGradesObject);
    return (b1 + b2 + b3 + b4) / 4;
  };
  
  const calculateStudentAvg = (s) => {
    const math = calculateSubjectAvg(s.id, 'math', s.grades);
    const science = calculateSubjectAvg(s.id, 'science', s.grades);
    const language = calculateSubjectAvg(s.id, 'language', s.grades);
    const history = calculateSubjectAvg(s.id, 'history', s.grades);
    return (math + science + language + history) / 4;
  };

  const globalAverage = totalStudents > 0 
    ? (students.reduce((acc, s) => acc + calculateStudentAvg(s), 0) / totalStudents).toFixed(1)
    : 0;

  const getSubjectAverage = (subKey) => {
    if (totalStudents === 0) return 0;
    const totalSum = students.reduce((acc, s) => {
      return acc + calculateSubjectAvg(s.id, subKey, s.grades);
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

  const toggleUserActive = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, active: !u.active };
      }
      return u;
    }));
  };

  // --- VIEW: Login ---
  if (!currentUser) {
    return (
      <div className="login-container">
        <div className="login-bg-decor"></div>
        <div className="login-bg-decor-2"></div>
        
        <div className="login-card animate-fade-in" style={{ borderTop: '8px solid var(--primary)' }}>
          <div className="login-header">
            {/* School details matching image exactly */}
            <div style={{ margin: '0.5rem 0 1.5rem 0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#c8102e', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                REGISTRO DE EVALUACIÓN DIGITAL
              </div>
              <h1 className="school-title-highlight" style={{ fontSize: '1.9rem', fontWeight: '800', color: '#003876', margin: '0.25rem 0', letterSpacing: '0.02em', lineHeight: 1.2 }}>
                LICEO ANA ROSA CASTILLO
              </h1>
              <div style={{ marginTop: '0.75rem' }}>
                <span className="district-badge" style={{ backgroundColor: '#e8f0fe', color: '#003876', border: '1px solid #ebdcb9', padding: '0.45rem 1.25rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-block' }}>
                  DISTRITO EDUCATIVO 14-01 NAGUA
                </span>
              </div>
            </div>
            
            {/* Value Proposition / Intention */}
            <div style={{ backgroundColor: '#faf6eb', border: '1px solid #ebdcb9', padding: '1rem 1.25rem', borderRadius: '10px', textAlign: 'left', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.1rem', color: '#003876' }}>🛡️</span>
              <div>
                <strong>Base de datos autónoma de Registro Escolar</strong>: Diseñada para mitigar errores de cálculo, asegurar la evidencia del registro de calificaciones por competencias mediante instrumentos y automatizar la evaluación académica en el centro educativo.
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ color: 'var(--primary)' }}>Correo Electrónico</label>
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
              <label style={{ color: 'var(--primary)' }}>Contraseña</label>
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
              <div style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}>
                ⚠️ {loginError}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', backgroundColor: '#003876' }}>
              Acceder al Registro
            </button>
          </form>

          <div className="demo-box" style={{ borderTopColor: '#ebdcb9' }}>
            <div className="demo-title" style={{ color: 'var(--text-secondary)' }}>Ingreso Rápido de Demostración</div>
            <div className="demo-buttons">
              <button className="btn-demo" style={{ borderColor: '#ebdcb9' }} onClick={() => handleQuickLogin('admin@school.edu', 'admin123')}>
                <span className="role" style={{ color: '#003876' }}>Administrador</span>
                <span className="email">admin@school.edu</span>
              </button>
              <button className="btn-demo" style={{ borderColor: '#ebdcb9' }} onClick={() => handleQuickLogin('profesor.mate@school.edu', 'profe123')}>
                <span className="role" style={{ color: '#003876' }}>Prof. Matemáticas</span>
                <span className="email">profesor.mate@school.edu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Circular Pencil Emblem */}
        <div className="minerd-pencil-badge">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#003876" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
          </svg>
        </div>

        {/* Multicolor cover page footer stripes */}
        <div className="minerd-multicolor-strip">
          <div className="minerd-strip-blue"></div>
          <div className="minerd-strip-green"></div>
          <div className="minerd-strip-yellow"></div>
          <div className="minerd-strip-orange"></div>
          <div className="minerd-strip-red"></div>
        </div>
      </div>
    );
  }

  // --- VIEW: Admin Dashboard ---
  if (currentUser.role === 'admin') {
    return (
      <div className="app-container">
        <header className="header" style={{ borderBottom: '2px solid #ebdcb9' }}>
          <div className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.6rem', color: '#c8102e', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>REGISTRO DE EVALUACIÓN DIGITAL</span>
              <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#003876' }}>LICEO ANA ROSA CASTILLO</span>
              <span style={{ fontSize: '0.68rem', color: '#003876', fontWeight: '700', textTransform: 'uppercase' }}>Distrito 14-01 Nagua</span>
            </div>
            <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.4rem', backgroundColor: 'rgba(0, 56, 118, 0.08)', color: '#003876', border: '1px solid #ebdcb9', borderRadius: '4px', marginLeft: '0.5rem', fontWeight: 'bold', alignSelf: 'center' }}>Admin</span>
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

        <div className="main-content animate-fade-in">
          <div className="dashboard-layout">
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

            <section className="content-area">
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
                    <h3 style={{ marginBottom: '1rem' }}>Resumen de Promedios por Asignatura</h3>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none' }}>
                      <li>Matemáticas: <strong>{mathAvg}%</strong></li>
                      <li>Ciencias: <strong>{scienceAvg}%</strong></li>
                      <li>Lenguaje: <strong>{langAvg}%</strong></li>
                      <li>Historia: <strong>{historyAvg}%</strong></li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'teachers' && (
                <div>
                  <h2>Docentes y Asignación de Materias/Grados</h2>
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
                                  {u.assignments.map((a, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                                      <span><strong>{a.grade}</strong> - {SUBJECTS[a.subject].name}</span>
                                      <button style={{ border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer' }} onClick={() => handleRemoveAssignment(u.id, idx)}>✕</button>
                                    </div>
                                  ))}
                                  <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
                                    <select className="form-select" style={{ padding: '0.25rem', fontSize: '0.78rem' }} value={newAssignment.grade} onChange={(e) => setNewAssignment(prev => ({ ...prev, grade: e.target.value }))}>
                                      <option value="1ro A">1ro A</option>
                                      <option value="1ro B">1ro B</option>
                                      <option value="10° A">10° A</option>
                                      <option value="10° B">10° B</option>
                                    </select>
                                    <select className="form-select" style={{ padding: '0.25rem', fontSize: '0.78rem' }} value={newAssignment.subject} onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}>
                                      <option value="math">Matemáticas</option>
                                      <option value="science">Ciencias</option>
                                      <option value="language">Lenguaje</option>
                                      <option value="history">Historia</option>
                                    </select>
                                    <button className="btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleAddAssignment(u.id)}>Asignar</button>
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
                      <h3>Registrar Docente</h3>
                      <form onSubmit={handleCreateTeacher}>
                        <div className="form-group">
                          <label>Nombre del Docente</label>
                          <input type="text" className="form-input" value={teacherForm.name} onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))} required />
                        </div>
                        <div className="form-group">
                          <label>Correo Electrónico</label>
                          <input type="email" className="form-input" value={teacherForm.email} onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))} required />
                        </div>
                        <div className="form-group">
                          <label>Contraseña</label>
                          <input type="text" className="form-input" value={teacherForm.password} onChange={(e) => setTeacherForm(prev => ({ ...prev, password: e.target.value }))} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Crear Cuenta</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div>
                  <h2>Estudiantes por Grado</h2>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {['1ro A', '1ro B', '10° A', '10° B'].map(g => (
                      <button key={g} className={`btn-secondary ${activeAdminGrade === g ? 'btn-primary' : ''}`} onClick={() => setActiveAdminGrade(g)}>{g}</button>
                    ))}
                  </div>

                  <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                    <h3>Importador Masivo (Grado: {activeAdminGrade})</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      <div>
                        <h4>Subir Archivo CSV</h4>
                        <div className="import-zone" onClick={() => fileInputRef.current.click()}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <span>Seleccionar .CSV</span>
                        </div>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".csv" onChange={handleFileUpload} />
                      </div>
                      <div>
                        <h4>Pegar desde Excel</h4>
                        <form onSubmit={handleTextImportSubmit}>
                          <textarea className="textarea-excel-import" placeholder="Sofia Perez, sofia@correo.com" value={excelImportText} onChange={(e) => setExcelImportText(e.target.value)} />
                          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Procesar Listado</button>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
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
                                <button className="btn-danger" style={{ padding: '0.35rem 0.75rem' }} onClick={() => handleDeleteStudent(s.id)}>Eliminar</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
                      <h3>Inscribir Individual</h3>
                      <form onSubmit={handleAddStudent}>
                        <div className="form-group">
                          <label>Nombre del Alumno</label>
                          <input type="text" className="form-input" value={studentForm.name} onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))} required />
                        </div>
                        <div className="form-group">
                          <label>Correo</label>
                          <input type="email" className="form-input" value={studentForm.email} onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Inscribir</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && (
                <div>
                  <h2>Calendario Escolar</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                      <div className="calendar-grid">
                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                          <div key={d} className="calendar-day-header">{d}</div>
                        ))}
                        {Array.from({ length: 3 }).map((_, idx) => <div key={idx} className="calendar-day-cell other-month"></div>)}
                        {Array.from({ length: 31 }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const dateString = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                          const dayEvents = calendarEvents.filter(ev => ev.date === dateString);
                          return (
                            <div key={dayNum} className="calendar-day-cell">
                              <span>{dayNum}</span>
                              <div>{dayEvents.map(e => <div key={e.id} className={`calendar-event-dot ${e.type}`}>{e.title}</div>)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
                      <h3>Agendar Evento</h3>
                      <form onSubmit={handleAddEvent}>
                        <div className="form-group"><label>Fecha</label><input type="date" className="form-input" value={newEvent.date} onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))} required /></div>
                        <div className="form-group"><label>Título</label><input type="text" className="form-input" value={newEvent.title} onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))} required /></div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Agendar</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: Teacher Dashboard ---
  const activeConfigs = evaluationConfigs[`${selectedGrade}_${selectedSubject}_${activeBloque}`] || [];

  return (
    <div className="app-container">
      <header className="header" style={{ borderBottom: '2px solid #ebdcb9' }}>
        <div className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '0.6rem', color: '#c8102e', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>REGISTRO DE EVALUACIÓN DIGITAL</span>
            <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#003876' }}>LICEO ANA ROSA CASTILLO</span>
            <span style={{ fontSize: '0.68rem', color: '#003876', fontWeight: '700', textTransform: 'uppercase' }}>Distrito 14-01 Nagua</span>
          </div>
          <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.4rem', backgroundColor: 'rgba(0, 56, 118, 0.08)', color: '#003876', border: '1px solid #ebdcb9', borderRadius: '4px', marginLeft: '0.5rem', fontWeight: 'bold', alignSelf: 'center' }}>Docente</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button className="theme-toggle" onClick={toggleTheme} title="Cambiar Tema">
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>
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
            <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', marginLeft: '0.5rem' }} onClick={handleLogout}>Salir</button>
          </div>
        </div>
      </header>

      <div className="main-content animate-fade-in">
        <div className="dashboard-layout">
          <aside className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
            <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Seleccionar Curso / Grado</label>
              <select className="form-select" value={selectedGrade} onChange={(e) => { setSelectedGrade(e.target.value); setActiveTab('grades'); }}>
                {teacherUniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="sidebar-nav">
              <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard Docente</div>
              <div className={`nav-item ${activeTab === 'grades' ? 'active' : ''}`} onClick={() => setActiveTab('grades')}>Planilla Calificaciones</div>
              <div className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>Control Asistencia</div>
              <div className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>Calendario Escolar</div>
              <div className={`nav-item ${activeTab === 'instruments' ? 'active' : ''}`} onClick={() => {
                if (activeBloque === 'promedio_ce') {
                  setActiveBloque('bloque1');
                }
                setActiveTab('instruments');
              }}>Instrumentos de Eval.</div>
              <div className={`nav-item ${activeTab === 'instructions' ? 'active' : ''}`} onClick={() => setActiveTab('instructions')}>Instructivo de Uso</div>
            </div>
          </aside>

          <section className="content-area">
            {activeTab === 'dashboard' && (
              <div>
                <h2>Dashboard Docente</h2>
                <div className="stats-grid">
                  <div className="glass-panel" style={{ padding: '1.25rem' }}><h3>{teacherUniqueGrades.length}</h3><p>Grados a cargo</p></div>
                  <div className="glass-panel" style={{ padding: '1.25rem' }}><h3>{currentUser.assignments.length}</h3><p>Clases totales</p></div>
                </div>
              </div>
            )}

            {/* TEACHER: Tab Grades (Criteria Columns or Summary Mode) */}
            {activeTab === 'grades' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2>Planilla de Notas: <span style={{ color: 'var(--primary)' }}>{selectedGrade || 'Sin Selección'}</span></h2>
                  </div>

                </div>

                {selectedGrade && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Subject Tabs */}
                    <div className="subject-tabs-container" style={{ marginBottom: 0, borderBottom: 'none' }}>
                      {teacherGradeSubjects.map(subKey => (
                        <button key={subKey} className={`subject-tab ${selectedSubject === subKey ? 'active' : ''}`} onClick={() => setSelectedSubject(subKey)}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: SUBJECTS[subKey].color }}></span>
                          {SUBJECTS[subKey].name}
                        </button>
                      ))}
                    </div>

                    {/* Bloques Tabs */}
                    <div className="block-tabs-container" style={{ marginBottom: 0 }}>
                      {['bloque1', 'bloque2', 'bloque3', 'bloque4', 'promedio_ce'].map((b) => (
                        <button 
                          key={b} 
                          className={`block-tab-btn ${activeBloque === b ? 'active' : ''}`}
                          onClick={() => setActiveBloque(b)}
                        >
                          {b === 'bloque1' ? 'Bloque CE1' :
                           b === 'bloque2' ? 'Bloque CE2-CE3' :
                           b === 'bloque3' ? 'Bloque CE4-CE7' :
                           b === 'bloque4' ? 'Bloque CE5-CE6' : 'Promedio de CE'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SPREADSHEET TABLE */}
                {selectedGrade && selectedSubject ? (
                  activeBloque === 'promedio_ce' ? (
                    /* Render Promedio de CE View */
                    (() => {
                      return (
                        <div className="custom-table-container">
                          <table className="custom-table" style={{ tableLayout: 'auto' }}>
                            <thead>
                              {/* Row 1: Group Header */}
                              <tr>
                                <th rowSpan={2} style={{ width: '40px', verticalAlign: 'middle', textAlign: 'center' }}>#</th>
                                <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Estudiante</th>
                                <th colSpan={4} style={{ textAlign: 'center', backgroundColor: '#e2e8f0', color: '#1e293b', fontWeight: '800', letterSpacing: '0.08em', fontSize: '0.85rem', padding: '0.5rem', borderBottom: '1.5px solid var(--border-color)' }}>
                                  Promedio de Competencias Específicas
                                </th>
                                <th rowSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle', width: '150px', fontWeight: 'bold', backgroundColor: '#f1f5f9' }}>Calificación final</th>
                              </tr>
                              <tr>
                                <th style={{ width: '160px', textAlign: 'center', fontSize: '0.78rem' }}>PC1: Competencia 1</th>
                                <th style={{ width: '160px', textAlign: 'center', fontSize: '0.78rem' }}>PC2: Competencia 2</th>
                                <th style={{ width: '160px', textAlign: 'center', fontSize: '0.78rem' }}>PC3: Competencia 3</th>
                                <th style={{ width: '160px', textAlign: 'center', fontSize: '0.78rem' }}>PC4: Competencia 4</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentsFilteredByGrade.map((s, sIdx) => {
                                // Calculate promedios for bloque1, bloque2, bloque3, bloque4
                                const pc1 = calculateBlockAvg(s.id, selectedSubject, 'bloque1', s.grades);
                                const pc2 = calculateBlockAvg(s.id, selectedSubject, 'bloque2', s.grades);
                                const pc3 = calculateBlockAvg(s.id, selectedSubject, 'bloque3', s.grades);
                                const pc4 = calculateBlockAvg(s.id, selectedSubject, 'bloque4', s.grades);

                                // Calificación final: average of pc1..pc4 rounded to nearest integer
                                const finalGradeRaw = (pc1 + pc2 + pc3 + pc4) / 4;
                                const finalGrade = Math.round(finalGradeRaw);

                                return (
                                  <tr key={s.id}>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{sIdx + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                                    
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{pc1.toFixed(1)}</td>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{pc2.toFixed(1)}</td>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{pc3.toFixed(1)}</td>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{pc4.toFixed(1)}</td>
                                    
                                    <td style={{ textAlign: 'center', fontWeight: '800', backgroundColor: '#f1f5f9', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '1.05rem' }}>
                                      {finalGrade}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()
                  ) : (
                    /* Existing Block view */
                    (() => {
                      const showRP1 = studentsFilteredByGrade.some(s => (s.grades?.[selectedSubject]?.[activeBloque]?.[0] || 0) < 70);
                      const showRP2 = studentsFilteredByGrade.some(s => (s.grades?.[selectedSubject]?.[activeBloque]?.[1] || 0) < 70);
                      const showRP3 = studentsFilteredByGrade.some(s => (s.grades?.[selectedSubject]?.[activeBloque]?.[2] || 0) < 70);
                      const showRP4 = studentsFilteredByGrade.some(s => (s.grades?.[selectedSubject]?.[activeBloque]?.[3] || 0) < 70);

                      return (
                        <div className="custom-table-container">
                          <table className="custom-table">
                            
                            {/* Render spreadsheet depending on mode */}
                            {spreadsheetViewMode === 'resumen' ? (
                              /* Standard summary view */
                              <>
                                <thead>
                                  <tr>
                                    <th>Estudiante</th>
                                    <th style={{ width: '130px', textAlign: 'center' }}>P1</th>
                                    {showRP1 && <th style={{ width: '100px', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)' }}>RP1</th>}
                                    <th style={{ width: '130px', textAlign: 'center' }}>P2</th>
                                    {showRP2 && <th style={{ width: '100px', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)' }}>RP2</th>}
                                    <th style={{ width: '130px', textAlign: 'center' }}>P3</th>
                                    {showRP3 && <th style={{ width: '100px', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)' }}>RP3</th>}
                                    <th style={{ width: '130px', textAlign: 'center' }}>P4</th>
                                    {showRP4 && <th style={{ width: '100px', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)' }}>RP4</th>}
                                    <th style={{ textAlign: 'center', width: '150px' }}>Promedio Bloque</th>
                                    <th>Estado</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {studentsFilteredByGrade.map(s => {
                                    const subjectData = s.grades?.[selectedSubject] || {};
                                    const blockArray = subjectData[activeBloque] || [80, 80, 80, 80];
                                    
                                    const rpKey = `${s.id}_${selectedSubject}_${activeBloque}`;
                                    const rpArray = studentRpGrades[rpKey] || [null, null, null, null];
                                    
                                    const avg = calculateBlockAvg(s.id, selectedSubject, activeBloque, s.grades);
                                    const isPassing = avg >= 70;
                                    return (
                                      <tr key={s.id}>
                                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                                        
                                        {/* P1 & RP1 */}
                                        <td>
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <input 
                                              type="number" 
                                              className="form-input" 
                                              style={{ padding: '0.35rem', width: '55px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                              value={blockArray[0]}
                                              disabled
                                            />
                                          </div>
                                        </td>
                                        {showRP1 && (
                                          <td style={{ backgroundColor: 'rgba(239, 68, 68, 0.04)' }}>
                                            <input 
                                              type="number" 
                                              className="form-input" 
                                              style={{ padding: '0.35rem', width: '55px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                              value={rpArray[0] !== null ? rpArray[0] : ''}
                                              onChange={(e) => handleRpGradeChange(s.id, selectedSubject, activeBloque, 0, e.target.value)}
                                              min="0"
                                              max="100"
                                              placeholder="-"
                                            />
                                          </td>
                                        )}

                                        {/* P2 & RP2 */}
                                        <td>
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <input 
                                              type="number" 
                                              className="form-input" 
                                              style={{ padding: '0.35rem', width: '55px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                              value={blockArray[1]}
                                              disabled
                                            />
                                          </div>
                                        </td>
                                        {showRP2 && (
                                          <td style={{ backgroundColor: 'rgba(239, 68, 68, 0.04)' }}>
                                            <input 
                                              type="number" 
                                              className="form-input" 
                                              style={{ padding: '0.35rem', width: '55px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                              value={rpArray[1] !== null ? rpArray[1] : ''}
                                              onChange={(e) => handleRpGradeChange(s.id, selectedSubject, activeBloque, 1, e.target.value)}
                                              min="0"
                                              max="100"
                                              placeholder="-"
                                            />
                                          </td>
                                        )}

                                        {/* P3 & RP3 */}
                                        <td>
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <input 
                                              type="number" 
                                              className="form-input" 
                                              style={{ padding: '0.35rem', width: '55px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                              value={blockArray[2]}
                                              disabled
                                            />
                                          </div>
                                        </td>
                                        {showRP3 && (
                                          <td style={{ backgroundColor: 'rgba(239, 68, 68, 0.04)' }}>
                                            <input 
                                              type="number" 
                                              className="form-input" 
                                              style={{ padding: '0.35rem', width: '55px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                              value={rpArray[2] !== null ? rpArray[2] : ''}
                                              onChange={(e) => handleRpGradeChange(s.id, selectedSubject, activeBloque, 2, e.target.value)}
                                              min="0"
                                              max="100"
                                              placeholder="-"
                                            />
                                          </td>
                                        )}

                                        {/* P4 & RP4 */}
                                        <td>
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <input 
                                              type="number" 
                                              className="form-input" 
                                              style={{ padding: '0.35rem', width: '55px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                              value={blockArray[3]}
                                              disabled
                                            />
                                          </div>
                                        </td>
                                        {showRP4 && (
                                          <td style={{ backgroundColor: 'rgba(239, 68, 68, 0.04)' }}>
                                            <input 
                                              type="number" 
                                              className="form-input" 
                                              style={{ padding: '0.35rem', width: '55px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                                              value={rpArray[3] !== null ? rpArray[3] : ''}
                                              onChange={(e) => handleRpGradeChange(s.id, selectedSubject, activeBloque, 3, e.target.value)}
                                              min="0"
                                              max="100"
                                              placeholder="-"
                                            />
                                          </td>
                                        )}

                                        {/* Average Block */}
                                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: isPassing ? 'var(--success)' : 'var(--danger)' }}>
                                          {avg}
                                        </td>

                                        {/* Status */}
                                        <td>
                                          <span className={`badge ${isPassing ? 'badge-success' : 'badge-danger'}`}>
                                            {isPassing ? 'Aprobado' : 'Reprobado'}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </>
                            ) : (
                              /* Detailed matrix criterion spreadsheet mode */
                              (() => {
                                const activeEvalIdx = Number(spreadsheetViewMode.replace('ev_', ''));
                                const configKey = `${selectedGrade}_${selectedSubject}_${activeBloque}`;
                                const config = evaluationConfigs[configKey]?.[activeEvalIdx] || DEFAULT_EVALUATION_CONFIGS[activeEvalIdx];
                                
                                const criteriaList = normalizeCriteria(config.criteria, config.type);
                                const maxCritScore = Math.floor(100 / criteriaList.length);

                                return (
                                  <>
                                    <thead>
                                      <tr>
                                        <th style={{ width: '50px' }}>#</th>
                                        <th>Estudiante</th>
                                        
                                        {/* Criterias column headers */}
                                        {criteriaList.map((crit, idx) => (
                                          <th key={idx} style={{ textAlign: 'center', minWidth: '130px' }}>
                                            {crit.name}
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                                              (Máx: {maxCritScore} pts)
                                            </div>
                                          </th>
                                        ))}
                                        
                                        <th style={{ textAlign: 'center', width: '100px', backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
                                          Total (100)
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {studentsFilteredByGrade.map((s, sIdx) => {
                                        const assessmentKey = `${s.id}_${selectedSubject}_${activeBloque}_${activeEvalIdx}`;
                                        const savedAssessment = studentAssessments[assessmentKey] || {};
                                        const subjectData = s.grades?.[selectedSubject] || {};
                                        const blockArray = subjectData[activeBloque] || [80, 80, 80, 80];
                                        const currentTotal = blockArray[activeEvalIdx] || 0;

                                        return (
                                          <tr key={s.id}>
                                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{sIdx + 1}</td>
                                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                                            
                                            {/* Criterias values */}
                                            {criteriaList.map((crit, critIdx) => {
                                              const score = savedAssessment[crit.name] !== undefined ? savedAssessment[crit.name] : Math.floor(maxCritScore * 0.75);
                                              return (
                                                <td key={critIdx} style={{ padding: 0 }}>
                                                  
                                                  {/* Dropdown helper select in cell for Tobon level scoring */}
                                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <input 
                                                      type="number" 
                                                      className="criteria-grade-input"
                                                      value={score}
                                                      min="0"
                                                      max={maxCritScore}
                                                      onChange={(e) => handleUpdateStudentCriterionScore(s.id, selectedSubject, activeEvalIdx, crit.name, e.target.value)}
                                                    />
                                                    
                                                    {/* Simple quick selector */}
                                                    {config.type !== 'lista' ? (
                                                      <select 
                                                        style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--text-secondary)', paddingRight: '0.25rem' }}
                                                        value={
                                                          score >= maxCritScore ? 'estrategico' :
                                                          score >= Math.floor(maxCritScore * 0.85) ? 'autonomo' :
                                                          score >= Math.floor(maxCritScore * 0.75) ? 'resolutivo' :
                                                          score >= Math.floor(maxCritScore * 0.65) ? 'receptivo' : 'preformal'
                                                        }
                                                        onChange={(e) => {
                                                          const targetLevel = e.target.value;
                                                          let val = 0;
                                                          if (targetLevel === 'preformal') val = Math.floor(maxCritScore * 0.55);
                                                          else if (targetLevel === 'receptivo') val = Math.floor(maxCritScore * 0.65);
                                                          else if (targetLevel === 'resolutivo') val = Math.floor(maxCritScore * 0.75);
                                                          else if (targetLevel === 'autonomo') val = Math.floor(maxCritScore * 0.88);
                                                          else if (targetLevel === 'estrategico') val = maxCritScore;
                                                          
                                                          handleUpdateStudentCriterionScore(s.id, selectedSubject, activeEvalIdx, crit.name, val);
                                                        }}
                                                      >
                                                        <option value="preformal">Preformal</option>
                                                        <option value="receptivo">Receptivo</option>
                                                        <option value="resolutivo">Resolutivo</option>
                                                        <option value="autonomo">Autónomo</option>
                                                        <option value="estrategico">Estratégico</option>
                                                      </select>
                                                    ) : (
                                                      <select 
                                                        style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--text-secondary)', paddingRight: '0.25rem' }}
                                                        value={score >= maxCritScore ? 'si' : 'no'}
                                                        onChange={(e) => {
                                                          const val = e.target.value === 'si' ? maxCritScore : Math.floor(maxCritScore * 0.5);
                                                          handleUpdateStudentCriterionScore(s.id, selectedSubject, activeEvalIdx, crit.name, val);
                                                        }}
                                                      >
                                                        <option value="si">Sí (100%)</option>
                                                        <option value="no">No (50%)</option>
                                                      </select>
                                                    )}
                                                  </div>

                                                </td>
                                              );
                                            })}
                                            
                                            {/* Total sum column */}
                                            <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold', backgroundColor: 'var(--bg-secondary)' }}>
                                              {currentTotal}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </>
                                );
                              })()
                            )}
                          </table>
                        </div>
                      );
                    })()
                  )
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                    Por favor selecciona un Grado y Asignatura.
                  </div>
                )}
              </div>
            )}

            {/* TEACHER: Tab Attendance */}
            {activeTab === 'attendance' && (
              <div>
                <h2>Control de Asistencia: <span style={{ color: 'var(--primary)' }}>{selectedGrade || 'Sin Selección'}</span></h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Haz clic en el círculo correspondiente a cada día laborable para alternar entre: **P** (Presente), **A** (Ausente), **T** (Tardanza), **E** (Excusa) o **R** (Retirado). Las celdas vacías no suman ni restan al total.
                </p>

                <div className="attendance-month-tabs">
                  {['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'].map(m => (
                    <button 
                      key={m} 
                      className={`attendance-month-btn ${selectedAttendanceMonth === m ? 'active' : ''}`}
                      onClick={() => setSelectedAttendanceMonth(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {selectedGrade && selectedSubject ? (
                  (() => {
                    // Calculate activeColumns (indices 0 to 20 where the day number has been filled)
                    const activeColumns = [];
                    Array.from({ length: 21 }).forEach((_, idx) => {
                      const dateKey = `${selectedGrade}_${selectedSubject}_${selectedAttendanceMonth}_day_${idx}`;
                      const dateVal = attendanceDayDates[dateKey] || '';
                      if (dateVal.trim() !== '') {
                        activeColumns.push(idx);
                      }
                    });
                    const currentMonthWorkedDays = activeColumns.length;

                    // Calculate total worked days general across all months in the year
                    const monthsList = ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
                    const totalWorkedDaysGeneral = monthsList.reduce((sum, mName) => {
                      let count = 0;
                      Array.from({ length: 21 }).forEach((_, idx) => {
                        const mKey = `${selectedGrade}_${selectedSubject}_${mName}_day_${idx}`;
                        const dateVal = attendanceDayDates[mKey] || '';
                        if (dateVal.trim() !== '') {
                          count++;
                        }
                      });
                      return sum + count;
                    }, 0);

                    return (
                      <>
                        {/* Config Panel for Worked Days */}
                        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                              Días Trabajados en {selectedAttendanceMonth}: <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>{currentMonthWorkedDays}</strong>
                            </span>
                          </div>
                          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                              Total Días Trabajados General: <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>{totalWorkedDaysGeneral}</strong>
                            </span>
                          </div>
                          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px dashed var(--text-muted)', display: 'inline-block' }}></span>
                              Vacío (Neutro)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(46, 125, 50, 0.15)', border: '1.5px solid var(--success)', display: 'inline-block' }}></span>
                              P (Presente)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(200, 16, 46, 0.15)', border: '1.5px solid var(--danger)', display: 'inline-block' }}></span>
                              A (Ausente)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(245, 124, 0, 0.15)', border: '1.5px solid var(--warning)', display: 'inline-block' }}></span>
                              T (Tardanza)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(33, 150, 243, 0.15)', border: '1.5px solid #2196f3', display: 'inline-block' }}></span>
                              E (Excusa)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(93, 103, 112, 0.15)', border: '1.5px solid #5d6770', display: 'inline-block' }}></span>
                              R (Retirado)
                            </span>
                          </div>
                        </div>

                        {/* Grid Table */}
                        <div className="custom-table-container">
                          <table className="custom-table" style={{ tableLayout: 'fixed', width: '1000px' }}>
                            <thead>
                              {/* Row 1: Group Header matching registry cover cover image layout */}
                              <tr>
                                <th rowSpan={2} style={{ width: '40px', verticalAlign: 'middle', textAlign: 'center' }}>#</th>
                                <th rowSpan={2} style={{ width: '180px', verticalAlign: 'middle' }}>Estudiante</th>
                                <th colSpan={21} style={{ textAlign: 'center', backgroundColor: '#e2e8f0', color: '#1e293b', fontWeight: '800', letterSpacing: '0.08em', fontSize: '0.85rem', padding: '0.5rem', borderBottom: '1.5px solid var(--border-color)' }}>
                                  DÍAS TRABAJADOS
                                </th>
                                <th rowSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle', width: '55px', fontWeight: 'bold' }}>T</th>
                                <th rowSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle', width: '55px', fontWeight: 'bold' }}>%</th>
                              </tr>
                              {/* Row 2: Day numbers 1 to 21 */}
                              <tr>
                                {Array.from({ length: 21 }).map((_, idx) => (
                                  <th key={idx} style={{ textAlign: 'center', width: '32px', padding: '0.4rem 0.2rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {idx + 1}
                                  </th>
                                ))}
                              </tr>
                              {/* Row 3: Day dates inputs where the teacher types the days */}
                              <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                                <td></td>
                                <td style={{ fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>
                                  DÍAS
                                </td>
                                {Array.from({ length: 21 }).map((_, idx) => {
                                  const dateKey = `${selectedGrade}_${selectedSubject}_${selectedAttendanceMonth}_day_${idx}`;
                                  const dateVal = attendanceDayDates[dateKey] || '';
                                  return (
                                    <td key={idx} style={{ padding: '0.2rem', textAlign: 'center', borderBottom: '2px solid var(--border-color)' }}>
                                      <input 
                                        type="text"
                                        maxLength="2"
                                        style={{
                                          width: '26px',
                                          height: '24px',
                                          padding: '0.1rem',
                                          textAlign: 'center',
                                          fontSize: '0.72rem',
                                          fontWeight: '800',
                                          border: '1.5px solid var(--border-color)',
                                          borderRadius: '4px',
                                          backgroundColor: 'var(--bg-secondary)',
                                          color: 'var(--text-primary)',
                                          outline: 'none'
                                        }}
                                        value={dateVal}
                                        placeholder=""
                                        onChange={(e) => {
                                          const val = e.target.value.replace(/\D/g, ''); // only digits
                                          setAttendanceDayDates(prev => ({
                                            ...prev,
                                            [dateKey]: val
                                          }));
                                        }}
                                      />
                                    </td>
                                  );
                                })}
                                <td style={{ padding: '0.2rem', textAlign: 'center', borderBottom: '2px solid var(--border-color)' }}>
                                  <div 
                                    style={{
                                      width: '28px',
                                      height: '24px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.75rem',
                                      fontWeight: '800',
                                      border: '1.5px solid var(--primary)',
                                      borderRadius: '4px',
                                      backgroundColor: 'var(--primary-glow)',
                                      color: 'var(--primary)',
                                      margin: '0 auto'
                                    }}
                                  >
                                    {currentMonthWorkedDays}
                                  </div>
                                </td>
                                <td style={{ borderBottom: '2px solid var(--border-color)' }}></td>
                              </tr>
                            </thead>
                            <tbody>
                              {studentsFilteredByGrade.map((s, sIdx) => {
                                let aCount = 0;
                                let eCount = 0;
                                let rCount = 0;
                                let tCount = 0;
                                let pCount = 0;

                                Array.from({ length: 21 }).forEach((_, idx) => {
                                  const dateKey = `${selectedGrade}_${selectedSubject}_${selectedAttendanceMonth}_day_${idx}`;
                                  const dateVal = attendanceDayDates[dateKey] || '';
                                  if (dateVal.trim() !== '') {
                                    const attendanceKey = `${s.id}_${selectedSubject}_${selectedAttendanceMonth}_col_${idx}`;
                                    const status = studentAttendanceDetail[attendanceKey] || '';
                                    if (status === 'A') aCount++;
                                    else if (status === 'E') eCount++;
                                    else if (status === 'R') rCount++;
                                    else if (status === 'T') tCount++;
                                    else if (status === 'P') pCount++;
                                  }
                                });

                                // Active evaluated days for student
                                const activeDays = Math.max(0, currentMonthWorkedDays - rCount);
                                
                                // 3 excuses = 1 absence
                                const excuseAbsences = Math.floor(eCount / 3);
                                const excusePresences = eCount - excuseAbsences;
                                
                                // Total present days (T)
                                const finalPresentDays = pCount + tCount + excusePresences;
                                const cappedT = Math.min(activeDays, finalPresentDays);
                                
                                // Percentage calculation
                                const attendancePercentage = activeDays > 0 
                                  ? Math.round((cappedT / activeDays) * 100) 
                                  : 0;

                                const isRetiredStudent = rCount >= currentMonthWorkedDays || activeDays === 0;

                                return (
                                  <tr key={s.id}>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{sIdx + 1}</td>
                                    <td style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</td>
                                    
                                    {Array.from({ length: 21 }).map((_, idx) => {
                                      const attendanceKey = `${s.id}_${selectedSubject}_${selectedAttendanceMonth}_col_${idx}`;
                                      const status = studentAttendanceDetail[attendanceKey] || '';

                                      return (
                                        <td key={idx} style={{ textAlign: 'center', padding: '0.3rem 0.1rem' }}>
                                          <button 
                                            className={`attendance-cell-btn ${
                                              status === 'P' ? 'present' : 
                                              status === 'A' ? 'absent' : 
                                              status === 'T' ? 'tardy' : 
                                              status === 'E' ? 'excuse' : 
                                              status === 'R' ? 'retired' : ''
                                            }`}
                                            onClick={() => {
                                              let nextStatus = '';
                                              if (status === '') nextStatus = 'P';
                                              else if (status === 'P') nextStatus = 'A';
                                              else if (status === 'A') nextStatus = 'T';
                                              else if (status === 'T') nextStatus = 'E';
                                              else if (status === 'E') nextStatus = 'R';
                                              else if (status === 'R') nextStatus = '';
                                              
                                              setStudentAttendanceDetail(prev => ({
                                                ...prev,
                                                [attendanceKey]: nextStatus
                                              }));
                                            }}
                                          >
                                            {status}
                                          </button>
                                        </td>
                                      );
                                    })}

                                    {/* Stats (only T and %) */}
                                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
                                      {isRetiredStudent ? 'Retirado' : cappedT}
                                    </td>
                                    <td style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                                      {isRetiredStudent ? 'Retirado' : `${attendancePercentage}%`}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                    Por favor selecciona un Grado en la barra lateral.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'calendar' && (
              <div>
                <h2>Calendario Escolar</h2>
                <div className="calendar-wrapper">
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="calendar-grid">
                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                        <div key={d} className="calendar-day-header">{d}</div>
                      ))}
                      {Array.from({ length: 3 }).map((_, idx) => <div key={idx} className="calendar-day-cell other-month"></div>)}
                      {Array.from({ length: 31 }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dateString = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                        const dayEvents = calendarEvents.filter(ev => ev.date === dateString);
                        return (
                          <div key={dayNum} className="calendar-day-cell">
                            <span>{dayNum}</span>
                            <div>{dayEvents.map(e => <div key={e.id} className={`calendar-event-dot ${e.type}`}>{e.title}</div>)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TEACHER: Tab Instruments (AI Chatbot with credentials config & fully editable matrix table) */}
            {activeTab === 'instruments' && (
              <div>
                <h2>Instrumentos de Evaluación Ponderada</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Define las competencias, indicadores y criterios específicos para el <strong style={{ color: 'var(--primary)' }}>{
                    activeBloque === 'bloque1' ? 'Bloque CE1' :
                    activeBloque === 'bloque2' ? 'Bloque CE2-CE3' :
                    activeBloque === 'bloque3' ? 'Bloque CE4-CE7' :
                    activeBloque === 'bloque4' ? 'Bloque CE5-CE6' : 'Bloque CE1'
                  }</strong>. Modifica los textos directamente en la cuadrícula de la rúbrica.
                </p>

                {selectedGrade && selectedSubject ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0, 1fr)', gap: '1.5rem' }}>
                    
                    {/* Evaluations selector */}
                    <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'start', maxHeight: '80vh', overflowY: 'auto' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                        Evaluaciones por Bloque
                      </span>
                      
                      {/* Bloque CE1 */}
                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem', paddingLeft: '0.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.2rem' }}>Bloque CE1</div>
                        {Array.from({ length: 4 }).map((_, idx) => {
                          const isSel = activeBloque === 'bloque1' && activeInstrumentIdx === idx;
                          return (
                            <button
                              key={`b1_${idx}`}
                              className={`nav-item ${isSel ? 'active' : ''}`}
                              onClick={() => {
                                setActiveBloque('bloque1');
                                setActiveInstrumentIdx(idx);
                              }}
                              style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.76rem', padding: '0.35rem 0.5rem', width: '100%' }}
                            >
                              Evaluación {idx + 1}
                            </button>
                          );
                        })}
                      </div>

                      {/* Bloque CE2-CE3 */}
                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem', paddingLeft: '0.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.2rem' }}>Bloque CE2-CE3</div>
                        {Array.from({ length: 4 }).map((_, idx) => {
                          const isSel = activeBloque === 'bloque2' && activeInstrumentIdx === idx;
                          return (
                            <button
                              key={`b2_${idx}`}
                              className={`nav-item ${isSel ? 'active' : ''}`}
                              onClick={() => {
                                setActiveBloque('bloque2');
                                setActiveInstrumentIdx(idx);
                              }}
                              style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.76rem', padding: '0.35rem 0.5rem', width: '100%' }}
                            >
                              Evaluación {idx + 1}
                            </button>
                          );
                        })}
                      </div>

                      {/* Bloque CE4-CE7 */}
                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem', paddingLeft: '0.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.2rem' }}>Bloque CE4-CE7</div>
                        {Array.from({ length: 4 }).map((_, idx) => {
                          const isSel = activeBloque === 'bloque3' && activeInstrumentIdx === idx;
                          return (
                            <button
                              key={`b3_${idx}`}
                              className={`nav-item ${isSel ? 'active' : ''}`}
                              onClick={() => {
                                setActiveBloque('bloque3');
                                setActiveInstrumentIdx(idx);
                              }}
                              style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.76rem', padding: '0.35rem 0.5rem', width: '100%' }}
                            >
                              Evaluación {idx + 1}
                            </button>
                          );
                        })}
                      </div>

                      {/* Bloque CE5-CE6 */}
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem', paddingLeft: '0.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.2rem' }}>Bloque CE5-CE6</div>
                        {Array.from({ length: 4 }).map((_, idx) => {
                          const isSel = activeBloque === 'bloque4' && activeInstrumentIdx === idx;
                          return (
                            <button
                              key={`b4_${idx}`}
                              className={`nav-item ${isSel ? 'active' : ''}`}
                              onClick={() => {
                                setActiveBloque('bloque4');
                                setActiveInstrumentIdx(idx);
                              }}
                              style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.76rem', padding: '0.35rem 0.5rem', width: '100%' }}
                            >
                              Evaluación {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      
                      {/* AI Credentials Configuration Bar */}
                      <div className="ai-config-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowAiConfig(!showAiConfig)}>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
                            🔧 Configuración de Inteligencia Artificial (Gemini / Copilot Real)
                          </strong>
                          <span>{showAiConfig ? '▲ Ocultar' : '▼ Mostrar'}</span>
                        </div>

                        {showAiConfig && (
                          <form onSubmit={saveAiCredentials} style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                            <div className="ai-config-row">
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Proveedor</label>
                                <select className="form-select" style={{ padding: '0.4rem' }} value={aiProvider} onChange={(e) => setAiProvider(e.target.value)}>
                                  <option value="gemini">Google Gemini (Recomendado)</option>
                                  <option value="copilot">Microsoft Copilot (Azure Endpoint)</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Clave de API / API Key</label>
                                <input 
                                  type="password" 
                                  className="form-input" 
                                  placeholder="Ingresa tu API Key (e.g. AIzaSy...)" 
                                  value={aiApiKey} 
                                  onChange={(e) => setAiApiKey(e.target.value)} 
                                />
                              </div>
                              <button type="submit" className="btn-primary" style={{ height: '38px', alignSelf: 'end' }}>Guardar</button>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                              * Consigue tu Gemini API Key gratis en el sitio de <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Google AI Studio</a>. La clave se guarda únicamente de forma local en tu navegador.
                            </p>
                          </form>
                        )}
                      </div>

                      {/* Interactive AI Chat Box */}
                      <div className="ai-chat-container">
                        <div className="ai-chat-header">
                          <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
                            ✨ Chat con Asistente Inteligente
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {aiApiKey ? '🟢 API Conectada' : '🟡 Modo Simulador Local'}
                          </span>
                        </div>

                        <div className="ai-chat-messages">
                          {aiChatHistory.map((msg, idx) => (
                            <div key={idx} className={`ai-chat-bubble ${msg.sender}`}>
                              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 'bold', marginBottom: '0.2rem', color: msg.sender === 'ai' ? '#a855f7' : 'var(--primary)' }}>
                                {msg.sender === 'ai' ? 'Gemini / Copilot' : 'Tú (Docente)'}
                              </span>
                              <div>{msg.text}</div>
                            </div>
                          ))}

                          {aiIsTyping && (
                            <div className="ai-chat-bubble ai">
                              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 'bold', color: '#a855f7' }}>Gemini / Copilot</span>
                              <div className="ai-typing-effect">Generando instrumento de rúbrica a medida...</div>
                            </div>
                          )}
                        </div>

                        {latestAiGeneratedInstrument && (
                          <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="ai-chat-apply-btn" onClick={handleApplyAiInstrument}>
                              ⚡ Aplicar este instrumento al formulario matricial
                            </button>
                          </div>
                        )}

                        <form onSubmit={handleSendAiMessage} className="ai-chat-input-row">
                          <input 
                            type="text" 
                            className="ai-chat-input"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Ej: 'rúbrica para debate sobre embarazo adolescente con 5 criterios'"
                            disabled={aiIsTyping}
                          />
                          <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }} disabled={aiIsTyping}>
                            Enviar
                          </button>
                        </form>
                      </div>

                      {/* Fully Editable Matrix Form (exactly like Google Doc sample!) */}
                      <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                          Configuración General de Evaluación {activeInstrumentIdx + 1}
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div className="form-group">
                            <label>Nombre de la Actividad</label>
                            <input 
                              type="text" 
                              className="form-input"
                              value={instrumentEditState.activity}
                              onChange={(e) => setInstrumentEditState(prev => ({ ...prev, activity: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Tema / Contenido</label>
                            <input 
                              type="text" 
                              className="form-input"
                              value={instrumentEditState.topic || ''}
                              onChange={(e) => setInstrumentEditState(prev => ({ ...prev, topic: e.target.value }))}
                              placeholder="e.g. Ecuaciones lineales"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Competencia a Evaluar</label>
                            <input 
                              type="text" 
                              className="form-input"
                              value={instrumentEditState.competence}
                              onChange={(e) => setInstrumentEditState(prev => ({ ...prev, competence: e.target.value }))}
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
                              required
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <div className="form-group" style={{ marginBottom: 0, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <label style={{ margin: 0, fontWeight: 'bold' }}>Tipo de Instrumento:</label>
                            <select 
                              className="form-select"
                              style={{ width: '220px', padding: '0.4rem' }}
                              value={instrumentEditState.type}
                              onChange={(e) => setInstrumentEditState(prev => ({ ...prev, type: e.target.value }))}
                            >
                              <option value="rubrica">Rúbrica Matricial de Desempeño</option>
                              <option value="lista">Lista de Cotejo (Sí/No)</option>
                              <option value="escala">Escala Estimativa</option>
                            </select>
                          </div>
                          <button type="button" className="btn-secondary" onClick={handleAddCriterionRow}>
                            ＋ Agregar Criterio (Fila)
                          </button>
                        </div>

                        {/* EDITABLE TABLE MATRIX */}
                        <div className="rubric-matrix-container">
                          <table className="rubric-matrix-table">
                            <thead>
                              <tr>
                                <th style={{ width: '180px' }}>Criterio</th>
                                {instrumentEditState.type === 'lista' ? (
                                  <>
                                    <th>Cumple (Sí)</th>
                                    <th>No Cumple (No)</th>
                                  </>
                                ) : (
                                  <>
                                    <th>Estratégico (4)</th>
                                    <th>Autónomo (3)</th>
                                    <th>Resolutivo (2)</th>
                                    <th>Receptivo (1)</th>
                                  </>
                                )}
                                <th style={{ width: '50px', textAlign: 'center' }}>Acción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {instrumentEditState.criteria.map((crit, critIdx) => (
                                <tr key={critIdx}>
                                  {/* Criterion Name input */}
                                  <td>
                                    <input 
                                      type="text" 
                                      className="rubric-matrix-input-criterion"
                                      value={crit.name}
                                      onChange={(e) => handleEditCriterionName(critIdx, e.target.value)}
                                      placeholder={`Criterio ${critIdx + 1}`}
                                    />
                                  </td>
                                  
                                  {/* Levels textareas */}
                                  {instrumentEditState.type === 'lista' ? (
                                    <>
                                      <td>
                                        <textarea 
                                          className="rubric-matrix-textarea"
                                          value={crit.levels.cumple || ''}
                                          onChange={(e) => handleEditCriterionLevel(critIdx, 'cumple', e.target.value)}
                                          placeholder="Sí cumple..."
                                        />
                                      </td>
                                      <td>
                                        <textarea 
                                          className="rubric-matrix-textarea"
                                          value={crit.levels.nocumple || ''}
                                          onChange={(e) => handleEditCriterionLevel(critIdx, 'nocumple', e.target.value)}
                                          placeholder="No cumple..."
                                        />
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>
                                        <textarea 
                                          className="rubric-matrix-textarea"
                                          value={crit.levels.estrategico || ''}
                                          onChange={(e) => handleEditCriterionLevel(critIdx, 'estrategico', e.target.value)}
                                        />
                                      </td>
                                      <td>
                                        <textarea 
                                          className="rubric-matrix-textarea"
                                          value={crit.levels.autonomo || ''}
                                          onChange={(e) => handleEditCriterionLevel(critIdx, 'autonomo', e.target.value)}
                                        />
                                      </td>
                                      <td>
                                        <textarea 
                                          className="rubric-matrix-textarea"
                                          value={crit.levels.resolutivo || ''}
                                          onChange={(e) => handleEditCriterionLevel(critIdx, 'resolutivo', e.target.value)}
                                        />
                                      </td>
                                      <td>
                                        <textarea 
                                          className="rubric-matrix-textarea"
                                          value={crit.levels.receptivo || ''}
                                          onChange={(e) => handleEditCriterionLevel(critIdx, 'receptivo', e.target.value)}
                                        />
                                      </td>
                                    </>
                                  )}
                                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <button 
                                      type="button" 
                                      style={{ border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                                      onClick={() => handleRemoveCriterionRow(critIdx)}
                                    >
                                      ✕
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {instrumentEditState.criteria.length === 0 && (
                                <tr>
                                  <td colSpan={instrumentEditState.type === 'lista' ? 4 : 7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                    No hay criterios definidos. Agrega uno con el botón superior.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <button type="button" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', marginBottom: '2rem' }} onClick={handleSaveInstrument}>
                          Guardar Configuración de Instrumento
                        </button>
                      </div>

                      {/* DETAILED STUDENT GRADING GRID FOR THIS EVALUATION */}
                      <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                          Planilla de Calificación: Evaluación {activeInstrumentIdx + 1}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                          Evalúa a los estudiantes seleccionando el nivel de logro para cada criterio o digitando el puntaje directamente. Las notas se guardan y actualizan automáticamente en la planilla general.
                        </p>

                        {(() => {
                          const configKey = `${selectedGrade}_${selectedSubject}_${activeBloque}`;
                          const config = evaluationConfigs[configKey]?.[activeInstrumentIdx] || {
                            id: activeInstrumentIdx,
                            activity: instrumentEditState.activity || `Evaluación ${activeInstrumentIdx + 1}`,
                            topic: instrumentEditState.topic || '',
                            competence: instrumentEditState.competence || '',
                            indicator: instrumentEditState.indicator || '',
                            type: instrumentEditState.type || 'rubrica',
                            criteria: instrumentEditState.criteria || []
                          };
                          
                          const criteriaList = normalizeCriteria(config.criteria, config.type);
                          
                          // Divide 100 points proportional to number of criteria
                          const maxCritScore = criteriaList.length > 0 ? Math.floor(100 / criteriaList.length) : 100;

                          return (
                            <div className="custom-table-container">
                              <table className="custom-table">
                                <thead>
                                  <tr>
                                    <th style={{ width: '40px' }}>#</th>
                                    <th>Estudiante</th>
                                    
                                    {/* Criteria column headers */}
                                    {criteriaList.map((crit, idx) => (
                                      <th key={idx} style={{ textAlign: 'center', minWidth: '130px' }}>
                                        {crit.name}
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                                          (Máx: {maxCritScore} pts)
                                        </div>
                                      </th>
                                    ))}
                                    
                                    <th style={{ textAlign: 'center', width: '100px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', fontWeight: 'bold' }}>
                                      Total (100)
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {studentsFilteredByGrade.map((s, sIdx) => {
                                    const assessmentKey = `${s.id}_${selectedSubject}_${activeBloque}_${activeInstrumentIdx}`;
                                    const savedAssessment = studentAssessments[assessmentKey] || {};
                                    const subjectData = s.grades?.[selectedSubject] || {};
                                    const blockArray = subjectData[activeBloque] || [80, 80, 80, 80];
                                    const currentTotal = blockArray[activeInstrumentIdx] || 0;

                                    return (
                                      <tr key={s.id}>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textAlign: 'center' }}>{sIdx + 1}</td>
                                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                                        
                                        {/* Criteria values input */}
                                        {criteriaList.map((crit, critIdx) => {
                                          const score = savedAssessment[crit.name] !== undefined ? savedAssessment[crit.name] : Math.floor(maxCritScore * 0.75);
                                          return (
                                            <td key={critIdx} style={{ padding: 0 }}>
                                              
                                              {/* Dropdown helper select in cell for Tobon level scoring */}
                                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <input 
                                                  type="number" 
                                                  className="criteria-grade-input"
                                                  value={score}
                                                  min="0"
                                                  max={maxCritScore}
                                                  onChange={(e) => handleUpdateStudentCriterionScore(s.id, selectedSubject, activeInstrumentIdx, crit.name, e.target.value)}
                                                />
                                                
                                                {/* Simple quick selector */}
                                                {config.type !== 'lista' ? (
                                                  <select 
                                                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--text-secondary)', paddingRight: '0.25rem' }}
                                                    value={
                                                      score >= maxCritScore ? 'estrategico' :
                                                      score >= Math.floor(maxCritScore * 0.85) ? 'autonomo' :
                                                      score >= Math.floor(maxCritScore * 0.75) ? 'resolutivo' : 'receptivo'
                                                    }
                                                    onChange={(e) => {
                                                      const targetLevel = e.target.value;
                                                      let val = 0;
                                                      if (targetLevel === 'receptivo') val = Math.floor(maxCritScore * 0.65);
                                                      else if (targetLevel === 'resolutivo') val = Math.floor(maxCritScore * 0.75);
                                                      else if (targetLevel === 'autonomo') val = Math.floor(maxCritScore * 0.88);
                                                      else if (targetLevel === 'estrategico') val = maxCritScore;
                                                      
                                                      handleUpdateStudentCriterionScore(s.id, selectedSubject, activeInstrumentIdx, crit.name, val);
                                                    }}
                                                  >
                                                    <option value="receptivo">Receptivo (65%)</option>
                                                    <option value="resolutivo">Resolutivo (75%)</option>
                                                    <option value="autonomo">Autónomo (88%)</option>
                                                    <option value="estrategico">Estratégico (100%)</option>
                                                  </select>
                                                ) : (
                                                  <select 
                                                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--text-secondary)', paddingRight: '0.25rem' }}
                                                    value={score >= maxCritScore ? 'si' : 'no'}
                                                    onChange={(e) => {
                                                      const val = e.target.value === 'si' ? maxCritScore : Math.floor(maxCritScore * 0.5);
                                                      handleUpdateStudentCriterionScore(s.id, selectedSubject, activeInstrumentIdx, crit.name, val);
                                                    }}
                                                  >
                                                    <option value="si">Sí (100%)</option>
                                                    <option value="no">No (50%)</option>
                                                  </select>
                                                )}
                                              </div>

                                            </td>
                                          );
                                        })}
                                        
                                        {/* Total sum column */}
                                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold', backgroundColor: 'var(--bg-secondary)', color: 'var(--primary)' }}>
                                          {currentTotal}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>

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
                      <strong>Configuración de API Key para Gemini Real</strong>
                      <p style={{ fontSize: '0.85rem' }}>Despliega el menú de configuración de IA arriba del chat, introduce tu API Key obtenida en Google AI Studio y guárdala. ¡Ahora las respuestas del chat serán 100% reales generadas por IA!</p>
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-step-num">2</div>
                    <div>
                      <strong>Edición de Celdas de la Rúbrica</strong>
                      <p style={{ fontSize: '0.85rem' }}>En la grilla del instrumento, puedes hacer clic y escribir directamente en cada celda para personalizar los textos de los criterios y niveles de desempeño a tu gusto.</p>
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-step-num">3</div>
                    <div>
                      <strong>Evaluación por Criterios en la Planilla</strong>
                      <p style={{ fontSize: '0.85rem' }}>Cambia la "Vista de Calificación" en la planilla a la rúbrica deseada. Podrás rellenar directamente las notas de Claridad, Organización, etc., para cada alumno. Las celdas tienen un selector rápido de niveles para mayor comodidad.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* PERSISTENT CRITERIA-LEVEL ASSESSMENT MODAL WINDOW */}
      {isAssessmentModalOpen && activeAssessment && (
        <div className="modal-backdrop">
          <div className="modal-card animate-fade-in">
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Evaluación Detallada: {activeAssessment.studentName}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Asignatura: <strong>{SUBJECTS[activeAssessment.subjectKey].name}</strong> | Grado: <strong>{selectedGrade}</strong> | Evaluación {activeAssessment.evalIdx + 1}
                </span>
              </div>
              <button style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setIsAssessmentModalOpen(false)}>✕</button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', fontSize: '0.88rem' }}>
                <p><strong>Actividad:</strong> {activeAssessment.config.activity}</p>
                <p><strong>Competencia:</strong> {activeAssessment.config.competence}</p>
                <p><strong>Indicador:</strong> {activeAssessment.config.indicator}</p>
                <p><strong>Tipo:</strong> {activeAssessment.config.type === 'rubrica' ? 'Rúbrica' : activeAssessment.config.type === 'lista' ? 'Lista de Cotejo' : 'Escala Estimativa'}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeAssessment.config.criteria.map((crit, idx) => {
                  const currentVal = tempCriteriaRatings[crit.name];
                  const isList = activeAssessment.config.type === 'lista';

                  return (
                    <div key={idx} className="criterion-eval-card">
                      <div className="criterion-title">
                        <span>{idx + 1}. {crit.name}</span>
                        <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                          {isList ? (
                            currentVal === true ? 'Sí Cumple' : 'No Cumple'
                          ) : (
                            currentVal === 'estrategico' ? 'Estratégico (4)' :
                            currentVal === 'autonomo' ? 'Autónomo (3)' :
                            currentVal === 'resolutivo' ? 'Resolutivo (2)' :
                            currentVal === 'receptivo' ? 'Receptivo (1)' : 'Pre-formal (0)'
                          )}
                        </span>
                      </div>

                      {!isList ? (
                        <div className="criterion-levels-row">
                          <button type="button" className={`criterion-level-btn preformal ${currentVal === 'preformal' ? 'selected' : ''}`} onClick={() => setTempCriteriaRatings(prev => ({ ...prev, [crit.name]: 'preformal' }))}>
                            <span className="level-label">Pre-formal</span>
                            <div className="criterion-level-desc-tooltip">{crit.levels?.preformal}</div>
                          </button>
                          <button type="button" className={`criterion-level-btn receptivo ${currentVal === 'receptivo' ? 'selected' : ''}`} onClick={() => setTempCriteriaRatings(prev => ({ ...prev, [crit.name]: 'receptivo' }))}>
                            <span className="level-label">Receptivo</span>
                            <div className="criterion-level-desc-tooltip">{crit.levels?.receptivo}</div>
                          </button>
                          <button type="button" className={`criterion-level-btn resolutivo ${currentVal === 'resolutivo' ? 'selected' : ''}`} onClick={() => setTempCriteriaRatings(prev => ({ ...prev, [crit.name]: 'resolutivo' }))}>
                            <span className="level-label">Resolutivo</span>
                            <div className="criterion-level-desc-tooltip">{crit.levels?.resolutivo}</div>
                          </button>
                          <button type="button" className={`criterion-level-btn autonomo ${currentVal === 'autonomo' ? 'selected' : ''}`} onClick={() => setTempCriteriaRatings(prev => ({ ...prev, [crit.name]: 'autonomo' }))}>
                            <span className="level-label">Autónomo</span>
                            <div className="criterion-level-desc-tooltip">{crit.levels?.autonomo}</div>
                          </button>
                          <button type="button" className={`criterion-level-btn estrategico ${currentVal === 'estrategico' ? 'selected' : ''}`} onClick={() => setTempCriteriaRatings(prev => ({ ...prev, [crit.name]: 'estrategico' }))}>
                            <span className="level-label">Estratégico</span>
                            <div className="criterion-level-desc-tooltip">{crit.levels?.estrategico}</div>
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button type="button" className={`btn-secondary ${currentVal === true ? 'btn-primary' : ''}`} style={{ flex: 1, padding: '0.5rem' }} onClick={() => setTempCriteriaRatings(prev => ({ ...prev, [crit.name]: true }))}>
                            ✓ Sí Cumple
                          </button>
                          <button type="button" className={`btn-secondary ${currentVal === false ? 'btn-danger' : ''}`} style={{ flex: 1, padding: '0.5rem' }} onClick={() => setTempCriteriaRatings(prev => ({ ...prev, [crit.name]: false }))}>
                            ✕ No Cumple
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsAssessmentModalOpen(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleApplyAssessment}>Aplicar Calificación al Alumno</button>
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
