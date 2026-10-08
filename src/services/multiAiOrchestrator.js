import { generateEvaluationInstrument } from './aiService';

export const generateCurricularInstrument = async ({
  grade,
  subject,
  instrumentType,
  documentText = '',
  targetActivity = ''
}) => {
  const result = await generateEvaluationInstrument({
    topic: targetActivity || 'Evaluación Curricular',
    instrumentType: instrumentType || 'rubrica_analitica',
    grade: grade || 'Secundaria',
    subject: subject || 'General',
    documentContext: documentText
  });

  return {
    cleanTopic: result.cleanTopic || targetActivity || 'Evaluación Curricular',
    activityName: result.activityName || targetActivity || 'Actividad Evaluada',
    criterios: (result.criteria || []).map(c => ({
      criterio: c.name || c.criterio,
      puntos: c.weight || c.puntos || 5,
      descriptores: c.levels || c.descriptores || {}
    }))
  };
};
