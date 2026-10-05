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

  // 2. Extract first valid JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    try {
      const jsonString = cleaned.substring(firstBrace, lastBrace + 1);
      const data = JSON.parse(jsonString);

      const criteriaArray = data.criterios || data.criteria || data.criteriosEvaluacion || [];

      return {
        cleanTopic: data.cleanTopic || data.tema || data.topic || data.titulo || '',
        activityName: data.activityName || data.actividad || data.activity || data.nombreActividad || '',
        maxScore: data.maxScore || data.puntajeMaximo || data.totalScore || 0,
        criterios: Array.isArray(criteriaArray) ? criteriaArray.map(c => ({
          criterio: typeof c === 'string' ? c : (c.criterio || c.nombre || c.name || c.title || ''),
          puntos: typeof c === 'object' ? Number(c.puntos || c.weight || c.points || c.score || 5) || 5 : 5,
          descriptores: typeof c === 'object' ? (c.descriptores || c.levels || c.niveles || {}) : {}
        })) : []
      };
    } catch (e) {
      console.warn("Fallo en parseo directo de JSON, usando extracción por patrones...", e);
    }
  }

  // Fallback: If AI responded in plain text bullet lines
  const lines = cleaned.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('*') || /^\d+[\.\)]/.test(l.trim()));
  return {
    cleanTopic: '',
    activityName: '',
    maxScore: 0,
    criterios: lines.map(line => ({
      criterio: line.replace(/^[-*\d.)]+\s*/, '').trim(),
      puntos: 5,
      descriptores: {}
    }))
  };
};
