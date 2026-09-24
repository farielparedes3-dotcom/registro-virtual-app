import { useState, useEffect } from 'react';
import { OFFICIAL_BELL_SCHEDULE, parseTimeToMinutes } from '../config/scheduleConfig';
import docentesData from '../data/docentesHorarios.json';

const DAYS_MAP = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

export function useUpcomingClasses(currentUser) {
  const [scheduleState, setScheduleState] = useState({
    visibleBlocks: [],
    pendingBlocksToday: [],
    currentBlock: null,
    todaySchedule: [],
    statusText: 'Cargando horario...',
    isSchoolHours: false,
    isWeekend: false
  });

  useEffect(() => {
    const updateTimeline = () => {
      const now = new Date();
      const dayIndex = now.getDay();
      const dayName = DAYS_MAP[dayIndex];

      // 1. Verificar si es fin de semana (Domingo: 0, Sábado: 6)
      if (dayIndex === 0 || dayIndex === 6) {
        setScheduleState({
          visibleBlocks: [],
          pendingBlocksToday: [],
          currentBlock: null,
          todaySchedule: [],
          statusText: 'Fin de semana (Sin actividades lectivas)',
          isSchoolHours: false,
          isWeekend: true
        });
        return;
      }

      // 2. Obtener hora actual en minutos (ej: 08:30 = 8 * 60 + 30 = 510)
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // 3. Buscar horario docente asignado
      const teacherName = currentUser?.displayName || currentUser?.name || '';
      const teacherEmail = currentUser?.email || '';

      const teacherRecord = docentesData.find(d => 
        (d.email && d.email.toLowerCase() === teacherEmail.toLowerCase()) ||
        (teacherName && teacherName.toLowerCase().includes(d.docente.toLowerCase())) ||
        (d.docente && teacherName && d.docente.toLowerCase().includes(teacherName.toLowerCase()))
      ) || docentesData[1]; // Fallback predeterminado

      const daySchedule = teacherRecord?.horario?.[dayName] || [];

      // 4. Mapear la grilla de la jornada escolar oficial (10 bloques incluyendo recreos)
      const todaySchedule = OFFICIAL_BELL_SCHEDULE.map(bell => {
        const startMinutes = parseTimeToMinutes(bell.start);
        const endMinutes = parseTimeToMinutes(bell.end);
        
        let assignment = null;
        if (!bell.isBreak) {
          const found = daySchedule.find(s => s.block === bell.block);
          if (found) {
            assignment = {
              materia: found.materia,
              grado: found.grado,
              tipo: found.tipo || 'docencia'
            };
          } else {
            assignment = {
              materia: 'Hora Libre',
              grado: null,
              tipo: 'libre'
            };
          }
        }

        return {
          ...bell,
          startMinutes,
          endMinutes,
          startMin: startMinutes,
          endMin: endMinutes,
          assignment,
          isBreak: !!bell.isBreak
        };
      });

      // 5. Bloque activo actual
      const currentBlock = todaySchedule.find(b => currentMinutes >= b.startMinutes && currentMinutes < b.endMinutes) || null;

      // 6. Filtrar bloques del día actual que terminen después de la hora actual
      const pendingBlocksToday = todaySchedule.filter(b => b.endMinutes > currentMinutes);

      // 7. Limitar de forma estricta a un máximo de 3 elementos
      const visibleBlocks = pendingBlocksToday.slice(0, 3);

      const isSchoolHours = currentMinutes >= 480 && currentMinutes <= 900; // Entre 8:00 AM y 3:00 PM

      setScheduleState({
        visibleBlocks,
        pendingBlocksToday,
        currentBlock,
        todaySchedule,
        statusText: currentBlock ? `En curso: ${currentBlock.label}` : 'Fuera de bloque lectivo activo',
        isSchoolHours,
        isWeekend: false
      });
    };

    updateTimeline();
    const interval = setInterval(updateTimeline, 20000); // Actualización periódica
    return () => clearInterval(interval);
  }, [currentUser]);

  return scheduleState;
}

export default useUpcomingClasses;
