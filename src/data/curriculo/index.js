import secundaria1roOfficial from './secundaria_1ro.json';
import secundaria2doOfficial from './secundaria_2do.json';
import secundaria3roOfficial from './secundaria_3ro.json';
import secundaria4toOfficial from './secundaria_4to.json';
import secundario1roCN from './secundario_1ro_ciencias_naturaleza.json';
import secundario1roLE from './secundario_1ro_lengua_espanola.json';
import secundario1roMAT from './secundario_1ro_matematica.json';
import secundario4toCS from './secundario_4to_ciencias_sociales.json';

export const OFFICIAL_SECUNDARIA_1RO = secundaria1roOfficial;
export const OFFICIAL_SECUNDARIA_2DO = secundaria2doOfficial;
export const OFFICIAL_SECUNDARIA_3RO = secundaria3roOfficial;
export const OFFICIAL_SECUNDARIA_4TO = secundaria4toOfficial;

// Master Curriculum Registry
export const CURRICULO_DATASETS = [
  secundario1roCN,
  secundario1roLE,
  secundario1roMAT,
  secundario4toCS
];

/**
 * Get Official Curriculum Dataset Object by Grade
 */
export function getOfficialGradeDataset(gradeStr) {
  if (!gradeStr) return secundaria1roOfficial;
  const cleanGrade = String(gradeStr).trim().toLowerCase();
  if (cleanGrade.includes('4to') || cleanGrade.startsWith('4')) {
    return secundaria4toOfficial;
  }
  if (cleanGrade.includes('3ro') || cleanGrade.startsWith('3')) {
    return secundaria3roOfficial;
  }
  if (cleanGrade.includes('2do') || cleanGrade.startsWith('2')) {
    return secundaria2doOfficial;
  }
  return secundaria1roOfficial;
}

/**
 * Get Official Subject Specs for a specific grade (Ordenanza 04-2023)
 */
export function getOfficialSubjectData(gradeStr, subjectKey) {
  if (!subjectKey) return null;

  const dataset = getOfficialGradeDataset(gradeStr);
  const normalizedKey = subjectKey.toLowerCase().replace(/[\s-]/g, '_');
  const areas = dataset.areas || {};

  if (areas[normalizedKey]) {
    return areas[normalizedKey];
  }
  if (areas[subjectKey]) {
    return areas[subjectKey];
  }

  // Soft fallback matching
  const matchingKey = Object.keys(areas).find(k => k.includes(normalizedKey) || normalizedKey.includes(k));
  return matchingKey ? areas[matchingKey] : (areas['ciencias_naturaleza'] || Object.values(areas)[0]);
}

/**
 * Legacy alias for 1ro
 */
export function getOfficial1roSubjectData(subjectKey) {
  return getOfficialSubjectData('1ro', subjectKey);
}

/**
 * Filter CEs and ILs for a given grade, subject and optional fundamental competency filter
 */
export function filterOfficialCompetencies(gradeStr, subjectKey, selectedFundamental) {
  const subjectData = getOfficialSubjectData(gradeStr, subjectKey);
  const dataset = getOfficialGradeDataset(gradeStr);

  if (!subjectData || !Array.isArray(subjectData.competencias_especificas)) {
    return { competencies: [], indicators: [], groups: {} };
  }

  let comps = subjectData.competencias_especificas;

  if (selectedFundamental && selectedFundamental !== 'TODAS') {
    comps = comps.filter(c => 
      c.fundamental.toLowerCase().includes(selectedFundamental.toLowerCase()) ||
      selectedFundamental.toLowerCase().includes(c.fundamental.toLowerCase())
    );
  }

  const indicators = comps.flatMap(c => c.indicadores_logro || []);
  const groups = dataset.grupos_calificacion || {};

  return {
    competencies: comps,
    indicators,
    groups
  };
}

/**
 * Legacy alias for 1ro
 */
export function filterOfficialCompetencies1ro(subjectKey, selectedFundamental) {
  return filterOfficialCompetencies('1ro', subjectKey, selectedFundamental);
}

/**
 * Get available curriculum units by Grade and Subject Area
 */
export function getCurriculumUnits(gradeStr, subjectKey) {
  if (!gradeStr || !subjectKey) return [];

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
  const officialData = getOfficialSubjectData(cleanGrade, subjectKey);
  const subName = officialData?.nombre || subjectKey;

  const officialComps = officialData?.competencias_especificas || [];
  const primaryCE = officialComps[0] || {
    fundamental: "Comunicativa; Pensamiento Lógico, Crítico y Creativo; Científica y Tecnológica",
    descripcion: `Comprende y aplica los principios estructurantes y procedimientos normativos de ${subName} en situaciones concretas del Nivel Secundario.`,
    indicadores_logro: [
      { codigo: "IL-1", texto: `Aplica con rigor técnico y juicio crítico las herramientas conceptuales y procedimentales de ${subName}.` }
    ]
  };

  return [
    {
      id_unidad: `${subjectKey.toUpperCase().substring(0, 3)}-${cleanGrade}-U1`,
      tema: `Fundamentos Curriculares e Indagación en ${subName} (${cleanGrade})`,
      competencias_alineadas: [
        {
          fundamental: primaryCE.fundamental,
          especifica: primaryCE.descripcion,
          indicador_logro: primaryCE.indicadores_logro.map(i => `[${i.codigo}] ${i.texto}`).join(' | '),
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
