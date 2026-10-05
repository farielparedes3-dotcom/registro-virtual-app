import { parseUniversalAIResponse } from './aiUniversalParser';

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

export const generateEvaluationInstrumentWithAI = async ({ topic, instrumentType, grade, subject, preferredProvider, customApiKey }) => {
  const cleanTopic = cleanTopicString(topic);
  const provider = preferredProvider || localStorage.getItem('docente_ai_pref') || localStorage.getItem('s_ai_provider') || 'copilot';
  const apiKey = customApiKey || localStorage.getItem('docente_ai_key') || localStorage.getItem('s_ai_api_key') || '';

  const systemPrompt = buildInstrumentSystemPrompt(instrumentType, subject, grade);
  const userPrompt = `Genera un instrumento de evaluación del tipo "${instrumentType}" para el grado "${grade}" y asignatura "${subject}" sobre el tema/actividad: "${cleanTopic}".`;

  let rawText = '';

  try {
    if (provider === 'gemini' && apiKey) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }] })
      });
      const data = await response.json();
      rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (provider === 'chatgpt' && apiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      });
      const data = await response.json();
      rawText = data?.choices?.[0]?.message?.content || '';
    } else if (provider === 'claude' && apiKey) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }]
        })
      });
      const data = await response.json();
      rawText = data?.content?.[0]?.text || '';
    } else if (provider === 'copilot') {
      // Institutional Microsoft Copilot endpoint simulation/connector
      console.log('Utilizando motor Copilot Institucional MINERD');
    }
  } catch (err) {
    console.warn(`Error al invocar motor de IA ${provider}:`, err);
  }

  if (rawText) {
    const parsed = parseUniversalAIResponse(rawText, instrumentType);
    if (parsed && parsed.criterios && parsed.criterios.length > 0) {
      return {
        cleanTopic: parsed.cleanTopic || cleanTopic,
        activityName: parsed.activityName || `Evaluación de ${cleanTopic}`,
        maxScore: parsed.maxScore || 25,
        criteria: parsed.criterios.map(c => ({
          name: c.criterio,
          weight: c.puntos || 5,
          levels: c.descriptores || {}
        }))
      };
    }
  }

  // Fallback deterministic generator
  const criteriaNames = [
    `Comprensión y aplicación de conceptos clave en ${cleanTopic}`,
    `Ejecución procedimental y metodología en la actividad`,
    `Análisis crítico y resolución de problemas situados`,
    `Presentación, calidad y rigor del producto final`
  ];

  return {
    cleanTopic,
    activityName: `Evaluación de ${cleanTopic}`,
    maxScore: 25,
    criteria: criteriaNames.map(name => ({
      name,
      weight: 5,
      levels: {
        estrategico: `Demuestra excelencia estratégica y dominio completo en ${name.toLowerCase()}`,
        autonomo: `Demuestra autonomía y lógica consistente en ${name.toLowerCase()}`,
        resolutivo: `Resuelve adecuadamente los aspectos básicos de ${name.toLowerCase()}`,
        receptivo: `Muestra comprensión inicial y receptiva de ${name.toLowerCase()}`
      }
    }))
  };
};
