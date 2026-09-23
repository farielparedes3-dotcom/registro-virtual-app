import { useState, useEffect } from 'react';
import { OFFICIAL_BELL_SCHEDULE } from '../config/scheduleConfig';
import docentesData from '../data/docentesHorarios.json';

const DAYS_MAP = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function useUpcomingClasses(currentUser) {
  const [scheduleState, setScheduleState] = useState({
    currentBlock: null,
    upcomingBlocks: [],
    statusText: 'Cargando horario...',
    isSchoolHours: false
  });

  useEffect(() => {
    const updateTimeline = () => {
      const now = new Date();
      const dayIndex = now.getDay();
      const dayName = DAYS_MAP[dayIndex];

      if (dayIndex === 0 || dayIndex === 6) {
        setScheduleState({
          currentBlock: null,
          upcomingBlocks: [],
          statusText: 'Fin de semana (Sin actividades lectivas)',
          isSchoolHours: false
        });
        return;
      }

      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const teacherName = currentUser?.displayName || currentUser?.name || '';
      const teacherEmail = currentUser?.email || '';

      const teacherRecord = docentesData.find(d => 
        d.email?.toLowerCase() === teacherEmail.toLowerCase() ||
        (teacherName && teacherName.toLowerCase().includes(d.docente.toLowerCase())) ||
        (d.docente && teacherName.toLowerCase() && d.docente.toLowerCase().includes(teacherName.toLowerCase()))
      ) || docentesData[1]; // Fallback if not specifically found

      const daySchedule = teacherRecord?.horario?.[dayName] || [];

      // Combinar grilla horaria con las materias del docente
      const enrichedSchedule = OFFICIAL_BELL_SCHEDULE.map(bell => {
        const assignment = daySchedule.find(s => s.block === bell.block);
        return {
          ...bell,
          startMin: parseTimeToMinutes(bell.start),
          endMin: parseTimeToMinutes(bell.end),
          assignment: assignment || (bell.isBreak ? null : { materia: 'Hora Libre / Administrativa', grado: null, tipo: 'libre' })
        };
      });

      // Bloque actual
      const active = enrichedSchedule.find(b => currentMinutes >= b.startMin && currentMinutes < b.endMin);

      // Bloques en las próximas 3 horas (180 minutos a futuro)
      const maxFutureMin = currentMinutes + 180;
      const upcoming = enrichedSchedule.filter(b => b.startMin >= currentMinutes && b.startMin <= maxFutureMin);

      setScheduleState({
        currentBlock: active || null,
        upcomingBlocks: upcoming,
        statusText: active ? `En curso: ${active.label}` : 'Fuera de bloque lectivo activo',
        isSchoolHours: currentMinutes >= 480 && currentMinutes <= 900 // Entre 8:00 AM y 3:00 PM
      });
    };

    updateTimeline();
    const interval = setInterval(updateTimeline, 30000); // Evalúa cada 30 segundos
    return () => clearInterval(interval);
  }, [currentUser]);

  return scheduleState;
}

export default useUpcomingClasses;
