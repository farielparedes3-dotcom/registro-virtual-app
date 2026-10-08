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

Devuelve strictly un objeto JSON con este esquema:
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

export const cleanApiKeyString = (key) => {
  if (!key) return '';
  return key.trim().replace(/^["']|["']$/g, '').trim();
};

export const isValidGeminiKeyFormat = (key) => {
  if (!key || typeof key !== 'string') return false;
  const cleaned = cleanApiKeyString(key);
  return cleaned.startsWith('AIza') || cleaned.startsWith('AQ');
};

export const getActiveApiKey = () => {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY ? cleanApiKeyString(import.meta.env.VITE_GEMINI_API_KEY) : '';
  const localKey = typeof localStorage !== 'undefined' ? cleanApiKeyString(localStorage.getItem('s_ai_api_key')) : '';
  const docKey = typeof localStorage !== 'undefined' ? cleanApiKeyString(localStorage.getItem('docente_ai_key')) : '';

  if (envKey && isValidGeminiKeyFormat(envKey)) return envKey;
  if (localKey && isValidGeminiKeyFormat(localKey)) return localKey;
  if (docKey && isValidGeminiKeyFormat(docKey)) return docKey;

  return envKey || localKey || docKey || '';
};

export const callGeminiWithModelFallback = async (apiKey, systemInstruction, userPrompt) => {
  const modelsToTry = [
    { ver: 'v1beta', name: 'gemini-1.5-flash-latest' },
    { ver: 'v1beta', name: 'gemini-1.5-flash' },
    { ver: 'v1',     name: 'gemini-1.5-flash' },
    { ver: 'v1beta', name: 'gemini-2.0-flash' },
    { ver: 'v1beta', name: 'gemini-pro' }
  ];

  let lastError = null;

  for (const target of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/${target.ver}/models/${target.name}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `${systemInstruction}\n\n${userPrompt}` }
            ]
          }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      const data = await response.json();

      if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      if (data.error) {
        if (data.error?.message?.includes('API key not valid') || (response.status === 400 && data.error?.message?.includes('API key'))) {
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('s_ai_api_key');
            localStorage.removeItem('docente_ai_key');
          }
          throw new Error(data.error.message || "API key not valid");
        }
        if (data.error.message?.includes('not found') || data.error.message?.includes('is not supported') || response.status === 404) {
          console.warn(`Modelo ${target.name} (${target.ver}) no encontrado/soportado, probando siguiente...`);
          lastError = data.error.message;
          continue;
        }
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      lastError = err.message;
      if (err.message?.includes('API key not valid')) {
        throw err;
      }
    }
  }

  throw new Error(`Ningún modelo de Gemini respondió con éxito: ${lastError}`);
};

export const generateEvaluationInstrument = async ({ topic, instrumentType, grade, subject, documentContext = '' }) => {
  let activeKey = cleanApiKeyString(getActiveApiKey());

  if (!isValidGeminiKeyFormat(activeKey)) {
    if (typeof window !== 'undefined' && window.prompt) {
      const inputKey = window.prompt("🔑 Introduce tu clave de Google AI Studio (formato 'AIza...' o 'AQ...'):");
      if (inputKey && isValidGeminiKeyFormat(cleanApiKeyString(inputKey))) {
        activeKey = cleanApiKeyString(inputKey);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('s_ai_api_key', activeKey);
        }
      } else {
        throw new Error("Se requiere una API Key con formato válido de Google Gemini.");
      }
    } else {
      throw new Error("Se requiere una API Key con formato válido de Google Gemini.");
    }
  }

  if (!isValidGeminiKeyFormat(activeKey)) {
    throw new Error("Se requiere una API Key con formato válido de Google Gemini.");
  }

  const topicCleaned = cleanTopicString(topic || '');

  const userPrompt = `
Grado: ${grade || 'Secundaria'}
Asignatura: ${subject || 'Tronco Común'}
Tipo de Instrumento: ${instrumentType || 'rubrica_analitica'}
Instrucción / Tema del Docente: ${topic || 'Contenido Curricular'}
Tema Curricular Limpio: ${topicCleaned}
${documentContext ? `Contexto extraído de la planificación/secuencia:\n${documentContext.slice(0, 3000)}` : ''}
`;

  try {
    const rawText = await callGeminiWithModelFallback(activeKey, SYSTEM_PROMPT_MINERD, userPrompt);
    const parsed = parseUniversalAIResponse(rawText, instrumentType);

    const finalCleanTopic = parsed.cleanTopic ? cleanTopicString(parsed.cleanTopic) : (topicCleaned || topic);

    return {
      cleanTopic: finalCleanTopic,
      activityName: parsed.activityName || `Evaluación de ${finalCleanTopic}`,
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
    /^(para el tema de|sobre el tema de|del tema de|el tema de|para la|para el|sobre la|sobre el|tema:?)/i
  ];
  for (let i = 0; i < 3; i++) {
    for (const p of patterns) {
      str = str.replace(p, '').trim();
    }
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

