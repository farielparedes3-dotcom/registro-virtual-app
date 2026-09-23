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

  if (clean.includes('computacion') || clean.includes('quimica_y_computacion') || clean.includes('quimica_computacion')) {
    return 'quimica_y_computacion';
  }

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

      const aspectos = u.aspectos_indicadores || (u.indicadores_asociados || []).map((code, idx) => {
        const match = allILs.find(i => i.codigo === code);
        const ceCode = u.competencias_asociadas?.[idx] || '';
        return `Aspecto evaluado en la unidad [${code}]: Contextualización práctica de "${match?.texto || code}" en los contenidos de ${u.nombre_unidad}.`;
      });

      return {
        id_unidad: u.id_unidad,
        tema: u.nombre_unidad,
        nombre_unidad: u.nombre_unidad,
        tipo_texto: u.tipo_texto || 'Funcional / Descriptivo',
        competencias_asociadas: u.competencias_asociadas || [],
        indicadores_asociados: u.indicadores_asociados || [],
        aspectos_indicadores: aspectos,
        ces_alineadas_text: cesAlineadasText,
        ils_alineados_text: ilsAlineadosText,
        contenidos: u.contenidos || { conceptuales: [], procedimentales: [], actitudinales: [] },
        competencias_alineadas: [
          {
            fundamental: "Competencias Específicas Oficiales MINERD (Adecuación 2023)",
            especifica: cesAlineadasText.join(' | ') || `Desarrollo de competencias de ${u.nombre_unidad}`,
            indicador_logro: aspectos.join(' | ') || `Aplica los mediadores de ${u.nombre_unidad}`,
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

  // Fallback dynamic generator tailored to official MINERD Adecuación Curricular 2023 grade focus
  const subName = officialData?.nombre || subjectKey;
  const officialComps = officialData?.competencias_especificas || [];
  
  const gNum = cleanGrade.substring(0, 1);
  let customTitles = null;

  if (subjectKey === 'ciencias_naturaleza') {
    if (gNum === '1') {
      customTitles = [
        "1. Estructura Interna del Planeta Tierra y Tectónica de Placas",
        "2. El Planeta Tierra: Rocas, Minerales y Dinámica Geológica",
        "3. Composición y Dinámica de la Atmósfera e Hidrósfera",
        "4. El Sistema Solar, la Luna y la Dinámica Astronómica",
        "5. Recursos Naturales, Medio Ambiente y Gestión de Riesgos Geológicos"
      ];
    } else if (gNum === '2') {
      customTitles = [
        "1. La Célula y su Organización Estructural",
        "2. Reproducción y División Celular",
        "3. Genética y Herencia Biológica",
        "4. Estructura y Función de los Sistemas del Cuerpo Humano",
        "5. Ecosistemas, Biodiversidad y Biomas",
        "6. Salud, Inmunología y Prevención de Enfermedades"
      ];
    } else if (gNum === '3') {
      customTitles = [
        "1. Materia y sus Propiedades (Química Fundamental)",
        "2. Cinemática y Movimiento en Una Dimensión",
        "3. Dinámica y Leyes de Newton",
        "4. Trabajo, Energía Mecánica y Máquinas Simples",
        "5. Ondas, Luz y Sonido"
      ];
    } else if (gNum === '4') {
      customTitles = [
        "1. Biología Celular y Bioquímica Molecular",
        "2. Genética Molecular, Herencia Humana y Biotecnología",
        "3. Evolución Biológica y Selección Natural",
        "4. Ecología de Poblaciones y Comunidades",
        "5. Fisiología e Inmunología Humana Avanzada"
      ];
    } else if (gNum === '5') {
      customTitles = [
        "1. Estructura Atómica, Tabla Periódica y Enlaces Químicos",
        "2. Estequiometría y Reacciones Químicas",
        "3. Soluciones Químicas, Concentración y pH",
        "4. Termoquímica, Cinética Química y Equilibrio",
        "5. Química Orgánica, Hidrocarburos y Polímeros"
      ];
    } else if (gNum === '6') {
      customTitles = [
        "1. Mecánica Avanzada, Movimiento Circular y Torque",
        "2. Electrostática, Campo Eléctrico y Ley de Coulomb",
        "3. Circuitos Eléctricos y Ley de Ohm",
        "4. Electromagnetismo e Inducción Electromagnética",
        "5. Termodinámica, Física Moderna y Relatividad"
      ];
    }
  } else if (subjectKey === 'matematica') {
    if (gNum === '1') {
      customTitles = [
        "1. Conjunto de los Números Enteros (Z) y Operaciones",
        "2. Conjunto de los Números Racionales (Q) y Fracciones",
        "3. Razones, Proporciones y Porcentajes",
        "4. Geometría Plana: Ángulos, Rectas y Polígonos",
        "5. Estadística Descriptiva y Recolección de Datos"
      ];
    } else if (gNum === '2') {
      customTitles = [
        "1. Expresiones Algebraicas y Polinomios",
        "2. Operaciones con Polinomios (Suma, Resta y Multiplicación)",
        "3. Ecuaciones e Inecuaciones de Primer Grado",
        "4. Geometría de Triángulos y Teorema de Pitágoras",
        "5. Estadística y Probabilidad Básica"
      ];
    } else if (gNum === '3') {
      customTitles = [
        "1. Productos y Cocientes Notables",
        "2. Factorización de Expresiones Algebraicas",
        "3. Ecuaciones Cuadráticas y Racionales",
        "4. Funciones y Gráficas (Lineal y Cuadrática)",
        "5. Trigonometría Básica y Razones Trigonométricas"
      ];
    }
  } else if (subjectKey === 'ciencias_sociales') {
    if (gNum === '1') {
      customTitles = [
        "1. Geografía Física General y Representación de la Tierra",
        "2. Geografía Física de la Isla de Santo Domingo",
        "3. Las Primeras Civilizaciones de la Antigüedad",
        "4. Grecia y Roma Clásicas: Democracia y República",
        "5. Edad Media y Feudalismo en Europa"
      ];
    } else if (gNum === '2') {
      customTitles = [
        "1. Geografía Humana y Población Mundial",
        "2. Los Aborígenes de la Española (Taínos) y las Antillas",
        "3. Descubrimiento, Conquista y Colonización de América",
        "4. La Sociedad Colonial del Siglo XVI y XVII en Santo Domingo"
      ];
    } else if (gNum === '3') {
      customTitles = [
        "1. El Siglo XVIII en Santo Domingo y la Revolución Francesa",
        "2. La Revolución Haitiana y sus Impactos en la Isla",
        "3. Independencia Nacional Dominicana (1844) y La Trinitaria",
        "4. La Anexión a España y la Guerra de la Restauración (1863-1865)"
      ];
    }
  }

  const defaultUnits = (customTitles || [
    `1. Fundamentos Curriculares e Indagación en ${subName}`,
    `2. Investigación, Modelos y Procedimientos en ${subName}`,
    `3. Resolución de Problemas y Pensamiento Crítico en ${subName}`,
    `4. Proyectos Socioformativos e Innovación en ${subName}`,
    `5. Sostenibilidad, Medio Ambiente y Salud en ${subName}`
  ]).map((title, idx) => ({
    title,
    tipo: idx % 2 === 0 ? "Funcional / Analítico" : "Científico / Aplicado",
    ceIndices: [idx % 3, (idx + 1) % 4, (idx + 2) % 5],
    ilIndices: [idx * 3, idx * 3 + 1, idx * 3 + 2],
    conceptuales: [`Conceptos articuladores de ${title}.`, `Modelos teóricos de ${title}.`],
    procedimentales: [`Investigación documentada y empírica sobre ${title}.`, `Modelación práctica y resolución de problemas.`],
    actitudinales: [`Perseverancia, rigor científico y sentido ético en ${title}.`]
  }));

  return defaultUnits.map((uDef, uIdx) => {
    const ces = uDef.ceIndices.map(idx => officialComps[idx]).filter(Boolean);
    const cesCodes = ces.map(c => c.codigo);
    const cesText = ces.map(c => `[${c.codigo}] ${c.descripcion}`);

    const ilsText = uDef.ilIndices.map((ilIdx, idx) => {
      const allILs = officialComps.flatMap(c => c.indicadores_logro || []);
      const ilObj = allILs[ilIdx] || { codigo: `IL-${ilIdx + 1}`, texto: `Evalúa contenidos de ${uDef.title}` };
      return `[${ilObj.codigo}] ${ilObj.texto}`;
    });

    const ilCodes = uDef.ilIndices.map(ilIdx => `IL-${ilIdx + 1}`);

    const aspectos = ilsText.map((ilStr, idx) => {
      return `Aspecto evaluado en la unidad [${ilCodes[idx]}]: Contextualización de "${ilStr}" aplicada a ${uDef.title}.`;
    });

    return {
      id_unidad: `${subjectKey.toUpperCase().substring(0, 3)}-${cleanGrade}-U${uIdx + 1}`,
      tema: uDef.title,
      nombre_unidad: uDef.title,
      tipo_texto: uDef.tipo,
      competencias_asociadas: cesCodes,
      indicadores_asociados: ilCodes,
      aspectos_indicadores: aspectos,
      ces_alineadas_text: cesText,
      ils_alineados_text: ilsText,
      contenidos: {
        conceptuales: uDef.conceptuales,
        procedimentales: uDef.procedimentales,
        actitudinales: uDef.actitudinales
      },
      competencias_alineadas: [
        {
          fundamental: "Competencias Específicas Oficiales MINERD",
          especifica: cesText.join(' | '),
          indicador_logro: aspectos.join(' | '),
          contenidos: {
            conceptuales: uDef.conceptuales,
            procedimentales: uDef.procedimentales,
            actitudinales: uDef.actitudinales
          }
        }
      ]
    };
  });
}

/**
 * Get exact unit data by Unit ID
 */
export function getUnitById(gradeStr, subjectKey, unitId) {
  const units = getCurriculumUnits(gradeStr, subjectKey);
  return units.find(u => u.id_unidad === unitId) || units[0] || null;
}

/**
 * PRE-RENDER GUARDRAIL: Strict 1:1:1 Parity Validation (CF.length === CE.length === IL.length)
 * Guarantees that every row in the curriculum matrix has exactly 1 Fundamental Competency,
 * 1 Specific Competency, and 1 contextualized Achievement Indicator Aspect.
 */
export function validateAndHarmonizeParityMatrix(matrixRows) {
  if (!Array.isArray(matrixRows) || matrixRows.length === 0) return [];

  // Filter valid rows having required attributes
  const sanitized = matrixRows.filter(r => r && r.fundamental && r.especifica && r.indicador_aspecto);

  const countCF = sanitized.map(r => String(r.fundamental).trim()).filter(Boolean).length;
  const countCE = sanitized.map(r => String(r.especifica).trim()).filter(Boolean).length;
  const countIL = sanitized.map(r => String(r.indicador_aspecto).trim()).filter(Boolean).length;

  if (countCF !== countCE || countCF !== countIL) {
    console.warn(`[Guardrail Paridad 1:1:1 Alert] Discrepancia detectada: CF=${countCF}, CE=${countCE}, IL=${countIL}. Armonizando matriz a paridad estricta 1:1:1...`);
    const minCount = Math.min(countCF, countCE, countIL);
    return sanitized.slice(0, minCount).map((row, idx) => ({
      ...row,
      nro: idx + 1
    }));
  }

  return sanitized.map((row, idx) => ({
    ...row,
    nro: idx + 1
  }));
}
