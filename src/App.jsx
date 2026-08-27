import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
// Vercel deployment trigger

import { dbService } from './db';

// Global configuration
const DEFAULT_SUBJECTS = {
  lengua_espanola: { name: 'Lengua Española', color: 'hsl(215, 80%, 45%)', bg: 'rgba(13, 110, 253, 0.08)' },
  ingles: { name: 'Lenguas Extranjeras - Inglés', color: 'hsl(280, 65%, 45%)', bg: 'rgba(111, 66, 193, 0.08)' },
  frances: { name: 'Lenguas Extranjeras - Francés', color: 'hsl(325, 70%, 45%)', bg: 'rgba(214, 51, 132, 0.08)' },
  matematica: { name: 'Matemática', color: 'hsl(20, 85%, 45%)', bg: 'rgba(253, 126, 20, 0.08)' },
  ciencias_sociales: { name: 'Ciencias Sociales', color: 'hsl(140, 60%, 35%)', bg: 'rgba(25, 135, 84, 0.08)' },
  ciencias_naturaleza: { name: 'Ciencias de la Naturaleza - Ciencias de la Tierra y del Universo', color: 'hsl(175, 75%, 35%)', bg: 'rgba(20, 184, 166, 0.08)' },
  artistica: { name: 'Educación Artística', color: 'hsl(45, 85%, 40%)', bg: 'rgba(255, 193, 7, 0.08)' },
  educacion_fisica: { name: 'Educación Física', color: 'hsl(10, 75%, 45%)', bg: 'rgba(220, 53, 69, 0.08)' },
  formacion_religiosa: { name: 'Formación Integral Humana y Religiosa', color: 'hsl(200, 70%, 40%)', bg: 'rgba(13, 202, 240, 0.08)' }
};

const DEFAULT_GRADES = ['1ro A', '2do A', '3ro A', '4to A', '5to A', '6to A'];

const MOTIVATIONAL_QUOTES = [
  "La educación es el pasaporte hacia el futuro, el mañana pertenece a quienes se preparan para él hoy. — Malcolm X",
  "El aprendizaje es un tesoro que seguirá a su dueño a todas partes. — Proverbio Chino",
  "La calidad no es un acto, es un hábito. Hagamos las cosas con excelencia hoy. — Aristóteles",
  "Un maestro afecta la eternidad; nunca se sabe dónde termina su influencia. — Henry Adams",
  "El éxito en la vida no se mide por lo que logras, sino por los obstáculos que superas. — Booker T. Washington",
  "Enseñar es aprender dos veces. — Joseph Joubert",
  "La educación no cambia el mundo, cambia a las personas que van a cambiar el mundo. — Paulo Freire",
  "El arte supremo del maestro consiste en despertar el goce de la expresión creativa y del conocimiento. — Albert Einstein",
  "La perseverancia puede transformar el fracaso en un logro extraordinario. — Matt Biondi",
  "La educación es el arma más poderosa que puedes usar para cambiar el mundo. — Nelson Mandela",
  "Haz de cada día tu obra maestra. — John Wooden",
  "El verdadero maestro defiende a sus alumnos contra su propia influencia personal. — Amos Bronson Alcott"
];

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
    classroomGrade: '1ro A',
    assignments: [
      { grade: '1ro A', subject: 'matematica' },
      { grade: '2do A', subject: 'matematica' },
      { grade: '1ro A', subject: 'ciencias_sociales' }
    ],
    active: true 
  },
  { 
    id: 'u3', 
    name: 'Prof. Clara Ruiz', 
    email: 'profesor.ciencias@school.edu', 
    password: 'profe123', 
    role: 'teacher', 
    classroomGrade: '',
    assignments: [
      { grade: '1ro A', subject: 'ciencias_naturaleza' },
      { grade: '2do A', subject: 'ciencias_naturaleza' }
    ], 
    active: true 
  },
  { 
    id: 'u4', 
    name: 'Prof. Luis Castro', 
    email: 'profesor.lengua@school.edu', 
    password: 'profe123', 
    role: 'teacher', 
    classroomGrade: '',
    assignments: [
      { grade: '1ro A', subject: 'lengua_espanola' },
      { grade: '2do A', subject: 'lengua_espanola' }
    ], 
    active: true 
  },
  {
    id: 'u5',
    name: 'Prof. Mario Paredes',
    email: 'mario.paredes@docente.edu.do',
    password: 'mario123',
    role: 'teacher',
    classroomGrade: '4to A',
    assignments: [
      { grade: '4to A', subject: 'matematica' },
      { grade: '4to A', subject: 'ciencias_naturaleza' }
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
      lengua_espanola: { bloque1: [95, 90, 88, 92], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ingles: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      frances: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      matematica: { bloque1: [95, 90, 88, 92], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ciencias_sociales: { bloque1: [90, 88, 95, 92], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ciencias_naturaleza: { bloque1: [88, 85, 90, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      artistica: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      educacion_fisica: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      formacion_religiosa: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] }
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
      lengua_espanola: { bloque1: [88, 85, 90, 86], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ingles: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      frances: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      matematica: { bloque1: [85, 88, 82, 90], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ciencias_sociales: { bloque1: [85, 80, 88, 92], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ciencias_naturaleza: { bloque1: [92, 90, 95, 88], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      artistica: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      educacion_fisica: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      formacion_religiosa: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] }
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
      lengua_espanola: { bloque1: [78, 80, 74, 82], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ingles: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      frances: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      matematica: { bloque1: [70, 75, 80, 72], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ciencias_sociales: { bloque1: [74, 70, 78, 75], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ciencias_naturaleza: { bloque1: [80, 78, 82, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      artistica: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      educacion_fisica: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      formacion_religiosa: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] }
    },
    present: 16, 
    total: 20 
  },
  { 
    id: 's4', 
    name: 'Ana Ruiz', 
    email: 'ana.ruiz@school.edu', 
    grade: '2do A', 
    grades: {
      lengua_espanola: { bloque1: [95, 92, 90, 98], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ingles: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      frances: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      matematica: { bloque1: [85, 88, 82, 90], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ciencias_sociales: { bloque1: [89, 85, 92, 90], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ciencias_naturaleza: { bloque1: [84, 86, 80, 90], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      artistica: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      educacion_fisica: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      formacion_religiosa: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] }
    },
    present: 19, 
    total: 20 
  },
  { 
    id: 's5', 
    name: 'Mateo Gómez', 
    email: 'mateo.gom@school.edu', 
    grade: '3ro A', 
    grades: {
      lengua_espanola: { bloque1: [85, 80, 88, 84], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ingles: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      frances: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      matematica: { bloque1: [80, 82, 85, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ciencias_sociales: { bloque1: [80, 78, 82, 85], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      ciencias_naturaleza: { bloque1: [90, 88, 92, 90], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      artistica: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      educacion_fisica: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] },
      formacion_religiosa: { bloque1: [80, 80, 80, 80], bloque2: [80, 80, 80, 80], bloque3: [80, 80, 80, 80], bloque4: [80, 80, 80, 80] }
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

const getGradeThemeInfo = (gradeName) => {
  const name = gradeName || '';
  if (name.startsWith('1')) {
    return {
      number: '1er.',
      label: 'Grado',
      ciclo: 'PRIMER CICLO',
      nivel: 'NIVEL SECUNDARIO',
      modalidad: '',
      color: '#0e7033', // Dark Green
      colorSecondary: '#4caf50',
      bg: '#e8f5e9',
      borderStripes: ['#4caf50', '#8bc34a', '#ffeb3b', '#ff9800', '#f44336']
    };
  }
  if (name.startsWith('2')) {
    return {
      number: '2do.',
      label: 'Grado',
      ciclo: 'PRIMER CICLO',
      nivel: 'NIVEL SECUNDARIO',
      modalidad: '',
      color: '#0084c8', // Sky Blue
      colorSecondary: '#29b6f6',
      bg: '#e1f5fe',
      borderStripes: ['#0084c8', '#00b0ff', '#ffeb3b', '#ff9800', '#f44336']
    };
  }
  if (name.startsWith('3')) {
    return {
      number: '3er.',
      label: 'Grado',
      ciclo: 'PRIMER CICLO',
      nivel: 'NIVEL SECUNDARIO',
      modalidad: '',
      color: '#b8541c', // Orange
      colorSecondary: '#ffa726',
      bg: '#fff3e0',
      borderStripes: ['#b8541c', '#ffb74d', '#ffeb3b', '#ff9800', '#f44336']
    };
  }
  if (name.startsWith('4')) {
    return {
      number: '4to.',
      label: 'Grado',
      ciclo: 'SEGUNDO CICLO',
      nivel: 'NIVEL SECUNDARIO',
      modalidad: 'MODALIDAD ACADÉMICA',
      color: '#008b8b', // Aqua/Turquoise
      colorSecondary: '#26a69a',
      bg: '#e0f2f1',
      borderStripes: ['#008b8b', '#26a69a', '#ffeb3b', '#ff9800', '#f44336']
    };
  }
  if (name.startsWith('5')) {
    return {
      number: '5to.',
      label: 'Grado',
      ciclo: 'SEGUNDO CICLO',
      nivel: 'NIVEL SECUNDARIO',
      modalidad: 'MODALIDAD ACADÉMICA',
      color: '#d11b5d', // Crimson/Pink
      colorSecondary: '#ec407a',
      bg: '#fce4ec',
      borderStripes: ['#d11b5d', '#ec407a', '#ffeb3b', '#ff9800', '#f44336']
    };
  }
  if (name.startsWith('6')) {
    return {
      number: '6to.',
      label: 'Grado',
      ciclo: 'SEGUNDO CICLO',
      nivel: 'NIVEL SECUNDARIO',
      modalidad: 'MODALIDAD ACADÉMICA',
      color: '#1a3b8b', // Dark Blue
      colorSecondary: '#5c6bc0',
      bg: '#e8eaf6',
      borderStripes: ['#1a3b8b', '#3f51b5', '#ffeb3b', '#ff9800', '#f44336']
    };
  }
  return {
    number: name.split(' ')[0] || '',
    label: 'Grado',
    ciclo: 'NIVEL SECUNDARIO',
    nivel: 'REGISTRO DE GRADO',
    modalidad: '',
    color: 'var(--primary)',
    colorSecondary: 'var(--primary-glow)',
    bg: 'var(--bg-secondary)',
    borderStripes: ['var(--primary)', 'var(--primary-glow)', 'var(--border-color)']
  };
};

const getSubjectsForGrade = (subjectsList, gradeName) => {
  const result = {};
  if (!subjectsList || !gradeName) return result;
  Object.keys(subjectsList).forEach(key => {
    const sub = subjectsList[key];
    if (!sub.grades || sub.grades.includes(gradeName)) {
      result[key] = sub;
    }
  });
  return result;
};

const getAssignedTeacher = (usersList, subjectsList, gradeName, subjectKey) => {
  if (!usersList || !Array.isArray(usersList) || !gradeName || !subjectKey) return null;
  const subObj = subjectsList?.[subjectKey];
  const subName = subObj?.name || subjectKey;

  return usersList.find(u => {
    if (!u || (u.role !== 'teacher' && u.role !== 'docente' && u.role !== 'Teacher')) return false;
    if (!u.assignments || !Array.isArray(u.assignments)) return false;
    return u.assignments.some(a => {
      if (!a || !a.grade || !a.subject) return false;
      const gMatch = a.grade.trim().toLowerCase() === gradeName.trim().toLowerCase();
      const sMatch = 
        a.subject === subjectKey || 
        a.subject.toLowerCase() === subjectKey.toLowerCase() ||
        a.subject.toLowerCase() === subName.toLowerCase();
    });
  });
};

const getRpInputStyle = (rpVal, originalP) => {
  if (rpVal === null || rpVal === undefined || rpVal === '') {
    return { padding: '0.35rem', width: '55px', textAlign: 'center', fontFamily: 'var(--font-mono)' };
  }
  const numRp = Number(rpVal);
  const numP = Number(originalP);

  if (!isNaN(numRp) && !isNaN(numP) && numRp < numP) {
    // INTENSE RED
    return {
      padding: '0.35rem',
      width: '55px',
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      backgroundColor: '#dc3545',
      color: '#ffffff',
      fontWeight: 'bold',
      border: '2px solid #a71d2a',
      borderRadius: '4px',
      boxShadow: '0 0 6px rgba(220, 53, 69, 0.6)'
    };
  } else {
    // GREEN (Aprobado en RP)
    return {
      padding: '0.35rem',
      width: '55px',
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      backgroundColor: 'rgba(16, 185, 129, 0.18)',
      color: '#065f46',
      fontWeight: 'bold',
      border: '1.5px solid var(--success)',
      borderRadius: '4px'
    };
  }
};

const sortGrades = (gradesList) => {
  if (!gradesList || !Array.isArray(gradesList)) return [];
  return [...gradesList].sort((a, b) => {
    const numA = parseInt(a) || 0;
    const numB = parseInt(b) || 0;
    if (numA !== numB) {
      return numA - numB;
    }
    const cleanA = a.replace(/^\d+([a-zA-Záéíóúñ\s°º]*)/, '').trim().toLowerCase();
    const cleanB = b.replace(/^\d+([a-zA-Záéíóúñ\s°º]*)/, '').trim().toLowerCase();
    return cleanA.localeCompare(cleanB);
  });
};

const renderGradeHeaderBanner = (gradeName, extraText = '') => {
  const theme = getGradeThemeInfo(gradeName);
  const section = gradeName.replace(/^\d+([a-zA-Záéíóúñ\s°º]*)/, '').trim();

  return (
    <div 
      className="grade-cover-banner"
      style={{
        background: '#fcfaf6',
        borderRadius: '12px',
        border: '1px solid #ebdcb9',
        padding: '1.5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '140px',
        color: '#333333',
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}
    >
      {/* Decorative rotated squares from official cover design */}
      <div 
        style={{
          position: 'absolute',
          right: '-40px',
          top: '-20px',
          width: '120px',
          height: '120px',
          background: `linear-gradient(135deg, ${theme.color} 0%, ${theme.colorSecondary} 100%)`,
          transform: 'rotate(45deg)',
          opacity: 0.12,
          borderRadius: '16px'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          right: '50px',
          top: '65px',
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, ${theme.color} 0%, ${theme.colorSecondary} 100%)`,
          transform: 'rotate(45deg)',
          opacity: 0.15,
          borderRadius: '8px'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          right: '120px',
          bottom: '-10px',
          width: '40px',
          height: '40px',
          background: theme.colorSecondary,
          transform: 'rotate(45deg)',
          opacity: 0.08,
          borderRadius: '4px'
        }}
      />

      {/* Main Cover Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', zIndex: 2, textAlign: 'left' }}>
        <span 
          style={{ 
            fontSize: '0.72rem', 
            fontWeight: '800', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            color: '#c29d38' 
          }}
        >
          REGISTRO ESCOLAR
        </span>
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '0.1rem 0' }}>
          <span 
            style={{ 
              fontSize: '2.4rem', 
              fontWeight: '300', 
              color: theme.color, 
              lineHeight: 1 
            }}
          >
            {theme.number}
          </span>
          <span 
            style={{ 
              fontSize: '2.4rem', 
              fontWeight: '800', 
              color: theme.color, 
              lineHeight: 1 
            }}
          >
            {theme.label}
          </span>
          {section && (
            <span 
              style={{ 
                fontSize: '1.4rem', 
                fontWeight: '700', 
                color: 'var(--text-secondary)', 
                marginLeft: '0.5rem' 
              }}
            >
              Sección {section}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.05rem', marginTop: '0.1rem' }}>
          <span 
            style={{ 
              fontSize: '0.78rem', 
              fontWeight: '800', 
              color: theme.color, 
              letterSpacing: '0.03em' 
            }}
          >
            {theme.ciclo}
          </span>
          <span 
            style={{ 
              fontSize: '0.72rem', 
              fontWeight: '500', 
              color: 'var(--text-secondary)', 
              letterSpacing: '0.02em' 
            }}
          >
            {theme.nivel}
          </span>
          {theme.modalidad && (
            <span 
              style={{ 
                fontSize: '0.62rem', 
                fontWeight: '700', 
                color: theme.color, 
                letterSpacing: '0.02em', 
                opacity: 0.9 
              }}
            >
              {theme.modalidad}
            </span>
          )}
        </div>
      </div>

      {/* Right Side: Extra text / Subject name badge */}
      {extraText && (
        <div 
          style={{ 
            zIndex: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', 
            gap: '0.2rem' 
          }}
        >
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Parámetro / Materia</span>
          <span 
            style={{ 
              fontSize: '1rem', 
              fontWeight: '800', 
              color: theme.color, 
              backgroundColor: `${theme.color}12`, 
              padding: '0.35rem 0.85rem', 
              borderRadius: '20px', 
              border: `1px solid ${theme.color}25` 
            }}
          >
            {extraText}
          </span>
        </div>
      )}

      {/* Bottom colored stripe border */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '6px',
          display: 'flex'
        }}
      >
        <div style={{ flex: 1, backgroundColor: '#0084c8' }} />
        <div style={{ flex: 1, backgroundColor: '#ffeb3b' }} />
        <div style={{ flex: 1, backgroundColor: '#f44336' }} />
        <div style={{ flex: 1, backgroundColor: '#4caf50' }} />
        <div style={{ flex: 1, backgroundColor: '#ff9800' }} />
      </div>
    </div>
  );
};

export default function App() {
  // --- Core States ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('s_users');
    let list = saved ? JSON.parse(saved) : DEFAULT_USERS;
    
    // Ensure all existing teachers have classroomGrade
    list = list.map(u => {
      if (u.role === 'teacher' && u.classroomGrade === undefined) {
        let cg = '';
        if (u.id === 'u2' || u.email === 'profesor.mate@school.edu') cg = '1ro A';
        return { ...u, classroomGrade: cg };
      }
      return u;
    });

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
    }

    const hasMario = list.some(u => u.email === 'mario.paredes@docente.edu.do');
    if (!hasMario) {
      list.push({
        id: 'u5',
        name: 'Prof. Mario Paredes',
        email: 'mario.paredes@docente.edu.do',
        password: 'mario123',
        role: 'teacher',
        classroomGrade: '4to A',
        assignments: [
          { grade: '4to A', subject: 'matematica' },
          { grade: '4to A', subject: 'ciencias_naturaleza' }
        ],
        active: true
      });
    }

    localStorage.setItem('s_users', JSON.stringify(list));
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

  const [promotionGrades, setPromotionGrades] = useState(() => {
    const saved = localStorage.getItem('s_promotion_grades');
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
    const raw = saved ? JSON.parse(saved) : DEFAULT_GRADES;
    return sortGrades(raw);
  });

  const [expandedSections, setExpandedSections] = useState({
    teachers: true,
    subjects: false,
    grades: false
  });

  const [subjectForm, setSubjectForm] = useState({ name: '', color: '#003876' });
  const [gradeForm, setGradeForm] = useState({ name: '' });
  const [selectedConfigSubjectGrade, setSelectedConfigSubjectGrade] = useState('1ro A');
  const [editingSubjectKey, setEditingSubjectKey] = useState(null);
  const [editingSubjectForm, setEditingSubjectForm] = useState({ name: '', color: '#003876' });
  const [editingGradeName, setEditingGradeName] = useState(null);
  const [editingGradeForm, setEditingGradeForm] = useState({ name: '' });

  // --- Admin Report & Alarms States ---
  const [selectedAdminReportGrade, setSelectedAdminReportGrade] = useState(() => {
    const saved = localStorage.getItem('s_grades');
    const list = saved ? JSON.parse(saved) : DEFAULT_GRADES;
    return list[0] || '1ro A';
  });
  const [selectedAdminReportSubject, setSelectedAdminReportSubject] = useState('lengua_espanola');
  const [expandedReportSubjects, setExpandedReportSubjects] = useState({});

  const [selectedAdminAttendanceGrade, setSelectedAdminAttendanceGrade] = useState(() => {
    const saved = localStorage.getItem('s_grades');
    const list = saved ? JSON.parse(saved) : DEFAULT_GRADES;
    return list[0] || '1ro A';
  });
  const [expandedAdminAttendanceSubjects, setExpandedAdminAttendanceSubjects] = useState({});

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
    progress: 0,
    type: 'académico', // 'académico' | 'conductual'
    selectedSituations: [],
    customSituation: '',
    antecedent: '',
    customAntecedent: '',
    comments: '',
    modifiedWithAI: false,
    finalText: '',
    coordinatorEmail: '',
    counselorEmail: ''
  });
  const [alertLogs, setAlertLogs] = useState(() => {
    const saved = localStorage.getItem('s_alert_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [folderExplorerLevel, setFolderExplorerLevel] = useState('root'); // 'root' | 'grade' | 'student'
  const [folderExplorerGrade, setFolderExplorerGrade] = useState('');
  const [folderExplorerStudentName, setFolderExplorerStudentName] = useState('');
  const [selectedManualReportStudentId, setSelectedManualReportStudentId] = useState('');
  const [viewingReportLog, setViewingReportLog] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBulletinStudentId, setSelectedBulletinStudentId] = useState('');
  const [adminBulletinGrade, setAdminBulletinGrade] = useState('');
  const [salida1Name, setSalida1Name] = useState(() => {
    return localStorage.getItem('s_salida1_name') || 'Química';
  });
  const [salida2Name, setSalida2Name] = useState(() => {
    return localStorage.getItem('s_salida2_name') || 'Computación';
  });
  const [studentComments, setStudentComments] = useState(() => {
    const saved = localStorage.getItem('s_student_comments');
    return saved ? JSON.parse(saved) : {};
  });
  const [randomQuote, setRandomQuote] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // --- Filtering States ---
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [classroomGrade, setClassroomGrade] = useState(null);
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
  const [rowAssignmentForms, setRowAssignmentForms] = useState({});
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [studentForm, setStudentForm] = useState({ name: '', email: '' });
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', password: '', role: 'teacher' });
  const [newAssignment, setNewAssignment] = useState({ grade: '1ro A', subject: 'matematica' });
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

  // --- Refs and Event-Driven Save Wrappers to break infinite loops ---
  const monthlyWorkedDaysRef = useRef(monthlyWorkedDays);
  const attendanceDayDatesRef = useRef(attendanceDayDates);
  useEffect(() => { monthlyWorkedDaysRef.current = monthlyWorkedDays; }, [monthlyWorkedDays]);
  useEffect(() => { attendanceDayDatesRef.current = attendanceDayDates; }, [attendanceDayDates]);

  const setUsersAndSave = (updater) => {
    setUsers(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setTimeout(async () => {
        try {
          await dbService.saveUsers(next);
        } catch (e) {
          console.error("Error saving users to Firestore:", e);
        }
      }, 0);
      return next;
    });
  };

  const setStudentsAndSave = (updater) => {
    setStudents(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setTimeout(async () => {
        try {
          await dbService.saveStudents(next);
        } catch (e) {
          console.error("Error saving students to Firestore:", e);
        }
      }, 0);
      return next;
    });
  };

  const setStudentRpGradesAndSave = (updater) => {
    setStudentRpGrades(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setTimeout(async () => {
        try {
          await dbService.saveStudentRpGrades(next);
        } catch (e) {
          console.error("Error saving student RP grades to Firestore:", e);
        }
      }, 0);
      return next;
    });
  };

  const setStudentAttendanceDetailAndSave = (updater) => {
    setStudentAttendanceDetail(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setTimeout(async () => {
        try {
          await dbService.saveStudentAttendance(next);
        } catch (e) {
          console.error("Error saving student attendance to Firestore:", e);
        }
      }, 0);
      return next;
    });
  };

  const setMonthlyWorkedDaysAndSave = (updater) => {
    setMonthlyWorkedDays(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setTimeout(async () => {
        try {
          await dbService.saveAttendanceConfigs(next, attendanceDayDatesRef.current);
        } catch (e) {
          console.error("Error saving monthly worked days to Firestore:", e);
        }
      }, 0);
      return next;
    });
  };

  const setAttendanceDayDatesAndSave = (updater) => {
    setAttendanceDayDates(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setTimeout(async () => {
        try {
          await dbService.saveAttendanceConfigs(monthlyWorkedDaysRef.current, next);
        } catch (e) {
          console.error("Error saving attendance day dates to Firestore:", e);
        }
      }, 0);
      return next;
    });
  };

  const setCalendarEventsAndSave = (updater) => {
    setCalendarEvents(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setTimeout(async () => {
        try {
          await dbService.saveEvents(next);
        } catch (e) {
          console.error("Error saving calendar events to Firestore:", e);
        }
      }, 0);
      return next;
    });
  };

  const setEvaluationConfigsAndSave = (updater) => {
    setEvaluationConfigs(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setTimeout(async () => {
        try {
          await dbService.saveEvalConfigs(next);
        } catch (e) {
          console.error("Error saving evaluation configs to Firestore:", e);
        }
      }, 0);
      return next;
    });
  };

  const setStudentAssessmentsAndSave = (updater) => {
    setStudentAssessments(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setTimeout(async () => {
        try {
          await dbService.saveStudentAssessments(next);
        } catch (e) {
          console.error("Error saving student assessments to Firestore:", e);
        }
      }, 0);
      return next;
    });
  };

  const setAlertLogsAndSave = (updater) => {
    setAlertLogs(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setTimeout(async () => {
        try {
          await dbService.saveAlertLogs(next);
        } catch (e) {
          console.error("Error saving alert logs to Firestore:", e);
        }
      }, 0);
      return next;
    });
  };

  const setPromotionGradesAndSave = (updater) => {
    setPromotionGrades(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setTimeout(async () => {
        try {
          await dbService.savePromotionGrades(next);
        } catch (e) {
          console.error("Error saving promotion grades to Firestore:", e);
        }
      }, 0);
      return next;
    });
  };

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

    const unsubPromotionGrades = dbService.subscribePromotionGrades((data) => {
      setPromotionGrades(data || {});
    });

    const unsubConfig = dbService.subscribeConfig((data) => {
      if (data) {
        if (data.subjects) {
          const needsMigration = !Object.keys(data.subjects).includes('lengua_espanola');
          if (needsMigration) {
            setSubjects(DEFAULT_SUBJECTS);
            dbService.saveSubjects(DEFAULT_SUBJECTS);
          } else {
            setSubjects(data.subjects);
          }
        }
        if (data.grades) {
          const needsMigration = data.grades.includes('10° A') || data.grades.length === 0;
          if (needsMigration) {
            const sortedDefaults = sortGrades(DEFAULT_GRADES);
            setGrades(sortedDefaults);
            dbService.saveGrades(sortedDefaults);
          } else {
            setGrades(sortGrades(data.grades));
          }
        }
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
      unsubPromotionGrades();
      unsubConfig();
    };
  }, []);

  // Scroll to top on tab change to prevent content being "pushed down" or hidden above viewport on mobile
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

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
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('s_salida1_name', salida1Name);
  }, [salida1Name]);

  useEffect(() => {
    localStorage.setItem('s_salida2_name', salida2Name);
  }, [salida2Name]);

  useEffect(() => {
    localStorage.setItem('s_student_comments', JSON.stringify(studentComments));
  }, [studentComments]);

  useEffect(() => {
    if (currentUser) {
      const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      setRandomQuote(MOTIVATIONAL_QUOTES[idx]);
    }
  }, [currentUser]);

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
      setSelectedBulletinStudentId('');
    }
  }, [selectedGrade, currentUser]);

  const handleUpdatePromoField = (studentId, subjectKey, field, val) => {
    const promoKey = `${studentId}_${subjectKey}`;
    const numVal = val === '' ? null : Number(val);
    setPromotionGradesAndSave(prev => ({
      ...prev,
      [promoKey]: {
        ...(prev[promoKey] || { cec: null, ceex: null, ce: null }),
        [field]: numVal
      }
    }));
  };

  const handleUpdateCustomSubjectGrade = (studentId, subjectKey, bloqueKey, compIdx, val) => {
    const numVal = val === '' ? 80 : Math.min(100, Math.max(0, Number(val) || 0));
    setStudentsAndSave(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const currentGrades = s.grades || {};
      const subjectData = currentGrades[subjectKey] || {
        bloque1: [80, 80, 80, 80],
        bloque2: [80, 80, 80, 80],
        bloque3: [80, 80, 80, 80],
        bloque4: [80, 80, 80, 80]
      };
      let bloqueArray;
      if (compIdx === -1) {
        bloqueArray = [numVal, numVal, numVal, numVal];
      } else {
        bloqueArray = [...(subjectData[bloqueKey] || [80, 80, 80, 80])];
        bloqueArray[compIdx] = numVal;
      }
      
      return {
        ...s,
        grades: {
          ...currentGrades,
          [subjectKey]: {
            ...subjectData,
            [bloqueKey]: bloqueArray
          }
        }
      };
    }));
  };

  const getAttendanceStats = (studentId, bloqueKey) => {
    const bloqueMonths = {
      bloque1: ['Agosto', 'Septiembre', 'Octubre'],
      bloque2: ['Noviembre', 'Diciembre', 'Enero'],
      bloque3: ['Febrero', 'Marzo'],
      bloque4: ['Abril', 'Mayo', 'Junio']
    };
    const months = bloqueMonths[bloqueKey] || [];
    let present = 0;
    let absent = 0;
    
    Object.keys(studentAttendanceDetail).forEach(key => {
      if (key.startsWith(`${studentId}_`)) {
        const parts = key.split('_');
        const month = parts[2];
        if (months.includes(month)) {
          const val = studentAttendanceDetail[key];
          if (val === 'P' || val === 'T') {
            present++;
          } else if (val === 'A') {
            absent++;
          }
        }
      }
    });

    if (present === 0 && absent === 0) {
      if (bloqueKey === 'bloque1') return { present: 22, absent: 0 };
      if (bloqueKey === 'bloque2') return { present: 20, absent: 1 };
      if (bloqueKey === 'bloque3') return { present: 18, absent: 0 };
      return { present: 21, absent: 1 };
    }

    return { present, absent };
  };

  const getMonthlyAttendanceStats = (studentId, monthName, fallbackWorkedDays) => {
    let present = 0;
    let absent = 0;
    let late = 0;
    
    Object.keys(studentAttendanceDetail).forEach(key => {
      if (key.startsWith(`${studentId}_`)) {
        const parts = key.split('_');
        const month = parts[2];
        if (month === monthName) {
          const val = studentAttendanceDetail[key];
          if (val === 'P') {
            present++;
          } else if (val === 'T') {
            late++;
          } else if (val === 'A') {
            absent++;
          }
        }
      }
    });

    if (present === 0 && absent === 0 && late === 0) {
      const mockAbs = Math.random() > 0.85 ? 1 : 0;
      const mockLate = Math.random() > 0.8 ? 1 : 0;
      const mockPres = fallbackWorkedDays - mockAbs - mockLate;
      return {
        workedDays: fallbackWorkedDays,
        present: mockPres,
        late: mockLate,
        absent: mockAbs,
        pct: Math.round((mockPres / fallbackWorkedDays) * 100)
      };
    }

    const totalRecorded = present + late + absent;
    const workedDays = Math.max(totalRecorded, fallbackWorkedDays);
    const pct = workedDays > 0 ? Math.round(((present + late) / workedDays) * 100) : 100;
    
    return {
      workedDays,
      present,
      late,
      absent,
      pct
    };
  };

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

    setStudentsAndSave(prev => [...prev, created]);
    setStudentForm({ name: '', email: '' });
  };

  const handleDeleteStudent = (id) => {
    if (currentUser.role !== 'admin') return;
    if (window.confirm('¿Está seguro de eliminar este alumno?')) {
      setStudentsAndSave(prev => prev.filter(s => s.id !== id));
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
      setStudentsAndSave(prev => [...prev, ...addedStudents]);
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

    setUsersAndSave(prev => [...prev, created]);
    setTeacherForm({ name: '', email: '', password: '', role: 'teacher' });
    alert('Docente registrado.');
  };

  const handleAddAssignment = (userId, targetGrade, targetSubject) => {
    if (currentUser.role !== 'admin') return;
    const gradeVal = targetGrade || (grades[0] || '');
    const gradeSubs = getSubjectsForGrade(subjects, gradeVal);
    const subjectVal = targetSubject || (Object.keys(gradeSubs)[0] || '');

    if (!gradeVal || !subjectVal) {
      alert('Por favor selecciona un grado y asignatura válidos.');
      return;
    }

    setUsersAndSave(prev => prev.map(u => {
      if (u.id === userId) {
        const assignmentsList = u.assignments || [];
        const exists = assignmentsList.some(
          a => a.grade === gradeVal && a.subject === subjectVal
        );
        if (exists) {
          alert('Asignación duplicada.');
          return u;
        }
        return { ...u, assignments: [...assignmentsList, { grade: gradeVal, subject: subjectVal }] };
      }
      return u;
    }));
  };

  const handleRemoveAssignment = (userId, indexToRemove) => {
    if (currentUser.role !== 'admin') return;
    setUsersAndSave(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          assignments: u.assignments.filter((_, idx) => idx !== indexToRemove)
        };
      }
      return u;
    }));
  };

  const handleUpdateClassroomGrade = (userId, newGrade) => {
    if (currentUser.role !== 'admin') return;
    setUsersAndSave(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, classroomGrade: newGrade };
      }
      return u;
    }));
  };

  const handleDeleteUser = (id) => {
    if (currentUser.role !== 'admin') return;
    if (id === currentUser.id) return;
    if (window.confirm('¿Eliminar esta cuenta?')) {
      setUsersAndSave(prev => prev.filter(u => u.id !== id));
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
      handleAssignSubjectToGrade(key, selectedConfigSubjectGrade);
      setSubjectForm({ name: '', color: '#003876' });
      return;
    }

    const newSub = { 
      name, 
      color, 
      bg: `${color}15`, 
      grades: [selectedConfigSubjectGrade] 
    };
    const updatedSubjects = { ...subjects, [key]: newSub };
    setSubjects(updatedSubjects);

    setStudentsAndSave(prev => {
      return prev.map(s => {
        if (s.grade === selectedConfigSubjectGrade) {
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
        }
        return s;
      });
    });

    setSubjectForm({ name: '', color: '#003876' });
    alert(`Asignatura "${name}" creada y asignada a ${selectedConfigSubjectGrade} con éxito.`);
  };

  const handleAssignSubjectToGrade = (subjectKey, gradeName) => {
    if (!subjectKey || !gradeName) return;
    const sub = subjects[subjectKey];
    if (!sub) return;

    const currentGrades = sub.grades ? [...sub.grades] : [];
    if (currentGrades.includes(gradeName)) {
      alert('Esta asignatura ya está asignada a este grado.');
      return;
    }

    const updatedGrades = [...currentGrades, gradeName];
    const updatedSubjects = {
      ...subjects,
      [subjectKey]: { ...sub, grades: updatedGrades }
    };
    setSubjects(updatedSubjects);

    setStudentsAndSave(prev => {
      return prev.map(s => {
        if (s.grade === gradeName) {
          const studentGrades = s.grades ? { ...s.grades } : {};
          if (!studentGrades[subjectKey]) {
            studentGrades[subjectKey] = {
              bloque1: [80, 80, 80, 80],
              bloque2: [80, 80, 80, 80],
              bloque3: [80, 80, 80, 80],
              bloque4: [80, 80, 80, 80]
            };
          }
          return { ...s, grades: studentGrades };
        }
        return s;
      });
    });

    alert(`Asignatura "${sub.name}" asignada a ${gradeName} con éxito.`);
  };

  const handleRemoveSubjectFromGrade = (subjectKey, gradeName) => {
    if (!subjectKey || !gradeName) return;
    const sub = subjects[subjectKey];
    if (!sub) return;

    if (window.confirm(`¿Estás seguro de quitar la asignatura "${sub.name}" del grado ${gradeName}? Se mantendrá en el catálogo pero se ocultará de este grado y removerá sus calificaciones en esta sección.`)) {
      const currentGrades = sub.grades ? [...sub.grades] : [];
      const updatedGrades = currentGrades.filter(g => g !== gradeName);
      
      const updatedSubjects = {
        ...subjects,
        [subjectKey]: { ...sub, grades: updatedGrades }
      };
      setSubjects(updatedSubjects);

      setUsersAndSave(prev => prev.map(u => {
        if (u.role === 'teacher') {
          return {
            ...u,
            assignments: u.assignments.filter(a => !(a.grade === gradeName && a.subject === subjectKey))
          };
        }
        return u;
      }));

      setStudentsAndSave(prev => prev.map(s => {
        if (s.grade === gradeName) {
          const studentGrades = s.grades ? { ...s.grades } : {};
          delete studentGrades[subjectKey];
          return { ...s, grades: studentGrades };
        }
        return s;
      }));

      alert(`Asignatura "${sub.name}" removida del grado ${gradeName}.`);
    }
  };

  const handleUpdateSubject = (e) => {
    if (e) e.preventDefault();
    if (!editingSubjectKey) return;
    const name = editingSubjectForm.name.trim();
    const color = editingSubjectForm.color;
    if (!name) return;

    const sub = subjects[editingSubjectKey];
    if (!sub) return;

    const updatedSubjects = {
      ...subjects,
      [editingSubjectKey]: {
        ...sub,
        name,
        color,
        bg: `${color}15`
      }
    };
    setSubjects(updatedSubjects);
    setEditingSubjectKey(null);
    alert('Asignatura modificada con éxito.');
  };

  const handleDeleteSubject = (key) => {
    if (Object.keys(subjects).length <= 1) {
      alert('Debe haber al menos una asignatura en el sistema.');
      return;
    }
    if (window.confirm(`¿Estás seguro de eliminar COMPLETAMENTE la asignatura "${subjects[key].name}" del catálogo? Esto removerá todas las calificaciones, asignaciones docentes y registros en TODOS los grados.`)) {
      const updatedSubjects = { ...subjects };
      delete updatedSubjects[key];
      setSubjects(updatedSubjects);

      setUsersAndSave(prev => prev.map(u => {
        if (u.role === 'teacher') {
          return {
            ...u,
            assignments: u.assignments.filter(a => a.subject !== key)
          };
        }
        return u;
      }));

      setStudentsAndSave(prev => prev.map(s => {
        const studentGrades = s.grades ? { ...s.grades } : {};
        delete studentGrades[key];
        return { ...s, grades: studentGrades };
      }));

      alert('Asignatura eliminada por completo del catálogo global.');
    }
  };

  const [savingGrades, setSavingGrades] = useState(false);
  const [savingSubjects, setSavingSubjects] = useState(false);

  const handleSaveGradesToCloud = async () => {
    setSavingGrades(true);
    try {
      await dbService.saveGrades(grades);
      await dbService.saveGradeStaff(gradeStaffContacts);
      alert('✅ ¡Cambios en los grados y contactos guardados en la nube con éxito!');
    } catch (error) {
      console.error('Error saving grades:', error);
      alert(`❌ Error al guardar en la nube: ${error.message || error}\n\nPor favor, verifica que tus reglas de Firestore permitan acceso de lectura y escritura para la colección 'config'.`);
    } finally {
      setSavingGrades(false);
    }
  };

  const handleSaveSubjectsToCloud = async () => {
    setSavingSubjects(true);
    try {
      await dbService.saveSubjects(subjects);
      alert('✅ ¡Cambios en las asignaturas guardados en la nube con éxito!');
    } catch (error) {
      console.error('Error saving subjects:', error);
      alert(`❌ Error al guardar en la nube: ${error.message || error}\n\nPor favor, verifica que tus reglas de Firestore permitan acceso de lectura y escritura para la colección 'config'.`);
    } finally {
      setSavingSubjects(false);
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

    setGrades(prev => sortGrades([...prev, name]));
    
    const updatedSubjects = { ...subjects };
    Object.keys(updatedSubjects).forEach(subKey => {
      const sub = updatedSubjects[subKey];
      const subGrades = sub.grades ? [...sub.grades] : [];
      if (!subGrades.includes(name)) {
        subGrades.push(name);
      }
      updatedSubjects[subKey] = { ...sub, grades: subGrades };
    });
    setSubjects(updatedSubjects);

    setGradeForm({ name: '' });
    alert(`Grado "${name}" creado con éxito e inicializado con las asignaturas del catálogo.`);
  };

  const handleUpdateGrade = (e) => {
    if (e) e.preventDefault();
    if (!editingGradeName) return;
    const newName = editingGradeForm.name.trim();
    if (!newName) return;

    if (grades.includes(newName) && newName !== editingGradeName) {
      alert('Este nombre de grado ya existe.');
      return;
    }

    if (window.confirm(`¿Estás seguro de renombrar el grado "${editingGradeName}" a "${newName}"? Esto actualizará todos los alumnos, asignaturas y asignaciones docentes correspondientes.`)) {
      setGrades(prev => sortGrades(prev.map(g => g === editingGradeName ? newName : g)));

      setStudentsAndSave(prev => prev.map(s => s.grade === editingGradeName ? { ...s, grade: newName } : s));

      setUsersAndSave(prev => prev.map(u => {
        if (u.role === 'teacher') {
          return {
            ...u,
            assignments: u.assignments.map(a => a.grade === editingGradeName ? { ...a, grade: newName } : a)
          };
        }
         return u;
      }));

      setSubjects(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(subKey => {
          const sub = updated[subKey];
          if (sub.grades) {
            const subGrades = sub.grades.map(g => g === editingGradeName ? newName : g);
            updated[subKey] = { ...sub, grades: subGrades };
          }
        });
        return updated;
      });

      setGradeStaffContacts(prev => {
        const updated = { ...prev };
        if (updated[editingGradeName]) {
          updated[newName] = updated[editingGradeName];
          delete updated[editingGradeName];
        }
        return updated;
      });

      setMonthlyWorkedDaysAndSave(prev => {
        const updated = { ...prev };
        if (updated[editingGradeName]) {
          updated[newName] = updated[editingGradeName];
          delete updated[editingGradeName];
        }
        return updated;
      });

      setAttendanceDayDatesAndSave(prev => {
        const updated = { ...prev };
        if (updated[editingGradeName]) {
          updated[newName] = updated[editingGradeName];
          delete updated[editingGradeName];
        }
        return updated;
      });

      if (selectedGrade === editingGradeName) {
        setSelectedGrade(newName);
      }
      if (selectedAdminReportGrade === editingGradeName) {
        setSelectedAdminReportGrade(newName);
      }
      if (selectedConfigSubjectGrade === editingGradeName) {
        setSelectedConfigSubjectGrade(newName);
      }

      setEditingGradeName(null);
      alert(`El grado "${editingGradeName}" ha sido renombrado a "${newName}" con éxito.`);
    }
  };

  const handleDeleteGrade = (gradeName) => {
    if (grades.length <= 1) {
      alert('Debe haber al menos un grado en el sistema.');
      return;
    }
    if (window.confirm(`¿Estás seguro de eliminar el grado "${gradeName}"? Esto eliminará todos los estudiantes matriculados en este grado y todas las asignaciones docentes vinculadas.`)) {
      const updatedGrades = sortGrades(grades.filter(g => g !== gradeName));
      setGrades(updatedGrades);

      setUsersAndSave(prev => prev.map(u => {
        if (u.role === 'teacher') {
          return {
            ...u,
            assignments: u.assignments.filter(a => a.grade !== gradeName)
          };
        }
        return u;
      }));

      setStudentsAndSave(prev => prev.filter(s => s.grade !== gradeName));

      if (activeAdminGrade === gradeName) {
        setActiveAdminGrade(updatedGrades[0] || '');
      }

      alert('Grado eliminado.');
    }
  };

  // --- Admin: Grade & Subject Report Warnings ---
  const handleSaveStaffContacts = (gradeName, coordinatorEmail, counselorEmail) => {
    setGradeStaffContacts(prev => {
      const updated = {
        ...prev,
        [gradeName]: {
          coordinator: coordinatorEmail,
          counselor: counselorEmail
        }
      };
      localStorage.setItem('s_grade_staff', JSON.stringify(updated));
      return updated;
    });
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
      type: 'académico',
      selectedSituations: [],
      customSituation: '',
      antecedent: 'Primera vez (Incidente aislado)',
      customAntecedent: '',
      comments: '',
      modifiedWithAI: false,
      finalText: '',
      coordinatorEmail: contacts.coordinator || '',
      counselorEmail: contacts.counselor || ''
    });
  };

  const compileReportText = (modalState) => {
    if (modalState.modifiedWithAI && modalState.finalText) {
      return modalState.finalText;
    }
    
    const situationsStr = modalState.selectedSituations
      .map(s => s === 'Otro (especificar)' ? modalState.customSituation : s)
      .filter(Boolean)
      .join(', ');
    
    const antecedentStr = modalState.antecedent === 'Otra (especificar)' 
      ? modalState.customAntecedent 
      : modalState.antecedent;
    
    const subName = modalState.subjectKey ? (subjects[modalState.subjectKey]?.name || modalState.subjectKey) : '';
    const periodName = modalState.period ? (modalState.period === 'final' ? 'Fin de Año' : `Periodo ${modalState.period.replace('bloque', '')}`) : '';
    
    let text = `Estimados Coordinador y Orientador Encargados,\n\n`;
    text += `Por este medio se emite un REPORTE ${modalState.type.toUpperCase()} formal en relación al estudiante ${modalState.student.name} del grado ${modalState.student.grade}.\n\n`;
    
    text += `DETALLE DEL CASO:\n`;
    if (subName) {
      text += `• Asignatura: ${subName}\n`;
    }
    if (modalState.score) {
      text += `• Rendimiento/Calificación: ${modalState.score.toFixed(0)}/100 (${periodName})\n`;
    }
    if (situationsStr) {
      text += `• Situaciones observadas: ${situationsStr}\n`;
    }
    if (antecedentStr) {
      text += `• Persistencia de la situación: ${antecedentStr}\n`;
    }
    if (modalState.comments) {
      text += `• Comentarios y observaciones del docente: ${modalState.comments}\n`;
    }
    
    text += `\nSolicitamos gestionar una reunión de seguimiento o plan de apoyo con los padres o tutores del estudiante a la mayor brevedad posible.\n\n`;
    text += `Atentamente,\nDirección / Equipo Docente del Liceo Ana Rosa Castillo`;
    
    return text;
  };

  const handleOptimizeReportWithAI = async () => {
    const baseText = compileReportText(alertFormModal);
    setAlertFormModal(prev => ({ ...prev, sending: true, progress: 15 }));
    
    const promptText = `
Escribe una carta de reporte pedagógico formal y profesional para el Liceo Ana Rosa Castillo.
Basándote únicamente en el siguiente reporte crudo:
${baseText}

INSTRUCCIONES CRÍTICAS DE REDACCIÓN:
1. Usa un tono pedagógico formal, asertivo y constructivo.
2. Evita clichés genéricos y enfócate en describir la situación de manera concisa.
3. No incluyas secciones que estén vacías, ni listas con respuestas negativas o desmarcadas.
4. Genera ÚNICAMENTE el texto redactado final de la carta (con saludos formales, cuerpo y despedida). No agregues notas aclaratorias, preámbulos ni introducciones externas como "Aquí tienes tu carta" o similares.
5. El reporte generado no debe contener viñetas rústicas, listas de viñetas ("•") ni datos brutos. Toda la información seleccionada (situaciones, materia, calificación, persistencia) debe estar integrada de forma fluida y natural en el texto narrativo de la carta.
6. El resultado final debe ser limpio y listo para imprimirse o enviarse por correo.
`;

    if (aiProvider === 'gemini' && aiApiKey.trim()) {
      try {
        setAlertFormModal(prev => ({ ...prev, progress: 45 }));
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${aiApiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        });
        
        setAlertFormModal(prev => ({ ...prev, progress: 75 }));
        const result = await response.json();
        const generated = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (generated) {
          setAlertFormModal(prev => ({
            ...prev,
            modifiedWithAI: true,
            finalText: generated.trim(),
            sending: false,
            progress: 0
          }));
        } else {
          throw new Error('No se recibió texto generado de Gemini.');
        }
      } catch (error) {
        console.error("AI report optimization failed:", error);
        alert('Error al conectar con la API de Gemini. Se utilizará la optimización local simulada.');
        runMockAIOptimization();
      }
    } else {
      runMockAIOptimization();
    }
  };

  const runMockAIOptimization = () => {
    setTimeout(() => {
      setAlertFormModal(prev => ({ ...prev, progress: 50 }));
      setTimeout(() => {
        setAlertFormModal(prev => {
          const sName = prev.student?.name || 'Estudiante';
          const grade = prev.student?.grade || '';
          const typeStr = prev.type === 'académico' ? 'académico' : 'conductual';
          const subName = prev.subjectKey ? (subjects[prev.subjectKey]?.name || prev.subjectKey) : '';
          const periodName = prev.period ? (prev.period === 'final' ? 'Promedio Final' : `Periodo ${prev.period.replace('bloque', '')}`) : '';
          
          const situationsStr = prev.selectedSituations
            .map(s => s === 'Otro (especificar)' ? prev.customSituation : s)
            .filter(Boolean)
            .join(', ');
            
          const antecedentStr = prev.antecedent === 'Otra (especificar)' 
            ? prev.customAntecedent 
            : prev.antecedent;

          let caseDetails = `se han observado conductas que inciden en su desarrollo`;
          if (situationsStr) {
            caseDetails = `se han detectado las siguientes situaciones: ${situationsStr.toLowerCase()}`;
          }

          let schoolDetails = '';
          if (subName && prev.score) {
            schoolDetails = ` en la asignatura de ${subName}, registrando una calificación de ${prev.score.toFixed(0)}/100 durante el ${periodName}`;
          } else if (subName) {
            schoolDetails = ` en la asignatura de ${subName}`;
          }

          let persistDetails = '';
          if (antecedentStr) {
            persistDetails = ` Se hace constar que esta condición ${antecedentStr.toLowerCase()}.`;
          }

          let commentDetails = '';
          if (prev.comments) {
            commentDetails = ` Observaciones adicionales del docente: "${prev.comments}".`;
          }

          const optText = `Estimados Coordinador y Orientador Encargados,

Por este medio me dirijo a ustedes para formalizar el reporte pedagógico de tipo ${typeStr.toUpperCase()} del estudiante ${sName.toUpperCase()}, perteneciente al grado ${grade}.

Durante el seguimiento en el aula, ${caseDetails}${schoolDetails}.${persistDetails}${commentDetails}

Recomendamos iniciar un plan de acompañamiento conjunto y convocar a los padres del estudiante para establecer compromisos que apoyen su desarrollo integral.

Atentamente,
Equipo Docente del Liceo Ana Rosa Castillo`;

          return {
            ...prev,
            modifiedWithAI: true,
            finalText: optText,
            sending: false,
            progress: 0
          };
        });
      }, 500);
    }, 400);
  };

  const handleRegisterSentReportLog = () => {
    const contentText = compileReportText(alertFormModal);
    const newLog = {
      id: Date.now().toString(),
      studentId: alertFormModal.student.id,
      studentName: alertFormModal.student.name,
      grade: alertFormModal.student.grade,
      subjectName: alertFormModal.subjectKey ? (subjects[alertFormModal.subjectKey]?.name || alertFormModal.subjectKey) : 'Incidencia Directa',
      periodName: alertFormModal.period ? (alertFormModal.period === 'final' ? 'Promedio Final' : `Periodo ${alertFormModal.period.replace('bloque', '')}`) : 'N/A',
      score: alertFormModal.score ? alertFormModal.score.toFixed(0) : 'N/A',
      coordinator: alertFormModal.coordinatorEmail,
      counselor: alertFormModal.counselorEmail,
      timestamp: new Date().toLocaleString(),
      type: alertFormModal.type,
      selectedSituations: alertFormModal.selectedSituations,
      customSituation: alertFormModal.customSituation,
      antecedent: alertFormModal.antecedent,
      customAntecedent: alertFormModal.customAntecedent,
      comments: alertFormModal.comments,
      modifiedWithAI: alertFormModal.modifiedWithAI,
      finalText: contentText
    };
    
    setAlertLogsAndSave(logs => [newLog, ...logs]);
    setAlertFormModal(prev => ({ ...prev, isOpen: false }));
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
          
          const contentText = compileReportText(prev);
          
          const newLog = {
            id: Date.now().toString(),
            studentId: prev.student.id,
            studentName: prev.student.name,
            grade: prev.student.grade,
            subjectName: prev.subjectKey ? (subjects[prev.subjectKey]?.name || prev.subjectKey) : 'Incidencia Directa',
            periodName: prev.period ? (prev.period === 'final' ? 'Promedio Final' : `Periodo ${prev.period.replace('bloque', '')}`) : 'N/A',
            score: prev.score ? prev.score.toFixed(0) : 'N/A',
            coordinator: prev.coordinatorEmail,
            counselor: prev.counselorEmail,
            timestamp: new Date().toLocaleString(),
            type: prev.type,
            selectedSituations: prev.selectedSituations,
            customSituation: prev.customSituation,
            antecedent: prev.antecedent,
            customAntecedent: prev.customAntecedent,
            comments: prev.comments,
            modifiedWithAI: prev.modifiedWithAI,
            finalText: contentText
          };

          setAlertLogsAndSave(logs => [newLog, ...logs]);
          alert(`¡Reporte/Alerta generado con éxito!\nTipo: ${prev.type.toUpperCase()}\nEstudiante: ${prev.student.name}\n\nLos correos han sido simulados y guardados en el archivo digital.`);
          
          return { ...prev, isOpen: false, sending: false, progress: 0 };
        }
        return { ...prev, progress: prev.progress + 30 };
      });
    }, 200);
  };

  const handleLaunchManualReport = () => {
    if (!selectedManualReportStudentId) {
      alert('Por favor, selecciona un estudiante de la lista.');
      return;
    }
    const stud = students.find(s => s.id === selectedManualReportStudentId);
    if (stud) {
      handleOpenAlertModal(stud, '', 0, '');
    }
  };

  const renderReportsTabContent = () => {
    const visibleGradesForExplorer = currentUser.role === 'admin' 
      ? grades 
      : (currentUser.classroomGrade ? [currentUser.classroomGrade] : teacherUniqueGrades);

    const filteredAlertLogs = alertLogs.filter(log => {
      if (currentUser.role === 'admin') return true;
      return visibleGradesForExplorer.includes(log.grade);
    });

    const visibleStudents = students.filter(s => {
      if (currentUser.role === 'admin') return true;
      return visibleGradesForExplorer.includes(s.grade);
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>Gestión de Reportes y Archivo Digital</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '-1rem', marginBottom: 0 }}>
              Registra incidencias disciplinarias o académicas, optimiza con Inteligencia Artificial y consulta el archivo de carpetas digitales.
            </p>
          </div>
        </div>

        {/* Manual Report Trigger Panel */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ margin: 0, color: 'var(--primary)' }}>⚡ Emitir Nuevo Reporte Manual</h4>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
            <div className="form-group-compact" style={{ marginBottom: 0, flex: 1, minWidth: '240px' }}>
              <label>Seleccionar Estudiante</label>
              <select 
                className="form-select"
                value={selectedManualReportStudentId}
                onChange={(e) => setSelectedManualReportStudentId(e.target.value)}
                style={{ width: '100%', padding: '0.45rem' }}
              >
                <option value="">-- Buscar alumno --</option>
                {visibleStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                ))}
              </select>
            </div>
            <button 
              className="btn-primary" 
              style={{ height: '38px', borderRadius: '6px', fontWeight: 'bold' }}
              onClick={handleLaunchManualReport}
            >
              🚨 Crear Reporte
            </button>
          </div>
        </div>

        {/* Digital Folder Explorer */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📂</span> Archivo Digital de Reportes (Carpetas)
          </h4>

          {/* Breadcrumbs */}
          <div className="folder-breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.82rem', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setFolderExplorerLevel('root')}>
              📁 Archivo Principal
            </span>
            {folderExplorerLevel !== 'root' && (
              <>
                <span style={{ color: 'var(--text-secondary)' }}>&gt;</span>
                <span 
                  style={{ color: folderExplorerLevel === 'grade' ? 'var(--text-primary)' : 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }} 
                  onClick={() => {
                    setFolderExplorerLevel('grade');
                    setFolderExplorerStudentName('');
                  }}
                >
                  🏫 {folderExplorerGrade} Reporte
                </span>
              </>
            )}
            {folderExplorerLevel === 'student' && (
              <>
                <span style={{ color: 'var(--text-secondary)' }}>&gt;</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  👤 {folderExplorerStudentName}
                </span>
              </>
            )}
          </div>

          {/* Root view: Grades as folders */}
          {folderExplorerLevel === 'root' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
              {visibleGradesForExplorer.map(g => {
                const reportCount = filteredAlertLogs.filter(log => log.grade === g).length;
                return (
                  <div 
                    key={g} 
                    className="folder-item animate-fade-in" 
                    onClick={() => {
                      setFolderExplorerGrade(g);
                      setFolderExplorerLevel('grade');
                    }}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', transition: 'all 0.25s ease', boxShadow: 'var(--shadow-sm)' }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem', lineHeight: 1 }}>📁</div>
                    <span style={{ fontWeight: 'bold', fontSize: '0.88rem', textAlign: 'center', color: 'var(--text-primary)' }}>{g} Reporte</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{reportCount} archivo(s)</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Grade view: Students as subfolders */}
          {folderExplorerLevel === 'grade' && (() => {
            const studentsWithReportsInGrade = Array.from(new Set(
              filteredAlertLogs
                .filter(log => log.grade === folderExplorerGrade)
                .map(log => log.studentName)
            )).sort();

            return (
              <div style={{ marginTop: '0.5rem' }}>
                {studentsWithReportsInGrade.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2.5rem 1rem' }}>
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📂</span>
                    <p style={{ fontSize: '0.85rem' }}>No hay carpetas de estudiantes creadas para <strong>{folderExplorerGrade}</strong> aún.</p>
                    <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', marginTop: '0.5rem' }} onClick={() => setFolderExplorerLevel('root')}>Volver Atrás</button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
                    {studentsWithReportsInGrade.map(sName => {
                      const studentReportsCount = filteredAlertLogs.filter(log => log.grade === folderExplorerGrade && log.studentName === sName).length;
                      return (
                        <div 
                          key={sName} 
                          className="folder-item animate-fade-in" 
                          onClick={() => {
                            setFolderExplorerStudentName(sName);
                            setFolderExplorerLevel('student');
                          }}
                          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', transition: 'all 0.25s ease', boxShadow: 'var(--shadow-sm)' }}
                        >
                          <div style={{ fontSize: '3rem', marginBottom: '0.5rem', lineHeight: 1 }}>📂</div>
                          <span style={{ fontWeight: 'bold', fontSize: '0.82rem', textAlign: 'center', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{sName}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{studentReportsCount} archivo(s)</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Student view: Individual reports with dates and titles */}
          {folderExplorerLevel === 'student' && (() => {
            const studentLogs = filteredAlertLogs.filter(
              log => log.grade === folderExplorerGrade && log.studentName === folderExplorerStudentName
            );

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                {studentLogs.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                    <p style={{ fontSize: '0.85rem' }}>No hay reportes en esta carpeta.</p>
                    <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => setFolderExplorerLevel('grade')}>Volver Atrás</button>
                  </div>
                ) : (
                  studentLogs.map(log => {
                    const isBehavioral = log.type === 'conductual';
                    const reportTitle = `${log.timestamp.split(',')[0].replace(/\//g, '-')} - ${isBehavioral ? 'Conductual' : 'Académico'}`;
                    return (
                      <div 
                        key={log.id} 
                        className="animate-fade-in" 
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', gap: '1rem', flexWrap: 'wrap' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.4rem' }}>{isBehavioral ? '📕' : '📘'}</span>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                              {reportTitle}
                            </strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                              Asignatura: {log.subjectName} | Destinatarios: {log.coordinator || 'N/A'}, {log.counselor || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn-secondary" 
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem', fontWeight: 'bold' }}
                            onClick={() => setViewingReportLog(log)}
                          >
                            👁️ Ver Detalle
                          </button>
                          {currentUser.role === 'admin' && (
                            <button 
                              className="btn-danger" 
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem', fontWeight: 'bold', backgroundColor: 'rgba(234, 67, 53, 0.1)', color: '#ea4335', border: '1px solid rgba(234, 67, 53, 0.2)' }}
                              onClick={() => {
                                if (window.confirm('¿Está seguro de eliminar este reporte de forma permanente de la carpeta?')) {
                                  setAlertLogsAndSave(prev => prev.filter(x => x.id !== log.id));
                                  alert('Reporte eliminado de la base de datos.');
                                }
                              }}
                            >
                              🗑️ Borrar
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            );
          })()}
        </div>

        {/* Log Viewer Detail Modal */}
        {viewingReportLog && (
          <div className="modal-backdrop" style={{ zIndex: 1100 }}>
            <div className="modal-card animate-fade-in" style={{ maxWidth: '650px', width: '90%' }}>
              <div className="modal-header no-print-element">
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>📄 Reporte Pedagógico Guardado</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Detalle del archivo digital y opciones de impresión/envío</span>
                </div>
                <button 
                  style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }} 
                  onClick={() => setViewingReportLog(null)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                
                {/* Print Sheet Styling - Wrapped in a printable container */}
                <div className="report-print-sheet" style={{ padding: '2rem 1.5rem', backgroundColor: '#ffffff', color: '#000000', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'Courier New, Georgia, serif', fontSize: '0.9rem', lineHeight: '1.5', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)' }}>
                  
                  {/* School Header */}
                  <div style={{ textAlign: 'center', borderBottom: '2px double #000000', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', letterSpacing: '1px', fontSize: '1.1rem', color: '#000000' }}>MINISTERIO DE EDUCACIÓN (MINERD)</h3>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: '800', fontSize: '1rem', color: '#000000' }}>LICEO ANA ROSA CASTILLO</h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Distrito Escolar 14-01 Nagua | Reporte Oficial</span>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <strong style={{ fontSize: '1.05rem', textDecoration: 'underline', textTransform: 'uppercase' }}>
                      REPORTE PEDAGÓGICO DE TIPO: {viewingReportLog.type?.toUpperCase() || 'ALERTA ACADÉMICA'}
                    </strong>
                  </div>

                  {/* Metadata block */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '0.25rem 0', width: '140px', fontWeight: 'bold' }}>Estudiante:</td>
                        <td style={{ padding: '0.25rem 0', borderBottom: '1px dashed #000000' }}>{viewingReportLog.studentName}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.25rem 0', fontWeight: 'bold' }}>Grado / Sección:</td>
                        <td style={{ padding: '0.25rem 0', borderBottom: '1px dashed #000000' }}>{viewingReportLog.grade}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.25rem 0', fontWeight: 'bold' }}>Asignatura:</td>
                        <td style={{ padding: '0.25rem 0', borderBottom: '1px dashed #000000' }}>{viewingReportLog.subjectName}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.25rem 0', fontWeight: 'bold' }}>Fecha Registro:</td>
                        <td style={{ padding: '0.25rem 0', borderBottom: '1px dashed #000000' }}>{viewingReportLog.timestamp}</td>
                      </tr>
                      {viewingReportLog.score !== 'N/A' && (
                        <tr>
                          <td style={{ padding: '0.25rem 0', fontWeight: 'bold' }}>Calificación/Periodo:</td>
                          <td style={{ padding: '0.25rem 0', borderBottom: '1px dashed #000000' }}>{viewingReportLog.score}% ({viewingReportLog.periodName})</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Document Body */}
                  <div style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', minHeight: '150px', padding: '0.5rem 0' }}>
                    {viewingReportLog.finalText || viewingReportLog.comments}
                  </div>

                  {/* Signatures block */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '3.5rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '180px', borderBottom: '1px solid #000000', marginBottom: '0.25rem' }}></div>
                      <span>Docente Emisor</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '180px', borderBottom: '1px solid #000000', marginBottom: '0.25rem' }}></div>
                      <span>Coordinador/Orientador</span>
                    </div>
                  </div>

                </div>

              </div>

              <div className="modal-footer no-print-element" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => setViewingReportLog(null)}>Cerrar</button>
                
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(viewingReportLog.finalText || '');
                    alert('Texto copiado al portapapeles.');
                  }}
                >
                  📋 Copiar Texto
                </button>

                {/* Resend actions */}
                {(() => {
                  const subjectStr = `[REPORTE LARC] Grado: ${viewingReportLog.grade} | Alumno: ${viewingReportLog.studentName} | Tipo: ${viewingReportLog.type?.toUpperCase()}`;
                  const encodedTo = encodeURIComponent(`${viewingReportLog.coordinator},${viewingReportLog.counselor}`);
                  const encodedSubject = encodeURIComponent(subjectStr);
                  const encodedBody = encodeURIComponent(viewingReportLog.finalText || '');
                  
                  return (
                    <>
                      <a 
                        href={`mailto:${viewingReportLog.coordinator};${viewingReportLog.counselor}?subject=${encodedSubject}&body=${encodedBody}`}
                        className="btn-secondary"
                        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ✉️ Reenviar Local
                      </a>
                      <a 
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#ea4335', fontWeight: 'bold' }}
                      >
                        📧 Gmail Web
                      </a>
                    </>
                  );
                })()}

                <button 
                  className="btn-primary" 
                  onClick={() => window.print()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#7c3aed' }}
                >
                  🖨️ Imprimir / PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
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
        
        setEvaluationConfigsAndSave(nextEvaluationConfigs);
        
        // Also update students' final grades in real-time
        setStudentsAndSave(prevStudents => prevStudents.map(s => {
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

    setEvaluationConfigsAndSave(nextEvaluationConfigs);

    // Recalculate grades for all students in this grade
    setStudentsAndSave(prev => prev.map(s => {
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

    setEvaluationConfigsAndSave(nextEvaluationConfigs);

    // Recalculate grades for all students in this grade
    setStudentsAndSave(prev => prev.map(s => {
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

    setEvaluationConfigsAndSave(nextEvaluationConfigs);
    
    setActivePKey(pKey);
    setActiveInstrumentId(newInstId);
  };

  const handleAddCriterionRow = () => {
    const criteriaArray = instrumentEditState.criteria || [];
    const isList = instrumentEditState.type === 'lista';
    const newCrit = {
      name: `Criterio ${criteriaArray.length + 1}`,
      levels: isList ? { cumple: "Sí cumple", nocumple: "No cumple" } : {
        estrategico: "Descripción nivel estratégico (Excelente)",
        autonomo: "Descripción nivel autónomo (Muy bueno)",
        resolutivo: "Descripción nivel resolutivo (Bueno)",
        receptivo: "Descripción nivel receptivo (Regular)"
      }
    };
    updateActiveInstrumentConfig({
      criteria: [...criteriaArray, newCrit]
    });
  };

  const handleRemoveCriterionRow = (idxToRemove) => {
    const criteriaArray = instrumentEditState.criteria || [];
    updateActiveInstrumentConfig({
      criteria: criteriaArray.filter((_, idx) => idx !== idxToRemove)
    });
  };

  const handleEditCriterionName = (idx, nameVal) => {
    const criteriaArray = instrumentEditState.criteria || [];
    const nextList = [...criteriaArray];
    nextList[idx] = { ...nextList[idx], name: nameVal };
    updateActiveInstrumentConfig({ criteria: nextList });
  };

  const handleEditCriterionLevel = (critIdx, levelKey, textVal) => {
    const criteriaArray = instrumentEditState.criteria || [];
    const nextList = [...criteriaArray];
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
    setStudentsAndSave(prev => prev.map(s => {
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
    const rpKey = `${studentId}_${subjectKey}_${bloqueKey}`;
    const currentRp = studentRpGrades[rpKey] ? [...studentRpGrades[rpKey]] : [null, null, null, null];
    
    if (value === '' || value === null || value === undefined) {
      currentRp[evalIdx] = null;
    } else {
      const numVal = Math.min(100, Math.max(0, Number(value)));
      currentRp[evalIdx] = isNaN(numVal) ? null : numVal;
    }

    setStudentRpGradesAndSave(prev => ({
      ...prev,
      [rpKey]: currentRp
    }));
  };

  const handlePromotionGradeChange = (studentId, key, value) => {
    const promoKey = `${studentId}_${selectedSubject}`;
    const currentPromo = promotionGrades[promoKey] ? { ...promotionGrades[promoKey] } : { cec: null, ceex: null, ce: null };
    
    if (value === '') {
      currentPromo[key] = null;
    } else {
      currentPromo[key] = Math.min(100, Math.max(0, Number(value)));
    }

    setPromotionGradesAndSave(prev => ({
      ...prev,
      [promoKey]: currentPromo
    }));
  };

  const handleParameterGradeChange = (studentId, subjectKey, bloqueKey, pIdx, valueString) => {
    let value = valueString === '' ? 0 : Number(valueString);
    
    // Check if total (value + instrument sum) exceeds 100
    const pKeys = ['p1', 'p2', 'p3', 'p4'];
    const pKey = pKeys[pIdx];
    const instSum = getInstrumentSumForParameter(studentId, subjectKey, bloqueKey, pKey, studentAssessments);
    const totalScore = value + instSum;
    if (totalScore > 100) {
      alert(`⚠️ ¡Alerta! La calificación total ingresada (${totalScore}) supera los 100 puntos (Base manual: ${value}, Instrumentos: ${instSum}).`);
    }
    
    // Update the student's base grades (originalGrades) in s.grades
    setStudentsAndSave(prev => prev.map(s => {
      if (s.id === studentId) {
        const nextGrades = { ...s.grades };
        const subjectBlocks = nextGrades[subjectKey] ? { ...nextGrades[subjectKey] } : {};
        const baseGrades = [...(subjectBlocks[bloqueKey] || [80, 80, 80, 80])];
        
        baseGrades[pIdx] = value;
        subjectBlocks[bloqueKey] = baseGrades;
        nextGrades[subjectKey] = subjectBlocks;
        
        return { ...s, grades: nextGrades };
      }
      return s;
    }));
  };

  const handleUpdateAttendance = (studentId, type) => {
    setStudentsAndSave(prev => prev.map(s => {
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

    // Calculate total score to trigger alert if it exceeds 100
    const student = students.find(s => s.id === studentId);
    const pIdx = ['p1', 'p2', 'p3', 'p4'].indexOf(pKey);
    const baseGrade = getManualBaseGrade(student, subjectKey, activeBloque, pIdx, true);
    const newSum = getInstrumentSumForParameter(studentId, subjectKey, activeBloque, pKey, nextAssessmentsObject);
    const totalScore = baseGrade + newSum;
    if (totalScore > 100) {
      alert(`⚠️ ¡Alerta! La calificación total en este parámetro (${totalScore}) supera los 100 puntos (Base manual: ${baseGrade}, Instrumentos: ${newSum}).`);
    }

    setStudentAssessmentsAndSave(nextAssessmentsObject);

    // Recalculate grades using helper
    setStudentsAndSave(prev => prev.map(s => {
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
    setStudentAssessmentsAndSave(prev => ({
      ...prev,
      [assessmentKey]: nextAssessmentValues
    }));

    setStudentsAndSave(prev => prev.map(s => {
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

  const getManualBaseGrade = (student, subjectKey, bloqueKey, pIdx, hasInstruments) => {
    const subjectData = student?.grades?.[subjectKey] || {};
    const blockGrades = subjectData[bloqueKey];
    if (blockGrades && blockGrades[pIdx] !== undefined) {
      return Number(blockGrades[pIdx]) || 0;
    }
    return hasInstruments ? 0 : 80;
  };

  const getInstrumentSumForParameter = (studentId, subjectKey, bloqueKey, pKey, assessments) => {
    const student = students.find(s => s.id === studentId);
    const gradeName = student?.grade || selectedGrade;
    const configKey = `${gradeName}_${subjectKey}_${bloqueKey}`;
    const blockConfig = migrateConfig(evaluationConfigs[configKey]);
    const list = blockConfig[pKey] || [];
    
    let sum = 0;
    list.forEach(inst => {
      const criteriaList = normalizeCriteria(inst.criteria, inst.type);
      const aKey = `${studentId}_${subjectKey}_${bloqueKey}_${pKey}_${inst.id}`;
      const savedAssessment = assessments[aKey] || {};
      
      criteriaList.forEach(c => {
        const score = savedAssessment[c.name] !== undefined ? Number(savedAssessment[c.name]) : 0;
        sum += score;
      });
    });
    return sum;
  };

  const getCompetencyCodesForSubject = (subjectKey) => {
    const key = subjectKey || '';
    if (key.includes('espanola')) {
      return {
        c1: 'CE-LE1 & CE-LE2',
        c2: 'CE-LE3 & CE-LE4',
        c3: 'CE-LE5',
        c4: 'CE-LE6 & CE-LE7'
      };
    }
    if (key.includes('matematica')) {
      return {
        c1: 'CE-M1',
        c2: 'CE-M2',
        c3: 'CE-M3',
        c4: 'CE-M4'
      };
    }
    if (key.includes('sociales')) {
      return {
        c1: 'CE-CS1',
        c2: 'CE-CS2',
        c3: 'CE-CS3',
        c4: 'CE-CS4'
      };
    }
    if (key.includes('naturaleza')) {
      return {
        c1: 'CE-CN1',
        c2: 'CE-CN2',
        c3: 'CE-CN3',
        c4: 'CE-CN4'
      };
    }
    // Generic prefix
    const prefix = key ? key.slice(0, 3).toUpperCase() : 'CE';
    return {
      c1: `CE-${prefix}1`,
      c2: `CE-${prefix}2`,
      c3: `CE-${prefix}3`,
      c4: `CE-${prefix}4`
    };
  };

  const getSubjectTeacherName = (gradeName, subjectKey) => {
    const teacher = getAssignedTeacher(users, subjects, gradeName, subjectKey);
    return teacher ? teacher.name : 'Sin docente asignado';
  };

  const renderClassroomBreadcrumbs = () => {
    if (!selectedGrade || !selectedSubject) return null;
    const subjectName = subjects[selectedSubject]?.name || selectedSubject;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span 
          style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }} 
          onClick={() => { setActiveTab('dashboard'); setClassroomGrade(null); }}
        >
          Inicio
        </span>
        <span>&gt;</span>
        <span style={{ fontWeight: '500' }}>{selectedGrade}</span>
        <span>&gt;</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{subjectName}</span>
      </div>
    );
  };

  const renderClassroomTabs = () => {
    if (!selectedGrade || !selectedSubject) return null;
    
    // Get register theme color for the active tab indicator
    const themeInfo = getGradeThemeInfo(selectedGrade);
    const accentColor = themeInfo.color || 'var(--primary)';
    
    return (
      <div 
        className="classroom-tabs-bar"
        style={{
          display: 'flex',
          gap: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
          paddingBottom: '0px'
        }}
      >
        {[
          { label: 'Asistencia', tab: 'attendance' },
          { label: 'Calificaciones', tab: 'grades' },
          { label: 'Instrumentos', tab: 'instruments' }
        ].map(t => {
          const isActive = activeTab === t.tab;
          return (
            <button
              key={t.tab}
              type="button"
              onClick={() => {
                if (t.tab === 'instruments' && activeBloque === 'promedio_ce') {
                  setActiveBloque('bloque1');
                }
                setActiveTab(t.tab);
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 0.5rem',
                fontSize: '0.92rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? accentColor : 'var(--text-secondary)',
                borderBottom: isActive ? `3px solid ${accentColor}` : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              {t.tab === 'attendance' ? '📅' : t.tab === 'grades' ? '📊' : '🛠️'}
              {t.label}
            </button>
          );
        })}
      </div>
    );
  };

  const getCalculatedBlockGrades = (studentId, gradeName, subjectKey, bloqueKey, currentConfigs, currentAssessments, originalGrades) => {
    const configKey = `${gradeName}_${subjectKey}_${bloqueKey}`;
    const blockConfig = migrateConfig(currentConfigs[configKey]);
    const student = students.find(s => s.id === studentId);
    
    const finalGrades = [...originalGrades];
    const pKeys = ['p1', 'p2', 'p3', 'p4'];
    
    pKeys.forEach((pKey, pIdx) => {
      const list = blockConfig[pKey] || [];
      const hasInstruments = list.length > 0;
      const baseGrade = getManualBaseGrade(student, subjectKey, bloqueKey, pIdx, hasInstruments);
      
      let sum = 0;
      if (hasInstruments) {
        list.forEach(inst => {
          const criteriaList = normalizeCriteria(inst.criteria, inst.type);
          const assessmentKey = `${studentId}_${subjectKey}_${bloqueKey}_${pKey}_${inst.id}`;
          const savedAssessment = currentAssessments[assessmentKey] || {};
          
          let instSum = 0;
          criteriaList.forEach(c => {
            const score = savedAssessment[c.name] !== undefined ? Number(savedAssessment[c.name]) : 0;
            instSum += score;
          });
          sum += instSum;
        });
      }
      
      finalGrades[pIdx] = Math.min(100, Math.max(0, baseGrade + sum));
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

  const exportAttendanceToExcel = (targetGrade = selectedGrade, targetSubject = selectedSubject) => {
    if (!targetGrade || !targetSubject) {
      alert('Por favor selecciona un curso y una materia.');
      return;
    }

    const subjectName = subjects[targetSubject]?.name || targetSubject;
    const monthsList = ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    const studentsList = students.filter(s => s.grade === targetGrade);

    const teacherObj = getAssignedTeacher(users, subjects, targetGrade, targetSubject);
    const teacherName = teacherObj ? teacherObj.name : '';

    // Check if subject is core (Page 1 format) or special (Page 2 format)
    const isCore = (subKey) => {
      const k = (subKey || '').toLowerCase();
      const name = (subjects[subKey]?.name || subKey).toLowerCase();
      return k === 'lengua_espanola' || k === 'matematica' || k === 'ciencias_naturaleza' || k === 'ciencias_sociales' ||
             name.includes('matem') || name.includes('lengua') || name.includes('sociales') || name.includes('naturaleza');
    };

    const isCoreSubject = isCore(targetSubject);

    let htmlTable = '';

    if (isCoreSubject) {
      // --- PAGE 1 FORMAT: Core subjects (21 days per month, 2 months per section) ---
      const pairs = [];
      for (let i = 0; i < monthsList.length; i += 2) {
        pairs.push([monthsList[i], monthsList[i + 1] || '']);
      }

      htmlTable += `<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 11px;">`;

      pairs.forEach(([mA, mB]) => {
        const titleText = subjectName.toUpperCase();
        // Title Banner (Row 1)
        htmlTable += `
          <tr>
            <th colspan="47" style="background-color: #a6a6a6; color: #000000; font-size: 15px; font-weight: bold; height: 35px; text-align: center; border: 1px solid #000000;">${titleText}</th>
          </tr>
          <tr>
            <td style="background-color: #d9d9d9; font-weight: bold; text-align: center; border: 1px solid #000000; font-size: 11px; width: 60px;">DOCENTE</td>
            <td colspan="46" style="background-color: #ffffff; text-align: left; font-weight: bold; font-size: 12px; padding-left: 8px; border: 1px solid #000000;">${teacherName}</td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border: 1px solid #000000;"></td>
            <td colspan="23" style="background-color: #ffffff; font-weight: bold; font-size: 13px; text-align: left; padding-left: 6px; border: 1px solid #000000;">Mes: ${mA}</td>
            <td colspan="23" style="background-color: #ffffff; font-weight: bold; font-size: 13px; text-align: left; padding-left: 6px; border: 1px solid #000000;">Mes: ${mB || '-'}</td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border: 1px solid #000000;"></td>
            <td colspan="21" style="background-color: #d9d9d9; font-weight: bold; text-align: center; border: 1px solid #000000; font-size: 10px;">DÍAS TRABAJADOS</td>
            <td style="background-color: #d9d9d9; font-weight: bold; text-align: center; border: 1px solid #000000; font-size: 10px; width: 30px;">T</td>
            <td style="background-color: #d9d9d9; font-weight: bold; text-align: center; border: 1px solid #000000; font-size: 10px; width: 35px;">%</td>
            <td colspan="21" style="background-color: #d9d9d9; font-weight: bold; text-align: center; border: 1px solid #000000; font-size: 10px;">DÍAS TRABAJADOS</td>
            <td style="background-color: #d9d9d9; font-weight: bold; text-align: center; border: 1px solid #000000; font-size: 10px; width: 30px;">T</td>
            <td style="background-color: #d9d9d9; font-weight: bold; text-align: center; border: 1px solid #000000; font-size: 10px; width: 35px;">%</td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border: 1px solid #000000;"></td>
        `;

        // Day numbers for mA
        for (let d = 1; d <= 21; d++) {
          htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000; width: 22px;">${d}</td>`;
        }
        htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">T</td>`;
        htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">%</td>`;

        // Day numbers for mB
        for (let d = 1; d <= 21; d++) {
          htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000; width: 22px;">${d}</td>`;
        }
        htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">T</td>`;
        htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">%</td>`;
        htmlTable += `</tr>`;

        // Row DÍAS dates
        htmlTable += `
          <tr>
            <td style="background-color: #f2f2f2; font-weight: bold; font-size: 9px; text-align: center; border: 1px solid #000000;">DÍAS</td>
        `;

        // Month A day dates
        let mAWorkedDays = 0;
        for (let idx = 0; idx < 21; idx++) {
          const dateVal = attendanceDayDates[`${targetGrade}_${targetSubject}_${mA}_day_${idx}`] || '';
          if (dateVal.trim() !== '') mAWorkedDays++;
          htmlTable += `<td style="background-color: #f9f9f9; font-size: 9px; font-weight: bold; text-align: center; border: 1px solid #000000;">${dateVal}</td>`;
        }
        htmlTable += `<td style="background-color: #f9f9f9; border: 1px solid #000000;"></td><td style="background-color: #f9f9f9; border: 1px solid #000000;"></td>`;

        // Month B day dates
        let mBWorkedDays = 0;
        for (let idx = 0; idx < 21; idx++) {
          const dateVal = mB ? (attendanceDayDates[`${targetGrade}_${targetSubject}_${mB}_day_${idx}`] || '') : '';
          if (dateVal.trim() !== '') mBWorkedDays++;
          htmlTable += `<td style="background-color: #f9f9f9; font-size: 9px; font-weight: bold; text-align: center; border: 1px solid #000000;">${dateVal}</td>`;
        }
        htmlTable += `<td style="background-color: #f9f9f9; border: 1px solid #000000;"></td><td style="background-color: #f9f9f9; border: 1px solid #000000;"></td>`;
        htmlTable += `</tr>`;

        // 40 Student Rows
        for (let rIdx = 0; rIdx < 40; rIdx++) {
          const s = studentsList[rIdx];
          htmlTable += `<tr>`;
          htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">${rIdx + 1}</td>`;

          if (s) {
            // Student attendance mA
            let aA = 0, eA = 0, rA = 0, tA = 0, pA = 0;
            for (let idx = 0; idx < 21; idx++) {
              const st = studentAttendanceDetail[`${s.id}_${targetSubject}_${mA}_col_${idx}`] || '';
              if (st === 'R') rA++;
              const dVal = attendanceDayDates[`${targetGrade}_${targetSubject}_${mA}_day_${idx}`] || '';
              if (dVal.trim() !== '') {
                if (st === 'A') aA++;
                else if (st === 'E') eA++;
                else if (st === 'T') tA++;
                else if (st === 'P') pA++;
              }
              htmlTable += `<td style="background-color: #ffffff; text-align: center; border: 1px solid #000000;">${st}</td>`;
            }
            const actA = Math.max(0, mAWorkedDays - rA);
            const excAbsA = Math.floor(eA / 3);
            const excPresA = eA - excAbsA;
            const finPresA = pA + tA + excPresA;
            const capTA = Math.min(actA, finPresA);
            const pctA = actA > 0 ? Math.round((capTA / actA) * 100) : 0;
            const retA = rA > 0;

            htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">${retA ? 'R' : capTA}</td>`;
            htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">${retA ? '-' : pctA + '%'}</td>`;

            // Student attendance mB
            if (mB) {
              let aB = 0, eB = 0, rB = 0, tB = 0, pB = 0;
              for (let idx = 0; idx < 21; idx++) {
                const st = studentAttendanceDetail[`${s.id}_${targetSubject}_${mB}_col_${idx}`] || '';
                if (st === 'R') rB++;
                const dVal = attendanceDayDates[`${targetGrade}_${targetSubject}_${mB}_day_${idx}`] || '';
                if (dVal.trim() !== '') {
                  if (st === 'A') aB++;
                  else if (st === 'E') eB++;
                  else if (st === 'T') tB++;
                  else if (st === 'P') pB++;
                }
                htmlTable += `<td style="background-color: #ffffff; text-align: center; border: 1px solid #000000;">${st}</td>`;
              }
              const actB = Math.max(0, mBWorkedDays - rB);
              const excAbsB = Math.floor(eB / 3);
              const excPresB = eB - excAbsB;
              const finPresB = pB + tB + excPresB;
              const capTB = Math.min(actB, finPresB);
              const pctB = actB > 0 ? Math.round((capTB / actB) * 100) : 0;
              const retB = rB > 0;

              htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">${retB ? 'R' : capTB}</td>`;
              htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">${retB ? '-' : pctB + '%'}</td>`;
            } else {
              for (let idx = 0; idx < 23; idx++) {
                htmlTable += `<td style="background-color: #ffffff; border: 1px solid #000000;"></td>`;
              }
            }
          } else {
            // Empty row
            for (let c = 0; c < 46; c++) {
              htmlTable += `<td style="background-color: #ffffff; border: 1px solid #000000;"></td>`;
            }
          }
          htmlTable += `</tr>`;
        }

        // Add spacing row between month pairs
        htmlTable += `<tr><td colspan="47" style="height: 25px; border: none;"></td></tr>`;
      });

      htmlTable += `</table>`;
    } else {
      // --- PAGE 2 FORMAT: Special subjects (10 days per month, 4 months per section) ---
      const quads = [
        ['Agosto', 'Septiembre', 'Octubre', 'Noviembre'],
        ['Diciembre', 'Enero', 'Febrero', 'Marzo'],
        ['Abril', 'Mayo', 'Junio', '']
      ];

      htmlTable += `<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 11px;">`;

      quads.forEach((mQuad) => {
        const titleText = subjectName.toUpperCase();
        // Title Banner (Row 1)
        htmlTable += `
          <tr>
            <th colspan="49" style="background-color: #a6a6a6; color: #000000; font-size: 15px; font-weight: bold; height: 35px; text-align: center; border: 1px solid #000000;">${titleText}</th>
          </tr>
          <tr>
            <td style="background-color: #d9d9d9; font-weight: bold; text-align: center; border: 1px solid #000000; font-size: 11px; width: 60px;">DOCENTE</td>
            <td colspan="48" style="background-color: #ffffff; text-align: left; font-weight: bold; font-size: 12px; padding-left: 8px; border: 1px solid #000000;">${teacherName}</td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border: 1px solid #000000;"></td>
        `;

        mQuad.forEach((mName) => {
          htmlTable += `<td colspan="12" style="background-color: #ffffff; font-weight: bold; font-size: 13px; text-align: left; padding-left: 6px; border: 1px solid #000000;">Mes: ${mName || '-'}</td>`;
        });
        htmlTable += `</tr>`;

        // DÍAS TRABAJADOS Row
        htmlTable += `
          <tr>
            <td style="background-color: #ffffff; border: 1px solid #000000;"></td>
        `;
        mQuad.forEach(() => {
          htmlTable += `
            <td colspan="10" style="background-color: #d9d9d9; font-weight: bold; text-align: center; border: 1px solid #000000; font-size: 10px;">DÍAS TRABAJADOS</td>
            <td style="background-color: #d9d9d9; font-weight: bold; text-align: center; border: 1px solid #000000; font-size: 10px; width: 30px;">T</td>
            <td style="background-color: #d9d9d9; font-weight: bold; text-align: center; border: 1px solid #000000; font-size: 10px; width: 35px;">%</td>
          `;
        });
        htmlTable += `</tr>`;

        // Day numbers 1..10 T % Row
        htmlTable += `
          <tr>
            <td style="background-color: #ffffff; border: 1px solid #000000;"></td>
        `;
        mQuad.forEach(() => {
          for (let d = 1; d <= 10; d++) {
            htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000; width: 22px;">${d}</td>`;
          }
          htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">T</td>`;
          htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">%</td>`;
        });
        htmlTable += `</tr>`;

        // Row DÍAS dates
        htmlTable += `
          <tr>
            <td style="background-color: #f2f2f2; font-weight: bold; font-size: 9px; text-align: center; border: 1px solid #000000;">DÍAS</td>
        `;

        const quadWorkedDays = [0, 0, 0, 0];
        mQuad.forEach((mName, qIdx) => {
          if (mName) {
            for (let idx = 0; idx < 10; idx++) {
              const dateVal = attendanceDayDates[`${targetGrade}_${targetSubject}_${mName}_day_${idx}`] || '';
              if (dateVal.trim() !== '') quadWorkedDays[qIdx]++;
              htmlTable += `<td style="background-color: #f9f9f9; font-size: 9px; font-weight: bold; text-align: center; border: 1px solid #000000;">${dateVal}</td>`;
            }
            htmlTable += `<td style="background-color: #f9f9f9; border: 1px solid #000000;"></td><td style="background-color: #f9f9f9; border: 1px solid #000000;"></td>`;
          } else {
            for (let idx = 0; idx < 12; idx++) {
              htmlTable += `<td style="background-color: #f9f9f9; border: 1px solid #000000;"></td>`;
            }
          }
        });
        htmlTable += `</tr>`;

        // 40 Student Rows
        for (let rIdx = 0; rIdx < 40; rIdx++) {
          const s = studentsList[rIdx];
          htmlTable += `<tr>`;
          htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">${rIdx + 1}</td>`;

          if (s) {
            mQuad.forEach((mName, qIdx) => {
              if (mName) {
                let aCount = 0, eCount = 0, rCount = 0, tCount = 0, pCount = 0;
                for (let idx = 0; idx < 10; idx++) {
                  const st = studentAttendanceDetail[`${s.id}_${targetSubject}_${mName}_col_${idx}`] || '';
                  if (st === 'R') rCount++;
                  const dVal = attendanceDayDates[`${targetGrade}_${targetSubject}_${mName}_day_${idx}`] || '';
                  if (dVal.trim() !== '') {
                    if (st === 'A') aCount++;
                    else if (st === 'E') eCount++;
                    else if (st === 'T') tCount++;
                    else if (st === 'P') pCount++;
                  }
                  htmlTable += `<td style="background-color: #ffffff; text-align: center; border: 1px solid #000000;">${st}</td>`;
                }

                const mWorked = quadWorkedDays[qIdx];
                const actDays = Math.max(0, mWorked - rCount);
                const excAbs = Math.floor(eCount / 3);
                const excPres = eCount - excAbs;
                const finPres = pCount + tCount + excPres;
                const capT = Math.min(actDays, finPres);
                const pct = actDays > 0 ? Math.round((capT / actDays) * 100) : 0;
                const ret = rCount > 0;

                htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">${ret ? 'R' : capT}</td>`;
                htmlTable += `<td style="background-color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #000000;">${ret ? '-' : pct + '%'}</td>`;
              } else {
                for (let idx = 0; idx < 12; idx++) {
                  htmlTable += `<td style="background-color: #ffffff; border: 1px solid #000000;"></td>`;
                }
              }
            });
          } else {
            for (let c = 0; c < 48; c++) {
              htmlTable += `<td style="background-color: #ffffff; border: 1px solid #000000;"></td>`;
            }
          }
          htmlTable += `</tr>`;
        }

        // Spacing row
        htmlTable += `<tr><td colspan="49" style="height: 25px; border: none;"></td></tr>`;
      });

      htmlTable += `</table>`;
    }

    // Build Excel file Blob
    const htmlBlobContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
      <meta charset="utf-8"/>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Asistencia MINERD</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <style>
        table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; }
        th, td { border: 1px solid #000000; text-align: center; vertical-align: middle; }
      </style>
      </head>
      <body>
        ${htmlTable}
      </body>
      </html>
    `;

    const cleanGrade = targetGrade.replace(/\s+/g, '_');
    const cleanSubject = subjectName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const fileName = `Asistencia_MINERD_${cleanGrade}_${cleanSubject}.xls`;

    const blob = new Blob(['\ufeff' + htmlBlobContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const calculateStudentAvg = (s) => {
    const subKeys = Object.keys(getSubjectsForGrade(subjects, s.grade));
    if (subKeys.length === 0) return 0;
    const sum = subKeys.reduce((acc, subKey) => acc + calculateSubjectAvg(s.id, subKey, s.grades), 0);
    return sum / subKeys.length;
  };

  const globalAverage = totalStudents > 0 
    ? (students.reduce((acc, s) => acc + calculateStudentAvg(s), 0) / totalStudents).toFixed(1)
    : 0;

  const getSubjectAverage = (subKey) => {
    if (totalStudents === 0) return 0;
    const sub = subjects[subKey];
    const relevantStudents = students.filter(s => sub && sub.grades && sub.grades.includes(s.grade));
    if (relevantStudents.length === 0) return 0;
    const totalSum = relevantStudents.reduce((acc, s) => {
      return acc + calculateSubjectAvg(s.id, subKey, s.grades);
    }, 0);
    return (totalSum / relevantStudents.length).toFixed(1);
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
    setUsersAndSave(prev => prev.map(u => {
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

  if (!currentUser) {
    return (
      <div className="login-container">
        {/* Left Side: Circular emblem and 12 Curricular modules grid */}
        <div className="login-left-illustration">
          <div className="login-left-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            
            {/* Circular Official Emblem */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, #002244 0%, #003876 100%)', border: '3px solid #ffb300', boxShadow: '0 8px 16px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span style={{ fontSize: '2.5rem', zIndex: 2, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>🎓</span>
                <span style={{ fontSize: '0.6rem', fontWeight: '900', color: '#ffb300', letterSpacing: '0.12em', marginTop: '0.15rem', zIndex: 2 }}>L.A.R.C.</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#ffb300', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>
                Registro de Evaluación Digital
              </div>
              <h1 className="school-title-highlight" style={{ fontSize: '1.75rem', fontWeight: '900', color: '#ffffff', margin: '0.2rem 0', letterSpacing: '0.02em', lineHeight: 1.1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                LICEO ANA ROSA CASTILLO
              </h1>
              <div style={{ marginTop: '0.5rem' }}>
                <span className="district-badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '0.35rem 1rem', borderRadius: '50px', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'inline-block' }}>
                  Distrito Educativo 14-01 Nagua
                </span>
              </div>
            </div>

            {/* Grid of 12 Interactive Curricular Modules */}
            <div className="login-feature-grid">
              <div className="login-feature-card">
                <span style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>📙</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1 }}>Registro Anecdótico</span>
              </div>
              <div className="login-feature-card">
                <span style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>📈</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1 }}>Escala Estimativa</span>
              </div>
              <div className="login-feature-card">
                <span style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>☑️</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1 }}>Lista de Cotejo</span>
              </div>
              <div className="login-feature-card">
                <span style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>📊</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1 }}>Rúbricas</span>
              </div>
              <div className="login-feature-card">
                <span style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>💬</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1 }}>Asistente IA</span>
              </div>
              <div className="login-feature-card">
                <span style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>📂</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1 }}>Planificación</span>
              </div>
              <div className="login-feature-card">
                <span style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>📕</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1 }}>Reportes PDF</span>
              </div>
              <div className="login-feature-card">
                <span style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>📉</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1 }}>Rendimiento</span>
              </div>
              <div className="login-feature-card">
                <span style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>📅</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1 }}>Control Asistencia</span>
              </div>
              <div className="login-feature-card">
                <span style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>📄</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1 }}>Boletines</span>
              </div>
              <div className="login-feature-card">
                <span style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>🚨</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1 }}>Incidencias</span>
              </div>
              <div className="login-feature-card">
                <span style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>⚙️</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1 }}>Configuración</span>
              </div>
            </div>

            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.78rem', lineHeight: '1.4', margin: '1.5rem 0 0 0', textAlign: 'center', maxWidth: '440px' }}>
              Plataforma digital para la gestión del registro por competencias y rúbricas del Liceo Ana Rosa Castillo.
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

            <div className="demo-box-clean" style={{ marginTop: '1.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.25rem' }}>
              <div className="demo-title-clean" style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textAlign: 'center' }}>
                Ingreso Rápido de Demostración
              </div>
              <div className="demo-buttons-clean" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button 
                  type="button"
                  className="btn-demo-clean" 
                  onClick={() => handleQuickLogin('mario.paredes@docente.edu.do', 'mario123')}
                  style={{ display: 'flex', flexDirection: 'column', padding: '0.6rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'var(--bg-primary)', textAlign: 'left', transition: 'transform 0.2s', width: '100%' }}
                >
                  <span className="role" style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--primary)' }}>👨‍🏫 Prof. Mario Paredes (Docente de Prueba)</span>
                  <span className="email" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>mario.paredes@docente.edu.do (Un solo click)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating PWA Installation prompt badge matching DocenteProRD look */}
        {isInstallable && (
          <div className="pwa-install-toast no-print-element" style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#003876', color: '#ffffff', padding: '0.75rem 1.25rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', animation: 'slideInUp 0.3s ease', maxWidth: '340px' }}>
            <span style={{ fontSize: '1.5rem' }}>📥</span>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>Instalar Liceo Ana Rosa Castillo</span>
              <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.85)' }}>Acceso rápido y soporte offline</span>
            </div>
            <button 
              type="button" 
              onClick={handleInstallApp}
              style={{ backgroundColor: '#ffffff', color: '#003876', border: 'none', borderRadius: '4px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Instalar
            </button>
            <button 
              type="button" 
              onClick={() => setIsInstallable(false)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', marginLeft: '0.25rem' }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- HELPER: Render Official MINERD 2-Page Bulletin Document ---
  const renderBulletinContent = (student, targetGrade) => {
    if (!student) return null;

    const compileSubjectGrades = (stu, subKey) => {
      const sGrades = stu.grades?.[subKey] || {
        bloque1: [80, 80, 80, 80],
        bloque2: [80, 80, 80, 80],
        bloque3: [80, 80, 80, 80],
        bloque4: [80, 80, 80, 80]
      };

      const getBlockAverage = (bloqueArray) => {
        if (!bloqueArray || bloqueArray.length === 0) return 80;
        const sum = bloqueArray.reduce((a, b) => a + b, 0);
        return Math.round(sum / bloqueArray.length);
      };

      const p1 = getBlockAverage(sGrades.bloque1);
      const p2 = getBlockAverage(sGrades.bloque2);
      const p3 = getBlockAverage(sGrades.bloque3);
      const p4 = getBlockAverage(sGrades.bloque4);
      const rp = Math.round((p1 + p2 + p3 + p4) / 4);

      const promoKey = `${stu.id}_${subKey}`;
      const pData = promotionGrades[promoKey] || { cec: null, ceex: null, ce: null };
      const cpc = pData.cec;
      const cex = pData.ceex;

      let cc = null;
      if (cpc !== null && cpc !== undefined) {
        cc = Math.round((rp * 0.5) + (cpc * 0.5));
      }

      let cexc = null;
      if (cex !== null && cex !== undefined) {
        cexc = Math.round((rp * 0.3) + (cex * 0.7));
      }

      let cf = rp;
      if (rp < 70) {
        if (cc !== null && cc >= 70) {
          cf = cc;
        } else if (cc !== null && cc < 70 && cexc !== null) {
          cf = cexc;
        } else if (cc !== null) {
          cf = cc;
        }
      }

      return { p1, p2, p3, p4, rp, cpc, cc, cex, cexc, cf };
    };

    const standardSubjects = [
      { key: 'lengua_espanola', name: 'Lengua Española' },
      { key: 'matematica', name: 'Matemática' },
      { key: 'ciencias_sociales', name: 'Ciencias Sociales' },
      { key: 'ciencias_naturaleza', name: 'Ciencias de la Naturaleza' },
      { key: 'artistica', name: 'Educación Artística' },
      { key: 'educacion_fisica', name: 'Educación Física' },
      { key: 'formacion_religiosa', name: 'Formación Integral Humana y Religiosa' },
      { key: 'ingles', name: 'Lengua Extranjera - Inglés' },
      { key: 'frances', name: 'Lengua Extranjera - Francés' }
    ];

    const optativeSubjects = ['4to A', '5to A', '6to A'].includes(targetGrade) ? [
      { key: 'salida1', name: salida1Name || 'Salida Optativa 1' },
      { key: 'salida2', name: salida2Name || 'Salida Optativa 2' }
    ] : [];

    const activeSubjectsList = [...standardSubjects, ...optativeSubjects];

    const compiledGradesList = activeSubjectsList.map(sub => {
      const compiled = compileSubjectGrades(student, sub.key);
      return {
        ...sub,
        ...compiled
      };
    });

    const allFinalPassed = compiledGradesList.every(g => g.cf >= 70);
    const finalConditionLabel = allFinalPassed ? 'PROMOVIDO' : 'REPITENTE / PENDIENTE';

    const overallAverage = Math.round(compiledGradesList.reduce((sum, g) => sum + g.cf, 0) / compiledGradesList.length);
    const currentCommentVal = studentComments[student.id] || '';
    
    let autoComment = '';
    if (overallAverage >= 90) {
      autoComment = "Excelente desempeño durante este año escolar. Ha alcanzado un altísimo nivel de logro en todas las competencias curriculares clave.";
    } else if (overallAverage >= 80) {
      autoComment = "Muy buen desempeño académico. Ha consolidado con éxito sus aprendizajes, mostrando gran compromiso y responsabilidad en sus tareas diarias.";
    } else if (overallAverage >= 70) {
      autoComment = "Rendimiento satisfactorio. Ha logrado las competencias necesarias del grado, pero se recomienda seguir repasando y profundizando áreas específicas en el próximo año escolar.";
    } else {
      autoComment = "Atención pedagógica: El estudiante requiere reforzamiento intensivo y tutorías académicas adicionales en las asignaturas clave no superadas para lograr los aprendizajes esperados.";
    }

    const displayComment = currentCommentVal.trim() !== '' ? currentCommentVal : autoComment;

    return (
      <div className="bulletin-printable-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* ================= PAGE 1 (ANVERSO) ================= */}
        <div className="bulletin-page bulletin-page-1" style={{ backgroundColor: '#ffffff', color: '#000000', padding: '1.5in 1.2in', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', boxSizing: 'border-box', position: 'relative' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', display: 'flex' }}>
            <div style={{ flex: 1, backgroundColor: '#003876' }}></div>
            <div style={{ flex: 1, backgroundColor: '#ffffff' }}></div>
            <div style={{ flex: 1, backgroundColor: '#ce1126' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000000', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'radial-gradient(circle, #002244 0%, #003876 100%)', border: '2px solid #ffb300', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.6rem' }}>🎓</span>
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0, letterSpacing: '0.02em', color: '#000000' }}>LICEO ANA ROSA CASTILLO</h1>
                <span style={{ fontSize: '0.7rem', color: '#334155', fontWeight: 'bold' }}>DISTRITO EDUCATIVO 14-01 NAGUA, REP. DOM.</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ backgroundColor: '#003876', color: '#ffffff', padding: '0.3rem 0.75rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', display: 'inline-block' }}>BOLETÍN OFICIAL</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 'bold', marginTop: '0.25rem' }}>AÑO ESCOLAR: 2025-2026</div>
            </div>
          </div>

          <h3 style={{ textAlign: 'center', fontSize: '1.05rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1.25rem 0', color: '#000000' }}>
            REGISTRO OFICIAL DE EVALUACIÓN DEL APRENDIZAJE (SEGUNDO CICLO SECUNDARIA)
          </h3>

          {/* Student Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', border: '1px solid #000000', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
            <div>
              <strong>Estudiante:</strong> <span style={{ textTransform: 'uppercase' }}>{student.name}</span>
            </div>
            <div>
              <strong>Grado:</strong> {student.grade}
            </div>
            <div>
              <strong>Código RNE:</strong> <span style={{ fontFamily: 'monospace' }}>{student.id.toUpperCase().replace('S_', 'RNE-')}</span>
            </div>
            <div>
              <strong>Centro Educativo:</strong> Liceo Ana Rosa Castillo
            </div>
            <div>
              <strong>Distrito Escolar:</strong> 14-01 Nagua
            </div>
            <div>
              <strong>Sección:</strong> Única
            </div>
          </div>

          {/* Grades Table */}
          <table className="bulletin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={{ border: '1px solid #000000', padding: '0.5rem', textAlign: 'left', width: '38%' }}>Asignatura / Área Curricular</th>
                <th style={{ border: '1px solid #000000', padding: '0.5rem', textAlign: 'center', width: '7%' }}>P1</th>
                <th style={{ border: '1px solid #000000', padding: '0.5rem', textAlign: 'center', width: '7%' }}>P2</th>
                <th style={{ border: '1px solid #000000', padding: '0.5rem', textAlign: 'center', width: '7%' }}>P3</th>
                <th style={{ border: '1px solid #000000', padding: '0.5rem', textAlign: 'center', width: '7%' }}>P4</th>
                <th style={{ border: '1px solid #000000', padding: '0.5rem', textAlign: 'center', width: '7%', fontWeight: 'bold' }}>RP</th>
                <th style={{ border: '1px solid #000000', padding: '0.5rem', textAlign: 'center', width: '7%', backgroundColor: '#fef3c7' }}>CPC</th>
                <th style={{ border: '1px solid #000000', padding: '0.5rem', textAlign: 'center', width: '7%', backgroundColor: '#fef3c7' }}>CC</th>
                <th style={{ border: '1px solid #000000', padding: '0.5rem', textAlign: 'center', width: '7%', backgroundColor: '#fee2e2' }}>CEX</th>
                <th style={{ border: '1px solid #000000', padding: '0.5rem', textAlign: 'center', width: '7%', backgroundColor: '#fee2e2' }}>CEXC</th>
                <th style={{ border: '1px solid #000000', padding: '0.5rem', textAlign: 'center', width: '8%', fontWeight: 'bold', backgroundColor: '#e2e8f0' }}>CF</th>
              </tr>
            </thead>
            <tbody>
              {compiledGradesList.map((g) => (
                <tr key={g.key}>
                  <td style={{ border: '1px solid #000000', padding: '0.5rem', fontWeight: 'bold' }}>{g.name}</td>
                  
                  {/* Period 1 */}
                  <td style={{ border: '1px solid #000000', textAlign: 'center', padding: '0.2rem' }}>
                    <input 
                      type="number" 
                      className="no-print-input"
                      value={g.p1} 
                      onChange={(e) => handleUpdateCustomSubjectGrade(student.id, g.key, 'bloque1', -1, e.target.value)}
                      style={{ width: '100%', border: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}
                    />
                  </td>
                  
                  {/* Period 2 */}
                  <td style={{ border: '1px solid #000000', textAlign: 'center', padding: '0.2rem' }}>
                    <input 
                      type="number" 
                      className="no-print-input"
                      value={g.p2} 
                      onChange={(e) => handleUpdateCustomSubjectGrade(student.id, g.key, 'bloque2', -1, e.target.value)}
                      style={{ width: '100%', border: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}
                    />
                  </td>
                  
                  {/* Period 3 */}
                  <td style={{ border: '1px solid #000000', textAlign: 'center', padding: '0.2rem' }}>
                    <input 
                      type="number" 
                      className="no-print-input"
                      value={g.p3} 
                      onChange={(e) => handleUpdateCustomSubjectGrade(student.id, g.key, 'bloque3', -1, e.target.value)}
                      style={{ width: '100%', border: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}
                    />
                  </td>
                  
                  {/* Period 4 */}
                  <td style={{ border: '1px solid #000000', textAlign: 'center', padding: '0.2rem' }}>
                    <input 
                      type="number" 
                      className="no-print-input"
                      value={g.p4} 
                      onChange={(e) => handleUpdateCustomSubjectGrade(student.id, g.key, 'bloque4', -1, e.target.value)}
                      style={{ width: '100%', border: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}
                    />
                  </td>

                  <td style={{ border: '1px solid #000000', textAlign: 'center', fontWeight: '900', backgroundColor: '#f8fafc' }}>{g.rp}</td>
                  
                  {/* CPC */}
                  <td style={{ border: '1px solid #000000', textAlign: 'center', padding: '0.1rem', backgroundColor: '#fffbeb' }}>
                    {g.rp < 70 ? (
                      <input 
                        type="number" 
                        className="no-print-input"
                        placeholder="-"
                        value={g.cpc || ''} 
                        onChange={(e) => handleUpdatePromoField(student.id, g.key, 'cec', e.target.value)}
                        style={{ width: '100%', border: 'none', backgroundColor: 'transparent', textAlign: 'center', fontWeight: 'bold', color: '#b45309' }}
                      />
                    ) : '-'}
                  </td>

                  <td style={{ border: '1px solid #000000', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#fffbeb', color: g.cc < 70 ? '#ce1126' : 'inherit' }}>
                    {g.cc !== null ? g.cc : '-'}
                  </td>

                  {/* CEX */}
                  <td style={{ border: '1px solid #000000', textAlign: 'center', padding: '0.1rem', backgroundColor: '#fef2f2' }}>
                    {(g.rp < 70 && (g.cc === null || g.cc < 70)) ? (
                      <input 
                        type="number" 
                        className="no-print-input"
                        placeholder="-"
                        value={g.cex || ''} 
                        onChange={(e) => handleUpdatePromoField(student.id, g.key, 'ceex', e.target.value)}
                        style={{ width: '100%', border: 'none', backgroundColor: 'transparent', textAlign: 'center', fontWeight: 'bold', color: '#dc2626' }}
                      />
                    ) : '-'}
                  </td>

                  <td style={{ border: '1px solid #000000', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#fef2f2', color: g.cexc < 70 ? '#ce1126' : 'inherit' }}>
                    {g.cexc !== null ? g.cexc : '-'}
                  </td>

                  <td style={{ border: '1px solid #000000', textAlign: 'center', fontWeight: '900', backgroundColor: '#f1f5f9', color: g.cf < 70 ? '#ce1126' : '#1e3a8a' }}>{g.cf}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ border: '1px solid #000000', padding: '0.6rem', borderRadius: '4px', fontSize: '0.7rem', backgroundColor: '#f8fafc' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Leyenda y Criterios Oficiales:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                • <strong>P1 - P4:</strong> Calificaciones Parciales correspondientes a cada Período Escolar.<br />
                • <strong>RP:</strong> Promedio de Rendimiento Parcial del Año.<br />
                • <strong>CPC / CC:</strong> Examen Completivo (50%) / Calificación Completiva Final.
              </div>
              <div>
                • <strong>CEX / CEXC:</strong> Examen Extraordinario (70%) / Calificación Extraordinaria Final.<br />
                • <strong>CF:</strong> Calificación Final (Mínimo de aprobación: 70 puntos).
              </div>
            </div>
          </div>
        </div>


        {/* ================= PAGE 2 (REVERSO) ================= */}
        <div className="bulletin-page bulletin-page-2" style={{ backgroundColor: '#ffffff', color: '#000000', padding: '1.5in 1.2in', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', boxSizing: 'border-box', position: 'relative' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', display: 'flex' }}>
            <div style={{ flex: 1, backgroundColor: '#003876' }}></div>
            <div style={{ flex: 1, backgroundColor: '#ffffff' }}></div>
            <div style={{ flex: 1, backgroundColor: '#ce1126' }}></div>
          </div>

          <h3 style={{ borderBottom: '2px solid #000000', paddingBottom: '0.5rem', fontSize: '0.95rem', fontWeight: '900', textTransform: 'uppercase', margin: '0 0 1rem 0' }}>
            CONTROL DE ASISTENCIA Y RENDIMIENTO ANUAL
          </h3>

          {/* Attendance Table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Registro Mensual de Asistencia:</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 'bold' }}>
                  <th style={{ border: '1px solid #000000', padding: '0.4rem', textAlign: 'left' }}>Mes</th>
                  <th style={{ border: '1px solid #000000', padding: '0.4rem', textAlign: 'center' }}>Días Laborados</th>
                  <th style={{ border: '1px solid #000000', padding: '0.4rem', textAlign: 'center' }}>Asistencias (P)</th>
                  <th style={{ border: '1px solid #000000', padding: '0.4rem', textAlign: 'center' }}>Ausencias (A)</th>
                  <th style={{ border: '1px solid #000000', padding: '0.4rem', textAlign: 'center' }}>Tardanzas (T)</th>
                  <th style={{ border: '1px solid #000000', padding: '0.4rem', textAlign: 'center' }}>% Asistencia</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Agosto', days: 12 },
                  { name: 'Septiembre', days: 21 },
                  { name: 'Octubre', days: 22 },
                  { name: 'Noviembre', days: 20 },
                  { name: 'Diciembre', days: 15 },
                  { name: 'Enero', days: 20 },
                  { name: 'Febrero', days: 19 },
                  { name: 'Marzo', days: 21 },
                  { name: 'Abril', days: 20 },
                  { name: 'Mayo', days: 21 },
                  { name: 'Junio', days: 10 }
                ].map((m) => {
                  const stats = getMonthlyAttendanceStats(student.id, m.name, m.days);
                  return (
                    <tr key={m.name}>
                      <td style={{ border: '1px solid #000000', padding: '0.35rem 0.4rem', fontWeight: 'bold' }}>{m.name}</td>
                      <td style={{ border: '1px solid #000000', padding: '0.35rem 0.4rem', textAlign: 'center' }}>{stats.workedDays}</td>
                      <td style={{ border: '1px solid #000000', padding: '0.35rem 0.4rem', textAlign: 'center' }}>{stats.present}</td>
                      <td style={{ border: '1px solid #000000', padding: '0.35rem 0.4rem', textAlign: 'center' }}>{stats.absent}</td>
                      <td style={{ border: '1px solid #000000', padding: '0.35rem 0.4rem', textAlign: 'center' }}>{stats.late}</td>
                      <td style={{ border: '1px solid #000000', padding: '0.35rem 0.4rem', textAlign: 'center', fontWeight: 'bold', backgroundColor: stats.pct < 80 ? '#fee2e2' : 'transparent' }}>{stats.pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pedagogical Observations Comment Box */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 0.4rem 0' }}>Observaciones Pedagógicas del Docente:</h4>
            <div className="no-print-textarea-wrapper">
              <textarea 
                className="no-print-textarea"
                value={currentCommentVal} 
                onChange={(e) => setStudentComments(prev => ({ ...prev, [student.id]: e.target.value }))}
                placeholder={autoComment}
                style={{ width: '100%', minHeight: '90px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #000000', fontSize: '0.78rem', resize: 'none', display: 'block', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div className="print-only-text" style={{ display: 'none', border: '1px solid #000000', padding: '0.5rem', borderRadius: '4px', minHeight: '90px', fontSize: '0.78rem', boxSizing: 'border-box', whiteSpace: 'pre-wrap' }}>
              {displayComment}
            </div>
          </div>

          {/* Promotion Final Condition Panel */}
          <div style={{ border: '1px solid #000000', padding: '0.75rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', fontSize: '0.85rem', backgroundColor: '#f8fafc' }}>
            <div>
              <strong>Condición Académica Final:</strong>
              <span style={{ marginLeft: '0.5rem', fontWeight: '900', color: allFinalPassed ? '#15803d' : '#b91c1c', border: '2px solid', padding: '0.2rem 0.6rem', borderRadius: '4px', display: 'inline-block', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                {finalConditionLabel}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontWeight: 'bold' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <input type="checkbox" checked={allFinalPassed} readOnly style={{ transform: 'scale(1.2)' }} /> PROMOVIDO
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <input type="checkbox" checked={!allFinalPassed} readOnly style={{ transform: 'scale(1.2)' }} /> REPITENTE / PENDIENTE
              </label>
            </div>
          </div>

          {/* Official Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3.5rem', borderTop: '1px dashed #94a3b8', paddingTop: '1.5rem', fontSize: '0.8rem', color: '#000000' }}>
            <div style={{ textAlign: 'center', width: '40%' }}>
              <div style={{ borderBottom: '1px solid #000000', width: '220px', margin: '0 auto 0.4rem auto' }}></div>
              <strong>Maestro(a) Encargado(a) del Grado</strong>
            </div>
            <div style={{ textAlign: 'center', width: '40%' }}>
              <div style={{ borderBottom: '1px solid #000000', width: '220px', margin: '0 auto 0.4rem auto' }}></div>
              <strong>Director(a) del Centro Educativo</strong>
            </div>
            <div style={{ textAlign: 'center', width: '20%' }}>
              <div style={{ border: '1px solid #000000', width: '100px', height: '60px', margin: '0 auto 0.4rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', color: '#64748b' }}>
                SELLO
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

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
            <div 
              className="header-logo" 
              onClick={() => { setActiveTab('dashboard'); setClassroomGrade(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
              title="Ir a Inicio"
            >
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
                <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setClassroomGrade(null); setSidebarCollapsed(true); }}>
                  <span style={{ fontSize: '1.1rem' }}>🏠</span> Inicio
                </div>
                <div className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => { setActiveTab('teachers'); setSidebarCollapsed(true); }}>
                  <span style={{ fontSize: '1.1rem' }}>👨‍🏫</span> Asignación Docentes
                </div>
                <div className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => { setActiveTab('students'); setSidebarCollapsed(true); }}>
                  <span style={{ fontSize: '1.1rem' }}>🎒</span> Estudiantes por Grado
                </div>
                <div className={`nav-item ${activeTab === 'admin_grades' ? 'active' : ''}`} onClick={() => { setActiveTab('admin_grades'); setSidebarCollapsed(true); }}>
                  <span style={{ fontSize: '1.1rem' }}>📊</span> Control Calificaciones
                </div>
                <div className={`nav-item ${activeTab === 'admin_attendance' ? 'active' : ''}`} onClick={() => { setActiveTab('admin_attendance'); setSidebarCollapsed(true); }}>
                  <span style={{ fontSize: '1.1rem' }}>📅</span> Control Asistencia
                </div>
                <div className={`nav-item ${activeTab === 'general_grades_registry' ? 'active' : ''}`} onClick={() => { setActiveTab('general_grades_registry'); setSidebarCollapsed(true); }}>
                  <span style={{ fontSize: '1.1rem' }}>📋</span> Registro General
                </div>
                <div className={`nav-item ${activeTab === 'bulletin' ? 'active' : ''}`} onClick={() => { setActiveTab('bulletin'); setSidebarCollapsed(true); }}>
                  <span style={{ fontSize: '1.1rem' }}>📄</span> Boletín Calificaciones
                </div>
                <div className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => { setActiveTab('reports'); setSidebarCollapsed(true); }}>
                  <span style={{ fontSize: '1.1rem' }}>🚨</span> Reportes e Incidencias
                </div>
                <div className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => { setActiveTab('calendar'); setSidebarCollapsed(true); }}>
                  <span style={{ fontSize: '1.1rem' }}>🗓️</span> Calendario Escolar
                </div>
                <div className={`nav-item ${activeTab === 'instructions' ? 'active' : ''}`} onClick={() => { setActiveTab('instructions'); setSidebarCollapsed(true); }}>
                  <span style={{ fontSize: '1.1rem' }}>📖</span> Manual / Instructivo
                </div>
              </div>
            </aside>

            <section className="content-area" style={{ minWidth: 0 }}>
              {activeTab === 'dashboard' && (
                <div>
                  {classroomGrade === null ? (
                    <>
                      {/* Greeting Card with flat illustration banner */}
                      <div className="glass-panel welcome-banner-card" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, #003876 0%, #00224a 100%)', color: '#ffffff', border: 'none', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffc107', display: 'block', marginBottom: '0.5rem' }}>Plataforma Oficial MINERD</span>
                          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>Panel de Control: {currentUser.name}</h2>
                          <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0 }}>
                            Gestiona y supervisa las asignaciones de docentes, matrícula escolar de estudiantes de cada grado, y supervise el rendimiento general en tiempo real.
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

                      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
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

                      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--primary)' }}>Grados y Aulas</h2>
                      <div className="classroom-grid">
                        {grades.map((g, idx) => {
                          const theme = getGradeThemeInfo(g);
                          const bannerBg = `linear-gradient(135deg, ${theme.color} 0%, ${theme.colorSecondary || theme.color} 100%)`;
                          const gradeStudents = students.filter(s => s.grade === g);

                          return (
                            <div key={g} className="classroom-card animate-fade-in" onClick={() => setClassroomGrade(g)}>
                              <div className="classroom-card-header" style={{ background: bannerBg }}>
                                <div className="classroom-card-pattern"></div>
                                <h3 className="classroom-card-grade">{g}</h3>
                                <span className="classroom-card-sub">Nivel Secundario</span>
                              </div>
                              <div className="classroom-card-body">
                                <p className="classroom-card-info">
                                  <strong>{gradeStudents.length}</strong> estudiantes matriculados en este grado.
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Liceo Ana Rosa Castillo</span>
                                  <div className="classroom-card-action-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <button className="back-to-inicio-btn" onClick={() => setClassroomGrade(null)}>
                        ← Volver a Inicio
                      </button>

                      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                        Asignaturas en {classroomGrade}
                      </h2>

                      <div className="classroom-grid">
                        {Object.keys(getSubjectsForGrade(subjects, classroomGrade)).map((subKey, idx) => {
                          const theme = getGradeThemeInfo(classroomGrade);
                          const bannerBg = `linear-gradient(135deg, ${theme.color} 0%, ${theme.colorSecondary || theme.color} 100%)`;
                          const subName = subjects[subKey]?.name || subKey;
                          const teacherName = getSubjectTeacherName(classroomGrade, subKey);

                          return (
                            <div 
                              key={subKey} 
                              className="classroom-card animate-fade-in" 
                              onClick={() => {
                                setSelectedAdminReportGrade(classroomGrade);
                                setExpandedReportSubjects({ [subKey]: true });
                                setClassroomGrade(null); // Clear sub-view
                                setActiveTab('admin_grades');
                                setSidebarCollapsed(true);
                              }}
                            >
                              <div className="classroom-card-header" style={{ background: bannerBg }}>
                                <div className="classroom-card-pattern"></div>
                                <h3 className="classroom-card-grade" style={{ fontSize: '1.15rem' }}>{subName} ({teacherName})</h3>
                                <span className="classroom-card-sub">{classroomGrade}</span>
                              </div>
                              <div className="classroom-card-body">
                                <p className="classroom-card-info">
                                  Haz clic para supervisar las calificaciones de esta asignatura.
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Docente: {teacherName}</span>
                                  <div className="classroom-card-action-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
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
                                <th>Aula Tutor (Encargado)</th>
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
                                    <select 
                                      className="form-select"
                                      value={u.classroomGrade || ''}
                                      onChange={(e) => handleUpdateClassroomGrade(u.id, e.target.value)}
                                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', minWidth: '120px' }}
                                    >
                                      <option value="">-- Sin Aula Tutor --</option>
                                      {grades.map(g => (
                                        <option key={g} value={g}>{g}</option>
                                      ))}
                                    </select>
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
                                      {(() => {
                                        const defaultG = grades[0] || '1ro A';
                                        const defaultSubs = Object.keys(getSubjectsForGrade(subjects, defaultG));
                                        const defaultS = defaultSubs[0] || 'matematica';
                                        const rowForm = rowAssignmentForms[u.id] || { grade: defaultG, subject: defaultS };
                                        const rowSubs = Object.keys(getSubjectsForGrade(subjects, rowForm.grade));

                                        return (
                                          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                                            <select 
                                              className="form-select-compact" 
                                              style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', minWidth: '85px' }}
                                              value={rowForm.grade}
                                              onChange={(e) => {
                                                const selectedG = e.target.value;
                                                const availSubs = Object.keys(getSubjectsForGrade(subjects, selectedG));
                                                setRowAssignmentForms(prev => ({
                                                  ...prev,
                                                  [u.id]: {
                                                    grade: selectedG,
                                                    subject: availSubs[0] || 'matematica'
                                                  }
                                                }));
                                              }}
                                            >
                                              {grades.map(g => (
                                                <option key={g} value={g}>{g}</option>
                                              ))}
                                            </select>
                                            <select 
                                              className="form-select-compact" 
                                              style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', minWidth: '95px' }}
                                              value={rowForm.subject}
                                              onChange={(e) => {
                                                const selectedS = e.target.value;
                                                setRowAssignmentForms(prev => ({
                                                  ...prev,
                                                  [u.id]: {
                                                    ...rowForm,
                                                    subject: selectedS
                                                  }
                                                }));
                                              }}
                                            >
                                              {rowSubs.map(subKey => (
                                                <option key={subKey} value={subKey}>{subjects[subKey]?.name || subKey}</option>
                                              ))}
                                            </select>
                                            <button 
                                              className="btn-primary" 
                                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }} 
                                              onClick={() => handleAddAssignment(u.id, rowForm.grade, rowForm.subject)}
                                            >
                                              ＋ Asignar
                                            </button>
                                          </div>
                                        );
                                      })()}
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
                        {/* Selector de Grado Activo para Gestión */}
                        <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--primary)' }}>Filtrar por Grado:</span>
                          <select 
                            className="form-select-compact" 
                            style={{ minWidth: '180px', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                            value={selectedConfigSubjectGrade} 
                            onChange={(e) => {
                              setSelectedConfigSubjectGrade(e.target.value);
                              setEditingSubjectKey(null);
                            }}
                          >
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            (Gestiona qué materias cursa este grado en particular)
                          </span>
                        </div>

                        {/* Left Side: Table of Subjects for the active Grade */}
                        <div className="custom-table-container" style={{ margin: 0 }}>
                          <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)' }}>
                            Asignaturas en el Grado <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{selectedConfigSubjectGrade}</span>
                          </h4>
                          <table className="custom-table">
                            <thead>
                              <tr>
                                <th>Identificador (Slug)</th>
                                <th>Nombre Completo</th>
                                <th>Etiqueta Color</th>
                                <th style={{ width: '200px', textAlign: 'center' }}>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const gradeSubs = getSubjectsForGrade(subjects, selectedConfigSubjectGrade);
                                const keys = Object.keys(gradeSubs);
                                if (keys.length === 0) {
                                  return (
                                    <tr>
                                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                        No hay asignaturas asignadas a este grado. Asigna una existente o crea una nueva a la derecha.
                                      </td>
                                    </tr>
                                  );
                                }
                                return keys.map(subKey => {
                                  const sub = gradeSubs[subKey];
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
                                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                          <button 
                                            type="button"
                                            className="btn-secondary" 
                                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}
                                            onClick={() => {
                                              setEditingSubjectKey(subKey);
                                              setEditingSubjectForm({ name: sub.name, color: sub.color });
                                            }}
                                          >
                                            ✏️ Editar
                                          </button>
                                          <button 
                                            type="button"
                                            className="btn-delete-event" 
                                            onClick={() => handleRemoveSubjectFromGrade(subKey, selectedConfigSubjectGrade)}
                                            style={{ color: 'var(--danger)', fontWeight: 'bold', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                                            title="Quitar del Grado"
                                          >
                                            ✕ Quitar
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>

                        {/* Right Side: Configuration Panels */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          {editingSubjectKey ? (
                            /* PANEL: EDIT SUBJECT NAME & COLOR */
                            <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--primary)', borderRadius: '8px' }}>
                              <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>✏️ Editar Asignatura</span>
                                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', opacity: 0.7 }}>{editingSubjectKey}</span>
                              </h4>
                              <form onSubmit={handleUpdateSubject} className="add-event-form">
                                <div className="form-group-compact">
                                  <label>Nombre de la Materia</label>
                                  <input 
                                    type="text" 
                                    className="form-input-compact" 
                                    value={editingSubjectForm.name} 
                                    onChange={(e) => setEditingSubjectForm(prev => ({ ...prev, name: e.target.value }))} 
                                    required 
                                  />
                                </div>
                                <div className="form-group-compact">
                                  <label>Color de la Marca</label>
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input 
                                      type="color" 
                                      className="form-input-compact" 
                                      style={{ width: '45px', height: '35px', padding: '2px', cursor: 'pointer' }}
                                      value={editingSubjectForm.color} 
                                      onChange={(e) => setEditingSubjectForm(prev => ({ ...prev, color: e.target.value }))} 
                                      required 
                                    />
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{editingSubjectForm.color}</span>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
                                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem' }}>Actualizar</button>
                                  <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem' }} onClick={() => setEditingSubjectKey(null)}>Cancelar</button>
                                </div>
                              </form>
                            </div>
                          ) : (
                            <>
                              {/* PANEL 1: ASSIGN EXISTING SUBJECT */}
                              <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--primary)' }}>Asignar Materia Existente</h4>
                                {(() => {
                                  const unassigned = Object.keys(subjects).filter(key => {
                                    const sub = subjects[key];
                                    return !sub.grades || !sub.grades.includes(selectedConfigSubjectGrade);
                                  });
                                  if (unassigned.length === 0) {
                                    return (
                                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                                        Todas las asignaturas del catálogo ya están asignadas a este grado.
                                      </p>
                                    );
                                  }
                                  return (
                                    <div>
                                      <div className="form-group-compact">
                                        <label>Seleccionar Asignatura</label>
                                        <select id="assign-sub-select" className="form-select-compact" style={{ width: '100%' }}>
                                          {unassigned.map(key => (
                                            <option key={key} value={key}>{subjects[key].name}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <button 
                                        type="button" 
                                        className="btn-primary" 
                                        style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', fontSize: '0.8rem', marginTop: '0.25rem' }}
                                        onClick={() => {
                                          const val = document.getElementById('assign-sub-select')?.value;
                                          if (val) {
                                            handleAssignSubjectToGrade(val, selectedConfigSubjectGrade);
                                          }
                                        }}
                                      >
                                        ＋ Asignar a este Grado
                                      </button>
                                    </div>
                                  );
                                })()}
                              </div>

                              {/* PANEL 2: CREATE & ASSIGN NEW SUBJECT */}
                              <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
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
                                  <button type="submit" className="btn-add-event-submit" style={{ marginTop: '0.5rem' }}>Crear y Asignar</button>
                                </form>
                              </div>
                            </>
                          )}
                          <div style={{ marginTop: '1rem' }}>
                            <button 
                              type="button" 
                              className="btn-primary" 
                              style={{ 
                                width: '100%', 
                                padding: '0.65rem', 
                                backgroundColor: 'var(--success)', 
                                borderColor: 'var(--success)',
                                color: '#fff',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(25, 135, 84, 0.15)'
                              }}
                              onClick={handleSaveSubjectsToCloud}
                              disabled={savingSubjects}
                            >
                              {savingSubjects ? '💾 Guardando...' : '💾 Guardar Cambios en la Nube'}
                            </button>
                          </div>
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
                                <th style={{ width: '200px', textAlign: 'center' }}>Acciones</th>
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
                                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                        <button 
                                          type="button"
                                          className="btn-secondary" 
                                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}
                                          onClick={() => {
                                            setEditingGradeName(g);
                                            setEditingGradeForm({ name: g });
                                          }}
                                        >
                                          ✏️ Editar
                                        </button>
                                        <button 
                                          type="button"
                                          className="btn-delete-event" 
                                          onClick={() => handleDeleteGrade(g)}
                                          style={{ color: 'var(--danger)', fontWeight: 'bold', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                                          title="Eliminar Grado"
                                        >
                                          ✕ Eliminar
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Right Side: Add/Edit Grade Form */}
                        <div>
                          {editingGradeName ? (
                            <div className="glass-panel" style={{ padding: '1.25rem', alignSelf: 'start', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--primary)', borderRadius: '8px' }}>
                              <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--primary)' }}>✏️ Editar Grado</h4>
                              <form onSubmit={handleUpdateGrade} className="add-event-form">
                                <div className="form-group-compact">
                                  <label>Nombre del Grado</label>
                                  <input 
                                    type="text" 
                                    className="form-input-compact" 
                                    value={editingGradeForm.name} 
                                    onChange={(e) => setEditingGradeForm(prev => ({ ...prev, name: e.target.value }))} 
                                    required 
                                  />
                                </div>
                                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
                                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem' }}>Actualizar</button>
                                  <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem' }} onClick={() => setEditingGradeName(null)}>Cancelar</button>
                                </div>
                              </form>
                            </div>
                          ) : (
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
                          )}
                          <div style={{ marginTop: '1rem' }}>
                            <button 
                              type="button" 
                              className="btn-primary" 
                              style={{ 
                                width: '100%', 
                                padding: '0.65rem', 
                                backgroundColor: 'var(--success)', 
                                borderColor: 'var(--success)',
                                color: '#fff',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(25, 135, 84, 0.15)'
                              }}
                              onClick={handleSaveGradesToCloud}
                              disabled={savingGrades}
                            >
                              {savingGrades ? '💾 Guardando...' : '💾 Guardar Cambios en la Nube'}
                            </button>
                          </div>
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

              {activeTab === 'general_grades_registry' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h2>Registro de Calificación General</h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '-1rem', marginBottom: '0.5rem' }}>
                    Supervisión completa del registro oficial por competencias para cada asignatura del grado.
                  </p>

                  {/* Horizontal Grades Bar */}
                  <div className="report-grades-bar" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    {grades.map(g => {
                      const theme = getGradeThemeInfo(g);
                      const isSelected = selectedAdminReportGrade === g;
                      return (
                        <button 
                          key={g} 
                          className="btn-secondary"
                          onClick={() => {
                            setSelectedAdminReportGrade(g);
                            const gradeSubjects = Object.keys(getSubjectsForGrade(subjects, g));
                            if (gradeSubjects.length > 0 && !gradeSubjects.includes(selectedAdminReportSubject)) {
                              setSelectedAdminReportSubject(gradeSubjects[0]);
                            }
                          }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.4rem', 
                            fontWeight: 'bold',
                            borderBottom: isSelected ? `3px solid ${theme.color}` : 'none',
                            color: isSelected ? theme.color : 'inherit',
                            backgroundColor: isSelected ? theme.bg : ''
                          }}
                        >
                          🏫 {g}
                        </button>
                      );
                    })}
                  </div>

                  {/* Horizontal Subjects Tabs for selected grade */}
                  {selectedAdminReportGrade && (
                    <div className="subject-tabs-container" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                      {Object.keys(getSubjectsForGrade(subjects, selectedAdminReportGrade)).map(subKey => {
                        const sub = subjects[subKey];
                        const isSelected = selectedAdminReportSubject === subKey;
                        const theme = getGradeThemeInfo(selectedAdminReportGrade);
                        return (
                          <button 
                            key={subKey} 
                            className={`subject-tab ${isSelected ? 'active' : ''}`} 
                            onClick={() => setSelectedAdminReportSubject(subKey)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              borderBottom: isSelected ? `2.5px solid ${theme.color}` : '2.5px solid transparent',
                              color: isSelected ? theme.color : 'var(--text-secondary)',
                              fontWeight: isSelected ? '700' : '500'
                            }}
                          >
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: sub.color || 'var(--text-muted)' }}></span>
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Render Detailed MINERD Table for the selected subject and grade */}
                  {selectedAdminReportGrade && selectedAdminReportSubject ? (
                    (() => {
                      const theme = getGradeThemeInfo(selectedAdminReportGrade);
                      const subName = subjects[selectedAdminReportSubject]?.name || selectedAdminReportSubject;
                      const gradeStudents = students.filter(s => s.grade === selectedAdminReportGrade);
                      const compCodes = getCompetencyCodesForSubject(selectedAdminReportSubject);

                      return (
                        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', overflow: 'hidden' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                              <h3 style={{ margin: 0, color: theme.color, fontSize: '1.25rem', fontWeight: '800' }}>
                                {subName.toUpperCase()}
                              </h3>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Registro Oficial Escolar &bull; Grado: {selectedAdminReportGrade}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.82rem', padding: '0.3rem 0.6rem', border: `1px solid ${theme.color}`, borderRadius: '4px', backgroundColor: theme.bg, color: theme.color, fontWeight: 'bold' }}>
                              {theme.ciclo} &bull; {theme.nivel}
                            </div>
                          </div>

                          <div className="custom-table-container" style={{ overflowX: 'auto', maxWidth: '100%', display: 'block', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                            <table className="custom-table" style={{ tableLayout: 'auto', minWidth: '1800px', width: '100%', margin: 0 }}>
                              <thead>
                                {/* Row 1: Competencies column groups */}
                                <tr>
                                  <th rowSpan={2} style={{ width: '40px', verticalAlign: 'middle', textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>#</th>
                                  <th rowSpan={2} style={{ minWidth: '180px', verticalAlign: 'middle', borderRight: '1px solid var(--border-color)' }}>Estudiante</th>
                                  
                                  {/* CE1 */}
                                  <th colSpan={8} style={{ textAlign: 'center', backgroundColor: 'rgba(14, 112, 51, 0.05)', color: 'var(--text-primary)', borderRight: '1.5px solid var(--border-color)', fontSize: '0.82rem', padding: '0.4rem' }}>
                                    <strong>{compCodes.c1}</strong>
                                  </th>
                                  
                                  {/* CE2 */}
                                  <th colSpan={8} style={{ textAlign: 'center', backgroundColor: 'rgba(0, 132, 200, 0.05)', color: 'var(--text-primary)', borderRight: '1.5px solid var(--border-color)', fontSize: '0.82rem', padding: '0.4rem' }}>
                                    <strong>{compCodes.c2}</strong>
                                  </th>

                                  {/* CE3 */}
                                  <th colSpan={8} style={{ textAlign: 'center', backgroundColor: 'rgba(184, 84, 28, 0.05)', color: 'var(--text-primary)', borderRight: '1.5px solid var(--border-color)', fontSize: '0.82rem', padding: '0.4rem' }}>
                                    <strong>{compCodes.c3}</strong>
                                  </th>

                                  {/* CE4 */}
                                  <th colSpan={8} style={{ textAlign: 'center', backgroundColor: 'rgba(209, 27, 93, 0.05)', color: 'var(--text-primary)', borderRight: '1.5px solid var(--border-color)', fontSize: '0.82rem', padding: '0.4rem' }}>
                                    <strong>{compCodes.c4}</strong>
                                  </th>

                                  {/* Promedio Competencias */}
                                  <th colSpan={4} style={{ textAlign: 'center', backgroundColor: 'var(--bg-secondary)', color: 'var(--primary)', borderRight: '1.5px solid var(--border-color)', fontSize: '0.82rem', padding: '0.4rem' }}>
                                    <strong>Promedio Competencias</strong>
                                  </th>

                                  {/* Calificación Final */}
                                  <th rowSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle', backgroundColor: '#f1f5f9', fontWeight: '800', fontSize: '0.85rem', width: '80px' }}>Calif. Final</th>
                                </tr>

                                {/* Row 2: P1..P4 RP1..RP4 details */}
                                <tr>
                                  {/* CE1 subheaders */}
                                  {['P1', 'RP1', 'P2', 'RP2', 'P3', 'RP3', 'P4', 'RP4'].map((h, i) => (
                                    <th key={`ce1_${h}`} style={{ textAlign: 'center', fontSize: '0.72rem', width: '45px', borderRight: i === 7 ? '1.5px solid var(--border-color)' : '' }}>{h}</th>
                                  ))}
                                  {/* CE2 subheaders */}
                                  {['P1', 'RP1', 'P2', 'RP2', 'P3', 'RP3', 'P4', 'RP4'].map((h, i) => (
                                    <th key={`ce2_${h}`} style={{ textAlign: 'center', fontSize: '0.72rem', width: '45px', borderRight: i === 7 ? '1.5px solid var(--border-color)' : '' }}>{h}</th>
                                  ))}
                                  {/* CE3 subheaders */}
                                  {['P1', 'RP1', 'P2', 'RP2', 'P3', 'RP3', 'P4', 'RP4'].map((h, i) => (
                                    <th key={`ce3_${h}`} style={{ textAlign: 'center', fontSize: '0.72rem', width: '45px', borderRight: i === 7 ? '1.5px solid var(--border-color)' : '' }}>{h}</th>
                                  ))}
                                  {/* CE4 subheaders */}
                                  {['P1', 'RP1', 'P2', 'RP2', 'P3', 'RP3', 'P4', 'RP4'].map((h, i) => (
                                    <th key={`ce4_${h}`} style={{ textAlign: 'center', fontSize: '0.72rem', width: '45px', borderRight: i === 7 ? '1.5px solid var(--border-color)' : '' }}>{h}</th>
                                  ))}
                                  {/* Promedio columns subheaders */}
                                  <th style={{ textAlign: 'center', fontSize: '0.72rem', width: '55px', backgroundColor: 'var(--bg-secondary)' }}>P.C1</th>
                                  <th style={{ textAlign: 'center', fontSize: '0.72rem', width: '55px', backgroundColor: 'var(--bg-secondary)' }}>P.C2</th>
                                  <th style={{ textAlign: 'center', fontSize: '0.72rem', width: '55px', backgroundColor: 'var(--bg-secondary)' }}>P.C3</th>
                                  <th style={{ textAlign: 'center', fontSize: '0.72rem', width: '55px', backgroundColor: 'var(--bg-secondary)', borderRight: '1.5px solid var(--border-color)' }}>P.C4</th>
                                </tr>
                              </thead>
                              <tbody>
                                {gradeStudents.length === 0 ? (
                                  <tr>
                                    <td colSpan={39} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                      No hay estudiantes matriculados en este grado.
                                    </td>
                                  </tr>
                                ) : (
                                  gradeStudents.map((s, sIdx) => {
                                    const blocks = ['bloque1', 'bloque2', 'bloque3', 'bloque4'];
                                    
                                    const baseGradesObj = {};
                                    const rpGradesObj = {};
                                    const effectiveGradesObj = {};

                                    blocks.forEach((bKey, bIdx) => {
                                      const baseArr = getCalculatedBlockGrades(
                                        s.id,
                                        selectedAdminReportGrade,
                                        selectedAdminReportSubject,
                                        bKey,
                                        evaluationConfigs,
                                        studentAssessments,
                                        (s.grades?.[selectedAdminReportSubject]?.[bKey] || [80, 80, 80, 80])
                                      );
                                      
                                      const rpKey = `${s.id}_${selectedAdminReportSubject}_${bKey}`;
                                      const rpArr = studentRpGrades[rpKey] || [null, null, null, null];

                                      baseGradesObj[bKey] = baseArr;
                                      rpGradesObj[bKey] = rpArr;
                                      
                                      effectiveGradesObj[bKey] = baseArr.map((g, pIdx) => 
                                        getEffectiveGrade(s.id, selectedAdminReportSubject, bKey, pIdx, g)
                                      );
                                    });

                                    const pcAverages = [
                                      (effectiveGradesObj.bloque1[0] + effectiveGradesObj.bloque1[1] + effectiveGradesObj.bloque1[2] + effectiveGradesObj.bloque1[3]) / 4,
                                      (effectiveGradesObj.bloque2[0] + effectiveGradesObj.bloque2[1] + effectiveGradesObj.bloque2[2] + effectiveGradesObj.bloque2[3]) / 4,
                                      (effectiveGradesObj.bloque3[0] + effectiveGradesObj.bloque3[1] + effectiveGradesObj.bloque3[2] + effectiveGradesObj.bloque3[3]) / 4,
                                      (effectiveGradesObj.bloque4[0] + effectiveGradesObj.bloque4[1] + effectiveGradesObj.bloque4[2] + effectiveGradesObj.bloque4[3]) / 4
                                    ];

                                    const cf = Math.round((pcAverages[0] + pcAverages[1] + pcAverages[2] + pcAverages[3]) / 4);

                                    return (
                                      <tr key={s.id}>
                                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', borderRight: '1px solid var(--border-color)' }}>{sIdx + 1}</td>
                                        <td style={{ fontWeight: 700, borderRight: '1px solid var(--border-color)' }}>{s.name}</td>

                                        {/* Render CE1 */}
                                        {effectiveGradesObj.bloque1.map((eff, pIdx) => {
                                          const base = baseGradesObj.bloque1[pIdx];
                                          const rp = rpGradesObj.bloque1[pIdx];
                                          const hasRp = rp !== null && rp !== undefined && rp !== '';
                                          const isLower = hasRp && Number(rp) < base;

                                          return (
                                            <React.Fragment key={`ce1_${pIdx}`}>
                                              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: base < 70 ? 'var(--danger)' : 'inherit' }}>{base.toFixed(0)}</td>
                                              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', borderRight: pIdx === 3 ? '1.5px solid var(--border-color)' : '', backgroundColor: isLower ? 'rgba(220, 53, 69, 0.12)' : (base < 70 ? 'rgba(239, 68, 68, 0.03)' : '') }}>
                                                {hasRp ? (
                                                  <span 
                                                    style={{
                                                      padding: '0.15rem 0.4rem',
                                                      borderRadius: '4px',
                                                      backgroundColor: isLower ? '#dc3545' : 'rgba(16, 185, 129, 0.2)',
                                                      color: isLower ? '#ffffff' : '#065f46',
                                                      fontWeight: 'bold',
                                                      fontSize: '0.8rem',
                                                      display: 'inline-block'
                                                    }}
                                                    title={isLower ? `RP (${Number(rp)}) es menor que la nota base (${base.toFixed(0)}). Prevalece la nota base.` : `RP (${Number(rp)}) aprobada.`}
                                                  >
                                                    {Number(rp).toFixed(0)}
                                                  </span>
                                                ) : '-'}
                                              </td>
                                            </React.Fragment>
                                          );
                                        })}

                                        {/* Render CE2 */}
                                        {effectiveGradesObj.bloque2.map((eff, pIdx) => {
                                          const base = baseGradesObj.bloque2[pIdx];
                                          const rp = rpGradesObj.bloque2[pIdx];
                                          const hasRp = rp !== null && rp !== undefined && rp !== '';
                                          const isLower = hasRp && Number(rp) < base;

                                          return (
                                            <React.Fragment key={`ce2_${pIdx}`}>
                                              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: base < 70 ? 'var(--danger)' : 'inherit' }}>{base.toFixed(0)}</td>
                                              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', borderRight: pIdx === 3 ? '1.5px solid var(--border-color)' : '', backgroundColor: isLower ? 'rgba(220, 53, 69, 0.12)' : (base < 70 ? 'rgba(239, 68, 68, 0.03)' : '') }}>
                                                {hasRp ? (
                                                  <span 
                                                    style={{
                                                      padding: '0.15rem 0.4rem',
                                                      borderRadius: '4px',
                                                      backgroundColor: isLower ? '#dc3545' : 'rgba(16, 185, 129, 0.2)',
                                                      color: isLower ? '#ffffff' : '#065f46',
                                                      fontWeight: 'bold',
                                                      fontSize: '0.8rem',
                                                      display: 'inline-block'
                                                    }}
                                                    title={isLower ? `RP (${Number(rp)}) es menor que la nota base (${base.toFixed(0)}). Prevalece la nota base.` : `RP (${Number(rp)}) aprobada.`}
                                                  >
                                                    {Number(rp).toFixed(0)}
                                                  </span>
                                                ) : '-'}
                                              </td>
                                            </React.Fragment>
                                          );
                                        })}

                                        {/* Render CE3 */}
                                        {effectiveGradesObj.bloque3.map((eff, pIdx) => {
                                          const base = baseGradesObj.bloque3[pIdx];
                                          const rp = rpGradesObj.bloque3[pIdx];
                                          const hasRp = rp !== null && rp !== undefined && rp !== '';
                                          const isLower = hasRp && Number(rp) < base;

                                          return (
                                            <React.Fragment key={`ce3_${pIdx}`}>
                                              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: base < 70 ? 'var(--danger)' : 'inherit' }}>{base.toFixed(0)}</td>
                                              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', borderRight: pIdx === 3 ? '1.5px solid var(--border-color)' : '', backgroundColor: isLower ? 'rgba(220, 53, 69, 0.12)' : (base < 70 ? 'rgba(239, 68, 68, 0.03)' : '') }}>
                                                {hasRp ? (
                                                  <span 
                                                    style={{
                                                      padding: '0.15rem 0.4rem',
                                                      borderRadius: '4px',
                                                      backgroundColor: isLower ? '#dc3545' : 'rgba(16, 185, 129, 0.2)',
                                                      color: isLower ? '#ffffff' : '#065f46',
                                                      fontWeight: 'bold',
                                                      fontSize: '0.8rem',
                                                      display: 'inline-block'
                                                    }}
                                                    title={isLower ? `RP (${Number(rp)}) es menor que la nota base (${base.toFixed(0)}). Prevalece la nota base.` : `RP (${Number(rp)}) aprobada.`}
                                                  >
                                                    {Number(rp).toFixed(0)}
                                                  </span>
                                                ) : '-'}
                                              </td>
                                            </React.Fragment>
                                          );
                                        })}

                                        {/* Render CE4 */}
                                        {effectiveGradesObj.bloque4.map((eff, pIdx) => {
                                          const base = baseGradesObj.bloque4[pIdx];
                                          const rp = rpGradesObj.bloque4[pIdx];
                                          const hasRp = rp !== null && rp !== undefined && rp !== '';
                                          const isLower = hasRp && Number(rp) < base;

                                          return (
                                            <React.Fragment key={`ce4_${pIdx}`}>
                                              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: base < 70 ? 'var(--danger)' : 'inherit' }}>{base.toFixed(0)}</td>
                                              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', borderRight: pIdx === 3 ? '1.5px solid var(--border-color)' : '', backgroundColor: isLower ? 'rgba(220, 53, 69, 0.12)' : (base < 70 ? 'rgba(239, 68, 68, 0.03)' : '') }}>
                                                {hasRp ? (
                                                  <span 
                                                    style={{
                                                      padding: '0.15rem 0.4rem',
                                                      borderRadius: '4px',
                                                      backgroundColor: isLower ? '#dc3545' : 'rgba(16, 185, 129, 0.2)',
                                                      color: isLower ? '#ffffff' : '#065f46',
                                                      fontWeight: 'bold',
                                                      fontSize: '0.8rem',
                                                      display: 'inline-block'
                                                    }}
                                                    title={isLower ? `RP (${Number(rp)}) es menor que la nota base (${base.toFixed(0)}). Prevalece la nota base.` : `RP (${Number(rp)}) aprobada.`}
                                                  >
                                                    {Number(rp).toFixed(0)}
                                                  </span>
                                                ) : '-'}
                                              </td>
                                            </React.Fragment>
                                          );
                                        })}

                                        {/* Averages columns */}
                                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold', backgroundColor: 'var(--bg-secondary)', color: pcAverages[0] < 70 ? 'var(--danger)' : 'inherit' }}>{pcAverages[0].toFixed(1)}</td>
                                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold', backgroundColor: 'var(--bg-secondary)', color: pcAverages[1] < 70 ? 'var(--danger)' : 'inherit' }}>{pcAverages[1].toFixed(1)}</td>
                                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold', backgroundColor: 'var(--bg-secondary)', color: pcAverages[2] < 70 ? 'var(--danger)' : 'inherit' }}>{pcAverages[2].toFixed(1)}</td>
                                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold', backgroundColor: 'var(--bg-secondary)', borderRight: '1.5px solid var(--border-color)', color: pcAverages[3] < 70 ? 'var(--danger)' : 'inherit' }}>{pcAverages[3].toFixed(1)}</td>

                                        {/* C.F. final cell */}
                                        <td style={{ textAlign: 'center', fontWeight: '800', backgroundColor: '#f1f5f9', color: cf < 70 ? 'var(--danger)' : 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '1.02rem' }}>
                                          {cf}
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                      Selecciona un grado y asignatura para ver la planilla general.
                    </div>
                  )}
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

                  {/* Official Grade Cover Banner */}
                  {selectedAdminReportGrade && renderGradeHeaderBanner(selectedAdminReportGrade)}

                  {/* Accordion List of Subjects for this Grade */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.keys(getSubjectsForGrade(subjects, selectedAdminReportGrade)).map(subKey => {
                      const sub = subjects[subKey];
                      const teacher = getAssignedTeacher(users, subjects, selectedAdminReportGrade, subKey);
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

              {activeTab === 'admin_attendance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h2>Control de Asistencia General</h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '-1rem', marginBottom: '0.5rem' }}>
                    Supervisa y descarga los registros de asistencia oficiales del MINERD para todos los grados y asignaturas del centro educativo.
                  </p>

                  {/* Horizontal Grades Bar */}
                  <div className="report-grades-bar" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    {grades.map(g => (
                      <button 
                        key={g} 
                        className={`btn-secondary ${selectedAdminAttendanceGrade === g ? 'btn-primary active-report-grade' : ''}`} 
                        onClick={() => setSelectedAdminAttendanceGrade(g)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold' }}
                      >
                        🏫 {g}
                      </button>
                    ))}
                  </div>

                  {/* Banner */}
                  {selectedAdminAttendanceGrade && renderGradeHeaderBanner(selectedAdminAttendanceGrade, 'Control de Asistencia Oficial')}

                  {/* MINERD Warning Banner */}
                  <div className="minerd-warning-banner">
                    <span className="minerd-warning-icon">⚠️</span>
                    <p className="minerd-warning-text">
                      <strong>Nota Oficial MINERD:</strong> Las únicas literales que se deben usar son: <strong>P</strong> (Presente), <strong>A</strong> (Ausente), <strong>E</strong> (Excusa), <strong>T</strong> (Tardanza), <strong>R</strong> (Retirado). No se deben dejar espacios en blanco y se deben escribir las razones en caso de no docencia.
                    </p>
                  </div>

                  {/* Subjects Accordion */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.keys(getSubjectsForGrade(subjects, selectedAdminAttendanceGrade)).map(subKey => {
                      const sub = subjects[subKey];
                      const teacher = getAssignedTeacher(users, subjects, selectedAdminAttendanceGrade, subKey);
                      const isExpanded = expandedAdminAttendanceSubjects[subKey];
                      const gradeStudents = students.filter(s => s.grade === selectedAdminAttendanceGrade);

                      return (
                        <div 
                          key={subKey} 
                          className="glass-panel" 
                          style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                        >
                          <div
                            className="accordion-header"
                            style={{
                              width: '100%',
                              padding: '1rem 1.25rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              background: isExpanded ? 'var(--primary-glow)' : 'var(--bg-secondary)',
                              borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
                              color: isExpanded ? 'var(--primary)' : 'var(--text-primary)',
                              fontWeight: 'bold',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: sub.color }}></span>
                              <strong style={{ fontSize: '1.05rem' }}>{sub.name}</strong>
                              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                                Docente: <strong>{teacher ? teacher.name : 'Sin docente asignado'}</strong>
                              </span>
                            </span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <button
                                className="btn btn-success"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  backgroundColor: '#107c41',
                                  color: '#ffffff',
                                  fontWeight: '700',
                                  fontSize: '0.8rem',
                                  padding: '0.45rem 0.9rem',
                                  borderRadius: '6px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 6px rgba(16, 124, 65, 0.2)'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  exportAttendanceToExcel(selectedAdminAttendanceGrade, subKey);
                                }}
                                title="Exportar asistencia de esta materia a Excel según plantilla oficial MINERD"
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                  <line x1="16" y1="13" x2="8" y2="13"></line>
                                  <line x1="16" y1="17" x2="8" y2="17"></line>
                                  <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                Exportar a Excel
                              </button>

                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: 'inherit',
                                  fontWeight: 'bold'
                                }}
                                onClick={() => setExpandedAdminAttendanceSubjects(prev => ({ ...prev, [subKey]: !prev[subKey] }))}
                              >
                                {isExpanded ? '▲ Ocultar' : '▼ Ver Asistencia'}
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="accordion-content animate-fade-in" style={{ padding: '1.25rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div className="attendance-month-tabs" style={{ marginBottom: 0 }}>
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
                              </div>

                              {(() => {
                                const activeColumns = [];
                                Array.from({ length: 21 }).forEach((_, idx) => {
                                  const dateKey = `${selectedAdminAttendanceGrade}_${subKey}_${selectedAttendanceMonth}_day_${idx}`;
                                  const dateVal = attendanceDayDates[dateKey] || '';
                                  if (dateVal.trim() !== '') {
                                    activeColumns.push(idx);
                                  }
                                });
                                const currentMonthWorkedDays = activeColumns.length;

                                return (
                                  <div className="custom-table-container">
                                    <table className="custom-table" style={{ tableLayout: 'fixed', width: '1000px' }}>
                                      <thead>
                                        <tr>
                                          <th rowSpan={2} style={{ width: '40px', verticalAlign: 'middle', textAlign: 'center' }}>#</th>
                                          <th rowSpan={2} style={{ width: '180px', verticalAlign: 'middle' }}>Estudiante</th>
                                          <th colSpan={21} style={{ textAlign: 'center', backgroundColor: '#e2e8f0', color: '#1e293b', fontWeight: '800', letterSpacing: '0.08em', fontSize: '0.85rem', padding: '0.5rem', borderBottom: '1.5px solid var(--border-color)' }}>
                                            DÍAS TRABAJADOS ({selectedAttendanceMonth})
                                          </th>
                                          <th rowSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle', width: '55px', fontWeight: 'bold' }}>T</th>
                                          <th rowSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle', width: '55px', fontWeight: 'bold' }}>%</th>
                                        </tr>
                                        <tr>
                                          {Array.from({ length: 21 }).map((_, idx) => (
                                            <th key={idx} style={{ textAlign: 'center', width: '32px', padding: '0.4rem 0.2rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                              {idx + 1}
                                            </th>
                                          ))}
                                        </tr>
                                        <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                                          <td></td>
                                          <td style={{ fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>
                                            DÍAS
                                          </td>
                                          {Array.from({ length: 21 }).map((_, idx) => {
                                            const dateKey = `${selectedAdminAttendanceGrade}_${subKey}_${selectedAttendanceMonth}_day_${idx}`;
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
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setAttendanceDayDatesAndSave(prev => ({
                                                      ...prev,
                                                      [dateKey]: val
                                                    }));
                                                  }}
                                                />
                                              </td>
                                            );
                                          })}
                                          <td style={{ padding: '0.2rem', textAlign: 'center', borderBottom: '2px solid var(--border-color)' }}>
                                            <div style={{ width: '28px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', border: '1.5px solid var(--primary)', borderRadius: '4px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', margin: '0 auto' }}>
                                              {currentMonthWorkedDays}
                                            </div>
                                          </td>
                                          <td style={{ borderBottom: '2px solid var(--border-color)' }}></td>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {gradeStudents.map((s, sIdx) => {
                                          let aCount = 0, eCount = 0, rCount = 0, tCount = 0, pCount = 0;
                                          Array.from({ length: 21 }).forEach((_, idx) => {
                                            const attendanceKey = `${s.id}_${subKey}_${selectedAttendanceMonth}_col_${idx}`;
                                            const status = studentAttendanceDetail[attendanceKey] || '';
                                            if (status === 'R') rCount++;

                                            const dateKey = `${selectedAdminAttendanceGrade}_${subKey}_${selectedAttendanceMonth}_day_${idx}`;
                                            const dateVal = attendanceDayDates[dateKey] || '';
                                            if (dateVal.trim() !== '') {
                                              if (status === 'A') aCount++;
                                              else if (status === 'E') eCount++;
                                              else if (status === 'T') tCount++;
                                              else if (status === 'P') pCount++;
                                            }
                                          });

                                          const activeDays = Math.max(0, currentMonthWorkedDays - rCount);
                                          const excuseAbsences = Math.floor(eCount / 3);
                                          const excusePresences = eCount - excuseAbsences;
                                          const finalPresentDays = pCount + tCount + excusePresences;
                                          const cappedT = Math.min(activeDays, finalPresentDays);
                                          const attendancePercentage = activeDays > 0 ? Math.round((cappedT / activeDays) * 100) : 0;
                                          const isRetiredStudent = rCount > 0;

                                          return (
                                            <tr key={s.id}>
                                              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{sIdx + 1}</td>
                                              <td style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</td>
                                              {Array.from({ length: 21 }).map((_, idx) => {
                                                const attendanceKey = `${s.id}_${subKey}_${selectedAttendanceMonth}_col_${idx}`;
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
                                                        
                                                        setStudentAttendanceDetailAndSave(prev => ({
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
                                              <td style={{ textAlign: 'center', fontWeight: 'bold', color: isRetiredStudent ? 'var(--danger)' : 'var(--success)', fontFamily: 'var(--font-mono)', fontSize: isRetiredStudent ? '0.78rem' : 'inherit' }}>
                                                {isRetiredStudent ? 'Retirado' : cappedT}
                                              </td>
                                              <td style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                                                {isRetiredStudent ? '-' : `${attendancePercentage}%`}
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
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && (
                <div>
                  <h2>Calendario Escolar</h2>
                  {renderCalendarComponent()}
                </div>
              )}

              {activeTab === 'reports' && (
                <div>
                  {renderReportsTabContent()}
                </div>
              )}

              {/* ADMIN: Tab Bulletin (Boletín de Calificaciones) */}
              {activeTab === 'bulletin' && (
                <div>
                  {/* Controls - Hide when printing */}
                  <div className="glass-panel no-print-element" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h2 style={{ margin: 0, color: 'var(--primary)', fontWeight: 800 }}>📄 Boletín Oficial de Calificaciones</h2>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Generación y descarga de boletines académicos a doble cara para cualquier grado del plantel.
                        </p>
                      </div>
                      {selectedBulletinStudentId && (
                        <button 
                          onClick={() => window.print()}
                          className="btn-primary" 
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#003876', border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem', fontWeight: 'bold', color: '#ffffff', cursor: 'pointer' }}
                        >
                          🖨️ Descargar / Imprimir Boletín (PDF)
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
                      {/* Grade Selector for Admin */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Seleccionar Grado</label>
                        <select
                          className="form-select"
                          value={adminBulletinGrade || ''}
                          onChange={(e) => { setAdminBulletinGrade(e.target.value); setSelectedBulletinStudentId(''); }}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                        >
                          <option value="">-- Seleccionar Grado --</option>
                          {grades.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>

                      {/* Student Selector for Admin */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Seleccionar Estudiante</label>
                        <select 
                          className="form-select" 
                          value={selectedBulletinStudentId} 
                          onChange={(e) => setSelectedBulletinStudentId(e.target.value)}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                          disabled={!adminBulletinGrade}
                        >
                          <option value="">-- Seleccionar Estudiante --</option>
                          {students.filter(s => s.grade === adminBulletinGrade).map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Custom Salidas - Only for 4th, 5th, 6th Grade */}
                      {['4to A', '5to A', '6to A'].includes(adminBulletinGrade) && (
                        <>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Asignatura Salida Optativa 1</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={salida1Name} 
                              onChange={(e) => setSalida1Name(e.target.value)}
                              placeholder="Química, Biología, etc."
                              style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Asignatura Salida Optativa 2</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={salida2Name} 
                              onChange={(e) => setSalida2Name(e.target.value)}
                              placeholder="Computación, etc."
                              style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {!adminBulletinGrade ? (
                    <div className="glass-panel text-center no-print-element" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
                      <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🏫</span>
                      <h3>Seleccione un Grado para comenzar</h3>
                      <p style={{ fontSize: '0.85rem' }}>Elija primero el grado y luego el estudiante para visualizar su Boletín Oficial.</p>
                    </div>
                  ) : !selectedBulletinStudentId ? (
                    <div className="glass-panel text-center no-print-element" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
                      <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📄</span>
                      <h3>Seleccione un estudiante de {adminBulletinGrade} para visualizar su Boletín Oficial</h3>
                      <p style={{ fontSize: '0.85rem' }}>El documento oficial se generará automáticamente a doble cara con los datos reales del registro escolar.</p>
                    </div>
                  ) : (
                    (() => {
                      const student = students.find(s => s.id === selectedBulletinStudentId);
                      if (!student) return null;
                      return renderBulletinContent(student, adminBulletinGrade);
                    })()
                  )}
                </div>
              )}

              {/* ADMIN: Tab Instructions */}
              {activeTab === 'instructions' && (
                <div>
                  <h2>Manual del Administrador</h2>
                  <div className="glass-card instruction-card">
                    <div className="instruction-step">
                      <div className="instruction-step-num">1</div>
                      <div>
                        <strong>Gestión de Docentes y Estructura Escolar</strong>
                        <p style={{ fontSize: '0.85rem' }}>En "Asignación Docentes" puedes registrar nuevos docentes, asignarlos a sus grados tutores y configurar el correo de coordinación y orientación para cada grado. Estos correos se usarán automáticamente al emitir reportes.</p>
                      </div>
                    </div>
                    <div className="instruction-step">
                      <div className="instruction-step-num">2</div>
                      <div>
                        <strong>Boletín de Calificaciones</strong>
                        <p style={{ fontSize: '0.85rem' }}>Desde la sección "Boletín Calificaciones" puedes generar el Boletín Oficial MINERD para cualquier estudiante de cualquier grado. Selecciona el grado, el estudiante y presiona Imprimir para obtener el PDF.</p>
                      </div>
                    </div>
                    <div className="instruction-step">
                      <div className="instruction-step-num">3</div>
                      <div>
                        <strong>Sistema de Reportes e Incidencias</strong>
                        <p style={{ fontSize: '0.85rem' }}>Desde "Reportes e Incidencias" puedes emitir reportes académicos o conductuales para cualquier alumno del plantel. Los reportes se guardan en el Archivo Digital organizado por Grado → Alumno → Fecha. Cada reporte puede enviarse directamente por correo al coordinador y orientador del grado.</p>
                      </div>
                    </div>
                    <div className="instruction-step">
                      <div className="instruction-step-num">4</div>
                      <div>
                        <strong>Configuración de Contactos para Reportes</strong>
                        <p style={{ fontSize: '0.85rem' }}>Para que los correos lleguen automáticamente al destinatario correcto, ve a "Asignación Docentes", expande el bloque de "Contactos de Coordinación por Grado" y configura el correo del Coordinador y Orientador para cada grado. Estos datos se guardan de forma permanente.</p>
                      </div>
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
          <div 
            className="header-logo" 
            onClick={() => { setActiveTab('dashboard'); setClassroomGrade(null); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
            title="Ir a Inicio"
          >
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
              <select className="form-select" value={selectedGrade} onChange={(e) => { setSelectedGrade(e.target.value); setActiveTab('grades'); setSidebarCollapsed(true); }}>
                {teacherUniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="sidebar-nav">
              <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setClassroomGrade(null); setSidebarCollapsed(true); }}>
                <span style={{ fontSize: '1.1rem' }}>🏠</span> Inicio
              </div>
              <div className={`nav-item ${activeTab === 'grades' ? 'active' : ''}`} onClick={() => { setActiveTab('grades'); setSidebarCollapsed(true); }}>
                <span style={{ fontSize: '1.1rem' }}>📊</span> Control de Calificaciones
              </div>
              <div className={`nav-item ${activeTab === 'instruments' ? 'active' : ''}`} onClick={() => {
                if (activeBloque === 'promedio_ce') {
                  setActiveBloque('bloque1');
                }
                setActiveTab('instruments');
                setSidebarCollapsed(true);
              }}>
                <span style={{ fontSize: '1.1rem' }}>📝</span> Instrumentos de Eval.
              </div>
              <div className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => { setActiveTab('attendance'); setSidebarCollapsed(true); }}>
                <span style={{ fontSize: '1.1rem' }}>📅</span> Control de Asistencia
              </div>
              <div className={`nav-item ${activeTab === 'bulletin' ? 'active' : ''}`} onClick={() => { setActiveTab('bulletin'); setSidebarCollapsed(true); }}>
                <span style={{ fontSize: '1.1rem' }}>📄</span> Boletín de Calificaciones
              </div>
              <div className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => { setActiveTab('reports'); setSidebarCollapsed(true); }}>
                <span style={{ fontSize: '1.1rem' }}>🚨</span> Reportes e Incidencias
              </div>
              <div className={`nav-item ${activeTab === 'instructions' ? 'active' : ''}`} onClick={() => { setActiveTab('instructions'); setSidebarCollapsed(true); }}>
                <span style={{ fontSize: '1.1rem' }}>📖</span> Instructivo de Uso
              </div>
              <div className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => { setActiveTab('calendar'); setSidebarCollapsed(true); }}>
                <span style={{ fontSize: '1.1rem' }}>🗓️</span> Calendario Escolar
              </div>
            </div>
          </aside>

          <section className="content-area" style={{ minWidth: 0 }}>
            {activeTab === 'dashboard' && (
              <div>
                {/* Greeting Card with flat illustration banner */}
                <div className="glass-panel welcome-banner-card-epic" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'center', marginBottom: '2rem', color: '#ffffff', border: 'none', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffb300', display: 'block', marginBottom: '0.5rem' }}>Plataforma Oficial MINERD</span>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>¡Hola de nuevo, {currentUser.name}!</h2>
                    <p style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: '500', fontStyle: 'italic', lineHeight: 1.5, margin: 0, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      💡 {randomQuote || "Que hoy sea un día excelente para inspirar y educar con el corazón."}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                    <img 
                      src="/dr_education_banner.png" 
                      alt="Bienvenido" 
                      style={{ width: '100%', maxWidth: '200px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }} 
                    />
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', display: 'flex' }}>
                    <div style={{ flex: 1, backgroundColor: '#003876' }}></div>
                    <div style={{ flex: 1, backgroundColor: '#ffffff' }}></div>
                    <div style={{ flex: 1, backgroundColor: '#ce1126' }}></div>
                  </div>
                </div>

                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--primary)' }}>Mis Asignaturas</h2>
                <div className="classroom-grid">
                  {currentUser.assignments.map((a, idx) => {
                    const theme = getGradeThemeInfo(a.grade);
                    const bannerBg = `linear-gradient(135deg, ${theme.color} 0%, ${theme.colorSecondary || theme.color} 100%)`;
                    const subjectName = subjects[a.subject]?.name || a.subject;

                    return (
                      <div 
                        key={`${a.grade}_${a.subject}`} 
                        className="classroom-card animate-fade-in" 
                        onClick={() => {
                          setSelectedGrade(a.grade);
                          setSelectedSubject(a.subject);
                          setActiveTab('grades');
                          setSidebarCollapsed(true);
                        }}
                      >
                        <div className="classroom-card-header" style={{ background: bannerBg }}>
                          <div className="classroom-card-pattern"></div>
                          <h3 className="classroom-card-grade" style={{ fontSize: '1.25rem' }}>{a.grade} {subjectName}</h3>
                          <span className="classroom-card-sub">Nivel Secundario</span>
                        </div>
                        <div className="classroom-card-body">
                          <p className="classroom-card-info">
                            Control de calificaciones, asistencia e instrumentos de evaluación para esta clase.
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Liceo Ana Rosa Castillo</span>
                            <div className="classroom-card-action-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TEACHER: Tab Grades (Criteria Columns or Summary Mode) */}
            {activeTab === 'grades' && (
              <div>
                {renderClassroomBreadcrumbs()}
                {renderClassroomTabs()}

                {selectedGrade ? (
                  renderGradeHeaderBanner(selectedGrade, 'Control de Calificaciones - ' + (subjects[selectedSubject]?.name || selectedSubject))
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2>Control de Calificaciones: <span style={{ color: 'var(--primary)' }}>Sin Selección</span></h2>
                    </div>
                  </div>
                )}

                {selectedGrade && (
                  <div className="minerd-warning-banner">
                    <span className="minerd-warning-icon">⚠️</span>
                    <p className="minerd-warning-text">
                      <strong>Nota Oficial MINERD:</strong> En el registro de grado no se deben hacer tachaduras ni trabajar con un lapicero distinto al designado. Además, en las calificaciones sólo se colocan datos numéricos (nada de letras).
                    </p>
                  </div>
                )}

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
                      {['bloque1', 'bloque2', 'bloque3', 'bloque4', 'promedio_ce', 'promocion_grado'].map((b) => (
                        <button 
                          key={b} 
                          className={`block-tab-btn ${activeBloque === b ? 'active' : ''}`}
                          onClick={() => setActiveBloque(b)}
                        >
                          {b === 'bloque1' ? 'Bloque CE1' :
                           b === 'bloque2' ? 'Bloque CE2-CE3' :
                           b === 'bloque3' ? 'Bloque CE4-CE7' :
                           b === 'bloque4' ? 'Bloque CE5-CE6' :
                           b === 'promedio_ce' ? 'Promedio de CE' : 'Promoción del Grado'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SPREADSHEET TABLE */}
                {selectedGrade && selectedSubject ? (
                  activeBloque === 'promocion_grado' ? (
                    /* Render Promoción del Grado View */
                    (() => {
                      return (
                        <div className="custom-table-container" style={{ overflowX: 'auto' }}>
                          <table className="custom-table" style={{ tableLayout: 'auto', minWidth: '1000px' }}>
                            <thead>
                              {/* Row 1: Main Section Headers */}
                              <tr>
                                <th rowSpan={2} style={{ width: '40px', verticalAlign: 'middle', textAlign: 'center' }}>#</th>
                                <th rowSpan={2} style={{ verticalAlign: 'middle', minWidth: '160px' }}>Estudiante</th>
                                <th rowSpan={2} style={{ verticalAlign: 'middle', textAlign: 'center', backgroundColor: '#e2e8f0', color: '#1e293b', fontWeight: '800', width: '60px' }}>C.F.</th>
                                
                                <th colSpan={4} style={{ textAlign: 'center', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: '800', fontSize: '0.82rem', padding: '0.4rem', borderBottom: '1.5px solid var(--border-color)' }}>
                                  CALIFICACIÓN COMPLETIVA
                                </th>
                                
                                <th colSpan={4} style={{ textAlign: 'center', backgroundColor: '#f1f5f9', color: '#0f172a', fontWeight: '800', fontSize: '0.82rem', padding: '0.4rem', borderBottom: '1.5px solid var(--border-color)' }}>
                                  CALIFICACIÓN EXTRAORDINARIA
                                </th>
                                
                                <th colSpan={2} style={{ textAlign: 'center', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: '800', fontSize: '0.82rem', padding: '0.4rem', borderBottom: '1.5px solid var(--border-color)' }}>
                                  CALIFICACIONES ESPECIALES
                                </th>
                                
                                <th colSpan={2} style={{ textAlign: 'center', backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '800', fontSize: '0.82rem', padding: '0.4rem', borderBottom: '1.5px solid var(--border-color)' }}>
                                  SITUACIÓN FINAL EN LA ASIGNATURA
                                </th>
                              </tr>
                              {/* Row 2: Sub-column Headers */}
                              <tr>
                                {/* Completiva columns */}
                                <th style={{ textAlign: 'center', fontSize: '0.72rem', backgroundColor: '#f8fafc', width: '70px' }}>50% C.F.</th>
                                <th style={{ textAlign: 'center', fontSize: '0.72rem', backgroundColor: '#f8fafc', width: '80px' }}>C.E.C.</th>
                                <th style={{ textAlign: 'center', fontSize: '0.72rem', backgroundColor: '#f8fafc', width: '70px' }}>50% C.E.C.</th>
                                <th style={{ textAlign: 'center', fontSize: '0.72rem', backgroundColor: '#f8fafc', width: '75px', fontWeight: 'bold' }}>C.C.F.</th>
                                
                                {/* Extraordinaria columns */}
                                <th style={{ textAlign: 'center', fontSize: '0.72rem', backgroundColor: '#f1f5f9', width: '70px' }}>30% C.F.</th>
                                <th style={{ textAlign: 'center', fontSize: '0.72rem', backgroundColor: '#f1f5f9', width: '80px' }}>C. E.EX.</th>
                                <th style={{ textAlign: 'center', fontSize: '0.72rem', backgroundColor: '#f1f5f9', width: '70px' }}>70% C.E.EX.</th>
                                <th style={{ textAlign: 'center', fontSize: '0.72rem', backgroundColor: '#f1f5f9', width: '75px', fontWeight: 'bold' }}>C.EX.F.</th>
                                
                                {/* Especiales columns */}
                                <th style={{ textAlign: 'center', fontSize: '0.72rem', backgroundColor: '#f8fafc', width: '70px' }}>C.F.</th>
                                <th style={{ textAlign: 'center', fontSize: '0.72rem', backgroundColor: '#f8fafc', width: '80px' }}>C.E.</th>
                                
                                {/* Situación final columns */}
                                <th style={{ textAlign: 'center', fontSize: '0.72rem', backgroundColor: '#e0f2fe', width: '70px', fontWeight: 'bold' }}>A</th>
                                <th style={{ textAlign: 'center', fontSize: '0.72rem', backgroundColor: '#e0f2fe', width: '70px', fontWeight: 'bold' }}>R</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentsFilteredByGrade.map((s, sIdx) => {
                                // Calculate C.F.
                                const pc1 = calculateBlockAvg(s.id, selectedSubject, 'bloque1', s.grades);
                                const pc2 = calculateBlockAvg(s.id, selectedSubject, 'bloque2', s.grades);
                                const pc3 = calculateBlockAvg(s.id, selectedSubject, 'bloque3', s.grades);
                                const pc4 = calculateBlockAvg(s.id, selectedSubject, 'bloque4', s.grades);
                                const cf = Math.round((pc1 + pc2 + pc3 + pc4) / 4);

                                // Retrieve promotion grades from state
                                const promoKey = `${s.id}_${selectedSubject}`;
                                const pData = promotionGrades[promoKey] || { cec: null, ceex: null, ce: null };
                                
                                const cecVal = pData.cec;
                                const ceexVal = pData.ceex;
                                const ceVal = pData.ce;

                                // Check retired status in any month
                                const months = ['09', '10', '11', '12', '01', '02', '03', '04', '05', '06'];
                                let isRetired = false;
                                months.forEach(m => {
                                  Array.from({ length: 21 }).forEach((_, idx) => {
                                    const attendanceKey = `${s.id}_${selectedSubject}_${m}_col_${idx}`;
                                    if (studentAttendanceDetail[attendanceKey] === 'R') {
                                      isRetired = true;
                                    }
                                  });
                                });

                                // --- Calculation logic following official MINERD registry ---
                                let finalA = '';
                                let finalR = '';

                                // 1. Calificación Completiva
                                let halfCf = '';
                                let halfCec = '';
                                let ccf = '';
                                
                                if (cf < 70 && !isRetired) {
                                  halfCf = (cf * 0.5).toFixed(1);
                                  if (cecVal !== null && cecVal !== undefined) {
                                    halfCec = (cecVal * 0.5).toFixed(1);
                                    ccf = Math.round(Number(halfCf) + Number(halfCec));
                                  }
                                }

                                // 2. Calificación Extraordinaria
                                let thirtyCf = '';
                                let seventyCeex = '';
                                let cexf = '';

                                if (cf < 70 && ccf !== '' && ccf < 70 && !isRetired) {
                                  thirtyCf = (cf * 0.3).toFixed(1);
                                  if (ceexVal !== null && ceexVal !== undefined) {
                                    seventyCeex = (ceexVal * 0.7).toFixed(1);
                                    cexf = Math.round(Number(thirtyCf) + Number(seventyCeex));
                                  }
                                }

                                // 3. Calificaciones Especiales
                                let specialFinal = '';
                                if (cf < 70 && cexf !== '' && cexf < 70 && !isRetired) {
                                  if (ceVal !== null && ceVal !== undefined) {
                                    specialFinal = Math.round(cf + ceVal);
                                  }
                                }

                                // --- final situation logic ---
                                if (isRetired) {
                                  finalR = 'Retirado';
                                } else if (cf >= 70) {
                                  finalA = cf;
                                } else {
                                  // Did they pass in completiva?
                                  if (ccf !== '') {
                                    if (ccf >= 70) {
                                      finalA = ccf;
                                    } else {
                                      // Did they pass in extraordinaria?
                                      if (cexf !== '') {
                                        if (cexf >= 70) {
                                          finalA = cexf;
                                        } else {
                                          // Did they take special?
                                          if (specialFinal !== '') {
                                            if (specialFinal >= 70) {
                                              finalA = specialFinal;
                                            } else {
                                              finalR = specialFinal;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }

                                return (
                                  <tr key={s.id} style={{ opacity: isRetired ? 0.6 : 1 }}>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{sIdx + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold', backgroundColor: '#e2e8f0' }}>{cf}</td>
                                    
                                    {/* Completiva cells */}
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{halfCf || '-'}</td>
                                    <td style={{ textAlign: 'center', padding: '0.2rem' }}>
                                      {cf < 70 && !isRetired ? (
                                        <input 
                                          type="number" 
                                          className="form-input-compact" 
                                          style={{ width: '60px', padding: '0.25rem', textAlign: 'center', margin: '0 auto', fontSize: '0.82rem', height: '28px' }}
                                          value={cecVal !== null && cecVal !== undefined ? cecVal : ''}
                                          onChange={(e) => handlePromotionGradeChange(s.id, 'cec', e.target.value)}
                                          min={0}
                                          max={100}
                                        />
                                      ) : '-'}
                                    </td>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{halfCec || '-'}</td>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold', backgroundColor: ccf !== '' && ccf >= 70 ? 'var(--success-bg)' : '' }}>
                                      {ccf || '-'}
                                    </td>
                                    
                                    {/* Extraordinaria cells */}
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{thirtyCf || '-'}</td>
                                    <td style={{ textAlign: 'center', padding: '0.2rem' }}>
                                      {cf < 70 && ccf !== '' && ccf < 70 && !isRetired ? (
                                        <input 
                                          type="number" 
                                          className="form-input-compact" 
                                          style={{ width: '60px', padding: '0.25rem', textAlign: 'center', margin: '0 auto', fontSize: '0.82rem', height: '28px' }}
                                          value={ceexVal !== null && ceexVal !== undefined ? ceexVal : ''}
                                          onChange={(e) => handlePromotionGradeChange(s.id, 'ceex', e.target.value)}
                                          min={0}
                                          max={100}
                                        />
                                      ) : '-'}
                                    </td>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{seventyCeex || '-'}</td>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 'bold', backgroundColor: cexf !== '' && cexf >= 70 ? 'var(--success-bg)' : '' }}>
                                      {cexf || '-'}
                                    </td>
                                    
                                    {/* Especiales cells */}
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{cf < 70 && cexf !== '' && cexf < 70 && !isRetired ? cf : '-'}</td>
                                    <td style={{ textAlign: 'center', padding: '0.2rem' }}>
                                      {cf < 70 && cexf !== '' && cexf < 70 && !isRetired ? (
                                        <input 
                                          type="number" 
                                          className="form-input-compact" 
                                          style={{ width: '60px', padding: '0.25rem', textAlign: 'center', margin: '0 auto', fontSize: '0.82rem', height: '28px' }}
                                          value={ceVal !== null && ceVal !== undefined ? ceVal : ''}
                                          onChange={(e) => handlePromotionGradeChange(s.id, 'ce', e.target.value)}
                                          min={0}
                                          max={100}
                                        />
                                      ) : '-'}
                                    </td>
                                    
                                    {/* Situación Final cells */}
                                    <td style={{ textAlign: 'center', fontWeight: '800', backgroundColor: finalA ? '#f0fdf4' : '', color: 'var(--success)', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>
                                      {finalA}
                                    </td>
                                    <td style={{ textAlign: 'center', fontWeight: '800', backgroundColor: finalR ? '#fef2f2' : '', color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: isRetired ? '0.75rem' : '1rem' }}>
                                      {finalR}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()
                  ) : activeBloque === 'promedio_ce' ? (
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
                      const showRP1 = studentsFilteredByGrade.some(s => {
                        const pVal = s.grades?.[selectedSubject]?.[activeBloque]?.[0] ?? 80;
                        const rpKey = `${s.id}_${selectedSubject}_${activeBloque}`;
                        const rpVal = studentRpGrades[rpKey]?.[0];
                        return pVal < 70 || (rpVal !== null && rpVal !== undefined && rpVal !== '');
                      });
                      const showRP2 = studentsFilteredByGrade.some(s => {
                        const pVal = s.grades?.[selectedSubject]?.[activeBloque]?.[1] ?? 80;
                        const rpKey = `${s.id}_${selectedSubject}_${activeBloque}`;
                        const rpVal = studentRpGrades[rpKey]?.[1];
                        return pVal < 70 || (rpVal !== null && rpVal !== undefined && rpVal !== '');
                      });
                      const showRP3 = studentsFilteredByGrade.some(s => {
                        const pVal = s.grades?.[selectedSubject]?.[activeBloque]?.[2] ?? 80;
                        const rpKey = `${s.id}_${selectedSubject}_${activeBloque}`;
                        const rpVal = studentRpGrades[rpKey]?.[2];
                        return pVal < 70 || (rpVal !== null && rpVal !== undefined && rpVal !== '');
                      });
                      const showRP4 = studentsFilteredByGrade.some(s => {
                        const pVal = s.grades?.[selectedSubject]?.[activeBloque]?.[3] ?? 80;
                        const rpKey = `${s.id}_${selectedSubject}_${activeBloque}`;
                        const rpVal = studentRpGrades[rpKey]?.[3];
                        return pVal < 70 || (rpVal !== null && rpVal !== undefined && rpVal !== '');
                      });

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
                                              onChange={(e) => handleParameterGradeChange(s.id, selectedSubject, activeBloque, 0, e.target.value)}
                                              min="0"
                                              max="100"
                                            />
                                          </div>
                                        </td>
                                        {showRP1 && (
                                          <td style={{ backgroundColor: (rpArray[0] !== null && rpArray[0] !== '' && Number(rpArray[0]) < blockArray[0]) ? 'rgba(220, 53, 69, 0.12)' : 'rgba(239, 68, 68, 0.04)' }}>
                                            <input 
                                              type="number" 
                                              className="form-input" 
                                              style={getRpInputStyle(rpArray[0], blockArray[0])}
                                              value={rpArray[0] !== null && rpArray[0] !== undefined ? rpArray[0] : ''}
                                              onChange={(e) => handleRpGradeChange(s.id, selectedSubject, activeBloque, 0, e.target.value)}
                                              min="0"
                                              max="100"
                                              placeholder="-"
                                              title={(rpArray[0] !== null && rpArray[0] !== '' && Number(rpArray[0]) < blockArray[0]) ? `Nota de recuperación (${rpArray[0]}) es menor que la calificación del periodo (${blockArray[0]}). Prevalece la nota original.` : 'Nota de recuperación pedagógica'}
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
                                              onChange={(e) => handleParameterGradeChange(s.id, selectedSubject, activeBloque, 1, e.target.value)}
                                              min="0"
                                              max="100"
                                            />
                                          </div>
                                        </td>
                                        {showRP2 && (
                                          <td style={{ backgroundColor: (rpArray[1] !== null && rpArray[1] !== '' && Number(rpArray[1]) < blockArray[1]) ? 'rgba(220, 53, 69, 0.12)' : 'rgba(239, 68, 68, 0.04)' }}>
                                            <input 
                                              type="number" 
                                              className="form-input" 
                                              style={getRpInputStyle(rpArray[1], blockArray[1])}
                                              value={rpArray[1] !== null && rpArray[1] !== undefined ? rpArray[1] : ''}
                                              onChange={(e) => handleRpGradeChange(s.id, selectedSubject, activeBloque, 1, e.target.value)}
                                              min="0"
                                              max="100"
                                              placeholder="-"
                                              title={(rpArray[1] !== null && rpArray[1] !== '' && Number(rpArray[1]) < blockArray[1]) ? `Nota de recuperación (${rpArray[1]}) es menor que la calificación del periodo (${blockArray[1]}). Prevalece la nota original.` : 'Nota de recuperación pedagógica'}
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
                                              onChange={(e) => handleParameterGradeChange(s.id, selectedSubject, activeBloque, 2, e.target.value)}
                                              min="0"
                                              max="100"
                                            />
                                          </div>
                                        </td>
                                        {showRP3 && (
                                          <td style={{ backgroundColor: (rpArray[2] !== null && rpArray[2] !== '' && Number(rpArray[2]) < blockArray[2]) ? 'rgba(220, 53, 69, 0.12)' : 'rgba(239, 68, 68, 0.04)' }}>
                                            <input 
                                              type="number" 
                                              className="form-input" 
                                              style={getRpInputStyle(rpArray[2], blockArray[2])}
                                              value={rpArray[2] !== null && rpArray[2] !== undefined ? rpArray[2] : ''}
                                              onChange={(e) => handleRpGradeChange(s.id, selectedSubject, activeBloque, 2, e.target.value)}
                                              min="0"
                                              max="100"
                                              placeholder="-"
                                              title={(rpArray[2] !== null && rpArray[2] !== '' && Number(rpArray[2]) < blockArray[2]) ? `Nota de recuperación (${rpArray[2]}) es menor que la calificación del periodo (${blockArray[2]}). Prevalece la nota original.` : 'Nota de recuperación pedagógica'}
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
                                              onChange={(e) => handleParameterGradeChange(s.id, selectedSubject, activeBloque, 3, e.target.value)}
                                              min="0"
                                              max="100"
                                            />
                                          </div>
                                        </td>
                                        {showRP4 && (
                                          <td style={{ backgroundColor: (rpArray[3] !== null && rpArray[3] !== '' && Number(rpArray[3]) < blockArray[3]) ? 'rgba(220, 53, 69, 0.12)' : 'rgba(239, 68, 68, 0.04)' }}>
                                            <input 
                                              type="number" 
                                              className="form-input" 
                                              style={getRpInputStyle(rpArray[3], blockArray[3])}
                                              value={rpArray[3] !== null && rpArray[3] !== undefined ? rpArray[3] : ''}
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
                {renderClassroomBreadcrumbs()}
                {renderClassroomTabs()}

                {selectedGrade ? (
                  renderGradeHeaderBanner(selectedGrade, 'Control de Asistencia')
                ) : (
                  <h2>Control de Asistencia: <span style={{ color: 'var(--primary)' }}>Sin Selección</span></h2>
                )}

                {selectedGrade && (
                  <div className="minerd-warning-banner">
                    <span className="minerd-warning-icon">⚠️</span>
                    <p className="minerd-warning-text">
                      <strong>Nota Oficial MINERD:</strong> Las únicas literales que se deben usar son: <strong>P</strong> (Presente), <strong>A</strong> (Ausente), <strong>E</strong> (Excusa), <strong>T</strong> (Tardanza), <strong>R</strong> (Retirado). No se deben dejar espacios en blanco y se deben escribir las razones en caso de no docencia.
                    </p>
                  </div>
                )}
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Haz clic en el círculo correspondiente a cada día laborable para alternar entre: **P** (Presente), **A** (Ausente), **T** (Tardanza), **E** (Excusa) o **R** (Retirado). Las celdas vacías no suman ni restan al total.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="attendance-month-tabs" style={{ marginBottom: 0 }}>
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

                  {selectedGrade && selectedSubject && (
                    <button
                      className="btn btn-success"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#107c41',
                        color: '#ffffff',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 3px 10px rgba(16, 124, 65, 0.25)',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onClick={exportAttendanceToExcel}
                      title="Exportar asistencia de esta materia a un archivo Excel (.xlsx)"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      Exportar Asistencia a Excel
                    </button>
                  )}
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
                                          setAttendanceDayDatesAndSave(prev => ({
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
                                  const attendanceKey = `${s.id}_${selectedSubject}_${selectedAttendanceMonth}_col_${idx}`;
                                  const status = studentAttendanceDetail[attendanceKey] || '';
                                  if (status === 'R') rCount++;

                                  const dateKey = `${selectedGrade}_${selectedSubject}_${selectedAttendanceMonth}_day_${idx}`;
                                  const dateVal = attendanceDayDates[dateKey] || '';
                                  if (dateVal.trim() !== '') {
                                    if (status === 'A') aCount++;
                                    else if (status === 'E') eCount++;
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

                                const isRetiredStudent = rCount > 0;

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
                                              
                                              setStudentAttendanceDetailAndSave(prev => ({
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
                                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: isRetiredStudent ? 'var(--danger)' : 'var(--success)', fontFamily: 'var(--font-mono)', fontSize: isRetiredStudent ? '0.78rem' : 'inherit' }}>
                                      {isRetiredStudent ? 'Retirado' : cappedT}
                                    </td>
                                    <td style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                                      {isRetiredStudent ? '-' : `${attendancePercentage}%`}
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

            {activeTab === 'reports' && (
              <div>
                {renderReportsTabContent()}
              </div>
            )}
            {activeTab === 'instruments' && (
              <div>
                {renderClassroomBreadcrumbs()}
                {renderClassroomTabs()}

                {selectedGrade ? (
                  renderGradeHeaderBanner(selectedGrade, 'Instrumentos de Evaluación - ' + (subjects[selectedSubject]?.name || selectedSubject))
                ) : (
                  <h2>Instrumentos de Evaluación Ponderada</h2>
                )}
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

            {/* TEACHER: Tab Bulletin (Boletín de Calificaciones) */}
            {activeTab === 'bulletin' && (
              <div>
                {(() => {
                  const targetGrade = currentUser.classroomGrade || selectedGrade || (teacherUniqueGrades && teacherUniqueGrades[0]) || '1ro A';
                  const availableStudents = students.filter(s => s.grade === targetGrade);

                  return (
                    <div>
                      {/* Controls - Hide when printing */}
                      <div className="glass-panel no-print-element" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h2 style={{ margin: 0, color: 'var(--primary)', fontWeight: 800 }}>📄 Boletín Oficial de Calificaciones</h2>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              Generación y descarga de boletines académicos a doble cara para el grado: <strong>{targetGrade}</strong>.
                            </p>
                          </div>
                          {selectedBulletinStudentId && (
                            <button 
                              onClick={() => window.print()}
                              className="btn-primary" 
                              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#003876', border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem', fontWeight: 'bold', color: '#ffffff', cursor: 'pointer' }}
                            >
                              🖨️ Descargar / Imprimir Boletín (PDF)
                            </button>
                          )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
                          {/* Grade selector if teacher has multiple grades */}
                          {teacherUniqueGrades.length > 1 && (
                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Seleccionar Grado</label>
                              <select 
                                className="form-select" 
                                value={selectedGrade} 
                                onChange={(e) => { setSelectedGrade(e.target.value); setSelectedBulletinStudentId(''); }}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                              >
                                {teacherUniqueGrades.map(g => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div className="form-group" style={{ margin: 0 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Seleccionar Estudiante</label>
                            <select 
                              className="form-select" 
                              value={selectedBulletinStudentId} 
                              onChange={(e) => setSelectedBulletinStudentId(e.target.value)}
                              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                            >
                              <option value="">-- Seleccionar Estudiante --</option>
                              {availableStudents.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          </div>

                          {/* Custom Salidas - Only for 4th, 5th, 6th Grade */}
                          {['4to A', '5to A', '6to A'].includes(targetGrade) && (
                            <>
                              <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Asignatura Salida Optativa 1</label>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  value={salida1Name} 
                                  onChange={(e) => setSalida1Name(e.target.value)}
                                  placeholder="Química, Biología, etc."
                                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                />
                              </div>
                              <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Asignatura Salida Optativa 2</label>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  value={salida2Name} 
                                  onChange={(e) => setSalida2Name(e.target.value)}
                                  placeholder="Computación, etc."
                                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {!selectedBulletinStudentId ? (
                        <div className="glass-panel text-center no-print-element" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
                          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📄</span>
                          <h3>Por favor, seleccione un estudiante de {targetGrade} para visualizar su Boletín Oficial</h3>
                          <p style={{ fontSize: '0.85rem' }}>El documento oficial se generará automáticamente a doble cara con los datos reales del registro escolar.</p>
                        </div>
                      ) : (
                        (() => {
                          const student = students.find(s => s.id === selectedBulletinStudentId);
                          if (!student) return null;
                          return renderBulletinContent(student, targetGrade);
                        })()
                      )}
                    </div>
                  );
                })()}
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
        <div className="modal-backdrop" style={{ zIndex: 1050 }}>
          <div className="modal-card animate-fade-in" style={{ maxWidth: '700px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🚨</span> Borrador de Reporte / Alerta Escolar
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Generación oficial y enrutamiento de notificaciones del estudiante.
                </span>
              </div>
              <button 
                style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }} 
                onClick={() => setAlertFormModal(prev => ({ ...prev, isOpen: false }))}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              
              {/* Context Summary */}
              <div className="alert alert-danger" style={{ fontSize: '0.85rem', margin: 0, padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div><strong>Estudiante:</strong> {alertFormModal.student.name} ({alertFormModal.student.grade})</div>
                {alertFormModal.subjectKey && (
                  <div>
                    <strong>Alerta de Rendimiento:</strong> Asignatura: {subjects[alertFormModal.subjectKey]?.name || alertFormModal.subjectKey} (Nota: {alertFormModal.score.toFixed(0)}% en {alertFormModal.period === 'final' ? 'Promedio Final' : `Periodo ${alertFormModal.period.replace('bloque', '')}`})
                  </div>
                )}
              </div>

              {/* Form Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* 1. Tipo de Reporte */}
                <div className="form-group-compact">
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>Tipo de Reporte</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="report_type" 
                        value="académico"
                        checked={alertFormModal.type === 'académico'} 
                        onChange={() => setAlertFormModal(prev => ({ ...prev, type: 'académico', selectedSituations: [] }))} 
                      />
                      <span>Académico</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="report_type" 
                        value="conductual"
                        checked={alertFormModal.type === 'conductual'} 
                        onChange={() => setAlertFormModal(prev => ({ ...prev, type: 'conductual', selectedSituations: [] }))} 
                      />
                      <span>Conductual / Disciplinario</span>
                    </label>
                  </div>
                </div>

                 {/* 2. Checkboxes de Situaciones */}
                 <div className="form-group-compact">
                   <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>
                     Situaciones {alertFormModal.type === 'académico' ? 'Académicas' : 'Conductuales'} Detectadas
                   </label>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                     {(alertFormModal.type === 'académico' ? [
                       'Plagio',
                       'Entrega tardía',
                       'Falta de entrega de tareas',
                       'Bajo rendimiento en evaluaciones',
                       'Poco interés / participación',
                       'Dificultad de aprendizaje',
                       'Inasistencias constantes',
                       'Otro (especificar)'
                     ] : [
                       'Indisciplina o alteración del orden',
                       'Falta de respeto a compañeros o docentes',
                       'Uso inapropiado de móvil/dispositivo',
                       'Llegadas tardías constantes a clase',
                       'Salidas del aula sin autorización',
                       'Agresión física o verbal',
                       'Daño voluntario a la propiedad escolar',
                       'Otro (especificar)'
                     ]).map(sit => {
                       const isChecked = alertFormModal.selectedSituations.includes(sit);
                       return (
                         <label key={sit} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', padding: '0.2rem 0' }}>
                           <input 
                             type="checkbox" 
                             checked={isChecked}
                             style={{ marginTop: '0.15rem' }}
                             onChange={(e) => {
                               const checked = e.target.checked;
                               setAlertFormModal(prev => {
                                 const list = checked 
                                   ? [...prev.selectedSituations, sit] 
                                   : prev.selectedSituations.filter(x => x !== sit);
                                 return { ...prev, selectedSituations: list, modifiedWithAI: false, finalText: '' };
                               });
                             }}
                           />
                           <span>{sit}</span>
                         </label>
                       );
                     })}
                   </div>
                 </div>
 
                 {/* 2.1 Entrada de Situación Personalizada */}
                 {alertFormModal.selectedSituations.includes('Otro (especificar)') && (
                   <div className="form-group-compact">
                     <label>Especifique la situación:</label>
                     <input 
                       type="text" 
                       className="form-input-compact" 
                       placeholder="Describa el incidente aquí..."
                       value={alertFormModal.customSituation}
                       onChange={(e) => setAlertFormModal(prev => ({ ...prev, customSituation: e.target.value, modifiedWithAI: false, finalText: '' }))}
                     />
                   </div>
                 )}
 
                 {/* 3. Antecedentes (Persistencia) */}
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="form-group-compact">
                     <label style={{ fontWeight: 'bold' }}>Antecedentes (¿Desde cuándo persiste esta situación?)</label>
                     <select 
                       className="form-select"
                       value={alertFormModal.antecedent}
                       onChange={(e) => setAlertFormModal(prev => ({ ...prev, antecedent: e.target.value, modifiedWithAI: false, finalText: '' }))}
                       style={{ width: '100%', padding: '0.4rem' }}
                     >
                       <option value="Primera vez (Incidente aislado)">Primera vez (Incidente aislado)</option>
                       <option value="Persiste desde hace 1 semana">Persiste desde hace 1 semana</option>
                       <option value="Persiste desde hace 2 semanas">Persiste desde hace 2 semanas</option>
                       <option value="Persiste desde hace 1 mes">Persiste desde hace 1 mes</option>
                       <option value="Persiste durante todo el periodo actual">Persiste durante todo el periodo actual</option>
                       <option value="Persiste desde el inicio del año escolar">Persiste desde el inicio del año escolar</option>
                       <option value="Otra (especificar)">Otra (especificar)</option>
                     </select>
                   </div>
                  {alertFormModal.antecedent === 'Otra (especificar)' && (
                    <div className="form-group-compact">
                      <label style={{ fontWeight: 'bold' }}>Especifique la persistencia:</label>
                      <input 
                        type="text" 
                        className="form-input-compact" 
                        placeholder="Ej. Desde hace 3 meses..."
                        value={alertFormModal.customAntecedent}
                        onChange={(e) => setAlertFormModal(prev => ({ ...prev, customAntecedent: e.target.value, modifiedWithAI: false, finalText: '' }))}
                      />
                    </div>
                  )}
                </div>

                {/* 4. Comentarios Adicionales */}
                <div className="form-group-compact">
                  <label style={{ fontWeight: 'bold' }}>Notas y Comentarios adicionales del docente</label>
                  <textarea 
                    className="form-input-compact" 
                    placeholder="Notas internas que servirán como contexto adicional para el reporte..."
                    value={alertFormModal.comments}
                    onChange={(e) => setAlertFormModal(prev => ({ ...prev, comments: e.target.value, modifiedWithAI: false, finalText: '' }))}
                    style={{ minHeight: '60px', padding: '0.4rem', fontSize: '0.82rem' }}
                  />
                </div>

                {/* 5. Destinatarios Config */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group-compact">
                    <label style={{ fontWeight: 'bold' }}>Coordinador Encargado</label>
                    <input 
                      type="email" 
                      className="form-input-compact" 
                      placeholder="coordinador@liceo.edu" 
                      value={alertFormModal.coordinatorEmail}
                      onChange={(e) => setAlertFormModal(prev => ({ ...prev, coordinatorEmail: e.target.value }))}
                    />
                  </div>
                  <div className="form-group-compact">
                    <label style={{ fontWeight: 'bold' }}>Orientador Encargado</label>
                    <input 
                      type="email" 
                      className="form-input-compact" 
                      placeholder="orientador@liceo.edu" 
                      value={alertFormModal.counselorEmail}
                      onChange={(e) => setAlertFormModal(prev => ({ ...prev, counselorEmail: e.target.value }))}
                    />
                  </div>
                </div>

                {/* AI Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.25rem' }}>
                  <button 
                    type="button" 
                    className="btn-primary" 
                    onClick={handleOptimizeReportWithAI}
                    disabled={alertFormModal.sending}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', color: '#ffffff' }}
                  >
                    <span>✨ Redactar / Optimizar con IA (Gemini)</span>
                  </button>
                </div>

                {/* 6. Borrador Editable Final */}
                <div className="form-group-compact">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <label style={{ fontWeight: 'bold', margin: 0 }}>Texto Definitivo del Reporte (Editable)</label>
                    {alertFormModal.modifiedWithAI && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 'bold' }}>✓ Optimizado por IA</span>
                    )}
                  </div>
                  <textarea 
                    className="form-input-compact" 
                    style={{ minHeight: '180px', padding: '0.6rem', fontSize: '0.82rem', lineHeight: '1.4', fontFamily: 'inherit', border: '1px solid #000000', backgroundColor: '#fcfcfc', color: '#000000' }}
                    value={alertFormModal.finalText || compileReportText(alertFormModal)}
                    onChange={(e) => setAlertFormModal(prev => ({ ...prev, finalText: e.target.value, modifiedWithAI: true }))}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Nota: Este texto es lo que se guardará en la carpeta digital del alumno y se enviará en el correo. Puedes modificarlo directamente.
                  </span>
                </div>
              </div>

              {/* Progress bar for sending/AI */}
              {alertFormModal.sending && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span>Procesando solicitud...</span>
                    <span>{alertFormModal.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${alertFormModal.progress}%`, height: '100%', backgroundColor: 'var(--danger)', transition: 'width 0.2s ease' }}></div>
                  </div>
                </div>
              )}

              {/* Envelope Rule Guide / Help Box */}
              <div style={{ backgroundColor: 'var(--primary-glow)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span>📂</span> <span>Cómo organizar automáticamente en carpetas en tu correo:</span>
                </div>
                <p style={{ margin: 0, lineHeight: '1.4', color: 'var(--text-secondary)' }}>
                  Para que los reportes de <strong>{alertFormModal.student.grade}</strong> de <strong>{alertFormModal.student.name}</strong> se organicen automáticamente al recibirse, solicita al Orientador/Coordinador crear una <strong>Regla/Filtro</strong> en su Outlook/Gmail:
                  <br />
                  • <strong>Condición:</strong> Si el asunto contiene <code>[REPORTE LARC] Grado: {alertFormModal.student.grade} | Alumno: {alertFormModal.student.name}</code>
                  <br />
                  • <strong>Acción:</strong> Mover a carpeta: <code>{alertFormModal.student.grade} Reporte / {alertFormModal.student.name}</code>.
                </p>
              </div>

            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button 
                type="button"
                className="btn-secondary" 
                onClick={() => setAlertFormModal(prev => ({ ...prev, isOpen: false }))}
                disabled={alertFormModal.sending}
              >
                Cerrar
              </button>
              
              <button
                type="button"
                className="btn-secondary"
                style={{ fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                onClick={() => {
                  const finalTxt = alertFormModal.finalText || compileReportText(alertFormModal);
                  navigator.clipboard.writeText(finalTxt);
                  alert('¡Texto copiado al portapapeles con éxito!');
                }}
              >
                📋 Copiar Texto
              </button>

              {/* Compose Options */}
              {(() => {
                const finalTxt = alertFormModal.finalText || compileReportText(alertFormModal);
                const subjectStr = `[REPORTE LARC] Grado: ${alertFormModal.student.grade} | Alumno: ${alertFormModal.student.name} | Tipo: ${alertFormModal.type.toUpperCase()}`;
                const encodedTo = encodeURIComponent(`${alertFormModal.coordinatorEmail},${alertFormModal.counselorEmail}`);
                const encodedSubject = encodeURIComponent(subjectStr);
                const encodedBody = encodeURIComponent(finalTxt);
                
                return (
                  <>
                     <a 
                       href={`mailto:${alertFormModal.coordinatorEmail};${alertFormModal.counselorEmail}?subject=${encodedSubject}&body=${encodedBody}`}
                       className="btn-secondary"
                       style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 'bold' }}
                       onClick={handleRegisterSentReportLog}
                     >
                      ✉️ Correo Local
                    </a>
                    
                    <a 
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: '#ea4335', fontWeight: 'bold' }}
                      onClick={handleRegisterSentReportLog}
                    >
                      📧 Gmail Web
                    </a>
                    
                    <a 
                      href={`https://outlook.live.com/mail/0/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: '#0078d4', fontWeight: 'bold' }}
                      onClick={handleRegisterSentReportLog}
                    >
                      Ⓜ️ Outlook Web
                    </a>
                  </>
                );
              })()}

              <button 
                type="button"
                className="btn-danger" 
                onClick={handleSimulateSendAlert}
                disabled={alertFormModal.sending}
              >
                {alertFormModal.sending ? 'Generando...' : '⚡ Simular Registro'}
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
