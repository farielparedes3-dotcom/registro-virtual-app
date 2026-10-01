/**
 * multiAiOrchestrator.js
 * Multi-AI reasoning engine with chained fallback for MINERD 04-2023 evaluation instruments.
 */

import { generateEvaluationInstrumentWithAI } from './aiService';

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

  const providers = ['gemini', 'openai', 'claude', 'copilot'];

  for (const provider of providers) {
    try {
      console.log(`Intentando generación pedagógica con motor: ${provider}`);
      const result = await executeAiCall(provider, systemPrompt, userPayload, { grade, subject, instrumentType, targetActivity, documentText });
      if (result && result.criterios && Array.isArray(result.criterios) && result.criterios.length > 0) {
        return result;
      }
    } catch (error) {
      console.warn(`Fallo con el motor ${provider}, alternando al siguiente...`, error);
    }
  }

  throw new Error("No fue posible procesar el instrumento con ninguno de los motores de IA configurados.");
};

const executeAiCall = async (provider, systemPrompt, userPayload, context) => {
  switch (provider) {
    case 'gemini':
      return await callGeminiEngine(systemPrompt, userPayload, context);
    case 'openai':
      return await callOpenAiEngine(systemPrompt, userPayload);
    case 'claude':
      return await callClaudeEngine(systemPrompt, userPayload);
    case 'copilot':
      return await callCopilotEngine(systemPrompt, userPayload);
    default:
      throw new Error(`Proveedor no soportado: ${provider}`);
  }
};

const callGeminiEngine = async (systemPrompt, userPayload, context) => {
  // Use existing primary Gemini engine
  const topicPrompt = `${context.targetActivity || 'Actividad de planificación'}: ${context.documentText.slice(0, 500)}`;
  try {
    const rawResult = await generateEvaluationInstrumentWithAI({
      topic: topicPrompt,
      instrumentType: context.instrumentType,
      grade: context.grade,
      subject: context.subject
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
  } catch (err) {
    console.warn("Gemini engine direct call error:", err);
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY no configurada");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${systemPrompt}\n\n${userPayload}` }]
      }]
    })
  });

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return parseJsonFromResponse(rawText);
};

const callOpenAiEngine = async (systemPrompt, userPayload) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("VITE_OPENAI_API_KEY no configurada");

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
        { role: 'user', content: userPayload }
      ],
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;
  return parseJsonFromResponse(rawText);
};

const callClaudeEngine = async (systemPrompt, userPayload) => {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  if (!apiKey) throw new Error("VITE_CLAUDE_API_KEY no configurada");

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
      messages: [{ role: 'user', content: userPayload }]
    })
  });

  const data = await response.json();
  const rawText = data?.content?.[0]?.text;
  return parseJsonFromResponse(rawText);
};

const callCopilotEngine = async (systemPrompt, userPayload) => {
  const endpoint = import.meta.env.VITE_COPILOT_ENDPOINT;
  const apiKey = import.meta.env.VITE_COPILOT_API_KEY;
  if (!endpoint) throw new Error("VITE_COPILOT_ENDPOINT no configurada");

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'api-key': apiKey } : {})
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPayload }
      ]
    })
  });

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;
  return parseJsonFromResponse(rawText);
};

const parseJsonFromResponse = (rawText) => {
  if (!rawText) throw new Error("Respuesta de IA vacía.");

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Formato JSON no encontrado en respuesta.");

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed;
};
