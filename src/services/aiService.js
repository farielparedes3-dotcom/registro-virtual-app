import { parseUniversalAIResponse } from './aiUniversalParser';

/**
 * Real Multi-AI Authentication & Pedagogy Service for MINERD Ordenanza 04-2023
 */

// 0. Purge simulated/fake tokens from localStorage
export const purgeFakeAiTokens = () => {
  try {
    const token = localStorage.getItem('minerd_copilot_token');
    if (token && (token.includes('MINERD_COPILOT_TOKEN_') || token.includes('MINERD_TOKEN_VERIFIED_'))) {
      localStorage.removeItem('minerd_copilot_token');
      localStorage.removeItem('minerd_copilot_user');
      if (localStorage.getItem('docente_ai_pref') === 'copilot') {
        localStorage.setItem('docente_ai_pref', 'gemini');
        localStorage.setItem('s_ai_provider', 'gemini');
      }
    }
  } catch (e) {
    console.warn('Error purging fake tokens:', e);
  }
};

// Immediately execute token cleanup on import
purgeFakeAiTokens();

// 1. MSAL / Microsoft OAuth 2.0 PKCE Helper for MINERD Copilot (Strict Azure Client ID requirement)
export const loginMicrosoftCopilotPopup = () => {
  return new Promise((resolve, reject) => {
    const azureClientId = import.meta.env.VITE_AZURE_CLIENT_ID;

    if (!azureClientId || azureClientId.startsWith('00000000')) {
      return reject(new Error("La integración directa con Microsoft Copilot requiere un Client ID de Azure registrado oficialmente en Microsoft Entra ID. Utiliza tu clave de Google Gemini o ChatGPT."));
    }

    const redirectUri = window.location.origin;
    const scope = encodeURIComponent('openid profile email User.Read');
    
    const verifier = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    
    localStorage.setItem('minerd_msal_verifier', verifier);

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${azureClientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}&response_mode=fragment`;

    const width = 520;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'MSAL_MINERD_Copilot_Login',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes`
    );

    if (!popup) {
      return reject(new Error("El navegador bloqueó la ventana emergente de autenticación de Microsoft. Permite las ventanas emergentes para iniciar sesión."));
    }

    const timer = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(timer);
          const token = localStorage.getItem('minerd_copilot_token');
          const user = localStorage.getItem('minerd_copilot_user');
          if (token && user) {
            resolve({ token, user });
          } else {
            reject(new Error("Sesión de Microsoft cancelada por el usuario o no completada."));
          }
        }
      } catch (err) {
        // Cross-origin polling catch
      }
    }, 500);
  });
};

// 2. Real Live API Key Verification Endpoint Inspector (Google Gemini prioritized by default)
export const validateAiCredentials = async ({ provider = 'gemini', apiKey }) => {
  if (provider === 'copilot') {
    const existingToken = localStorage.getItem('minerd_copilot_token');
    const existingUser = localStorage.getItem('minerd_copilot_user');
    if (existingToken && existingUser && !existingToken.includes('MINERD_')) {
      return { success: true, user: existingUser, message: `✅ Sesión activa verificada para ${existingUser}` };
    }
    try {
      const res = await loginMicrosoftCopilotPopup();
      return { success: true, user: res.user, message: `✅ Autenticado con éxito como ${res.user}` };
    } catch (err) {
      return { success: false, message: `❌ ${err.message}` };
    }
  }

  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: `❌ Debes ingresar tu API Key de ${provider === 'gemini' ? 'Google AI Studio (Gemini)' : provider.toUpperCase()}` };
  }

  const cleanKey = apiKey.trim();

  try {
    if (provider === 'gemini' || provider === 'school_license') {
      const activeKey = apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY || '';
      if (!activeKey && provider !== 'school_license') {
        throw new Error("❌ No se encontró la clave de API. Por favor activa la Licencia Oficial del Liceo.");
      }
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);
      const data = await res.json();
      if (res.ok && !data.error) {
        return { success: true, message: `✅ Conexión verificada con éxito en Google Gemini API (modelos activos)` };
      }
      return { success: false, message: `❌ Error Google Gemini (${res.status}): ${data.error?.message || 'API Key de Gemini rechazada'}` };
    }

    if (provider === 'chatgpt') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${cleanKey}` }
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        return { success: true, message: `✅ Conexión verificada con éxito con OpenAI (ChatGPT API)` };
      }
      return { success: false, message: `❌ Error OpenAI (${res.status}): ${data.error?.message || 'Clave API no autorizada'}` };
    }

    if (provider === 'claude') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': cleanKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 5,
          messages: [{ role: 'user', content: 'Ping verification' }]
        })
      });
      const data = await res.json();
      if (res.ok || (data.type === 'message' || data.content)) {
        return { success: true, message: `✅ Conexión verificada con éxito con Anthropic Claude API` };
      }
      return { success: false, message: `❌ Error Anthropic Claude (${res.status}): ${data.error?.message || 'Clave API rechazada'}` };
    }
  } catch (err) {
    return { success: false, message: `❌ Error de red al verificar ${provider.toUpperCase()}: ${err.message}` };
  }

  return { success: false, message: `❌ Proveedor de IA no reconocido: ${provider}` };
};

// 3. Topic Cleaner
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

  str = str.replace(/\s+(con|usando|incluyendo)\s+(ejemplos|criterios|niveles|casas|situaciones).*/i, '').trim();

  if (str.length > 0) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str || rawPrompt.trim();
};

// 4. System Prompt Builder
export const buildInstrumentSystemPrompt = (selectedType, subject, grade) => {
  return `
Eres un Asesor Técnico-Pedagógico experto en el currículo dominicano del MINERD (Ordenanza 04-2023).
Tu tarea es generar la estructura de un instrumento de evaluación a partir de la solicitud del docente.

REGLAS CRÍTICAS:
1. EXTRACCIÓN DEL TEMA: El campo 'cleanTopic' DEBE ser el tema formal de la asignatura.
2. TIPO DE INSTRUMENTO: Se usará estrictamente el indicado (${selectedType}). Genera las filas acordes a su naturaleza:
   - 'lista_cotejo': Criterios observables dicotómicos (Sí / No / Puntos).
   - 'escala_estimativa': Criterios con niveles graduales (Excelente 100%, Muy Bueno 80%, Bueno 60%, Insuficiente 40%).
   - 'rubrica_analitica': Criterios con descriptores por los 4 niveles MINERD (Estratégico, Autónomo, Resolutivo, Receptivo).
   - 'rubrica_sintetica': Desempeño global holístico por nivel de logro.
   - 'guia_observacion': Aspectos observables con registro de evidencia y valoración.
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

// 5. Real Multi-AI Instrument Generator (Strict live fetch execution, default Gemini)
export const generateEvaluationInstrumentWithAI = async ({ topic, instrumentType, grade, subject, preferredProvider, customApiKey }) => {
  purgeFakeAiTokens();
  const cleanTopic = cleanTopicString(topic);
  const provider = preferredProvider || localStorage.getItem('docente_ai_pref') || 'gemini';
  const apiKey = customApiKey || localStorage.getItem('docente_ai_key') || localStorage.getItem('s_ai_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';

  const systemPrompt = buildInstrumentSystemPrompt(instrumentType, subject, grade);
  const userPrompt = `Genera un instrumento de evaluación del tipo "${instrumentType}" para el grado "${grade}" y asignatura "${subject}" sobre el tema/actividad: "${cleanTopic}".`;

  let rawText = '';
  let httpError = null;

  if (provider !== 'copilot' && (!apiKey || !apiKey.trim())) {
    throw new Error(`❌ No has ingresado una API Key para ${provider === 'gemini' ? 'Google Gemini' : provider.toUpperCase()}. Configura tu clave gratuita de Google AI Studio en tu Perfil de docente.`);
  }

  try {
    if (provider === 'gemini') {
      const activeKey = apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY || '';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }] })
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(`Google Gemini Error (${response.status}): ${data.error?.message || 'API Key no válida o cuota excedida.'}`);
      }
      rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (provider === 'chatgpt') {
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
            { role: 'user', content: userPrompt }
          ]
        })
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(`OpenAI ChatGPT Error (${response.status}): ${data.error?.message || 'Fallo de autenticación.'}`);
      }
      rawText = data?.choices?.[0]?.message?.content || '';
    } else if (provider === 'claude') {
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
          messages: [{ role: 'user', content: userPrompt }]
        })
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(`Anthropic Claude Error (${response.status}): ${data.error?.message || 'Fallo de autenticación.'}`);
      }
      rawText = data?.content?.[0]?.text || '';
    } else if (provider === 'copilot') {
      const azureClientId = import.meta.env.VITE_AZURE_CLIENT_ID;
      if (!azureClientId || azureClientId.startsWith('00000000')) {
        throw new Error("La integración directa con Microsoft Copilot requiere un Client ID de Azure configurado por el administrador del centro. Selecciona Google Gemini o ChatGPT.");
      }

      const copilotEndpoint = import.meta.env.VITE_COPILOT_ENDPOINT;
      const copilotKey = import.meta.env.VITE_COPILOT_API_KEY || apiKey.trim();

      if (!copilotEndpoint || !copilotKey) {
        throw new Error("Faltan credenciales del servidor Copilot Institucional.");
      }

      const response = await fetch(copilotEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${copilotKey}`
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
      if (response.ok && data?.choices?.[0]?.message?.content) {
        rawText = data.choices[0].message.content;
      } else {
        throw new Error(`Copilot Error (${response.status}): ${data.error?.message || 'No fue posible conectar con Copilot.'}`);
      }
    }
  } catch (err) {
    console.error(`Error en llamada real a motor de IA ${provider}:`, err);
    httpError = err.message;
  }

  if (httpError) {
    throw new Error(`❌ Error al conectar con ${provider === 'gemini' ? 'Google Gemini' : provider.toUpperCase()}: ${httpError}`);
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

  throw new Error(`❌ La respuesta recibida del motor ${provider.toUpperCase()} no pudo ser interpretada como un instrumento válido.`);
};
