import secundaria1roOfficial from './secundaria_1ro.json';
import secundaria2doOfficial from './secundaria_2do.json';
import secundaria3roOfficial from './secundaria_3ro.json';
import secundaria4toOfficial from './secundaria_4to.json';
import secundaria5toOfficial from './secundaria_5to.json';
import secundaria6toOfficial from './secundaria_6to.json';
import secundario1roCN from './secundario_1ro_ciencias_naturaleza.json';
import secundario1roLE from './secundario_1ro_lengua_espanola.json';
import secundario1roMAT from './secundario_1ro_matematica.json';
import secundario4toCS from './secundario_4to_ciencias_sociales.json';

export const OFFICIAL_SECUNDARIA_1RO = secundaria1roOfficial;
export const OFFICIAL_SECUNDARIA_2DO = secundaria2doOfficial;
export const OFFICIAL_SECUNDARIA_3RO = secundaria3roOfficial;
export const OFFICIAL_SECUNDARIA_4TO = secundaria4toOfficial;
export const OFFICIAL_SECUNDARIA_5TO = secundaria5toOfficial;
export const OFFICIAL_SECUNDARIA_6TO = secundaria6toOfficial;

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
  if (cleanGrade.includes('6to') || cleanGrade.startsWith('6')) {
    return secundaria6toOfficial;
  }
  if (cleanGrade.includes('5to') || cleanGrade.startsWith('5')) {
    return secundaria5toOfficial;
  }
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

export function normalizeSubjectKey(rawKey) {
  if (!rawKey) return 'ciencias_naturaleza';
  const clean = String(rawKey).toLowerCase().trim().replace(/[\s-]/g, '_');

  if (clean.includes('naturaleza') || clean.includes('biologia') || clean.includes('quimica') || clean.includes('fisica') && !clean.includes('educacion_fisica')) {
    return 'ciencias_naturaleza';
  }
  if (clean.includes('espanol') || clean.includes('lengua')) {
    return 'lengua_espanola';
  }
  if (clean.includes('matematica')) {
    return 'matematica';
  }
  if (clean.includes('sociales') || clean.includes('historia') || clean.includes('geografia')) {
    return 'ciencias_sociales';
  }
  if (clean.includes('ingles') || clean.includes('english')) {
    return 'ingles';
  }
  if (clean.includes('frances') || clean.includes('french')) {
    return 'frances';
  }
  if (clean.includes('artistica') || clean.includes('arte')) {
    return 'artistica';
  }
  if (clean.includes('educacion_fisica') || clean.includes('deporte')) {
    return 'educacion_fisica';
  }
  if (clean.includes('religiosa') || clean.includes('fihr') || clean.includes('humana')) {
    return 'formacion_religiosa';
  }
  if (clean.includes('optativa') || clean.includes('salida')) {
    return 'salidas_optativas';
  }
  return clean;
}

/**
 * Get Official Subject Specs for a specific grade (Ordenanza 04-2023)
 */
export function getOfficialSubjectData(gradeStr, subjectKey) {
  if (!subjectKey) return null;

  const dataset = getOfficialGradeDataset(gradeStr);
  const normKey = normalizeSubjectKey(subjectKey);
  const areas = dataset.areas || {};

  if (areas[normKey]) {
    return areas[normKey];
  }
  if (areas[subjectKey]) {
    return areas[subjectKey];
  }

  // Soft fallback matching by key or name
  const matchingKey = Object.keys(areas).find(k => {
    const normK = k.toLowerCase().replace(/[\s-]/g, '_');
    return normK.includes(normKey) || normKey.includes(normK) || (areas[k]?.nombre && areas[k].nombre.toLowerCase().includes(subjectKey.toLowerCase()));
  });

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
 * Get official Ejes Transversales for a given grade and subject
 */
export function getOfficialEjesTransversales(gradeStr, subjectKey) {
  const officialData = getOfficialSubjectData(gradeStr, subjectKey);
  if (officialData && Array.isArray(officialData.ejes_transversales) && officialData.ejes_transversales.length > 0) {
    return officialData.ejes_transversales;
  }
  return [
    {
      eje: "Salud y Bienestar",
      descriptor: "Caracterización de situaciones de salud que arriesgan el entorno escolar, familiar y comunitario en general, a través de variadas fuentes de información en diferentes formatos, proponiendo posibles acciones de solución para el bienestar común."
    },
    {
      eje: "Desarrollo Sostenible",
      descriptor: "Identificación de factores que ponen en riesgo el desarrollo sostenible (por ejemplo: cambio climático, contaminación ambiental, deforestación, entre otros), a fin de aportar soluciones posibles."
    },
    {
      eje: "Ciudadanía y Convivencia",
      descriptor: "Uso de diferentes textos orales y escritos para caracterizar diferentes conflictos que se presentan en contextos sociales, proponiendo soluciones según su capacidad y nivel."
    },
    {
      eje: "Alfabetización Imprescindible",
      descriptor: "Investigación sobre los variados usos de su lengua materna y la alfabetización digital, con miras a fortalecer la comunicación oral y escrita y el empleo de las tecnologías en diferentes situaciones de comunicación."
    },
    {
      eje: "Desarrollo Personal y Profesional",
      descriptor: "Iniciación en la elaboración de proyectos para su vida estudiantil y profesional, partiendo del uso de la lengua como medio fundamental de la cultura, para la formación de un ser humano democrático, participativo e integral."
    }
  ];
}

/**
 * Get available curriculum units by Grade and Subject Area
 */
export function getCurriculumUnits(gradeStr, subjectKey) {
  if (!gradeStr || !subjectKey) return [];

  const cleanGrade = gradeStr.trim();
  const officialData = getOfficialSubjectData(cleanGrade, subjectKey);

  if (officialData && Array.isArray(officialData.unidades_tematicas) && officialData.unidades_tematicas.length > 0) {
    const allCEs = officialData.competencias_especificas || [];
    const allILs = allCEs.flatMap(c => c.indicadores_logro || []);

    return officialData.unidades_tematicas.map(u => {
      const cesAlineadasText = (u.competencias_asociadas || []).map(code => {
        const match = allCEs.find(c => c.codigo === code);
        return match ? `[${match.codigo}] ${match.descripcion}` : code;
      });

      const ilsAlineadosText = (u.indicadores_asociados || []).map(code => {
        const match = allILs.find(i => i.codigo === code);
        return match ? `[${match.codigo}] ${match.texto}` : code;
      });

      return {
        id_unidad: u.id_unidad,
        tema: u.nombre_unidad,
        nombre_unidad: u.nombre_unidad,
        tipo_texto: u.tipo_texto || 'Funcional / Descriptivo',
        competencias_asociadas: u.competencias_asociadas || [],
        indicadores_asociados: u.indicadores_asociados || [],
        ces_alineadas_text: cesAlineadasText,
        ils_alineados_text: ilsAlineadosText,
        contenidos: u.contenidos || { conceptuales: [], procedimentales: [], actitudinales: [] },
        competencias_alineadas: [
          {
            fundamental: "Competencias Específicas Oficiales MINERD (Adecuación 2023)",
            especifica: cesAlineadasText.join(' | ') || `Desarrollo de competencias de ${u.nombre_unidad}`,
            indicador_logro: ilsAlineadosText.join(' | ') || `Aplica los mediadores de ${u.nombre_unidad}`,
            contenidos: u.contenidos || { conceptuales: [], procedimentales: [], actitudinales: [] }
          }
        ]
      };
    });
  }

  const foundDataset = CURRICULO_DATASETS.find(dataset => {
    const isSameArea = dataset.area === subjectKey;
    const isSameGrade = dataset.grado === cleanGrade || 
                        cleanGrade.startsWith(dataset.grado.substring(0, 3));
    return isSameArea && isSameGrade;
  });

  if (foundDataset && Array.isArray(foundDataset.unidades) && foundDataset.unidades.length > 0) {
    return foundDataset.unidades;
  }

  // Fallback dynamic generator if exact JSON file is not pre-packaged for that specific subject/grade
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
      nombre_unidad: `Fundamentos Curriculares e Indagación en ${subName} (${cleanGrade})`,
      tipo_texto: "Funcional / Analítico",
      competencias_asociadas: officialComps.slice(0, 3).map(c => c.codigo),
      indicadores_asociados: officialComps.flatMap(c => c.indicadores_logro || []).slice(0, 4).map(i => i.codigo),
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
      },
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
      nombre_unidad: `Aplicación Práctica y Proyectos de Intervención en ${subName}`,
      tipo_texto: "Argumentativo / Persuasivo",
      competencias_asociadas: officialComps.slice(3, 6).map(c => c.codigo),
      indicadores_asociados: officialComps.flatMap(c => c.indicadores_logro || []).slice(4, 8).map(i => i.codigo),
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
      },
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
