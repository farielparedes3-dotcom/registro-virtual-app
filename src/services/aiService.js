/**
 * AI Service for MINERD Ordenanza 04-2023 Instrument Generation & Topic Cleaning
 */

export const cleanTopicString = (rawPrompt) => {
  if (!rawPrompt) return '';
  let str = rawPrompt.trim();

  // Remove common user prompt instruction prefixes
  const patterns = [
    /^(haz|crea|genera|elabora|construye|diseña|has|dame|realiza|redacta)\s+(una|un|el|la|los|las)?\s*(lista de cotejo|rúbrica analítica|rúbrica sintética|rúbrica holística|rúbrica|escala estimativa|guía de observación|instrumento de evaluación|instrumento)?\s*(para|sobre|de|del|en relación a|referente a|con el tema|del tema)?/i,
    /^(lista de cotejo|rúbrica analítica|rúbrica sintética|rúbrica holística|rúbrica|escala estimativa|guía de observación|instrumento de evaluación|instrumento)\s+(para|sobre|de|del|en relación a)?/i,
    /^(para el tema de|sobre el tema de|del tema de|para la|para el|sobre la|sobre el|tema:?)/i
  ];

  for (const p of patterns) {
    str = str.replace(p, '').trim();
  }

  // Remove trailing user prompt clauses
  str = str.replace(/\s+(con|usando|incluyendo)\s+(ejemplos|criterios|niveles|casas|situaciones).*/i, '').trim();

  if (str.length > 0) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str || rawPrompt.trim();
};

export const buildInstrumentSystemPrompt = (selectedType, subject, grade) => {
  return `
Eres un Asesor Técnico-Pedagógico experto en el currículo dominicano del MINERD (Ordenanza 04-2023).
Tu tarea es generar la estructura de un instrumento de evaluación a partir de la solicitud del docente.

REGLAS CRÍTICAS:
1. EXTRACCIÓN DEL TEMA: No repitas comandos del usuario en el tema. Si el usuario escribe "haz una lista de cotejo sobre la materia", el campo 'cleanTopic' DEBE ser exactamente: "La materia y sus propiedades".
2. TIPO DE INSTRUMENTO: Se usará estrictamente el indicado en 'selectedInstrumentType' (${selectedType}). Genera las filas acordes a su naturaleza:
   - Si es 'lista_cotejo': Criterios observables dicotómicos (Sí / No / Puntos).
   - Si es 'escala_estimativa': Criterios con niveles de frecuencia o calidad graduados (Excelente 100%, Muy Bueno 80%, Bueno 60%, Insuficiente 40%).
   - Si es 'rubrica_analitica': Criterios con descriptores por los 4 niveles MINERD (Estratégico, Autónomo, Resolutivo, Receptivo).
   - Si es 'rubrica_sintetica': Desempeño global holístico por nivel de logro.
   - Si es 'guia_observacion': Aspectos observables con registro de evidencia y valoración.
3. CURRICULAR: Alinea los criterios con la asignatura (${subject}) y grado (${grade}).

Devuelve estrictamente un objeto JSON con este formato:
{
  "cleanTopic": "Nombre formal y limpio del contenido curricular",
  "suggestedActivity": "Nombre pedagógico de la actividad (ej: Indagación de Propiedades Físicas)",
  "criterios": [
    {
      "criterio": "Descripción clara del desempeño observable",
      "puntos": 5,
      "descriptores": {}
    }
  ]
}
`;
};
