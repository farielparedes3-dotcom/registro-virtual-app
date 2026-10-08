/**
 * aiUniversalParser.js
 * Universal AI response parser and normalizer for MINERD instruments and unit plans.
 */

export const parseUniversalAIResponse = (rawResponseText, instrumentType) => {
  let cleaned = (rawResponseText || '').trim();

  // 1. Clean Markdown code block wrappers ```json ... ```
  if (cleaned.includes('```')) {
    cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();
  }

  const isInvalidMetaField = (str) => {
    if (!str || typeof str !== 'string') return true;
    const lower = str.toLowerCase();
    return (
      lower.includes('cleantopic') ||
      lower.includes('activityname') ||
      lower.includes('instrumenttype') ||
      lower.includes('criterios:') ||
      lower.includes('array of') ||
      lower.includes('grade:') ||
      lower.includes('subject:') ||
      lower.includes('instrucción') ||
      lower.includes('tema del docente')
    );
  };

  // 2. Extract first valid JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1) {
    try {
      const jsonString = cleaned.substring(firstBrace, lastBrace + 1);
      const data = JSON.parse(jsonString);

      const criteriaArray = data.criterios || data.criteria || data.criteriosEvaluacion || [];

      if (Array.isArray(criteriaArray) && criteriaArray.length > 0) {
        const validCriteria = criteriaArray.filter(c => {
          const name = typeof c === 'string' ? c : (c.criterio || c.nombre || c.name || c.title || '');
          return name && !isInvalidMetaField(name);
        });

        if (validCriteria.length > 0) {
          return {
            cleanTopic: data.cleanTopic || data.tema || data.topic || data.titulo || '',
            activityName: data.activityName || data.actividad || data.activity || data.nombreActividad || '',
            maxScore: data.maxScore || data.puntajeMaximo || data.totalScore || 0,
            criterios: validCriteria.map(c => ({
              criterio: typeof c === 'string' ? c : (c.criterio || c.nombre || c.name || c.title || ''),
              puntos: typeof c === 'object' ? Number(c.puntos || c.weight || c.points || c.score || 5) || 5 : 5,
              descriptores: typeof c === 'object' && c.descriptores && typeof c.descriptores === 'object' ? c.descriptores : {}
            }))
          };
        }
      }
    } catch (e) {
      console.warn("Fallo en parseo directo de JSON, usando extracción por patrones...", e);
    }
  }

  // Fallback: If AI responded in plain text bullet lines, filter out meta lines
  const lines = cleaned.split('\n')
    .filter(l => l.trim().startsWith('-') || l.trim().startsWith('*') || /^\d+[\.\)]/.test(l.trim()))
    .map(l => l.replace(/^[-*\d.)`]+\s*/, '').replace(/`/g, '').trim())
    .filter(l => l.length > 5 && !isInvalidMetaField(l));

  if (lines.length > 0) {
    return {
      cleanTopic: '',
      activityName: '',
      maxScore: 0,
      criterios: lines.map(line => ({
        criterio: line,
        puntos: 5,
        descriptores: {
          estrategico: `Demuestra un dominio excelente y autónomo en: ${line}.`,
          autonomo: `Demuestra buen dominio y comprensión en: ${line}.`,
          resolutivo: `Cumple los aspectos básicos esperados en: ${line}.`,
          receptivo: `Requiere acompañamiento y refuerzo en: ${line}.`
        }
      }))
    };
  }

  // General fallback if AI failed completely
  return {
    cleanTopic: 'Evaluación Curricular',
    activityName: 'Actividad de Evaluación',
    maxScore: 20,
    criterios: [
      {
        criterio: 'Dominio de contenidos y conceptos clave',
        puntos: 5,
        descriptores: {
          estrategico: 'Demuestra dominio absoluto de los conceptos clave.',
          autonomo: 'Comprende y explica los conceptos principales.',
          resolutivo: 'Identifica conceptos básicos con algunas dudas.',
          receptivo: 'Muestra dificultad para identificar los conceptos clave.'
        }
      },
      {
        criterio: 'Aplicación práctica y evidencia de aprendizaje',
        puntos: 5,
        descriptores: {
          estrategico: 'Aplica los conocimientos a situaciones complejas de forma creativa.',
          autonomo: 'Aplica los conocimientos a las actividades asignadas.',
          resolutivo: 'Realiza aplicaciones básicas siguiendo instrucciones.',
          receptivo: 'Requiere guía constante para aplicar lo aprendido.'
        }
      },
      {
        criterio: 'Organización, claridad y presentación del trabajo',
        puntos: 5,
        descriptores: {
          estrategico: 'Presenta evidencias impecables, estructuradas y con lenguaje técnico.',
          autonomo: 'Presenta el trabajo de forma clara y organizada.',
          resolutivo: 'El trabajo presenta estructura básica pero legible.',
          receptivo: 'El trabajo carece de organización y claridad.'
        }
      },
      {
        criterio: 'Pensamiento crítico y capacidad reflexiva',
        puntos: 5,
        descriptores: {
          estrategico: 'Analiza, argumenta y emite juicios críticos fundamentados.',
          autonomo: 'Expresa opiniones y argumentos coherentes sobre el tema.',
          resolutivo: 'Emite comentarios sencillos sin mayor argumentación.',
          receptivo: 'Muestra poca o ninguna reflexión sobre el contenido.'
        }
      }
    ]
  };
};
