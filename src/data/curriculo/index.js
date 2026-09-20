import secundaria1roOfficial from './secundaria_1ro.json';
import secundario1roCN from './secundario_1ro_ciencias_naturaleza.json';
import secundario1roLE from './secundario_1ro_lengua_espanola.json';
import secundario1roMAT from './secundario_1ro_matematica.json';
import secundario4toCS from './secundario_4to_ciencias_sociales.json';

export const OFFICIAL_SECUNDARIA_1RO = secundaria1roOfficial;

// Master Curriculum Registry
export const CURRICULO_DATASETS = [
  secundario1roCN,
  secundario1roLE,
  secundario1roMAT,
  secundario4toCS
];

/**
 * Get Official Curriculum Specs for 1ro de Secundaria (Ordenanza 04-2023)
 */
export function getOfficial1roSubjectData(subjectKey) {
  if (!subjectKey) return null;

  // Map alternative keys if needed
  const normalizedKey = subjectKey.toLowerCase().replace(/[\s-]/g, '_');
  const areas = OFFICIAL_SECUNDARIA_1RO.areas || {};

  if (areas[normalizedKey]) {
    return areas[normalizedKey];
  }
  if (areas[subjectKey]) {
    return areas[subjectKey];
  }

  // Soft fallback matching
  const matchingKey = Object.keys(areas).find(k => k.includes(normalizedKey) || normalizedKey.includes(k));
  return matchingKey ? areas[matchingKey] : areas['ciencias_naturaleza'];
}

/**
 * Filter CEs and ILs for a given subject and optional fundamental competency filter
 */
export function filterOfficialCompetencies1ro(subjectKey, selectedFundamental) {
  const subjectData = getOfficial1roSubjectData(subjectKey);
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
  const groups = OFFICIAL_SECUNDARIA_1RO.grupos_calificacion || {};

  return {
    competencies: comps,
    indicators,
    groups
  };
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
  const officialData = getOfficial1roSubjectData(subjectKey);
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
