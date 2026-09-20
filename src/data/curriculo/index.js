import secundario1roCN from './secundario_1ro_ciencias_naturaleza.json';
import secundario1roLE from './secundario_1ro_lengua_espanola.json';
import secundario1roMAT from './secundario_1ro_matematica.json';
import secundario4toCS from './secundario_4to_ciencias_sociales.json';

// Master Curriculum Registry
export const CURRICULO_DATASETS = [
  secundario1roCN,
  secundario1roLE,
  secundario1roMAT,
  secundario4toCS
];

/**
 * Get available curriculum units by Grade and Subject Area
 */
export function getCurriculumUnits(gradeStr, subjectKey) {
  if (!gradeStr || !subjectKey) return [];

  // Normalize grade string (e.g. '1ro A' -> '1ro', '4AM' -> '4')
  const cleanGrade = gradeStr.trim();
  
  const foundDataset = CURRICULO_DATASETS.find(dataset => {
    const isSameArea = dataset.area === subjectKey;
    const isSameGrade = dataset.grado === cleanGrade || 
                        cleanGrade.startsWith(dataset.grado.substring(0, 3));
    return isSameArea && isSameGrade;
  });

  if (foundDataset && Array.isArray(foundDataset.unidades)) {
    return foundDataset.unidades;
  }

  // Fallback dynamic generator if exact JSON file is not pre-packaged for that specific subject/grade
  const subjectNames = {
    lengua_espanola: 'Lengua Española',
    ingles: 'Inglés',
    frances: 'Francés',
    matematica: 'Matemática',
    ciencias_sociales: 'Ciencias Sociales',
    ciencias_naturaleza: 'Ciencias de la Naturaleza',
    artistica: 'Educación Artística',
    educacion_fisica: 'Educación Física',
    formacion_religiosa: 'Formación Humana e Integral Religiosa',
    salida1: 'Asignatura Optativa de Salida I',
    salida2: 'Asignatura Optativa de Salida II'
  };

  const subName = subjectNames[subjectKey] || subjectKey;

  return [
    {
      id_unidad: `${subjectKey.toUpperCase().substring(0, 3)}-${cleanGrade}-U1`,
      tema: `Fundamentos Curriculares e Indagación en ${subName} (${cleanGrade})`,
      competencias_alineadas: [
        {
          fundamental: "Comunicativa; Pensamiento Lógico, Crítico y Creativo; Científica y Tecnológica",
          especifica: `Comprende y aplica los principios estructurantes y procedimientos normativos de ${subName} en situaciones concretas del contexto escolar y comunitario del Nivel Secundario.`,
          indicador_logro: `Aplica con rigor técnico y juicio crítico las herramientas conceptuales y procedimentales de ${subName}, demostrando autonomía y ética en su desempeño.`,
          contenidos: {
            conceptuales: [
              `Principios esenciales y conceptos articuladores de ${subName}.`,
              "Leyes, postulados y modelos explicativos de la disciplina.",
              "Vocabulario técnico y categorización de fenómenos según la Adecuación 2023."
            ],
            procedimentales: [
              "Formulación de hipótesis y preguntas de indagación contextualizadas.",
              "Recolección, clasificación y análisis sistemático de evidencias.",
              "Elaboración de informes sintéticos, diagramas y productos finales."
            ],
            actitudinales: [
              "Rigor científico y honestidad en el manejo de datos.",
              "Trabajo colaborativo, empatía y responsabilidad social.",
              "Valoración del conocimiento científico como motor de transformación."
            ]
          }
        }
      ]
    },
    {
      id_unidad: `${subjectKey.toUpperCase().substring(0, 3)}-${cleanGrade}-U2`,
      tema: `Aplicación Práctica y Proyectos de Intervención en ${subName}`,
      competencias_alineadas: [
        {
          fundamental: "Ambiental y de la Salud; Ética y Ciudadana; Resolución de Problemas",
          especifica: `Diseña y ejecuta alternativas de solución ante problemáticas sociales, ambientales y culturales mediante los mediadores de ${subName}.`,
          indicador_logro: `Evalúa responsablemente los resultados de intervenciones comunitarias sustentadas en los contenidos del área de ${subName}.`,
          contenidos: {
            conceptuales: [
              `Impacto social, tecnológico y ambiental de los avances en ${subName}.`,
              "Estrategias de desarrollo sostenible y ética ciudadana en el entorno."
            ],
            procedimentales: [
              "Diseño de prototipos, proyectos de investigación-acción o debates escolares.",
              "Socialización de productos formativos mediante medios analógicos y digitales."
            ],
            actitudinales: [
              "Compromiso ético con la sostenibilidad y la democracia deliberativa."
            ]
          }
        }
      ]
    }
  ];
}

/**
 * Get exact unit data by Unit ID
 */
export function getUnitById(gradeStr, subjectKey, unitId) {
  const units = getCurriculumUnits(gradeStr, subjectKey);
  return units.find(u => u.id_unidad === unitId) || units[0] || null;
}
