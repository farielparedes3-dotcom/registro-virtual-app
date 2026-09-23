export const OFFICIAL_BELL_SCHEDULE = [
  { block: 1, label: '1ra Hora', start: '08:00', end: '08:50', duration: 50, isBreak: false },
  { block: 2, label: '2da Hora', start: '08:50', end: '09:35', duration: 45, isBreak: false },
  { block: 3, label: '3ra Hora', start: '09:35', end: '10:20', duration: 45, isBreak: false },
  { block: 'recreo', label: 'Recreo', start: '10:20', end: '10:35', duration: 15, isBreak: true },
  { block: 4, label: '4ta Hora', start: '10:35', end: '11:20', duration: 45, isBreak: false },
  { block: 5, label: '5ta Hora', start: '11:20', end: '12:00', duration: 40, isBreak: false },
  { block: 'almuerzo', label: 'Almuerzo Escolar', start: '12:00', end: '13:00', duration: 60, isBreak: true },
  { block: 6, label: '6ta Hora', start: '13:00', end: '13:40', duration: 40, isBreak: false },
  { block: 7, label: '7ma Hora', start: '13:40', end: '14:20', duration: 40, isBreak: false },
  { block: 8, label: '8va Hora', start: '14:20', end: '15:00', duration: 40, isBreak: false }
];

export const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

export const getCurrentBlockInfo = (date = new Date()) => {
  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  
  for (let i = 0; i < OFFICIAL_BELL_SCHEDULE.length; i++) {
    const item = OFFICIAL_BELL_SCHEDULE[i];
    const startMins = parseTimeToMinutes(item.start);
    const endMins = parseTimeToMinutes(item.end);

    if (currentMinutes >= startMins && currentMinutes < endMins) {
      const elapsed = currentMinutes - startMins;
      const progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / item.duration) * 100)));
      return {
        active: true,
        currentBlock: item,
        nextBlock: OFFICIAL_BELL_SCHEDULE[i + 1] || null,
        progressPercent,
        remainingMinutes: endMins - currentMinutes
      };
    }
  }

  // If before school starts
  const firstBlockStart = parseTimeToMinutes(OFFICIAL_BELL_SCHEDULE[0].start);
  if (currentMinutes < firstBlockStart) {
    return {
      active: false,
      status: 'before_school',
      currentBlock: null,
      nextBlock: OFFICIAL_BELL_SCHEDULE[0],
      progressPercent: 0,
      remainingMinutes: firstBlockStart - currentMinutes
    };
  }

  // If after school ends
  return {
    active: false,
    status: 'after_school',
    currentBlock: null,
    nextBlock: null,
    progressPercent: 100,
    remainingMinutes: 0
  };
};
