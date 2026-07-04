import { useState, useEffect, useRef } from 'react';
import './App.css';

import { dbService } from './db';

// Global configuration
const DEFAULT_SUBJECTS = {
  math: { name: 'Matemáticas', color: 'var(--primary)', bg: 'var(--primary-glow)' },
  science: { name: 'Ciencias', color: 'var(--success)', bg: 'var(--success-bg)' },
  language: { name: 'Lenguaje', color: 'var(--warning)', bg: 'var(--warning-bg)' },
  history: { name: 'Historia', color: 'hsl(170, 75%, 40%)', bg: 'rgba(20, 184, 166, 0.1)' }
};

const DEFAULT_GRADES = ['1ro A', '1ro B', '10° A', '10° B'];

const getSubjectsList = () => {
  try {
    const saved = localStorage.getItem('s_subjects');
    const subs = saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
    return Object.keys(subs);
  } catch (e) {
    return Object.keys(DEFAULT_SUBJECTS);
  }
};

const DEFAULT_USERS = [
  { 
    id: 'u1', 
    name: 'Fariel Paredes', 
    email: 'farielparedes3@gmail.com', 
    password: 'Lina2754', 
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

const migrateConfig = (oldConfig) => {
  if (!oldConfig) {
    return { p1: [], p2: [], p3: [], p4: [] };
  }
  if (Array.isArray(oldConfig)) {
    return {
      p1: oldConfig[0] && oldConfig[0].activity ? [{ ...oldConfig[0], id: oldConfig[0].id || 'inst_p1_0', weight: 100 }] : [],
      p2: oldConfig[1] && oldConfig[1].activity ? [{ ...oldConfig[1], id: oldConfig[1].id || 'inst_p2_0', weight: 100 }] : [],
      p3: oldConfig[2] && oldConfig[2].activity ? [{ ...oldConfig[2], id: oldConfig[2].id || 'inst_p3_0', weight: 100 }] : [],
      p4: oldConfig[3] && oldConfig[3].activity ? [{ ...oldConfig[3], id: oldConfig[3].id || 'inst_p4_0', weight: 100 }] : []
    };
  }
  return {
    p1: Array.isArray(oldConfig.p1) ? oldConfig.p1 : [],
    p2: Array.isArray(oldConfig.p2) ? oldConfig.p2 : [],
    p3: Array.isArray(oldConfig.p3) ? oldConfig.p3 : [],
    p4: Array.isArray(oldConfig.p4) ? oldConfig.p4 : []
  };
};

const DEFAULT_EVALUATION_CONFIGS = {
  "1ro A_math": {
    p1: [
      {
        id: "inst_p1_0",
        activity: "Álgebra y Ecuaciones",
        topic: "Ecuaciones lineales",
        competence: "Resolución de problemas cotidianos usando herramientas algebraicas.",
        indicator: "Resuelve ecuaciones lineales aplicando propiedades de la igualdad.",
        type: "rubrica",
        weight: 100,
        criteria: INITIAL_CRITERIA_MATH
      }
    ],
    p2: [
      {
        id: "inst_p2_0",
        activity: "Geometría del Triángulo",
        topic: "Teorema de Pitágoras",
        competence: "Pensamiento espacial y modelamiento geométrico.",
        indicator: "Calcula perímetros y áreas aplicando teoremas básicos.",
        type: "rubrica",
        weight: 100,
        criteria: INITIAL_CRITERIA_MATH
      }
    ],
    p3: [
      {
        id: "inst_p3_0",
        activity: "Sistemas de Fracciones",
        topic: "Suma de fracciones",
        competence: "Razonamiento cuantitativo y operaciones fraccionarias.",
        indicator: "Resuelve problemas de reparto aplicando sumas de fracciones.",
        type: "lista",
        weight: 100,
        criteria: [
          { name: "Simplifica fracciones", levels: { cumple: "Sí simplifica", nocumple: "No simplifica" } },
          { name: "Suma con distinto denominador", levels: { cumple: "Sí suma", nocumple: "No suma" } },
          { name: "Resuelve problemas de reparto", levels: { cumple: "Sí resuelve", nocumple: "No resuelve" } }
        ]
      }
    ],
    p4: [
      {
        id: "inst_p4_0",
        activity: "Examen de Razonamiento",
        topic: "Secuencias numéricas",
        competence: "Estructuración lógica abstracta.",
        indicator: "Completa secuencias numéricas justificando la ley de cambio.",
        type: "rubrica",
        weight: 100,
        criteria: INITIAL_CRITERIA_MATH
      }
    ]
  }
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
  const subjectsList = getSubjectsList();
  
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
    let list = saved ? JSON.parse(saved) : DEFAULT_USERS;
    const hasFariel = list.some(u => u.email === 'farielparedes3@gmail.com');
    if (!hasFariel) {
      list = list.map(u => u.id === 'u1' ? { ...u, name: 'Fariel Paredes', email: 'farielparedes3@gmail.com', password: 'Lina2754' } : u);
      if (!list.some(u => u.email === 'farielparedes3@gmail.com')) {
        list.push({
          id: 'u1',
          name: 'Fariel Paredes',
          email: 'farielparedes3@gmail.com',
          password: 'Lina2754',
          role: 'admin',
          assignments: [],
          active: true
        });
      }
      localStorage.setItem('s_users', JSON.stringify(list));
    }
    return list;
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migrated = {};
        Object.keys(parsed).forEach(key => {
          migrated[key] = migrateConfig(parsed[key]);
        });
        return migrated;
      } catch (e) {
        console.error("Error migrating evaluationConfigs", e);
      }
    }
    return DEFAULT_EVALUATION_CONFIGS;
  });

  const [studentAssessments, setStudentAssessments] = useState(() => {
    const saved = localStorage.getItem('s_student_assessments');
    return saved ? JSON.parse(saved) : {};
  });

  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('s_subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem('s_grades');
    return saved ? JSON.parse(saved) : DEFAULT_GRADES;
  });

  const [expandedSections, setExpandedSections] = useState({
    teachers: true,
    subjects: false,
    grades: false
  });

  const [subjectForm, setSubjectForm] = useState({ name: '', color: '#003876' });
  const [gradeForm, setGradeForm] = useState({ name: '' });

  // --- Admin Report & Alarms States ---
  const [selectedAdminReportGrade, setSelectedAdminReportGrade] = useState(() => {
    const saved = localStorage.getItem('s_grades');
    const list = saved ? JSON.parse(saved) : DEFAULT_GRADES;
    return list[0] || '1ro A';
  });
  const [expandedReportSubjects, setExpandedReportSubjects] = useState({});
  const [gradeStaffContacts, setGradeStaffContacts] = useState(() => {
    const saved = localStorage.getItem('s_grade_staff');
    return saved ? JSON.parse(saved) : {};
  });
  const [alertFormModal, setAlertFormModal] = useState({
    isOpen: false,
    student: null,
    subjectKey: '',
    score: 0,
    period: '',
    sending: false,
    progress: 0
  });
  const [alertLogs, setAlertLogs] = useState(() => {
    const saved = localStorage.getItem('s_alert_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // --- Filtering States ---
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [activeAdminGrade, setActiveAdminGrade] = useState(() => {
    const saved = localStorage.getItem('s_grades');
    const list = saved ? JSON.parse(saved) : DEFAULT_GRADES;
    return list[0] || '1ro A';
  });
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());

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

  // Active evaluation parameter ('p1' | 'p2' | 'p3' | 'p4') and instrument ID in Instruments Tab
  const [activePKey, setActivePKey] = useState('p1');
  const [activeInstrumentId, setActiveInstrumentId] = useState('');
  const [expandedBlocks, setExpandedBlocks] = useState({ bloque1: true, bloque2: false, bloque3: false, bloque4: false });
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatMinimized, setAiChatMinimized] = useState(false);

  // Form state for editing instrument in Instruments Tab
  const [instrumentEditState, setInstrumentEditState] = useState({
    activity: '',
    topic: '',
    competence: '',
    indicator: '',
    type: 'rubrica',
    weight: 100,
    criteria: [] // Array of criteria objects
  });

  const fileInputRef = useRef(null);

  // --- Sync Effects ---
  useEffect(() => {
    if (window.innerWidth < 968) {
      setSidebarCollapsed(true);
    }

    const unsubUsers = dbService.subscribeUsers((data) => {
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        setUsers(DEFAULT_USERS);
      }
    });

    const unsubStudents = dbService.subscribeStudents((data) => {
      if (data && data.length > 0) {
        setStudents(data);
      } else {
        setStudents(DEFAULT_STUDENTS);
      }
    });

    const unsubEvents = dbService.subscribeEvents((data) => {
      setCalendarEvents(data && data.length > 0 ? data : DEFAULT_EVENTS);
    });

    const unsubAlertLogs = dbService.subscribeAlertLogs((data) => {
      setAlertLogs(data || []);
    });

    const unsubEvalConfigs = dbService.subscribeEvalConfigs((data) => {
      setEvaluationConfigs(data && Object.keys(data).length > 0 ? data : DEFAULT_EVALUATION_CONFIGS);
    });

    const unsubStudentAssessments = dbService.subscribeStudentAssessments((data) => {
      setStudentAssessments(data || {});
    });

    const unsubStudentRpGrades = dbService.subscribeStudentRpGrades((data) => {
      setStudentRpGrades(data || {});
    });

    const unsubStudentAttendance = dbService.subscribeStudentAttendance((data) => {
      setStudentAttendanceDetail(data || {});
    });

    const unsubConfig = dbService.subscribeConfig((data) => {
      if (data) {
        if (data.subjects) setSubjects(data.subjects);
        if (data.grades) setGrades(data.grades);
        if (data.staff) setGradeStaffContacts(data.staff);
        if (data.monthlyDays) setMonthlyWorkedDays(data.monthlyDays);
        if (data.attendanceDates) setAttendanceDayDates(data.attendanceDates);
      }
    });

    return () => {
      unsubUsers();
      unsubStudents();
      unsubEvents();
      unsubAlertLogs();
      unsubEvalConfigs();
      unsubStudentAssessments();
      unsubStudentRpGrades();
      unsubStudentAttendance();
      unsubConfig();
    };
  }, []);

  useEffect(() => {
    dbService.saveUsers(users);
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
    dbService.saveStudents(students);
  }, [students]);

  useEffect(() => {
    dbService.saveStudentRpGrades(studentRpGrades);
  }, [studentRpGrades]);

  useEffect(() => {
    dbService.saveStudentAttendance(studentAttendanceDetail);
  }, [studentAttendanceDetail]);

  useEffect(() => {
    dbService.saveAttendanceConfigs(monthlyWorkedDays, attendanceDayDates);
  }, [monthlyWorkedDays, attendanceDayDates]);

  useEffect(() => {
    dbService.saveEvents(calendarEvents);
  }, [calendarEvents]);

  useEffect(() => {
    dbService.saveEvalConfigs(evaluationConfigs);
  }, [evaluationConfigs]);

  useEffect(() => {
    dbService.saveStudentAssessments(studentAssessments);
  }, [studentAssessments]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    dbService.saveSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    dbService.saveGrades(grades);
  }, [grades]);

  useEffect(() => {
    dbService.saveGradeStaff(gradeStaffContacts);
  }, [gradeStaffContacts]);

  useEffect(() => {
    dbService.saveAlertLogs(alertLogs);
  }, [alertLogs]);

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
      const blockConfig = migrateConfig(evaluationConfigs[configKey]);
      const list = blockConfig[activePKey] || [];
      const activeConf = list.find(inst => inst.id === activeInstrumentId) || list[0];

      if (activeConf) {
        setInstrumentEditState({
          activity: activeConf.activity || '',
          topic: activeConf.topic || '',
          competence: activeConf.competence || '',
          indicator: activeConf.indicator || '',
          type: activeConf.type || 'rubrica',
          weight: activeConf.weight || 100,
          criteria: activeConf.criteria ? normalizeCriteria(activeConf.criteria, activeConf.type) : []
        });
        if (activeConf.id !== activeInstrumentId) {
          setActiveInstrumentId(activeConf.id);
        }
      } else {
        setInstrumentEditState({
          activity: '',
          topic: '',
          competence: '',
          indicator: '',
          type: 'rubrica',
          weight: 100,
          criteria: []
        });
        if (activeInstrumentId !== '') {
          setActiveInstrumentId('');
        }
      }
    }
  }, [activePKey, activeInstrumentId, selectedGrade, selectedSubject, activeBloque, evaluationConfigs, currentUser]);

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

  const handleAddAssignment = (userId, targetGrade, targetSubject) => {
    if (currentUser.role !== 'admin') return;
    const gradeVal = targetGrade || newAssignment.grade || (grades[0] || '');
    const subjectVal = targetSubject || newAssignment.subject || (Object.keys(subjects)[0] || '');

    if (!gradeVal || !subjectVal) {
      alert('Por favor selecciona un grado y asignatura válidos.');
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const exists = u.assignments.some(
          a => a.grade === gradeVal && a.subject === subjectVal
        );
        if (exists) {
          alert('Asignación duplicada.');
          return u;
        }
        return { ...u, assignments: [...u.assignments, { grade: gradeVal, subject: subjectVal }] };
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

  const handleCreateSubject = (e) => {
    if (e) e.preventDefault();
    const name = subjectForm.name.trim();
    const color = subjectForm.color;
    if (!name) return;

    const key = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (!key) {
      alert('Nombre de asignatura inválido.');
      return;
    }

    if (subjects[key]) {
      alert('Esta asignatura ya existe.');
      return;
    }

    const newSub = { name, color, bg: `${color}15` };
    const updatedSubjects = { ...subjects, [key]: newSub };
    setSubjects(updatedSubjects);

    setStudents(prev => {
      return prev.map(s => {
        const studentGrades = s.grades ? { ...s.grades } : {};
        if (!studentGrades[key]) {
          studentGrades[key] = {
            bloque1: [80, 80, 80, 80],
            bloque2: [80, 80, 80, 80],
            bloque3: [80, 80, 80, 80],
            bloque4: [80, 80, 80, 80]
          };
        }
        return { ...s, grades: studentGrades };
      });
    });

    setSubjectForm({ name: '', color: '#003876' });
    alert('Asignatura creada con éxito.');
  };

  const handleDeleteSubject = (key) => {
    if (Object.keys(subjects).length <= 1) {
      alert('Debe haber al menos una asignatura en el sistema.');
      return;
    }
    if (window.confirm(`¿Estás seguro de eliminar la asignatura "${subjects[key].name}"? Esto removerá todas las calificaciones y asignaciones docentes vinculadas.`)) {
      const updatedSubjects = { ...subjects };
      delete updatedSubjects[key];
      setSubjects(updatedSubjects);

      setUsers(prev => prev.map(u => {
        if (u.role === 'teacher') {
          return {
            ...u,
            assignments: u.assignments.filter(a => a.subject !== key)
          };
        }
        return u;
      }));

      setStudents(prev => prev.map(s => {
        const studentGrades = s.grades ? { ...s.grades } : {};
        delete studentGrades[key];
        return { ...s, grades: studentGrades };
      }));

      alert('Asignatura eliminada.');
    }
  };

  const handleCreateGrade = (e) => {
    if (e) e.preventDefault();
    const name = gradeForm.name.trim();
    if (!name) return;

    if (grades.includes(name)) {
      alert('Este grado ya existe.');
      return;
    }

    setGrades(prev => [...prev, name]);
    setGradeForm({ name: '' });
    alert('Grado creado con éxito.');
  };

  const handleDeleteGrade = (gradeName) => {
    if (grades.length <= 1) {
      alert('Debe haber al menos un grado en el sistema.');
      return;
    }
    if (window.confirm(`¿Estás seguro de eliminar el grado "${gradeName}"? Esto eliminará todos los estudiantes matriculados en este grado y todas las asignaciones docentes vinculadas.`)) {
      const updatedGrades = grades.filter(g => g !== gradeName);
      setGrades(updatedGrades);

      setUsers(prev => prev.map(u => {
        if (u.role === 'teacher') {
          return {
            ...u,
            assignments: u.assignments.filter(a => a.grade !== gradeName)
          };
        }
        return u;
      }));

      setStudents(prev => prev.filter(s => s.grade !== gradeName));

      if (activeAdminGrade === gradeName) {
        setActiveAdminGrade(updatedGrades[0] || '');
      }

      alert('Grado eliminado.');
    }
  };

  // --- Admin: Grade & Subject Report Warnings ---
  const handleSaveStaffContacts = (gradeName, coordinatorEmail, counselorEmail) => {
    setGradeStaffContacts(prev => ({
      ...prev,
      [gradeName]: {
        coordinator: coordinatorEmail,
        counselor: counselorEmail
      }
    }));
    alert('Contactos de coordinación y orientación actualizados para ' + gradeName);
  };

  const handleOpenAlertModal = (student, subjectKey, score, period) => {
    const contacts = gradeStaffContacts[student.grade] || { coordinator: '', counselor: '' };
    setAlertFormModal({
      isOpen: true,
      student,
      subjectKey,
      score,
      period,
      sending: false,
      progress: 0,
      coordinatorEmail: contacts.coordinator || '',
      counselorEmail: contacts.counselor || ''
    });
  };

  const handleSimulateSendAlert = () => {
    if (!alertFormModal.coordinatorEmail || !alertFormModal.counselorEmail) {
      alert('Por favor, ingresa los correos del Coordinador y Orientador antes de enviar la alerta.');
      return;
    }

    setAlertFormModal(prev => ({ ...prev, sending: true, progress: 10 }));

    let interval = setInterval(() => {
      setAlertFormModal(prev => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          
          const newLog = {
            id: Date.now().toString(),
            studentName: prev.student.name,
            grade: prev.student.grade,
            subjectName: subjects[prev.subjectKey]?.name || prev.subjectKey,
            periodName: prev.period === 'final' ? 'Promedio Final' : `Periodo ${prev.period.replace('bloque', '')}`,
            score: prev.score.toFixed(0),
            coordinator: prev.coordinatorEmail,
            counselor: prev.counselorEmail,
            timestamp: new Date().toLocaleString()
          };

          setAlertLogs(logs => [newLog, ...logs]);
          alert('¡Alerta Académica emitida con éxito! Notificación enviada a:\n- Coordinador: ' + prev.coordinatorEmail + '\n- Orientador: ' + prev.counselorEmail);
          
          return { ...prev, isOpen: false, sending: false, progress: 0 };
        }
        return { ...prev, progress: prev.progress + 30 };
      });
    }, 300);
  };

  // --- Docente: Instrument Configuration ---
  const updateActiveInstrumentConfig = (updatedFields) => {
    setInstrumentEditState(prev => {
      const nextState = { ...prev, ...updatedFields };
      
      // Auto-save to evaluationConfigs
      if (selectedGrade && selectedSubject && activeInstrumentId) {
        const configKey = `${selectedGrade}_${selectedSubject}_${activeBloque}`;
        const blockConfig = migrateConfig(evaluationConfigs[configKey]);
        const currentList = blockConfig[activePKey] || [];
        
        const updatedConfig = {
          id: activeInstrumentId,
          activity: nextState.activity,
          topic: nextState.topic || '',
          competence: nextState.competence,
          indicator: nextState.indicator,
          type: nextState.type,
          weight: nextState.weight !== undefined ? (Number(nextState.weight) || 0) : 100,
          criteria: nextState.criteria
        };
        
        const nextList = [...currentList];
        const matchIdx = nextList.findIndex(inst => inst.id === activeInstrumentId);
        if (matchIdx >= 0) {
          nextList[matchIdx] = updatedConfig;
        } else {
          nextList.push(updatedConfig);
        }
        
        const nextBlockConfig = {
          ...blockConfig,
          [activePKey]: nextList
        };
        
        const nextEvaluationConfigs = {
          ...evaluationConfigs,
          [configKey]: nextBlockConfig
        };
        
        setEvaluationConfigs(nextEvaluationConfigs);
        
        // Also update students' final grades in real-time
        setStudents(prevStudents => prevStudents.map(s => {
          if (s.grade === selectedGrade) {
            const nextGrades = { ...s.grades };
            const subjectBlocks = nextGrades[selectedSubject] ? { ...nextGrades[selectedSubject] } : {};
            const baseGrades = subjectBlocks[activeBloque] || [80, 80, 80, 80];
            
            const finalGrades = getCalculatedBlockGrades(
              s.id,
              s.grade,
              selectedSubject,
              activeBloque,
              nextEvaluationConfigs,
              studentAssessments,
              baseGrades
            );
            
            subjectBlocks[activeBloque] = finalGrades;
            nextGrades[selectedSubject] = subjectBlocks;
            return { ...s, grades: nextGrades };
          }
          return s;
        }));
      }
      
      return nextState;
    });
  };

  const handleSaveInstrument = (e) => {
    if (e) e.preventDefault();
    if (!selectedGrade || !selectedSubject) return;

    if (!instrumentEditState.activity.trim() || !instrumentEditState.topic.trim() || !instrumentEditState.competence.trim() || !instrumentEditState.indicator.trim()) {
      alert("Por favor complete todos los campos obligatorios: Nombre de la Actividad, Tema/Contenido, Competencia a Evaluar e Indicador de Logro.");
      return;
    }

    const configKey = `${selectedGrade}_${selectedSubject}_${activeBloque}`;
    const blockConfig = migrateConfig(evaluationConfigs[configKey]);
    
    const currentList = blockConfig[activePKey] || [];
    const instId = activeInstrumentId || `inst_${Date.now()}`;

    const updatedConfig = {
      id: instId,
      activity: instrumentEditState.activity,
      topic: instrumentEditState.topic,
      competence: instrumentEditState.competence,
      indicator: instrumentEditState.indicator,
      type: instrumentEditState.type,
      weight: Number(instrumentEditState.weight) || 100,
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

    let nextList = [...currentList];
    const matchIdx = nextList.findIndex(inst => inst.id === instId);
    if (matchIdx >= 0) {
      nextList[matchIdx] = updatedConfig;
    } else {
      nextList.push(updatedConfig);
    }

    const nextBlockConfig = {
      ...blockConfig,
      [activePKey]: nextList
    };

    const nextEvaluationConfigs = {
      ...evaluationConfigs,
      [configKey]: nextBlockConfig
    };

    setEvaluationConfigs(nextEvaluationConfigs);

    // Recalculate grades for all students in this grade
    setStudents(prev => prev.map(s => {
      if (s.grade === selectedGrade) {
        const nextGrades = { ...s.grades };
        const subjectBlocks = nextGrades[selectedSubject] ? { ...nextGrades[selectedSubject] } : {};
        const baseGrades = subjectBlocks[activeBloque] || [80, 80, 80, 80];
        
        const finalGrades = getCalculatedBlockGrades(
          s.id,
          s.grade,
          selectedSubject,
          activeBloque,
          nextEvaluationConfigs,
          studentAssessments,
          baseGrades
        );
        
        subjectBlocks[activeBloque] = finalGrades;
        nextGrades[selectedSubject] = subjectBlocks;
        return { ...s, grades: nextGrades };
      }
      return s;
    }));

    if (!activeInstrumentId) {
      setActiveInstrumentId(instId);
    }

    alert(`Instrumento de la Evaluación guardado correctamente.`);
  };

  const handleDeleteInstrument = (instrumentIdToDelete) => {
    if (!selectedGrade || !selectedSubject) return;
    if (!window.confirm("¿Está seguro de eliminar este instrumento? Se perderán las calificaciones asociadas a él.")) return;

    const configKey = `${selectedGrade}_${selectedSubject}_${activeBloque}`;
    const blockConfig = migrateConfig(evaluationConfigs[configKey]);
    const currentList = blockConfig[activePKey] || [];
    
    const nextList = currentList.filter(inst => inst.id !== instrumentIdToDelete);
    const nextBlockConfig = {
      ...blockConfig,
      [activePKey]: nextList
    };

    const nextEvaluationConfigs = {
      ...evaluationConfigs,
      [configKey]: nextBlockConfig
    };

    setEvaluationConfigs(nextEvaluationConfigs);

    // Recalculate grades for all students in this grade
    setStudents(prev => prev.map(s => {
      if (s.grade === selectedGrade) {
        const nextGrades = { ...s.grades };
        const subjectBlocks = nextGrades[selectedSubject] ? { ...nextGrades[selectedSubject] } : {};
        const baseGrades = subjectBlocks[activeBloque] || [80, 80, 80, 80];
        
        const finalGrades = getCalculatedBlockGrades(
          s.id,
          s.grade,
          selectedSubject,
          activeBloque,
          nextEvaluationConfigs,
          studentAssessments,
          baseGrades
        );
        
        subjectBlocks[activeBloque] = finalGrades;
        nextGrades[selectedSubject] = subjectBlocks;
        return { ...s, grades: nextGrades };
      }
      return s;
    }));

    setActiveInstrumentId('');
    alert("Instrumento eliminado correctamente.");
  };

  const handleAddNewInstrument = (pKey) => {
    if (!selectedGrade || !selectedSubject) return;

    const configKey = `${selectedGrade}_${selectedSubject}_${activeBloque}`;
    const blockConfig = migrateConfig(evaluationConfigs[configKey]);
    const currentList = blockConfig[pKey] || [];

    const existingSum = currentList.reduce((acc, inst) => acc + (inst.weight || 0), 0);
    const remainingWeight = Math.max(0, 100 - existingSum);

    const newInstId = `inst_${Date.now()}`;
    const newInstrument = {
      id: newInstId,
      activity: `Nueva Actividad P${pKey.replace('p', '')}`,
      topic: '',
      competence: '',
      indicator: '',
      type: 'rubrica',
      weight: remainingWeight > 0 ? remainingWeight : 20,
      criteria: [
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

    const nextList = [...currentList, newInstrument];
    const nextBlockConfig = {
      ...blockConfig,
      [pKey]: nextList
    };

    const nextEvaluationConfigs = {
      ...evaluationConfigs,
      [configKey]: nextBlockConfig
    };

    setEvaluationConfigs(nextEvaluationConfigs);
    
    setActivePKey(pKey);
    setActiveInstrumentId(newInstId);
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
    updateActiveInstrumentConfig({
      criteria: [...instrumentEditState.criteria, newCrit]
    });
  };

  const handleRemoveCriterionRow = (idxToRemove) => {
    updateActiveInstrumentConfig({
      criteria: instrumentEditState.criteria.filter((_, idx) => idx !== idxToRemove)
    });
  };

  const handleEditCriterionName = (idx, nameVal) => {
    const nextList = [...instrumentEditState.criteria];
    nextList[idx] = { ...nextList[idx], name: nameVal };
    updateActiveInstrumentConfig({ criteria: nextList });
  };

  const handleEditCriterionLevel = (critIdx, levelKey, textVal) => {
    const nextList = [...instrumentEditState.criteria];
    nextList[critIdx] = {
      ...nextList[critIdx],
      levels: {
        ...nextList[critIdx].levels,
        [levelKey]: textVal
      }
    };
    updateActiveInstrumentConfig({ criteria: nextList });
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
  const handleUpdateStudentCriterionScore = (studentId, subjectKey, pKey, instrumentId, critName, scoreValue) => {
    // Save detailed score
    const assessmentKey = `${studentId}_${subjectKey}_${activeBloque}_${pKey}_${instrumentId}`;
    const studentAssessment = studentAssessments[assessmentKey] || {};
    const nextAssessment = { ...studentAssessment, [critName]: Number(scoreValue) || 0 };

    const nextAssessmentsObject = {
      ...studentAssessments,
      [assessmentKey]: nextAssessment
    };

    setStudentAssessments(nextAssessmentsObject);

    // Recalculate grades using helper
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const nextGrades = { ...s.grades };
        const subjectBlocks = nextGrades[subjectKey] ? { ...nextGrades[subjectKey] } : {};
        const baseGrades = subjectBlocks[activeBloque] || [80, 80, 80, 80];
        
        const finalGrades = getCalculatedBlockGrades(
          studentId,
          s.grade,
          subjectKey,
          activeBloque,
          evaluationConfigs,
          nextAssessmentsObject,
          baseGrades
        );
        
        subjectBlocks[activeBloque] = finalGrades;
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
    if (!currentUser) return;

    const created = {
      id: 'ev_' + Date.now().toString(),
      date: newEvent.date,
      title: newEvent.title,
      desc: newEvent.desc || '',
      type: newEvent.type || 'primary'
    };

    const updated = [...calendarEvents, created];
    setCalendarEvents(updated);
    localStorage.setItem('s_events', JSON.stringify(updated));
    setNewEvent(prev => ({ ...prev, title: '', desc: '' }));
    alert('Actividad académica agendada exitosamente.');
  };

  const handleDeleteEvent = (eventId) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta actividad?')) return;
    const updated = calendarEvents.filter(ev => ev.id !== eventId);
    setCalendarEvents(updated);
    localStorage.setItem('s_events', JSON.stringify(updated));
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

  const getCalculatedBlockGrades = (studentId, gradeName, subjectKey, bloqueKey, currentConfigs, currentAssessments, originalGrades) => {
    const configKey = `${gradeName}_${subjectKey}_${bloqueKey}`;
    const blockConfig = migrateConfig(currentConfigs[configKey]);
    
    const finalGrades = [...originalGrades];
    const pKeys = ['p1', 'p2', 'p3', 'p4'];
    
    pKeys.forEach((pKey, pIdx) => {
      const list = blockConfig[pKey] || [];
      if (list.length > 0) {
        let sum = 0;
        list.forEach(inst => {
          const criteriaList = normalizeCriteria(inst.criteria, inst.type);
          const maxCritScore = criteriaList.length > 0 ? Math.floor(inst.weight / criteriaList.length) : inst.weight;
          const assessmentKey = `${studentId}_${subjectKey}_${bloqueKey}_${pKey}_${inst.id}`;
          const savedAssessment = currentAssessments[assessmentKey] || {};
          
          let instSum = 0;
          criteriaList.forEach(c => {
            const score = savedAssessment[c.name] !== undefined ? Number(savedAssessment[c.name]) : 0;
            instSum += score;
          });
          sum += instSum;
        });
        finalGrades[pIdx] = Math.min(100, Math.max(0, sum));
      }
    });
    
    return finalGrades;
  };

  const calculateBlockAvg = (studentId, subjectKey, bloqueKey, studentGradesObject) => {
    const subjectData = studentGradesObject?.[subjectKey] || {};
    const baseGrades = subjectData[bloqueKey] || [80, 80, 80, 80];
    
    const student = students.find(s => s.id === studentId);
    const gradeName = student?.grade || selectedGrade;

    const blockArray = getCalculatedBlockGrades(
      studentId,
      gradeName,
      subjectKey,
      bloqueKey,
      evaluationConfigs,
      studentAssessments,
      baseGrades
    );

    let sum = 0;
    blockArray.forEach((g, idx) => {
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
    const subKeys = Object.keys(subjects);
    if (subKeys.length === 0) return 0;
    const sum = subKeys.reduce((acc, subKey) => acc + calculateSubjectAvg(s.id, subKey, s.grades), 0);
    return sum / subKeys.length;
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

  const renderCalendarComponent = () => {
    const MONTH_NAMES = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const YEARS_LIST = Array.from({ length: 11 }, (_, i) => 2024 + i); // 2024 to 2034

    // First day of current month/year
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const startDayIndex = firstDay.getDay(); // 0 is Sunday, 6 is Saturday
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(calendarYear, calendarMonth, 0).getDate();

    // Previous month cells
    const prevDaysCells = [];
    for (let i = startDayIndex - 1; i >= 0; i--) {
      prevDaysCells.push(prevMonthTotalDays - i);
    }

    // Current month cells
    const currentDaysCells = Array.from({ length: totalDays }, (_, i) => i + 1);

    // Next month cells
    const totalCells = startDayIndex + totalDays;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const nextDaysCells = Array.from({ length: remainingCells }, (_, i) => i + 1);

    // Helpers to navigate month
    const handlePrevMonth = () => {
      if (calendarMonth === 0) {
        setCalendarMonth(11);
        setCalendarYear(prev => prev - 1);
      } else {
        setCalendarMonth(prev => prev - 1);
      }
    };

    const handleNextMonth = () => {
      if (calendarMonth === 11) {
        setCalendarMonth(0);
        setCalendarYear(prev => prev + 1);
      } else {
        setCalendarMonth(prev => prev + 1);
      }
    };

    // Filter events for this month
    const monthEvents = calendarEvents.filter(ev => {
      const parts = ev.date.split('-');
      if (parts.length !== 3) return false;
      const y = Number(parts[0]);
      const m = Number(parts[1]);
      return y === calendarYear && m === (calendarMonth + 1);
    }).sort((a, b) => a.date.localeCompare(b.date));

    // Form states (controlled inputs)
    const handleLocalSubmit = (e) => {
      e.preventDefault();
      handleAddEvent(e);
    };

    const today = new Date();
    const isToday = (dayNum) => {
      return today.getDate() === dayNum &&
             today.getMonth() === calendarMonth &&
             today.getFullYear() === calendarYear;
    };

    return (
      <div className="calendar-dynamic-container">
        {/* Top Controls: Dropdowns and navigation arrows */}
        <div className="calendar-controls-bar">
          <div className="month-year-selectors">
            <select 
              value={calendarMonth} 
              onChange={(e) => setCalendarMonth(Number(e.target.value))}
              className="calendar-select"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={idx} value={idx}>{name}</option>
              ))}
            </select>
            <select 
              value={calendarYear} 
              onChange={(e) => setCalendarYear(Number(e.target.value))}
              className="calendar-select"
            >
              {YEARS_LIST.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="calendar-nav-buttons">
            <button type="button" className="btn-nav" onClick={handlePrevMonth}>◀</button>
            <button type="button" className="btn-nav-today" onClick={() => { setCalendarMonth(today.getMonth()); setCalendarYear(today.getFullYear()); }}>Hoy</button>
            <button type="button" className="btn-nav" onClick={handleNextMonth}>▶</button>
          </div>
        </div>

        {/* Layout Grid: Calendar left side, Info list + scheduler right side */}
        <div className="calendar-layout-grid">
          {/* Calendar Grid Container */}
          <div className="calendar-grid-card glass-panel">
            <div className="calendar-grid-header">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                <div key={d} className="day-header">{d}</div>
              ))}
            </div>
            <div className="calendar-grid-body">
              {/* Previous month grey days */}
              {prevDaysCells.map((dayNum, idx) => (
                <div key={`prev-${idx}`} className="day-cell other-month">
                  <span className="day-num">{dayNum}</span>
                </div>
              ))}

              {/* Current month days */}
              {currentDaysCells.map(dayNum => {
                const monthStr = (calendarMonth + 1).toString().padStart(2, '0');
                const dayStr = dayNum.toString().padStart(2, '0');
                const dateString = `${calendarYear}-${monthStr}-${dayStr}`;
                const dayEvents = calendarEvents.filter(ev => ev.date === dateString);

                return (
                  <div key={`curr-${dayNum}`} className={`day-cell ${isToday(dayNum) ? 'today' : ''}`} onClick={() => setNewEvent(prev => ({ ...prev, date: dateString }))}>
                    <span className="day-num">{dayNum}</span>
                    <div className="cell-events-container">
                      {dayEvents.map(ev => (
                        <div key={ev.id} className={`event-tag-pill ${ev.type}`} title={`${ev.title}: ${ev.desc || 'Sin descripción'}`}>
                          <span className="dot"></span>
                          <span className="text">{ev.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Next month grey days */}
              {nextDaysCells.map((dayNum, idx) => (
                <div key={`next-${idx}`} className="day-cell other-month">
                  <span className="day-num">{dayNum}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Pending Activities List & Add Activity Form */}
          <div className="calendar-sidebar-container">
            {/* List of pending activities for the selected month */}
            <div className="glass-panel sidebar-box">
              <h3 className="section-title font-small-mobile">Actividades de {MONTH_NAMES[calendarMonth]} {calendarYear}</h3>
              {monthEvents.length === 0 ? (
                <p className="no-events-text">No hay actividades agendadas para este mes.</p>
              ) : (
                <div className="events-vertical-list">
                  {monthEvents.map(ev => {
                    const [, , day] = ev.date.split('-');
                    return (
                      <div key={ev.id} className={`event-list-item ${ev.type}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span className="item-date">Día {Number(day)}</span>
                            <h4 className="item-title">{ev.title}</h4>
                            {ev.desc && <p className="item-desc">{ev.desc}</p>}
                          </div>
                          <button 
                            type="button" 
                            className="btn-delete-event" 
                            onClick={() => handleDeleteEvent(ev.id)}
                            title="Eliminar actividad"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Form to add calendar event */}
            <div className="glass-panel sidebar-box">
              <h3 className="section-title">Agendar Actividad</h3>
              <form onSubmit={handleLocalSubmit} className="add-event-form">
                <div className="form-group-compact">
                  <label>Fecha</label>
                  <input 
                    type="date" 
                    className="form-input-compact" 
                    value={newEvent.date} 
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))} 
                    required 
                  />
                </div>
                <div className="form-group-compact">
                  <label>Título</label>
                  <input 
                    type="text" 
                    className="form-input-compact" 
                    placeholder="Ej: Entrega de Rúbrica"
                    value={newEvent.title} 
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))} 
                    required 
                  />
                </div>
                <div className="form-group-compact">
                  <label>Detalles / Descripción</label>
                  <textarea 
                    className="form-input-compact" 
                    rows="2"
                    placeholder="Detalles de la actividad..."
                    value={newEvent.desc || ''} 
                    onChange={(e) => setNewEvent(prev => ({ ...prev, desc: e.target.value }))} 
                  />
                </div>
                <div className="form-group-compact">
                  <label>Tipo de Actividad</label>
                  <select 
                    className="form-select-compact" 
                    value={newEvent.type || 'primary'} 
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="primary">Evaluación (Azul)</option>
                    <option value="success">Entrega/Feria (Verde)</option>
                    <option value="warning">Reunión Docente (Naranja)</option>
                    <option value="danger">Examen Parcial (Rojo)</option>
                  </select>
                </div>
                <button type="submit" className="btn-add-event-submit">Agendar Actividad</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- VIEW: Login ---
  if (!currentUser) {
    return (
      <div className="login-container">
        {/* Left Side: Modern illustration and curves */}
        <div className="login-left-illustration">
          <div className="login-left-content">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#ffb300', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                REGISTRO DE EVALUACIÓN DIGITAL
              </div>
              <h1 className="school-title-highlight" style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', margin: '0.25rem 0', letterSpacing: '0.02em', lineHeight: 1.2 }}>
                LICEO ANA ROSA CASTILLO
              </h1>
              <div style={{ marginTop: '0.75rem' }}>
                <span className="district-badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.25)', padding: '0.45rem 1.25rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-block' }}>
                  DISTRITO EDUCATIVO 14-01 NAGUA
                </span>
              </div>
            </div>

            <img 
              src="/dr_education_banner.png" 
              alt="Liceo Ana Rosa Castillo" 
              className="login-illustration-img" 
            />

            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.92rem', lineHeight: '1.6', margin: '1.5rem 0 0 0', textAlign: 'center', maxWidth: '440px' }}>
              Plataforma digital para la gestión del registro por competencias y rúbricas. Alineado con las normativas del Ministerio de Educación de la República Dominicana.
            </p>
          </div>
        </div>

        {/* Right Side: Clean login form */}
        <div className="login-right-form">
          <div className="login-card-clean animate-fade-in">
            <h2 className="login-clean-title">Acceso al Portal</h2>
            <p className="login-clean-subtitle">Ingresa tus credenciales para continuar</p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="login-clean-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  placeholder="ejemplo@school.edu" 
                  className="form-input login-clean-input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="login-clean-label">Contraseña</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="form-input login-clean-input"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              {loginError && (
                <div style={{ color: '#ff8a80', fontSize: '0.85rem', fontWeight: 600, paddingLeft: '0.25rem' }}>
                  ⚠️ {loginError}
                </div>
              )}

              <button type="submit" className="login-clean-btn">
                Ingresar al Sistema
              </button>
            </form>

            <div className="demo-box-clean">
              <div className="demo-title-clean">Ingreso Rápido de Demostración</div>
              <div className="demo-buttons-clean">
                <button className="btn-demo-clean" onClick={() => handleQuickLogin('farielparedes3@gmail.com', 'Lina2754')}>
                  <span className="role">Administrador</span>
                  <span className="email">farielparedes3@gmail.com</span>
                </button>
                <button className="btn-demo-clean" onClick={() => handleQuickLogin('profesor.mate@school.edu', 'profe123')}>
                  <span className="role">Prof. Matemáticas</span>
                  <span className="email">profesor.mate@school.edu</span>
                </button>
              </div>
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
        <header className="header" style={{ borderBottom: '2px solid #ebdcb9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              type="button" 
              className="sidebar-toggle-btn" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ border: 'none', background: 'none', fontSize: '1.4rem', cursor: 'pointer', padding: '0.25rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ☰
            </button>
            <div className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--danger)', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>REGISTRO DE EVALUACIÓN DIGITAL</span>
                <span style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--primary)' }}>LICEO ANA ROSA CASTILLO</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>Distrito 14-01 Nagua</span>
              </div>
              <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.4rem', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', border: '1px solid var(--border-color)', borderRadius: '4px', marginLeft: '0.5rem', fontWeight: 'bold', alignSelf: 'center' }}>Admin</span>
              <span 
                style={{ 
                  fontSize: '0.72rem', 
                  padding: '0.2rem 0.5rem', 
                  backgroundColor: dbService.isEnabled ? 'var(--success-bg)' : 'var(--border-color)', 
                  color: dbService.isEnabled ? 'var(--success)' : 'var(--text-secondary)', 
                  border: '1px solid currentColor', 
                  borderRadius: '4px', 
                  marginLeft: '0.4rem', 
                  fontWeight: 'bold', 
                  alignSelf: 'center',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
                title={dbService.isEnabled ? "Datos sincronizados en la nube" : "Datos guardados en este dispositivo localmente"}
              >
                <span>{dbService.isEnabled ? '☁️ En la nube' : '📁 Local'}</span>
              </span>
            </div>
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
              <div className="header-profile-text" style={{ display: 'flex', flexDirection: 'column' }}>
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
          <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {!sidebarCollapsed && (
              <div className="sidebar-mobile-backdrop" onClick={() => setSidebarCollapsed(true)}></div>
            )}
            <aside className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start', position: 'relative' }}>
              <button 
                type="button" 
                className="sidebar-close-btn" 
                onClick={() => setSidebarCollapsed(true)}
              >
                ✕
              </button>
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
                <div className={`nav-item ${activeTab === 'admin_grades' ? 'active' : ''}`} onClick={() => setActiveTab('admin_grades')}>
                  Control Calificaciones
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
                  {/* Greeting Card with flat illustration banner */}
                  <div className="glass-panel welcome-banner-card" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, #003876 0%, #00224a 100%)', color: '#ffffff', border: 'none', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffc107', display: 'block', marginBottom: '0.5rem' }}>Plataforma Oficial MINERD</span>
                      <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>Panel de Control: {currentUser.name}</h2>
                      <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0 }}>
                        Gestiona y supervisa las asignaciones de docentes, matrícula escolar de estudiantes de cada grado, eventos del calendario escolar y supervise el rendimiento general en tiempo real para mitigar discrepancias académicas.
                      </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                      <img 
                        src="/dr_education_banner.png" 
                        alt="Administración" 
                        style={{ width: '100%', maxWidth: '200px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }} 
                      />
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', display: 'flex' }}>
                      <div style={{ flex: 1, backgroundColor: '#003876' }}></div>
                      <div style={{ flex: 1, backgroundColor: '#ffffff' }}></div>
                      <div style={{ flex: 1, backgroundColor: '#ce1126' }}></div>
                    </div>
                  </div>

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
                      {Object.keys(subjects).map(subKey => (
                        <li key={subKey}>
                          {subjects[subKey].name}: <strong>{getSubjectAverage(subKey)}%</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'teachers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h2>Configuración de la Estructura Escolar</h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '-1rem', marginBottom: '0.5rem' }}>
                    Administra y personaliza los grados, asignaturas e instructores del plantel. Expande cada bloque para realizar modificaciones y adiciones en caliente.
                  </p>

                  {/* BLOCK 1: DOCENTES Y ASIGNACIONES */}
                  <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    <button 
                      type="button" 
                      className={`accordion-header ${expandedSections.teachers ? 'active' : ''}`}
                      onClick={() => setExpandedSections(prev => ({ ...prev, teachers: !prev.teachers }))}
                      style={{
                        width: '100%',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--bg-secondary)',
                        border: 'none',
                        borderBottom: expandedSections.teachers ? '1px solid var(--border-color)' : 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.05rem',
                        transition: 'all 0.2s ease',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span>👨‍🏫</span>
                        <strong>Gestión de Docentes y Asignaciones</strong>
                        <span style={{ fontSize: '0.8rem', padding: '0.15rem 0.5rem', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '20px', fontWeight: 'bold' }}>
                          {users.filter(u => u.role === 'teacher').length} registrados
                        </span>
                      </span>
                      <span>{expandedSections.teachers ? '▲ Ocultar' : '▼ Mostrar'}</span>
                    </button>

                    {expandedSections.teachers && (
                      <div className="accordion-content animate-fade-in" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
                        {/* Left Side: Table of Teachers */}
                        <div className="custom-table-container" style={{ margin: 0 }}>
                          <table className="custom-table">
                            <thead>
                              <tr>
                                <th>Docente</th>
                                <th style={{ width: '100px' }}>Estado</th>
                                <th>Grados y Asignaturas Asignadas</th>
                                <th style={{ width: '90px', textAlign: 'center' }}>Acción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.filter(u => u.role === 'teacher').map(u => (
                                <tr key={u.id}>
                                  <td>
                                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{u.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Clave: {u.password}</div>
                                  </td>
                                  <td>
                                    <button 
                                      className={`btn-secondary ${u.active ? 'active-status' : 'inactive-status'}`}
                                      style={{ 
                                        padding: '0.35rem 0.65rem', 
                                        fontSize: '0.78rem',
                                        fontWeight: 'bold',
                                        borderRadius: '6px',
                                        backgroundColor: u.active ? 'var(--success-bg)' : 'var(--border-color)',
                                        color: u.active ? 'var(--success)' : 'var(--text-secondary)',
                                        border: '1px solid currentColor',
                                        cursor: 'pointer'
                                      }} 
                                      onClick={() => toggleUserActive(u.id)}
                                    >
                                      {u.active ? '✓ Activo' : '✕ Inactivo'}
                                    </button>
                                  </td>
                                  <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                      {/* Assigned courses list */}
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                        {u.assignments.map((a, idx) => {
                                          const subInfo = subjects[a.subject] || { name: a.subject, color: 'var(--text-muted)' };
                                          return (
                                            <div 
                                              key={idx} 
                                              style={{ 
                                                display: 'inline-flex', 
                                                alignItems: 'center', 
                                                gap: '0.35rem', 
                                                padding: '0.25rem 0.55rem', 
                                                backgroundColor: 'var(--bg-primary)', 
                                                borderRadius: '20px', 
                                                border: `1px solid ${subInfo.color}35`, 
                                                fontSize: '0.78rem',
                                                fontWeight: '600'
                                              }}
                                            >
                                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: subInfo.color }}></span>
                                              <span><strong>{a.grade}</strong>: {subInfo.name}</span>
                                              <button 
                                                style={{ border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0 0.15rem', fontSize: '0.85rem', fontWeight: 'bold' }} 
                                                onClick={() => handleRemoveAssignment(u.id, idx)}
                                                title="Quitar Asignación"
                                              >
                                                ✕
                                              </button>
                                            </div>
                                          );
                                        })}
                                        {u.assignments.length === 0 && (
                                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Sin clases asignadas.</span>
                                        )}
                                      </div>

                                      {/* Assignment creator inside the row */}
                                      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                                        <select 
                                          className="form-select-compact" 
                                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', minWidth: '85px' }}
                                          value={newAssignment.grade}
                                          onChange={(e) => setNewAssignment(prev => ({ ...prev, grade: e.target.value }))}
                                        >
                                          {grades.map(g => (
                                            <option key={g} value={g}>{g}</option>
                                          ))}
                                        </select>
                                        <select 
                                          className="form-select-compact" 
                                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', minWidth: '95px' }}
                                          value={newAssignment.subject}
                                          onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}
                                        >
                                          {Object.keys(subjects).map(subKey => (
                                            <option key={subKey} value={subKey}>{subjects[subKey].name}</option>
                                          ))}
                                        </select>
                                        <button 
                                          className="btn-primary" 
                                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }} 
                                          onClick={() => handleAddAssignment(u.id)}
                                        >
                                          ＋ Asignar
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <button 
                                      className="btn-delete-event" 
                                      onClick={() => handleDeleteUser(u.id)}
                                      style={{ color: 'var(--danger)', fontWeight: 'bold' }}
                                      title="Eliminar Cuenta Docente"
                                    >
                                      ✕ Borrar
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {users.filter(u => u.role === 'teacher').length === 0 && (
                                <tr>
                                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                    No hay docentes registrados en el sistema.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Right Side: Add Teacher Form */}
                        <div className="glass-panel" style={{ padding: '1.25rem', alignSelf: 'start', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                          <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--primary)' }}>Registrar Nuevo Docente</h4>
                          <form onSubmit={handleCreateTeacher} className="add-event-form">
                            <div className="form-group-compact">
                              <label>Nombre del Docente</label>
                              <input type="text" className="form-input-compact" value={teacherForm.name} onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Ej: Prof. Roberto Díaz" required />
                            </div>
                            <div className="form-group-compact">
                              <label>Correo Electrónico</label>
                              <input type="email" className="form-input-compact" value={teacherForm.email} onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))} placeholder="ejemplo@correo.com" required />
                            </div>
                            <div className="form-group-compact">
                              <label>Contraseña</label>
                              <input type="text" className="form-input-compact" value={teacherForm.password} onChange={(e) => setTeacherForm(prev => ({ ...prev, password: e.target.value }))} placeholder="Clave temporal" required />
                            </div>
                            <button type="submit" className="btn-add-event-submit" style={{ marginTop: '0.5rem' }}>Crear Cuenta</button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BLOCK 2: ASIGNATURAS */}
                  <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    <button 
                      type="button" 
                      className={`accordion-header ${expandedSections.subjects ? 'active' : ''}`}
                      onClick={() => setExpandedSections(prev => ({ ...prev, subjects: !prev.subjects }))}
                      style={{
                        width: '100%',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--bg-secondary)',
                        border: 'none',
                        borderBottom: expandedSections.subjects ? '1px solid var(--border-color)' : 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.05rem',
                        transition: 'all 0.2s ease',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span>📚</span>
                        <strong>Gestión de Asignaturas</strong>
                        <span style={{ fontSize: '0.8rem', padding: '0.15rem 0.5rem', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '20px', fontWeight: 'bold' }}>
                          {Object.keys(subjects).length} activas
                        </span>
                      </span>
                      <span>{expandedSections.subjects ? '▲ Ocultar' : '▼ Mostrar'}</span>
                    </button>

                    {expandedSections.subjects && (
                      <div className="accordion-content animate-fade-in" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
                        {/* Left Side: Table of Subjects */}
                        <div className="custom-table-container" style={{ margin: 0 }}>
                          <table className="custom-table">
                            <thead>
                              <tr>
                                <th>Identificador (Slug)</th>
                                <th>Nombre Completo</th>
                                <th>Etiqueta Color</th>
                                <th style={{ width: '80px', textAlign: 'center' }}>Acción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.keys(subjects).map(subKey => {
                                const sub = subjects[subKey];
                                return (
                                  <tr key={subKey}>
                                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 'bold' }}>{subKey}</td>
                                    <td style={{ fontWeight: 700 }}>{sub.name}</td>
                                    <td>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: sub.color, border: '1px solid rgba(0,0,0,0.1)' }}></span>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{sub.color}</span>
                                      </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                      <button 
                                        className="btn-delete-event" 
                                        onClick={() => handleDeleteSubject(subKey)}
                                        style={{ color: 'var(--danger)', fontWeight: 'bold' }}
                                        title="Eliminar Asignatura"
                                      >
                                        ✕ Eliminar
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Right Side: Add Subject Form */}
                        <div className="glass-panel" style={{ padding: '1.25rem', alignSelf: 'start', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                          <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--primary)' }}>Crear Nueva Asignatura</h4>
                          <form onSubmit={handleCreateSubject} className="add-event-form">
                            <div className="form-group-compact">
                              <label>Nombre de la Materia</label>
                              <input 
                                type="text" 
                                className="form-input-compact" 
                                value={subjectForm.name} 
                                onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))} 
                                placeholder="Ej: Educación Artística" 
                                required 
                              />
                            </div>
                            <div className="form-group-compact">
                              <label>Color de la Marca (Etiqueta)</label>
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input 
                                  type="color" 
                                  className="form-input-compact" 
                                  style={{ width: '45px', height: '35px', padding: '2px', cursor: 'pointer' }}
                                  value={subjectForm.color} 
                                  onChange={(e) => setSubjectForm(prev => ({ ...prev, color: e.target.value }))} 
                                  required 
                                />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{subjectForm.color}</span>
                              </div>
                            </div>
                            <button type="submit" className="btn-add-event-submit" style={{ marginTop: '0.5rem' }}>Crear Asignatura</button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BLOCK 3: GRADOS */}
                  <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    <button 
                      type="button" 
                      className={`accordion-header ${expandedSections.grades ? 'active' : ''}`}
                      onClick={() => setExpandedSections(prev => ({ ...prev, grades: !prev.grades }))}
                      style={{
                        width: '100%',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--bg-secondary)',
                        border: 'none',
                        borderBottom: expandedSections.grades ? '1px solid var(--border-color)' : 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.05rem',
                        transition: 'all 0.2s ease',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span>🏫</span>
                        <strong>Gestión de Grados y Cursos</strong>
                        <span style={{ fontSize: '0.8rem', padding: '0.15rem 0.5rem', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '20px', fontWeight: 'bold' }}>
                          {grades.length} habilitados
                        </span>
                      </span>
                      <span>{expandedSections.grades ? '▲ Ocultar' : '▼ Mostrar'}</span>
                    </button>

                    {expandedSections.grades && (
                      <div className="accordion-content animate-fade-in" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
                        {/* Left Side: Table of Grades */}
                        <div className="custom-table-container" style={{ margin: 0 }}>
                          <table className="custom-table">
                            <thead>
                              <tr>
                                <th>Nombre del Curso/Grado</th>
                                <th>Estudiantes Matriculados</th>
                                <th style={{ width: '80px', textAlign: 'center' }}>Acción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {grades.map(g => {
                                const studentsCount = students.filter(s => s.grade === g).length;
                                return (
                                  <tr key={g}>
                                    <td style={{ fontWeight: 700 }}>{g}</td>
                                    <td>
                                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>{studentsCount} alumnos</span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                      <button 
                                        className="btn-delete-event" 
                                        onClick={() => handleDeleteGrade(g)}
                                        style={{ color: 'var(--danger)', fontWeight: 'bold' }}
                                        title="Eliminar Grado"
                                      >
                                        ✕ Eliminar
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Right Side: Add Grade Form */}
                        <div className="glass-panel" style={{ padding: '1.25rem', alignSelf: 'start', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                          <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--primary)' }}>Crear Nuevo Grado</h4>
                          <form onSubmit={handleCreateGrade} className="add-event-form">
                            <div className="form-group-compact">
                              <label>Nombre del Grado</label>
                              <input 
                                type="text" 
                                className="form-input-compact" 
                                value={gradeForm.name} 
                                onChange={(e) => setGradeForm(prev => ({ ...prev, name: e.target.value }))} 
                                placeholder="Ej: 2do B" 
                                required 
                              />
                            </div>
                            <button type="submit" className="btn-add-event-submit" style={{ marginTop: '0.5rem' }}>Crear Grado</button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div>
                  <h2>Estudiantes por Grado</h2>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {grades.map(g => (
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

              {activeTab === 'admin_grades' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h2>Control de Calificaciones y Alertas Académicas</h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '-1rem', marginBottom: '0.5rem' }}>
                    Supervisa el rendimiento escolar por periodos. Configura los contactos de coordinación y orientación del grado para emitir alertas si la nota cae por debajo de 70.
                  </p>

                  {/* Horizontal Grades Bar */}
                  <div className="report-grades-bar" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    {grades.map(g => (
                      <button 
                        key={g} 
                        className={`btn-secondary ${selectedAdminReportGrade === g ? 'btn-primary active-report-grade' : ''}`} 
                        onClick={() => setSelectedAdminReportGrade(g)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold' }}
                      >
                        🏫 {g}
                      </button>
                    ))}
                  </div>

                  {/* Contacts Configuration for selected Grade */}
                  <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--primary)' }}>Configuración de Contactos del Grado: {selectedAdminReportGrade}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 150px', gap: '1rem', alignItems: 'end' }}>
                      <div className="form-group-compact" style={{ marginBottom: 0 }}>
                        <label>Correo del Coordinador Encargado</label>
                        <input 
                          type="email" 
                          className="form-input-compact" 
                          placeholder="coordinador@liceo.edu" 
                          value={gradeStaffContacts[selectedAdminReportGrade]?.coordinator || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGradeStaffContacts(prev => ({
                              ...prev,
                              [selectedAdminReportGrade]: {
                                ...(prev[selectedAdminReportGrade] || { counselor: '' }),
                                coordinator: val
                              }
                            }));
                          }}
                        />
                      </div>
                      <div className="form-group-compact" style={{ marginBottom: 0 }}>
                        <label>Correo del Orientador Encargado</label>
                        <input 
                          type="email" 
                          className="form-input-compact" 
                          placeholder="orientador@liceo.edu" 
                          value={gradeStaffContacts[selectedAdminReportGrade]?.counselor || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGradeStaffContacts(prev => ({
                              ...prev,
                              [selectedAdminReportGrade]: {
                                ...(prev[selectedAdminReportGrade] || { coordinator: '' }),
                                counselor: val
                              }
                            }));
                          }}
                        />
                      </div>
                      <button 
                        className="btn-primary" 
                        style={{ height: '38px', borderRadius: '6px' }}
                        onClick={() => {
                          const contact = gradeStaffContacts[selectedAdminReportGrade] || { coordinator: '', counselor: '' };
                          handleSaveStaffContacts(selectedAdminReportGrade, contact.coordinator, contact.counselor);
                        }}
                      >
                        💾 Guardar
                      </button>
                    </div>
                  </div>

                  {/* Accordion List of Subjects for this Grade */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.keys(subjects).map(subKey => {
                      const sub = subjects[subKey];
                      const teacher = users.find(u => 
                        u.role === 'teacher' && 
                        u.assignments.some(a => a.grade === selectedAdminReportGrade && a.subject === subKey)
                      );
                      const isExpanded = expandedReportSubjects[subKey];
                      const gradeStudents = students.filter(s => s.grade === selectedAdminReportGrade);

                      return (
                        <div 
                          key={subKey} 
                          className="glass-panel" 
                          style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                        >
                          <button
                            type="button"
                            className="accordion-header"
                            onClick={() => setExpandedReportSubjects(prev => ({ ...prev, [subKey]: !prev[subKey] }))}
                            style={{
                              width: '100%',
                              padding: '1rem 1.25rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              background: isExpanded ? 'var(--primary-glow)' : 'var(--bg-secondary)',
                              border: 'none',
                              borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
                              color: isExpanded ? 'var(--primary)' : 'var(--text-primary)',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              transition: 'all 0.2s ease',
                              textAlign: 'left'
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: sub.color }}></span>
                              <strong>{sub.name}</strong>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                                Docente: <strong>{teacher ? teacher.name : 'Sin docente asignado'}</strong>
                              </span>
                            </span>
                            <span>{isExpanded ? '▲ Ocultar Calificaciones' : '▼ Mostrar Calificaciones'}</span>
                          </button>

                          {isExpanded && (
                            <div className="accordion-content animate-fade-in" style={{ padding: '1.25rem' }}>
                              <div className="custom-table-container" style={{ margin: 0 }}>
                                <table className="custom-table">
                                  <thead>
                                    <tr>
                                      <th>Estudiante</th>
                                      <th style={{ textAlign: 'center', width: '90px' }}>P1</th>
                                      <th style={{ textAlign: 'center', width: '90px' }}>P2</th>
                                      <th style={{ textAlign: 'center', width: '90px' }}>P3</th>
                                      <th style={{ textAlign: 'center', width: '90px' }}>P4</th>
                                      <th style={{ textAlign: 'center', width: '110px' }}>Promedio Final</th>
                                      <th style={{ textAlign: 'center', width: '180px' }}>Acciones</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {gradeStudents.map(s => {
                                      const p1 = calculateBlockAvg(s.id, subKey, 'bloque1', s.grades);
                                      const p2 = calculateBlockAvg(s.id, subKey, 'bloque2', s.grades);
                                      const p3 = calculateBlockAvg(s.id, subKey, 'bloque3', s.grades);
                                      const p4 = calculateBlockAvg(s.id, subKey, 'bloque4', s.grades);
                                      const finalAvg = calculateSubjectAvg(s.id, subKey, s.grades);

                                      const hasFailing = p1 < 70 || p2 < 70 || p3 < 70 || p4 < 70 || finalAvg < 70;

                                      return (
                                        <tr key={s.id}>
                                          <td style={{ fontWeight: 700 }}>{s.name}</td>
                                          <td style={{ textAlign: 'center' }}>
                                            <span style={{ color: p1 < 70 ? 'var(--danger)' : 'inherit', fontWeight: p1 < 70 ? 'bold' : 'normal' }}>
                                              {p1.toFixed(0)}
                                            </span>
                                          </td>
                                          <td style={{ textAlign: 'center' }}>
                                            <span style={{ color: p2 < 70 ? 'var(--danger)' : 'inherit', fontWeight: p2 < 70 ? 'bold' : 'normal' }}>
                                              {p2.toFixed(0)}
                                            </span>
                                          </td>
                                          <td style={{ textAlign: 'center' }}>
                                            <span style={{ color: p3 < 70 ? 'var(--danger)' : 'inherit', fontWeight: p3 < 70 ? 'bold' : 'normal' }}>
                                              {p3.toFixed(0)}
                                            </span>
                                          </td>
                                          <td style={{ textAlign: 'center' }}>
                                            <span style={{ color: p4 < 70 ? 'var(--danger)' : 'inherit', fontWeight: p4 < 70 ? 'bold' : 'normal' }}>
                                              {p4.toFixed(0)}
                                            </span>
                                          </td>
                                          <td style={{ textAlign: 'center' }}>
                                            <span 
                                              style={{ 
                                                color: finalAvg < 70 ? 'var(--danger)' : 'var(--success)', 
                                                fontWeight: 'bold', 
                                                fontSize: '0.95rem',
                                                padding: '0.15rem 0.4rem',
                                                borderRadius: '4px',
                                                backgroundColor: finalAvg < 70 ? 'var(--danger-bg)' : 'var(--success-bg)'
                                              }}
                                            >
                                              {finalAvg.toFixed(0)}
                                            </span>
                                          </td>
                                          <td style={{ textAlign: 'center' }}>
                                            {hasFailing ? (
                                              <button 
                                                className="btn-danger active-status" 
                                                style={{ 
                                                  padding: '0.35rem 0.65rem', 
                                                  fontSize: '0.78rem', 
                                                  fontWeight: 'bold',
                                                  borderRadius: '6px',
                                                  display: 'inline-flex',
                                                  alignItems: 'center',
                                                  gap: '0.3rem',
                                                  cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                  let worstPeriod = 'final';
                                                  let worstScore = finalAvg;
                                                  if (p1 < 70) { worstPeriod = 'bloque1'; worstScore = p1; }
                                                  else if (p2 < 70) { worstPeriod = 'bloque2'; worstScore = p2; }
                                                  else if (p3 < 70) { worstPeriod = 'bloque3'; worstScore = p3; }
                                                  else if (p4 < 70) { worstPeriod = 'bloque4'; worstScore = p4; }

                                                  handleOpenAlertModal(s, subKey, worstScore, worstPeriod);
                                                }}
                                              >
                                                📧 Emitir Alerta
                                              </button>
                                            ) : (
                                              <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'bold' }}>✓ Aprobado</span>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                    {gradeStudents.length === 0 && (
                                      <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                                          No hay alumnos matriculados en este grado.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Alert Bitacora History */}
                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3 style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>Historial de Alertas Académicas Emitidas</h3>
                    <div className="custom-table-container" style={{ margin: 0, maxHeight: '250px', overflowY: 'auto' }}>
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Estudiante</th>
                            <th>Grado</th>
                            <th>Asignatura</th>
                            <th>Periodo / Nota</th>
                            <th>Destinatarios</th>
                            <th>Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alertLogs.map(log => (
                            <tr key={log.id}>
                              <td style={{ fontWeight: 700 }}>{log.studentName}</td>
                              <td><span className="badge badge-success">{log.grade}</span></td>
                              <td>{log.subjectName}</td>
                              <td>
                                <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{log.periodName} ({log.score})</span>
                              </td>
                              <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                <div>Coord: {log.coordinator}</div>
                                <div>Orient: {log.counselor}</div>
                              </td>
                              <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                            </tr>
                          ))}
                          {alertLogs.length === 0 && (
                            <tr>
                              <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                                No se han registrado envíos de alerta todavía.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && (
                <div>
                  <h2>Calendario Escolar</h2>
                  {renderCalendarComponent()}
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
      <header className="header" style={{ borderBottom: '2px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            type="button" 
            className="sidebar-toggle-btn" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ border: 'none', background: 'none', fontSize: '1.4rem', cursor: 'pointer', padding: '0.25rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ☰
          </button>
          <div className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--danger)', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>REGISTRO DE EVALUACIÓN DIGITAL</span>
              <span style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--primary)' }}>LICEO ANA ROSA CASTILLO</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>Distrito 14-01 Nagua</span>
            </div>
            <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.4rem', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', border: '1px solid var(--border-color)', borderRadius: '4px', marginLeft: '0.5rem', fontWeight: 'bold', alignSelf: 'center' }}>Docente</span>
            <span 
              style={{ 
                fontSize: '0.72rem', 
                padding: '0.2rem 0.5rem', 
                backgroundColor: dbService.isEnabled ? 'var(--success-bg)' : 'var(--border-color)', 
                color: dbService.isEnabled ? 'var(--success)' : 'var(--text-secondary)', 
                border: '1px solid currentColor', 
                borderRadius: '4px', 
                marginLeft: '0.4rem', 
                fontWeight: 'bold', 
                alignSelf: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title={dbService.isEnabled ? "Datos sincronizados en la nube" : "Datos guardados en este dispositivo localmente"}
            >
              <span>{dbService.isEnabled ? '☁️ En la nube' : '📁 Local'}</span>
            </span>
          </div>
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
            <div className="header-profile-text" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 650 }}>{currentUser.name}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Docente</span>
            </div>
            <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', marginLeft: '0.5rem' }} onClick={handleLogout}>Salir</button>
          </div>
        </div>
      </header>

      <div className="main-content animate-fade-in">
        <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {!sidebarCollapsed && (
            <div className="sidebar-mobile-backdrop" onClick={() => setSidebarCollapsed(true)}></div>
          )}
          <aside className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start', position: 'relative' }}>
            <button 
              type="button" 
              className="sidebar-close-btn" 
              onClick={() => setSidebarCollapsed(true)}
            >
              ✕
            </button>
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
                {/* Greeting Card with flat illustration banner */}
                <div className="glass-panel welcome-banner-card" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, #003876 0%, #00224a 100%)', color: '#ffffff', border: 'none', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffc107', display: 'block', marginBottom: '0.5rem' }}>Plataforma Oficial MINERD</span>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>¡Hola de nuevo, {currentUser.name}!</h2>
                    <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0 }}>
                      Bienvenido al Registro de Evaluación Digital del Liceo Ana Rosa Castillo. Accede a las herramientas de Rúbricas por competencias, asigne puntajes en caliente, verifique el promedio final de cada estudiante, y controle la asistencia desde este panel central.
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                    <img 
                      src="/dr_education_banner.png" 
                      alt="Bienvenido" 
                      style={{ width: '100%', maxWidth: '200px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }} 
                    />
                  </div>
                  {/* Decorative flag stripes or waves */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', display: 'flex' }}>
                    <div style={{ flex: 1, backgroundColor: '#003876' }}></div>
                    <div style={{ flex: 1, backgroundColor: '#ffffff' }}></div>
                    <div style={{ flex: 1, backgroundColor: '#ce1126' }}></div>
                  </div>
                </div>

                <h2>Resumen de Clases</h2>
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
                          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: subjects[subKey]?.color || 'var(--text-muted)' }}></span>
                          {subjects[subKey]?.name || subKey}
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
                                    const blockArray = getCalculatedBlockGrades(s.id, s.grade, selectedSubject, activeBloque, evaluationConfigs, studentAssessments, subjectData[activeBloque] || [80, 80, 80, 80]);
                                    
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
                {renderCalendarComponent()}
              </div>
            )}
            {activeTab === 'instruments' && (
              <div>
                <h2>Instrumentos de Evaluación Ponderada</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Define las competencias, indicadores y criterios específicos para el parámetro seleccionado. Modifica los textos directamente en la cuadrícula de la rúbrica.
                </p>

{selectedGrade && selectedSubject ? (
                  <div>
                    {/* Horizontal Parameter Selectors (P1 - P4) */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                      {['p1', 'p2', 'p3', 'p4'].map((pKey, pIdx) => {
                        const isSel = activePKey === pKey;
                        return (
                          <button
                            key={pKey}
                            type="button"
                            onClick={() => {
                              setActivePKey(pKey);
                              
                              // Auto-select first instrument of the activeBloque if it has instruments
                              const configKey = `${selectedGrade}_${selectedSubject}_${activeBloque}`;
                              const blockConfig = migrateConfig(evaluationConfigs[configKey]);
                              const list = blockConfig[pKey] || [];
                              if (list.length > 0) {
                                setActiveInstrumentId(list[0].id);
                              } else {
                                // Try to find any instrument in other blocks for this parameter
                                let found = false;
                                const blocks = ['bloque1', 'bloque2', 'bloque3', 'bloque4'];
                                for (const b of blocks) {
                                  const bk = `${selectedGrade}_${selectedSubject}_${b}`;
                                  const bc = migrateConfig(evaluationConfigs[bk]);
                                  const blist = bc[pKey] || [];
                                  if (blist.length > 0) {
                                    setActiveBloque(b);
                                    setExpandedBlocks(prev => ({ ...prev, [b]: true }));
                                    setActiveInstrumentId(blist[0].id);
                                    found = true;
                                    break;
                                  }
                                }
                                if (!found) {
                                  setActiveInstrumentId('');
                                }
                              }
                            }}
                            className={`btn-primary ${isSel ? 'active' : ''}`}
                            style={{
                              padding: '0.65rem 1.25rem',
                              borderRadius: '20px',
                              fontSize: '0.9rem',
                              fontWeight: 'bold',
                              border: isSel ? 'none' : '1px solid rgba(0, 56, 118, 0.15)',
                              background: isSel ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)' : 'rgba(255, 255, 255, 0.4)',
                              color: isSel ? '#fff' : 'var(--primary)',
                              boxShadow: isSel ? '0 4px 12px var(--primary-glow)' : '0 2px 6px rgba(0,0,0,0.03)',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer'
                            }}
                          >
                            Parámetro P{pIdx + 1}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
                      
                      {/* Evaluations/Instruments Accordion sidebar (Blocks CE1-CE4 with parameters instruments) */}
                      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                          Bloques de Evaluaciones
                        </span>

                        {[
                          { key: 'bloque1', label: 'Bloque CE1' },
                          { key: 'bloque2', label: 'Bloque CE2-CE3' },
                          { key: 'bloque3', label: 'Bloque CE4-CE7' },
                          { key: 'bloque4', label: 'Bloque CE5-CE6' }
                        ].map(block => {
                          const isExpanded = expandedBlocks[block.key];
                          const blockKey = `${selectedGrade}_${selectedSubject}_${block.key}`;
                          const blockConfig = migrateConfig(evaluationConfigs[blockKey]);
                          const list = blockConfig[activePKey] || [];
                          const isBlockActive = activeBloque === block.key;
                          
                          return (
                            <div key={block.key} style={{ marginBottom: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', backgroundColor: isBlockActive ? 'rgba(0, 56, 118, 0.02)' : 'transparent' }}>
                              
                              {/* Accordion header button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveBloque(block.key);
                                  setExpandedBlocks(prev => ({ ...prev, [block.key]: !prev[block.key] }));
                                  if (list.length > 0) {
                                    setActiveInstrumentId(list[0].id);
                                  }
                                }}
                                style={{
                                  width: '100%',
                                  padding: '0.65rem 0.85rem',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  backgroundColor: isBlockActive ? 'var(--primary-glow)' : 'var(--bg-secondary)',
                                  border: 'none',
                                  borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  fontWeight: 'bold',
                                  fontSize: '0.82rem',
                                  color: isBlockActive ? 'var(--primary)' : 'var(--text-primary)'
                                }}
                              >
                                <span>{block.label}</span>
                                <span>{isExpanded ? '▲' : '▼'}</span>
                              </button>
                              
                              {/* Accordion body (instruments list) */}
                              {isExpanded && (
                                <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', backgroundColor: 'var(--bg-primary)' }}>
                                  
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.2rem 0', padding: '0 0.25rem' }}>
                                    <span style={{ fontSize: '0.68rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                      Actividades ({activePKey.toUpperCase()})
                                    </span>
                                    <button 
                                      type="button" 
                                      style={{ padding: '0.1rem 0.4rem', background: 'rgba(0, 56, 118, 0.06)', border: '1px solid var(--primary)', borderRadius: '4px', color: 'var(--primary)', fontSize: '0.68rem', cursor: 'pointer', fontWeight: 'bold' }}
                                      onClick={() => {
                                        setActiveBloque(block.key);
                                        handleAddNewInstrument(activePKey);
                                      }}
                                    >
                                      ＋ Agregar
                                    </button>
                                  </div>

                                  {/* List instruments */}
                                  {list.map(inst => {
                                    const isSel = activeBloque === block.key && activeInstrumentId === inst.id;
                                    return (
                                      <button
                                        key={inst.id}
                                        className={`instrument-card-btn ${isSel ? 'active' : ''}`}
                                        onClick={() => {
                                          setActiveBloque(block.key);
                                          setActiveInstrumentId(inst.id);
                                        }}
                                        style={{ 
                                          textAlign: 'left', 
                                          fontSize: '0.74rem', 
                                          width: '100%', 
                                          display: 'flex', 
                                          flexDirection: 'column', 
                                          alignItems: 'flex-start',
                                          padding: '0.5rem 0.65rem',
                                          borderRadius: '6px',
                                          border: isSel ? '1px solid var(--primary)' : '1px solid rgba(0, 56, 118, 0.08)',
                                          background: isSel ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)' : 'rgba(255,255,255,0.7)',
                                          color: isSel ? '#fff' : 'var(--text-primary)',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s ease'
                                        }}
                                      >
                                        <div style={{ fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', color: isSel ? '#fff' : 'var(--primary)' }}>
                                          {inst.activity || 'Actividad Sin Nombre'}
                                        </div>
                                        <div style={{ fontSize: '0.66rem', color: isSel ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)', marginTop: '0.1rem' }}>
                                          Puntos: <strong>{inst.weight || 100}</strong> pts
                                        </div>
                                      </button>
                                    );
                                  })}
                                  
                                  {list.length === 0 && (
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', padding: '0.5rem 0.25rem', fontStyle: 'italic', textAlign: 'center' }}>
                                      Sin instrumentos
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      


                      {/* SIDE-BY-SIDE PANELS (Rúbrica Matrix on Left, Students spreadsheet on Right) */}
                      <div className="instruments-stacked-panels" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem', width: '100%' }}>
                        
                        {/* Fully Editable Matrix Form (exactly like Google Doc sample!) */}
                        <div className="glass-panel" style={{ padding: '2rem', width: '100%' }}>

                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                          <h3 style={{ margin: 0 }}>
                            Configuración de Instrumento ({activePKey.toUpperCase()})
                          </h3>
                          {activeInstrumentId && (
                            <button 
                              type="button" 
                              className="btn-danger" 
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                              onClick={() => handleDeleteInstrument(activeInstrumentId)}
                            >
                              ✕ Eliminar Instrumento
                            </button>
                          )}
                        </div>

                        {(() => {
                          const configKey = `${selectedGrade}_${selectedSubject}_${activeBloque}`;
                          const blockConfig = migrateConfig(evaluationConfigs[configKey]);
                          const currentList = blockConfig[activePKey] || [];
                          const currentWeightSum = currentList.reduce((acc, inst) => acc + (inst.weight || 0), 0);
                          
                          if (currentWeightSum !== 100 && currentList.length > 0) {
                            return (
                              <div style={{ backgroundColor: 'rgba(245, 124, 0, 0.08)', border: '1px solid var(--warning)', color: 'var(--warning)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>⚠️</span>
                                <div>
                                  La suma de las ponderaciones de los instrumentos de <strong>{activePKey.toUpperCase()}</strong> es actualmente de <strong>{currentWeightSum} / 100</strong> puntos. Para un cálculo exacto de la nota de la planilla general, asegúrese de que el total de instrumentos sume 100 puntos.
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr 1.2fr 0.6fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div className="form-group">
                            <label>Nombre de la Actividad</label>
                            <input 
                              type="text" 
                              className="form-input"
                              value={instrumentEditState.activity}
                              onChange={(e) => updateActiveInstrumentConfig({ activity: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Tema / Contenido</label>
                            <input 
                              type="text" 
                              className="form-input"
                              value={instrumentEditState.topic || ''}
                              onChange={(e) => updateActiveInstrumentConfig({ topic: e.target.value })}
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
                              onChange={(e) => updateActiveInstrumentConfig({ competence: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Indicador de Logro</label>
                            <input 
                              type="text" 
                              className="form-input"
                              value={instrumentEditState.indicator}
                              onChange={(e) => updateActiveInstrumentConfig({ indicator: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Puntos (Máx 100)</label>
                            <input 
                              type="number" 
                              className="form-input"
                              min="1"
                              max="100"
                              value={instrumentEditState.weight || 100}
                              onChange={(e) => updateActiveInstrumentConfig({ weight: Number(e.target.value) || 0 })}
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
                              onChange={(e) => updateActiveInstrumentConfig({ type: e.target.value })}
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
                      <div className="glass-panel" style={{ padding: '2rem', width: '100%' }}>
                        {(() => {
                          const configKey = `${selectedGrade}_${selectedSubject}_${activeBloque}`;
                          const blockConfig = migrateConfig(evaluationConfigs[configKey]);
                          const list = blockConfig[activePKey] || [];
                          const config = list.find(inst => inst.id === activeInstrumentId) || list[0];

                          if (!config) {
                            return (
                              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                No hay ningún instrumento configurado para este parámetro. Haz clic en "＋ Agregar" arriba a la izquierda para crear uno.
                              </div>
                            );
                          }

                          const criteriaList = normalizeCriteria(config.criteria, config.type);
                          
                          // Divide instrument weight proportional to number of criteria
                          const maxCritScore = criteriaList.length > 0 ? Math.floor((config.weight || 100) / criteriaList.length) : (config.weight || 100);

                          return (
                            <>
                              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                                Planilla de Calificación: {config.activity || 'Actividad Académica'}
                              </h3>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                Evalúa a los estudiantes seleccionando el nivel de logro para cada criterio o digitando el puntaje directamente. Las notas se sumarán con otros instrumentos del parámetro para dar el total sobre 100 de {activePKey.toUpperCase()} en la planilla general.
                              </p>

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
                                        Total ({config.weight || 100})
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {studentsFilteredByGrade.map((s, sIdx) => {
                                      const assessmentKey = `${s.id}_${selectedSubject}_${activeBloque}_${activePKey}_${config.id}`;
                                      const savedAssessment = studentAssessments[assessmentKey] || {};
                                      
                                      // Calculate total points for this student in this specific instrument
                                      const instTotal = criteriaList.reduce((acc, c) => acc + (savedAssessment[c.name] !== undefined ? Number(savedAssessment[c.name]) : 0), 0);

                                      return (
                                        <tr key={s.id}>
                                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textAlign: 'center' }}>{sIdx + 1}</td>
                                          <td style={{ fontWeight: 600 }}>{s.name}</td>
                                          
                                          {/* Criteria values input */}
                                          {criteriaList.map((crit, critIdx) => {
                                            const score = savedAssessment[crit.name] !== undefined ? Number(savedAssessment[crit.name]) : 0;
                                            return (
                                              <td key={critIdx} style={{ padding: 0 }}>
                                                
                                                {/* Dropdown helper select in cell for Tobon level scoring */}
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                  <input 
                                                    type="number" 
                                                    className="criteria-grade-input"
                                                    value={savedAssessment[crit.name] !== undefined ? score : ''}
                                                    min="0"
                                                    max={maxCritScore}
                                                    placeholder="-"
                                                    onChange={(e) => handleUpdateStudentCriterionScore(s.id, selectedSubject, activePKey, config.id, crit.name, e.target.value)}
                                                  />
                                                  
                                                  {/* Simple quick selector */}
                                                  {config.type !== 'lista' ? (
                                                    <select 
                                                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--text-secondary)', paddingRight: '0.25rem' }}
                                                      value={
                                                        score >= maxCritScore ? 'estrategico' :
                                                        score >= Math.floor(maxCritScore * 0.85) ? 'autonomo' :
                                                        score >= Math.floor(maxCritScore * 0.75) ? 'resolutivo' :
                                                        score > 0 ? 'receptivo' : ''
                                                      }
                                                      onChange={(e) => {
                                                        const targetLevel = e.target.value;
                                                        let val = 0;
                                                        if (targetLevel === 'receptivo') val = Math.floor(maxCritScore * 0.65);
                                                        else if (targetLevel === 'resolutivo') val = Math.floor(maxCritScore * 0.75);
                                                        else if (targetLevel === 'autonomo') val = Math.floor(maxCritScore * 0.88);
                                                        else if (targetLevel === 'estrategico') val = maxCritScore;
                                                        
                                                        handleUpdateStudentCriterionScore(s.id, selectedSubject, activePKey, config.id, crit.name, val);
                                                      }}
                                                    >
                                                      <option value="">-- Nivel --</option>
                                                      <option value="receptivo">Receptivo (65%)</option>
                                                      <option value="resolutivo">Resolutivo (75%)</option>
                                                      <option value="autonomo">Autónomo (88%)</option>
                                                      <option value="estrategico">Estratégico (100%)</option>
                                                    </select>
                                                  ) : (
                                                    <select 
                                                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--text-secondary)', paddingRight: '0.25rem' }}
                                                      value={savedAssessment[crit.name] !== undefined ? (score >= maxCritScore ? 'si' : 'no') : ''}
                                                      onChange={(e) => {
                                                        const val = e.target.value === 'si' ? maxCritScore : Math.floor(maxCritScore * 0.5);
                                                        handleUpdateStudentCriterionScore(s.id, selectedSubject, activePKey, config.id, crit.name, val);
                                                      }}
                                                    >
                                                      <option value="">-- Sí/No --</option>
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
                                            {instTotal}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {/* DYNAMIC CALENDAR UNDERNEATH INSTRUMENTS */}
                      <div className="glass-panel" style={{ padding: '2rem', width: '100%', marginTop: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <span>Calendario de Actividades del Curso</span>
                        </h2>
                        {renderCalendarComponent()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                    Por favor selecciona un Grado y Asignatura en la barra lateral.
                  </div>
                )}
              {/* Gemini Floating Chatbot Assistant */}
              {!aiChatOpen && (
                <button
                  type="button"
                  className="gemini-chat-fab"
                  onClick={() => setAiChatOpen(true)}
                  style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #9b72cb 0%, #4285f4 30%, #d96570 70%, #ffca28 100%)',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(66, 133, 244, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                  }}
                  title="Asistente de Rúbricas Gemini"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22c0-5.523 4.477-10 10-10-5.477 0-10-4.477-10-10C12 7.523 7.523 12 2 12c5.523 0 10 4.477 10 10Z" fill="#ffffff"/>
                    <path d="M6 6c0-2.209 1.791-4 4-4-2.209 0-4 1.791-4 4C6 3.791 4.209 2 2 2c2.209 0 4 1.791 4 4Z" fill="#ffffff"/>
                  </svg>
                </button>
              )}

              {aiChatOpen && (
                <div
                  className="gemini-floating-chat glass-panel animate-fade-in"
                  style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '380px',
                    height: aiChatMinimized ? '48px' : '520px',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(66, 133, 244, 0.2)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                >
                  {/* Chat Header */}
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'linear-gradient(135deg, #9b72cb 0%, #4285f4 30%, #d96570 70%, #ffca28 100%)',
                      color: '#fff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => setAiChatMinimized(!aiChatMinimized)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22c0-5.523 4.477-10 10-10-5.477 0-10-4.477-10-10C12 7.523 7.523 12 2 12c5.523 0 10 4.477 10 10Z" fill="#ffffff"/>
                        <path d="M6 6c0-2.209 1.791-4 4-4-2.209 0-4 1.791-4 4C6 3.791 4.209 2 2 2c2.209 0 4 1.791 4 4Z" fill="#ffffff"/>
                      </svg>
                      <strong style={{ fontSize: '0.88rem' }}>Asistente Gemini</strong>
                      <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                        {aiApiKey ? '(En Línea)' : '(Simulador)'}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setAiChatMinimized(!aiChatMinimized)}
                        style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1rem', cursor: 'pointer', padding: '0.25rem' }}
                        title="Minimizar"
                      >
                        {aiChatMinimized ? '▲' : '▼'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiChatOpen(false)}
                        style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.1rem', cursor: 'pointer', padding: '0.25rem', fontWeight: 'bold' }}
                        title="Cerrar"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Chat Body */}
                  {!aiChatMinimized && (
                    <>
                      {/* AI Config link button */}
                      <div style={{ padding: '0.4rem 0.85rem', backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Configuración de Clave API</span>
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: '#4285f4', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.72rem' }}
                          onClick={() => setShowAiConfig(!showAiConfig)}
                        >
                          {showAiConfig ? 'Ocultar 🔧' : 'Configurar 🔧'}
                        </button>
                      </div>

                      {/* Collapsible API config section inside float */}
                      {showAiConfig && (
                        <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
                          <form onSubmit={saveAiCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.66rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Proveedor</label>
                                <select className="form-select" style={{ padding: '0.25rem', fontSize: '0.75rem' }} value={aiProvider} onChange={(e) => setAiProvider(e.target.value)}>
                                  <option value="gemini">Google Gemini</option>
                                  <option value="copilot">Microsoft Copilot</option>
                                </select>
                              </div>
                              <div style={{ flex: 1.5 }}>
                                <label style={{ display: 'block', fontSize: '0.66rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>API Key</label>
                                <input 
                                  type="password" 
                                  className="form-input" 
                                  style={{ padding: '0.25rem', fontSize: '0.75rem' }}
                                  placeholder="Ingresa clave..." 
                                  value={aiApiKey} 
                                  onChange={(e) => setAiApiKey(e.target.value)} 
                                />
                              </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ padding: '0.35rem', fontSize: '0.75rem', backgroundColor: '#4285f4' }}>Guardar</button>
                          </form>
                        </div>
                      )}

                      {/* Chat Messages */}
                      <div className="ai-chat-messages" style={{ flex: 1, padding: '0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {aiChatHistory.map((msg, idx) => (
                          <div key={idx} className={`ai-chat-bubble ${msg.sender}`} style={{ alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                            <span style={{ display: 'block', fontSize: '0.66rem', fontWeight: 'bold', marginBottom: '0.15rem', color: msg.sender === 'ai' ? '#4285f4' : 'var(--primary)' }}>
                              {msg.sender === 'ai' ? 'Gemini' : 'Tú'}
                            </span>
                            <div style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{msg.text}</div>
                          </div>
                        ))}

                        {aiIsTyping && (
                          <div className="ai-chat-bubble ai" style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                            <span style={{ display: 'block', fontSize: '0.66rem', fontWeight: 'bold', color: '#4285f4' }}>Gemini</span>
                            <div className="ai-typing-effect" style={{ fontSize: '0.8rem' }}>Generando instrumento...</div>
                          </div>
                        )}
                      </div>

                      {/* Applied instrument preview inside chat */}
                      {latestAiGeneratedInstrument && (
                        <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'rgba(66, 133, 244, 0.08)', borderTop: '1px solid rgba(66, 133, 244, 0.15)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-primary)' }}>
                            Instrumento listo: <strong>{latestAiGeneratedInstrument.activity}</strong>
                          </div>
                          <button className="ai-chat-apply-btn" onClick={handleApplyAiInstrument} style={{ padding: '0.35rem', fontSize: '0.75rem', width: '100%', background: 'linear-gradient(135deg, #9b72cb 0%, #4285f4 50%, #d96570 100%)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            ⚡ Aplicar Instrumento
                          </button>
                        </div>
                      )}

                      {/* Chat Input form */}
                      <form onSubmit={handleSendAiMessage} className="ai-chat-input-row" style={{ display: 'flex', borderTop: '1px solid var(--border-color)', padding: '0.5rem', gap: '0.35rem', backgroundColor: 'var(--bg-primary)' }}>
                        <input 
                          type="text" 
                          className="ai-chat-input"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="Pídele una rúbrica a Gemini..."
                          disabled={aiIsTyping}
                          style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', backgroundColor: '#7c3aed' }} disabled={aiIsTyping}>
                          Enviar
                        </button>
                      </form>
                    </>
                  )}
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
                      <strong>Evaluación por Criterios Integrada</strong>
                      <p style={{ fontSize: '0.85rem' }}>Califica directamente al final de la pestaña "Instrumentos de Evaluación" seleccionando el nivel de logro para cada criterio de la actividad. Las calificaciones de todos los instrumentos asociados a un parámetro (ej: P1) se sumarán automáticamente y se verán reflejadas en la Planilla de Calificaciones general.</p>
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
                  Asignatura: <strong>{subjects[activeAssessment.subjectKey]?.name || activeAssessment.subjectKey}</strong> | Grado: <strong>{selectedGrade}</strong> | Evaluación {activeAssessment.evalIdx + 1}
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

      {/* ACADEMIC WARNING ALARM MODAL */}
      {alertFormModal.isOpen && alertFormModal.student && (
        <div className="modal-backdrop">
          <div className="modal-card animate-fade-in" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--danger)' }}>🚨 Borrador de Alerta Académica</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Notificación de bajo rendimiento (Calificación por debajo de 70)
                </span>
              </div>
              <button 
                style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }} 
                onClick={() => setAlertFormModal(prev => ({ ...prev, isOpen: false }))}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="alert alert-danger" style={{ fontSize: '0.85rem', margin: 0, padding: '0.75rem 1rem' }}>
                <strong>Nota Crítica Detectada:</strong> El estudiante <strong>{alertFormModal.student.name}</strong> tiene una calificación de <strong>{alertFormModal.score.toFixed(0)}%</strong> en la asignatura <strong>{subjects[alertFormModal.subjectKey]?.name || alertFormModal.subjectKey}</strong> ({alertFormModal.period === 'final' ? 'Promedio Final' : `Periodo ${alertFormModal.period.replace('bloque', '')}`}).
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="form-group-compact">
                  <label>De (Dirección Liceo)</label>
                  <input type="text" className="form-input-compact" value="liceo.anarosacastillo@minerd.edu.do" readOnly />
                </div>
                <div className="form-group-compact">
                  <label>Para (Coordinador Encargado)</label>
                  <input 
                    type="email" 
                    className="form-input-compact" 
                    placeholder="coordinador@liceo.edu" 
                    value={alertFormModal.coordinatorEmail}
                    onChange={(e) => setAlertFormModal(prev => ({ ...prev, coordinatorEmail: e.target.value }))}
                  />
                </div>
                <div className="form-group-compact">
                  <label>Para (Orientador Encargado)</label>
                  <input 
                    type="email" 
                    className="form-input-compact" 
                    placeholder="orientador@liceo.edu" 
                    value={alertFormModal.counselorEmail}
                    onChange={(e) => setAlertFormModal(prev => ({ ...prev, counselorEmail: e.target.value }))}
                  />
                </div>
                <div className="form-group-compact">
                  <label>Asunto del Correo</label>
                  <input 
                    type="text" 
                    className="form-input-compact" 
                    value={`[ALERTA ACADÉMICA] Convocatoria a reunión de padres - Alumno: ${alertFormModal.student.name} - Grado: ${alertFormModal.student.grade}`} 
                    readOnly 
                  />
                </div>
                <div className="form-group-compact">
                  <label>Borrador de Mensaje</label>
                  <textarea 
                    className="form-input-compact" 
                    style={{ minHeight: '160px', padding: '0.5rem', fontSize: '0.85rem', lineHeight: '1.4', fontFamily: 'inherit' }}
                    readOnly
                    value={`Estimados Coordinador y Orientador Encargados,\n\nPor este medio se emite una ALERTA ACADÉMICA formal en relación al estudiante ${alertFormModal.student.name} del grado ${alertFormModal.student.grade}.\n\nEl alumno presenta un rendimiento crítico acumulado de ${alertFormModal.score.toFixed(0)}/100 en la asignatura de ${subjects[alertFormModal.subjectKey]?.name || alertFormModal.subjectKey} durante el periodo ${alertFormModal.period === 'final' ? 'Final' : alertFormModal.period.replace('bloque', '')}.\n\nSolicitamos formalmente que se gestione de manera coordinada una convocatoria de reunión de padres, madres o tutores del menor a la mayor brevedad posible para trazar un plan de seguimiento y rescate académico.\n\nAtentamente,\nDirección Liceo Ana Rosa Castillo`}
                  />
                </div>
              </div>

              {alertFormModal.sending && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span>Emitiendo alerta y enrutando correo...</span>
                    <span>{alertFormModal.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${alertFormModal.progress}%`, height: '100%', backgroundColor: 'var(--danger)', transition: 'width 0.2s ease' }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setAlertFormModal(prev => ({ ...prev, isOpen: false }))}
                disabled={alertFormModal.sending}
              >
                Cerrar
              </button>
              
              <a 
                href={`mailto:${alertFormModal.coordinatorEmail},${alertFormModal.counselorEmail}?subject=${encodeURIComponent(`[ALERTA ACADÉMICA] Convocatoria a reunión de padres - Alumno: ${alertFormModal.student.name} - Grado: ${alertFormModal.student.grade}`)}&body=${encodeURIComponent(`Estimados Coordinador y Orientador Encargados,\n\nPor este medio se emite una ALERTA ACADÉMICA formal en relación al estudiante ${alertFormModal.student.name} del grado ${alertFormModal.student.grade}.\n\nEl alumno presenta un rendimiento crítico acumulado de ${alertFormModal.score.toFixed(0)}/100 en la asignatura de ${subjects[alertFormModal.subjectKey]?.name || alertFormModal.subjectKey} durante el periodo ${alertFormModal.period === 'final' ? 'Final' : alertFormModal.period.replace('bloque', '')}.\n\nSolicitamos formalmente que se gestione de manera coordinada una convocatoria de reunión de padres, madres o tutores del menor a la mayor brevedad posible para trazar un plan de seguimiento y rescate académico.\n\nAtentamente,\nDirección Liceo Ana Rosa Castillo`)}`}
                className="btn-secondary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 'bold' }}
                onClick={() => {
                  const newLog = {
                    id: Date.now().toString(),
                    studentName: alertFormModal.student.name,
                    grade: alertFormModal.student.grade,
                    subjectName: subjects[alertFormModal.subjectKey]?.name || alertFormModal.subjectKey,
                    periodName: alertFormModal.period === 'final' ? 'Promedio Final' : `Periodo ${alertFormModal.period.replace('bloque', '')}`,
                    score: alertFormModal.score.toFixed(0),
                    coordinator: alertFormModal.coordinatorEmail,
                    counselor: alertFormModal.counselorEmail,
                    timestamp: new Date().toLocaleString()
                  };
                  setAlertLogs(logs => [newLog, ...logs]);
                  setAlertFormModal(prev => ({ ...prev, isOpen: false }));
                }}
              >
                ✉️ Enviar con Outlook/Gmail
              </a>

              <button 
                className="btn-danger" 
                onClick={handleSimulateSendAlert}
                disabled={alertFormModal.sending}
              >
                {alertFormModal.sending ? 'Enviando...' : '⚡ Simular Envío'}
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
