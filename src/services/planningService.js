/**
 * Planning Service for MINERD Didactic Sequences (Student-Centered & Situated Questions)
 */

export const planningPedagogicalRules = `
REGLAS ESTRICTAS DE REDACCIÓN DE SECUENCIAS DIDÁCTICAS MINERD:

1. SUJETO ACTIVO: EL ESTUDIANTE.
   - PROHIBIDO redactar en términos del docente (NO escribir: "El maestro saluda", "El docente explica", "El facilitador pregunta", "El profesor realiza una dinámica").
   - OBLIGATORIO redactar en términos de las acciones del estudiante:
     * "Los estudiantes se organizan en semicírculo y exploran..."
     * "Los alumnos analizan y responden a la situación problemática..."
     * "En equipos de trabajo, clasifican muestras de materiales del entorno..."
     * "Sintetizan sus conclusiones en un mapa mental y completan su ticket de salida..."

2. PREGUNTAS SITUADAS Y CONTEXTUALIZADAS (CERO CLICHÉS):
   - PROHIBIDO usar preguntas genéricas y abstractas como: "¿Cómo influye este tema en nuestra vida diaria?", "¿Qué importancia tiene?", "¿Qué recuerdan de la clase pasada?".
   - OBLIGATORIO formular preguntas que conecten con objetos cotidianos, el hogar y su comunidad:
     * Ejemplos para 'La Materia':
       - "¿De qué manera podemos comprobar si el aire que infla una vejiga o el gas de la cocina ocupan espacio y tienen masa?"
       - "¿Cuáles objetos de la cocina consideramos materia y cuáles fenómenos (como la luz del bombillo o el calor de la estufa) no lo son y por qué?"
       - "¿Cómo se comportan los ingredientes en nuestra casa cuando se mezclan agua y aceite frente a agua y sal?"

3. VARIEDAD METODOLÓGICA POR SESIONES:
   - Sesión 1: Rutina de pensamiento inductiva ("Veo, Pienso, Me Pregunto") a partir de una situación problema real.
   - Sesión 2: Experimentación guiada, manipulación de materiales o recolección de evidencias.
   - Sesión 3: Modelado conceptual, contraste de hipótesis y debate de resultados.
   - Sesión 4: Socialización y evaluación formativa (coevaluación mediante lista de cotejo y metacognición).
`;

export const generateSituatedQuestion = (topicTitle, sessionNum, subjectName = 'Ciencias') => {
  const topic = topicTitle || 'el tema curricular';
  const cycle = (sessionNum - 1) % 4;

  if (cycle === 0) {
    return `¿De qué manera podemos comprobar en nuestra casa u objetos cotidianos (como el gas de la cocina, el agua o el aire que infla una vejiga) cómo se manifiestan las características de ${topic} en nuestro entorno?`;
  } else if (cycle === 1) {
    return `¿Cuáles objetos o sustancias de la cocina y la comunidad consideramos ${topic} y cuáles fenómenos del hogar (como la luz del bombillo o el calor de la estufa) no lo son y por qué?`;
  } else if (cycle === 2) {
    return `¿Cómo se comportan los ingredientes y materiales de nuestra casa u entorno al interactuar entre sí frente a soluciones de ${topic}?`;
  } else {
    return `¿De qué forma nuestros hallazgos e indagaciones sobre ${topic} aportan soluciones concretas a los problemas del hogar y de nuestra comunidad escolar?`;
  }
};
