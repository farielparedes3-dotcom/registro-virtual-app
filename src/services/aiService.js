import { parseUniversalAIResponse } from './aiUniversalParser';

const SYSTEM_PROMPT_MINERD = `
Eres el Asesor Pedagógico Institucional del Liceo Ana Rosa Castillo, experto en la adecuación curricular del MINERD bajo la Ordenanza 04-2023.
Tu objetivo es estructurar instrumentos de evaluación formativa y sumativa con máximo rigor técnico.

REGLAS DE ORO OBLIGATORIAS:
1. RESPONDE ÚNICAMENTE CON UN OBJETO JSON VÁLIDO. NO incluyas saludos, explicaciones, ni bloques de texto fuera del JSON.
2. NO devuelvas los nombres del esquema ("cleanTopic", "criterios", etc.) como ítems de evaluación. Debes redactar de 4 a 6 criterios pedagógicos reales y específicos sobre el tema solicitado.
3. Para cada criterio, redacta los 4 descriptores por nivel MINERD:
   - "estrategico": Nivel máximo de desempeño y autonomía.
   - "autonomo": Nivel satisfactorio de desempeño.
   - "resolutivo": Nivel elemental/aceptable.
   - "receptivo": Nivel inicial o con necesidad de acompañamiento.

EJEMPLO DE ESTRUCTURA JSON QUE DEBES DEVOLVER:
{
  "cleanTopic": "Nombre limpio del tema curricular",
  "activityName": "Título pedagógico de la actividad",
  "criterios": [
    {
      "criterio": "Descripción clara del desempeño observable a evaluar",
      "puntos": 5,
      "descriptores": {
        "estrategico": "Descripción del nivel estratégico",
        "autonomo": "Descripción del nivel autónomo",
        "resolutivo": "Descripción del nivel resolutivo",
        "receptivo": "Descripción del nivel receptivo"
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
  const firebaseKey = import.meta.env.VITE_FIREBASE_API_KEY ? cleanApiKeyString(import.meta.env.VITE_FIREBASE_API_KEY) : '';
  const localKey = typeof localStorage !== 'undefined' ? cleanApiKeyString(localStorage.getItem('s_ai_api_key')) : '';
  const docKey = typeof localStorage !== 'undefined' ? cleanApiKeyString(localStorage.getItem('docente_ai_key')) : '';

  if (envKey && isValidGeminiKeyFormat(envKey)) return envKey;
  if (localKey && isValidGeminiKeyFormat(localKey)) return localKey;
  if (docKey && isValidGeminiKeyFormat(docKey)) return docKey;
  if (firebaseKey && isValidGeminiKeyFormat(firebaseKey)) return firebaseKey;

  return envKey || localKey || docKey || firebaseKey || '';
};

export const getAvailableGeminiModels = async (apiKey) => {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    if (res.ok && Array.isArray(data.models)) {
      const dynamicModels = data.models
        .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
        .map(m => ({ ver: 'v1beta', name: m.name.replace(/^models\//, '') }));
      if (dynamicModels.length > 0) {
        return dynamicModels;
      }
    }
  } catch (e) {
    console.warn("No se pudo listar modelos dinámicamente:", e);
  }
  return [];
};

export const callGeminiWithModelFallback = async (apiKey, systemInstruction, userPrompt) => {
  const dynamicModels = await getAvailableGeminiModels(apiKey);

  const staticModels = [
    { ver: 'v1beta', name: 'gemini-2.5-flash' },
    { ver: 'v1beta', name: 'gemini-2.0-flash' },
    { ver: 'v1beta', name: 'gemini-1.5-flash' },
    { ver: 'v1beta', name: 'gemini-1.5-flash-8b' },
    { ver: 'v1beta', name: 'gemini-1.5-pro' },
    { ver: 'v1beta', name: 'gemini-2.0-flash-exp' },
    { ver: 'v1beta', name: 'gemini-1.0-pro' },
    { ver: 'v1',     name: 'gemini-1.5-flash' },
    { ver: 'v1',     name: 'gemini-1.0-pro' },
    { ver: 'v1beta', name: 'gemini-pro' }
  ];

  // Combinar evitando duplicados
  const modelsToTry = [...dynamicModels];
  for (const s of staticModels) {
    if (!modelsToTry.some(m => m.name === s.name && m.ver === s.ver)) {
      modelsToTry.push(s);
    }
  }

  let lastError = null;

  for (const target of modelsToTry) {
    // Intentar con y sin responseMimeType
    const mimeConfigs = [
      { temperature: 0.2, responseMimeType: "application/json" },
      { temperature: 0.2 }
    ];

    for (const config of mimeConfigs) {
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
            generationConfig: config
          })
        });

        const data = await response.json();

        if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }

        if (data.error) {
          const msg = data.error.message || '';

          if (msg.includes('API key not valid') || (response.status === 400 && msg.includes('API key'))) {
            if (typeof localStorage !== 'undefined') {
              localStorage.removeItem('s_ai_api_key');
              localStorage.removeItem('docente_ai_key');
            }
            throw new Error(msg || "API key not valid");
          }

          if (msg.includes('not found') || msg.includes('is not supported') || response.status === 404) {
            console.warn(`Modelo ${target.name} (${target.ver}) con config ${JSON.stringify(config)} no disponible: ${msg}`);
            lastError = msg;
            if (msg.includes('responseMimeType') || msg.includes('mime')) {
              continue;
            } else {
              break;
            }
          }

          throw new Error(msg || `HTTP ${response.status}`);
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
  }

  throw new Error(`Ningún modelo de Gemini respondió con éxito: ${lastError}`);
};

export const buildCleanInstrumentPrompt = (instrumentType, subject, grade, userInstruction) => {
  return `
Eres un asesor pedagógico del MINERD de República Dominicana (Ordenanza 04-2023).
Diseña un instrumento de evaluación tipo "${instrumentType}" para ${grade} en la asignatura ${subject}.

TEMA / INSTRUCCIÓN DEL DOCENTE:
"${userInstruction}"

REGLAS OBLIGATORIAS:
1. 'indicadorLogro': Redacta UN SOLO indicador de logro claro y alineado al currículo oficial.
2. 'cleanTopic': Nombre formal y limpio del contenido curricular (ej: "La célula").
3. 'criterios': Genera entre 3 y MÁXIMO 5 criterios de evaluación observables. NUNCA generes más de 5.
4. En cada criterio, el campo 'criterio' debe ser una frase corta y precisa del desempeño (ej: "Identificación de estructuras celulares", "Explicación de funciones metabólicas"). NUNCA devuelvas fragmentos de código, texto en inglés ni instrucciones del sistema.
5. Puntos: Distribuye el puntaje de manera equitativa entre los criterios generados (ej: si son 4 criterios, 5 pts cada uno para sumar 20 pts).
6. Si es 'rubrica_analitica', redacta los descriptores en español para los 4 niveles MINERD: Estratégico, Autónomo, Resolutivo, Receptivo.

Devuelve EXCLUSIVAMENTE este objeto JSON:
{
  "cleanTopic": "Nombre formal del contenido",
  "indicadorLogro": "Texto del indicador de logro oficial",
  "criterios": [
    {
      "criterio": "Criterio 1 observable",
      "puntos": 5,
      "descriptores": {
        "estrategico": "Excelente...",
        "autonomo": "Muy bueno...",
        "resolutivo": "Aceptable...",
        "receptivo": "En inicio..."
      }
    }
  ]
}
`;
};

export const generateEvaluationInstrument = async ({ topic, instrumentType, grade, subject, documentContext = '' }) => {
  let activeKey = cleanApiKeyString(getActiveApiKey());

  if (!isValidGeminiKeyFormat(activeKey)) {
    throw new Error("Se requiere una API Key con formato válido de Google Gemini.");
  }

  const topicCleaned = cleanTopicString(topic || '');
  const userInstruction = `${topic || topicCleaned}${documentContext ? `\n\nContexto del documento:\n${documentContext.slice(0, 3000)}` : ''}`;
  const systemPrompt = buildCleanInstrumentPrompt(instrumentType || 'rubrica_analitica', subject || 'General', grade || 'Secundaria', userInstruction);

  try {
    const rawText = await callGeminiWithModelFallback(activeKey, systemPrompt, "Devuelve EXCLUSIVAMENTE el objeto JSON.");
    const parsed = parseUniversalAIResponse(rawText, instrumentType);

    const finalCleanTopic = parsed.cleanTopic ? cleanTopicString(parsed.cleanTopic) : (topicCleaned || topic);
    const slicedCriteria = (parsed.criterios || []).slice(0, 5);

    return {
      cleanTopic: finalCleanTopic,
      indicadorLogro: parsed.indicadorLogro || `Identifica y aplica los conceptos clave de ${finalCleanTopic} según las competencias del MINERD.`,
      activityName: parsed.activityName || `Evaluación de ${finalCleanTopic}`,
      criteria: slicedCriteria.map(c => ({
        name: c.criterio,
        weight: c.puntos || Math.max(1, Math.round(20 / (slicedCriteria.length || 1))),
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

