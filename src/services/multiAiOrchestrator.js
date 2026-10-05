/**
 * multiAiOrchestrator.js
 * Real Multi-AI Engine Orchestrator with verified user credential enforcement for MINERD 04-2023.
 */

import { generateEvaluationInstrumentWithAI, validateAiCredentials } from './aiService';

export const generateCurricularInstrument = async ({
  grade,
  subject,
  instrumentType,
  documentText = '',
  targetActivity = ''
}) => {
  const systemPrompt = `
    Eres un especialista de alta precisión en evaluación por competencias del MINERD (Ordenanza 04-2023).
    A partir de la planificación pedagógica adjunta, elabora un instrumento de evaluación del tipo: "${instrumentType}".
    Debes centrar la evaluación exclusivamente en la actividad indicada: "${targetActivity || 'Actividad 1'}".

    REGLAS:
    1. Criterios observables y centrados en las evidencias que el estudiante produce en esa actividad.
    2. Si es 'lista_cotejo', genera criterios dicotómicos (Sí/No) con asignación de puntos.
    3. Si es 'escala_estimativa', genera criterios con niveles graduales (Excelente, Muy Bueno, Bueno, Necesita Mejorar).
    4. Si es 'rubrica_analitica', redacta los descriptores por los 4 niveles MINERD (Estratégico, Autónomo, Resolutivo, Receptivo).
    5. Formato de salida: Devuelve estrictamente un objeto JSON válido con el siguiente esquema exacto:
       {
         "cleanTopic": "Tema extraído de la actividad",
         "activityName": "${targetActivity || 'Actividad 1'}",
         "criterios": [
           {
             "criterio": "Texto del criterio observable",
             "puntos": 25,
             "descriptores": {
               "estrategico": "Nivel alto / Excelente",
               "autonomo": "Nivel medio alto / Muy bueno",
               "resolutivo": "Nivel medio / Bueno",
               "receptivo": "Nivel inicial / Necesita mejorar"
             }
           }
         ]
       }
  `;

  const userPayload = `
    Grado: ${grade || 'Secundaria'}
    Asignatura: ${subject || 'General'}
    Tipo de Instrumento: ${instrumentType || 'rubrica_analitica'}
    Actividad solicitada: ${targetActivity || 'Actividad 1'}
    Fragmento de la Planificación:
    ${documentText.slice(0, 4000)}
  `;

  const userPref = localStorage.getItem('docente_ai_pref') || 'copilot';
  const providers = [userPref, 'copilot', 'gemini', 'openai', 'claude'].filter((v, i, a) => a.indexOf(v) === i);

  let lastError = null;

  for (const provider of providers) {
    try {
      console.log(`Ejecutando llamada real a motor pedagógico: ${provider}`);
      const result = await executeAiCall(provider, systemPrompt, userPayload, { grade, subject, instrumentType, targetActivity, documentText });
      if (result && result.criterios && Array.isArray(result.criterios) && result.criterios.length > 0) {
        return result;
      }
    } catch (error) {
      console.warn(`Fallo con el motor real ${provider}:`, error.message);
      lastError = error;
    }
  }

  throw new Error(lastError ? lastError.message : "No fue posible procesar el instrumento. Por favor verifica tus credenciales de IA en 'Mi Perfil'.");
};

const executeAiCall = async (provider, systemPrompt, userPayload, context) => {
  const userApiKey = localStorage.getItem('docente_ai_key') || localStorage.getItem('s_ai_api_key') || '';

  if (provider === 'gemini') {
    return await callGeminiEngine(systemPrompt, userPayload, context, userApiKey);
  } else if (provider === 'openai') {
    return await callOpenAiEngine(systemPrompt, userPayload, userApiKey);
  } else if (provider === 'claude') {
    return await callClaudeEngine(systemPrompt, userPayload, userApiKey);
  } else if (provider === 'copilot') {
    return await callCopilotEngine(systemPrompt, userPayload, userApiKey);
  }
  throw new Error(`Proveedor no soportado: ${provider}`);
};

const callGeminiEngine = async (systemPrompt, userPayload, context, userApiKey) => {
  const topicPrompt = `${context.targetActivity || 'Actividad de planificación'}: ${context.documentText.slice(0, 500)}`;
  
  const rawResult = await generateEvaluationInstrumentWithAI({
    topic: topicPrompt,
    instrumentType: context.instrumentType,
    grade: context.grade,
    subject: context.subject,
    preferredProvider: 'gemini',
    customApiKey: userApiKey
  });

  if (rawResult && rawResult.criteria) {
    return {
      cleanTopic: rawResult.cleanTopic || context.targetActivity || 'Evaluación Curricular',
      activityName: rawResult.activityName || context.targetActivity || 'Actividad Evaluada',
      criterios: rawResult.criteria.map(c => ({
        criterio: c.name || c.criterio,
        puntos: c.weight || c.puntos || 25,
        descriptores: c.descriptors || c.descriptores || {}
      }))
    };
  }
  throw new Error("Respuesta inválida de Gemini.");
};

const callOpenAiEngine = async (systemPrompt, userPayload, userApiKey) => {
  const apiKey = userApiKey || import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("Falta API Key de OpenAI. Ingresa tu clave en 'Mi Perfil'.");

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPayload }
      ]
    })
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(`OpenAI Error (${response.status}): ${data.error?.message || 'Error de autenticación'}`);
  }
  const rawText = data?.choices?.[0]?.message?.content;
  return parseJsonFromResponse(rawText);
};

const callClaudeEngine = async (systemPrompt, userPayload, userApiKey) => {
  const apiKey = userApiKey || import.meta.env.VITE_CLAUDE_API_KEY;
  if (!apiKey) throw new Error("Falta API Key de Anthropic Claude. Ingresa tu clave en 'Mi Perfil'.");

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.trim(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerously-allow-browser': 'true'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPayload }]
    })
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(`Anthropic Claude Error (${response.status}): ${data.error?.message || 'Error de autenticación'}`);
  }
  const rawText = data?.content?.[0]?.text;
  return parseJsonFromResponse(rawText);
};

const callCopilotEngine = async (systemPrompt, userPayload, userApiKey) => {
  const token = localStorage.getItem('minerd_copilot_token');
  const endpoint = import.meta.env.VITE_COPILOT_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
  const apiKey = userApiKey || import.meta.env.VITE_COPILOT_API_KEY;

  if (!token && !apiKey) {
    throw new Error("Se requiere iniciar sesión en Microsoft 365 Copilot Institucional.");
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey || token}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPayload }
      ]
    })
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(`Copilot Error (${response.status}): ${data.error?.message || 'Fallo de conexión'}`);
  }
  const rawText = data?.choices?.[0]?.message?.content;
  return parseJsonFromResponse(rawText);
};

const parseJsonFromResponse = (rawText) => {
  if (!rawText) throw new Error("Respuesta de IA vacía.");
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Formato JSON no encontrado en respuesta.");
  return JSON.parse(jsonMatch[0]);
};
