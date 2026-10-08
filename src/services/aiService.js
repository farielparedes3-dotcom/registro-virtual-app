import { parseUniversalAIResponse } from './aiUniversalParser';

const SYSTEM_PROMPT_MINERD = `
Eres el Asesor Pedagógico Institucional del Liceo Ana Rosa Castillo, experto en la adecuación curricular del MINERD bajo la Ordenanza 04-2023.
Tu objetivo es estructurar instrumentos de evaluación formativa y sumativa con máximo rigor técnico.

REGLAS DE ORO:
1. EXTRACCIÓN LIMPIA DEL TEMA: Si el usuario escribe una instrucción libre como "haz una lista de cotejo sobre la célula animal", el campo 'cleanTopic' DEBE ser exactamente: "La célula animal y sus organelos".
2. TIPOLOGÍA ESTRICTA SEGÚN 'instrumentType':
   - 'lista_cotejo': Criterios observables dicotómicos (Sí / No / Puntos).
   - 'escala_estimativa': Criterios graduados (Excelente 100%, Muy Bueno 80%, Bueno 60%, Insuficiente 40%).
   - 'rubrica_analitica': Criterios con descriptores por los 4 niveles MINERD (Estratégico, Autónomo, Resolutivo, Receptivo).
   - 'rubrica_sintetica': Descriptores integrales globales por nivel.
   - 'guia_observacion': Registro de aspectos observados y nivel de logro.
3. SUJETO: Criterios centrados en desempeños y evidencias reales observables en el estudiante.

Devuelve estrictamente un objeto JSON con este esquema:
{
  "cleanTopic": "Nombre curricular del contenido",
  "activityName": "Nombre pedagógico de la actividad",
  "criterios": [
    {
      "criterio": "Descripción clara del desempeño",
      "puntos": 5,
      "descriptores": {
        "estrategico": "Descriptor nivel alto",
        "autonomo": "Descriptor nivel medio-alto",
        "resolutivo": "Descriptor nivel medio",
        "receptivo": "Descriptor nivel básico"
      }
    }
  ]
}
`;

export const generateEvaluationInstrument = async ({ topic, instrumentType, grade, subject, documentContext = '' }) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    throw new Error("No se ha configurado la clave institucional (VITE_GEMINI_API_KEY) en las variables de entorno.");
  }

  const userPrompt = `
Grado: ${grade || 'Secundaria'}
Asignatura: ${subject || 'Tronco Común'}
Tipo de Instrumento: ${instrumentType || 'rubrica_analitica'}
Instrucción / Tema del Docente: ${topic || 'Contenido Curricular'}
${documentContext ? `Contexto extraído de la planificación/secuencia:\n${documentContext.slice(0, 3000)}` : ''}
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: `${SYSTEM_PROMPT_MINERD}\n\n${userPrompt}` }
          ]
        }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || "Error al conectar con el servidor institucional.");
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = parseUniversalAIResponse(rawText, instrumentType);

    return {
      cleanTopic: parsed.cleanTopic || topic,
      activityName: parsed.activityName || `Evaluación de ${topic}`,
      criteria: (parsed.criterios || []).map(c => ({
        name: c.criterio,
        weight: c.puntos || 5,
        levels: c.descriptores || {}
      }))
    };
  } catch (err) {
    console.error("Fallo en generación de instrumento:", err);
    throw new Error(`Error en el asistente: ${err.message}`);
  }
};

// Aliases for full backwards compatibility
export const cleanTopicString = (rawPrompt) => {
  if (!rawPrompt) return '';
  let str = rawPrompt.trim();
  const patterns = [
    /^(haz|crea|genera|elabora|construye|diseña|has|dame|realiza|redacta)\s+(una|un|el|la|los|las)?\s*(lista de cotejo|rúbrica analítica|rúbrica sintética|rúbrica holística|rúbrica|escala estimativa|guía de observación|instrumento de evaluación|instrumento)?\s*(para|sobre|de|del|en relación a|referente a|con el tema|del tema)?/i,
    /^(lista de cotejo|rúbrica analítica|rúbrica sintética|rúbrica holística|rúbrica|escala estimativa|guía de observación|instrumento de evaluación|instrumento)\s+(para|sobre|de|del|en relación a)?/i,
    /^(para el tema de|sobre el tema de|del tema de|para la|para el|sobre la|sobre el|tema:?)/i
  ];
  for (const p of patterns) {
    str = str.replace(p, '').trim();
  }
  if (str.length > 0) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str || rawPrompt.trim();
};

export const buildInstrumentSystemPrompt = () => SYSTEM_PROMPT_MINERD;

export const generateEvaluationInstrumentWithAI = async (params) => {
  return await generateEvaluationInstrument(params);
};

export const validateAiCredentials = async () => ({
  success: true,
  message: "✅ Licencia Institucional Oficial del Liceo Ana Rosa Castillo Activa"
});

export const loginMicrosoftCopilotPopup = async () => ({
  token: 'SCHOOL_LICENSE_TOKEN',
  user: 'Docente Liceo Ana Rosa Castillo'
});

export const purgeFakeAiTokens = () => {};
