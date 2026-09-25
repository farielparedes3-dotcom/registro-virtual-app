import React, { useState, useEffect } from 'react';
import { OFFICIAL_BELL_SCHEDULE, getCurrentBlockInfo, parseTimeToMinutes } from '../config/scheduleConfig';
import docentesHorariosData from '../data/docentesHorarios.json';
import { useUpcomingClasses } from '../hooks/useUpcomingClasses';
import ScheduleTimeline from './dashboard/ScheduleTimeline';

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
const DISPLAY_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

export default function ClassTimelineDashboard({ currentUser, onNavigateToGrade }) {
  if (!currentUser || !docentesHorariosData) return null;

  const [now, setNow] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(() => {
    const dayIdx = new Date().getDay();
    if (dayIdx >= 1 && dayIdx <= 5) {
      return DAY_NAMES[dayIdx];
    }
    return 'Lunes';
  });
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'weekly'
  const upcomingSchedule = useUpcomingClasses(currentUser) || {};

  // Update clock every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Find teacher in schedule data
  const currentEmail = (currentUser?.email || '').toLowerCase();
  const currentName = (currentUser?.name || '').toLowerCase();

  const matchedTeacher = (Array.isArray(docentesHorariosData) ? docentesHorariosData : []).find(t => 
    (t?.email && t.email.toLowerCase() === currentEmail) ||
    (t?.docente && t.docente.toLowerCase() === currentName) ||
    (currentEmail.includes('lohany') && t?.docente && t.docente.includes('Lohany')) ||
    (currentEmail.includes('mario') && t?.docente && t.docente.includes('Mario'))
  ) || docentesHorariosData?.[0] || { docente: currentUser?.name || 'Docente', asignatura: 'Ciencias de la Naturaleza', horario: {} };

  // Get teacher schedule for a specific day
  const getTeacherDaySchedule = (dayKey) => {
    // Normalize day key without accents
    const key = dayKey.replace('é', 'e');
    const dayBlocks = matchedTeacher?.horario?.[key] || matchedTeacher?.horario?.[dayKey] || [];
    
    // Map official 10 blocks (including breaks)
    return OFFICIAL_BELL_SCHEDULE.map(bell => {
      if (bell.isBreak) {
        return {
          ...bell,
          materia: bell.label,
          grado: null,
          tipo: bell.block === 'recreo' ? 'recreo' : 'almuerzo'
        };
      }

      const assigned = dayBlocks.find(b => b.block === bell.block);
      if (assigned) {
        return {
          ...bell,
          materia: assigned.materia,
          grado: assigned.grado,
          tipo: assigned.tipo || 'docencia'
        };
      }

      return {
        ...bell,
        materia: 'Hora Libre',
        grado: null,
        tipo: 'libre'
      };
    });
  };

  const todayKey = DAY_NAMES[now.getDay()];
  const isTodaySelected = selectedDay.replace('é', 'e') === todayKey.replace('é', 'e');
  const activeBlockInfo = isTodaySelected ? getCurrentBlockInfo(now) : { active: false };
  const daySchedule = getTeacherDaySchedule(selectedDay);

  // Type Styling & Icons
  const getTypeBadge = (tipo) => {
    switch (tipo) {
      case 'docencia':
        return { bg: 'rgba(79, 70, 229, 0.12)', color: '#4f46e5', border: '#4f46e5', label: 'Docencia', icon: '📚' };
      case 'administrativo':
        return { bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706', border: '#f59e0b', label: 'Administrativo', icon: '📋' };
      case 'pedagogico':
        return { bg: 'rgba(13, 148, 136, 0.12)', color: '#0d9488', border: '#0d9488', label: 'Pedagógico', icon: '💡' };
      case 'recreo':
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#059669', border: '#10b981', label: 'Recreo Escolar', icon: '☕' };
      case 'almuerzo':
        return { bg: 'rgba(225, 29, 72, 0.12)', color: '#e11d48', border: '#e11d48', label: 'Almuerzo Escolar', icon: '🍽️' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', border: '#9ca3af', label: 'Hora Libre', icon: '⏳' };
    }
  };

  // Active Block details if running
  const activeItem = activeBlockInfo.active && activeBlockInfo.currentBlock
    ? daySchedule.find(item => item.block === activeBlockInfo.currentBlock.block)
    : null;

  return (
    <div className="class-timeline-dashboard" style={{ margin: '1rem 0' }}>
      {/* HEADER BAR */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.5rem',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(147, 51, 234, 0.05) 100%)',
        border: '1px solid rgba(79, 70, 229, 0.2)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.07)',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.6rem' }}>⏰</span>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--primary)', fontWeight: '800' }}>
                Horario Oficial y Timeline de Clases
              </h3>
            </div>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Docente: <strong>{matchedTeacher.docente}</strong> ({matchedTeacher.asignatura})
            </p>
          </div>

          {/* VIEW SWITCHER & CLOCK */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span>🕒</span>
              <span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.3rem', backgroundColor: 'rgba(0,0,0,0.05)', padding: '3px', borderRadius: '10px' }}>
              <button
                type="button"
                className={`btn-tab ${viewMode === 'timeline' ? 'active' : ''}`}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: viewMode === 'timeline' ? 'var(--primary)' : 'transparent',
                  color: viewMode === 'timeline' ? '#fff' : 'var(--text-primary)'
                }}
                onClick={() => setViewMode('timeline')}
              >
                📅 Timeline de Hoy
              </button>
              <button
                type="button"
                className={`btn-tab ${viewMode === 'live' ? 'active' : ''}`}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: viewMode === 'live' ? '#6366F1' : 'transparent',
                  color: viewMode === 'live' ? '#fff' : 'var(--text-primary)'
                }}
                onClick={() => setViewMode('live')}
              >
                ⏱️ Agenda Live (3h)
              </button>
              <button
                type="button"
                className={`btn-tab ${viewMode === 'weekly' ? 'active' : ''}`}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: viewMode === 'weekly' ? 'var(--primary)' : 'transparent',
                  color: viewMode === 'weekly' ? '#fff' : 'var(--text-primary)'
                }}
                onClick={() => setViewMode('weekly')}
              >
                📊 Horario Semanal
              </button>
            </div>
          </div>
        </div>

        {/* ACTIVE CLASS LIVE WIDGET */}
        {isTodaySelected && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed rgba(79, 70, 229, 0.2)' }}>
            {activeBlockInfo.active && activeItem ? (
              <div style={{
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '0.15rem 0.5rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      🔴 En Curso — {activeItem.label} ({activeItem.start} - {activeItem.end})
                    </span>
                    {activeItem.grado && (
                      <span style={{ backgroundColor: '#10b981', color: '#fff', padding: '0.15rem 0.6rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 'bold' }}>
                        Grado {activeItem.grado}
                      </span>
                    )}
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>
                    {activeItem.materia}
                  </h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Countdown Timer */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.85, fontWeight: '600' }}>TIEMPO RESTANTE</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '0.5px' }}>
                      ⏱️ {activeBlockInfo.remainingMinutes} min
                    </div>
                  </div>

                  {/* Quick Action */}
                  {activeItem.grado && onNavigateToGrade && (
                    <button
                      type="button"
                      style={{
                        padding: '0.55rem 1.1rem',
                        backgroundColor: '#ffffff',
                        color: '#4f46e5',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transition: 'transform 0.15s ease'
                      }}
                      onClick={() => onNavigateToGrade(activeItem.grado)}
                    >
                      Ir al Aula {activeItem.grado} ➔
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                border: '1px solid var(--border-color)',
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>
                  {activeBlockInfo.status === 'before_school' 
                    ? `🌅 Clases inician a las 08:00 AM. Próximo bloque: ${activeBlockInfo.nextBlock?.label}`
                    : `🌙 Docencia finalizada por hoy. ¡Excelente labor pedagógica!`}
                </span>
                {activeBlockInfo.nextBlock && (
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                    Próxima: {activeBlockInfo.nextBlock.label} ({activeBlockInfo.nextBlock.start})
                  </span>
                )}
              </div>
            )}

            {/* UPCOMING CLASSES (NEXT 3 HOURS) STRIP */}
            {upcomingSchedule.upcomingBlocks && upcomingSchedule.upcomingBlocks.length > 0 && (
              <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Próximas 3h:
                </span>
                {upcomingSchedule.upcomingBlocks.map((b) => (
                  <span key={b.block + '_' + b.start} style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <strong style={{ color: 'var(--primary)' }}>{b.start}</strong>
                    <span>{b.assignment?.materia || b.label}</span>
                    {b.assignment?.grado && <span style={{ backgroundColor: 'var(--primary)', color: '#fff', padding: '0 0.3rem', borderRadius: '4px', fontSize: '0.7rem' }}>{b.assignment.grado}</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* LIVE SCHEDULE TIMELINE VIEW MODE */}
      {viewMode === 'live' && (
        <ScheduleTimeline 
          currentUser={currentUser} 
          onSelectCourse={(grado) => onNavigateToGrade && onNavigateToGrade(grado)} 
        />
      )}

      {/* TIMELINE VIEW MODE */}
      {viewMode === 'timeline' && (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          {/* DAY FILTER TABS */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {DISPLAY_DAYS.map(day => {
              const isSelected = selectedDay.replace('é', 'e') === day.replace('é', 'e');
              const isToday = todayKey.replace('é', 'e') === day.replace('é', 'e');
              return (
                <button
                  key={day}
                  type="button"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-primary)',
                    color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                    fontWeight: isSelected ? 'bold' : '500',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={() => setSelectedDay(day)}
                >
                  {isToday && <span style={{ fontSize: '0.7rem', backgroundColor: '#10b981', color: '#fff', borderRadius: '50%', width: '8px', height: '8px', display: 'inline-block' }}></span>}
                  {day}
                </button>
              );
            })}
          </div>

          {/* 10 CANONICAL BLOCKS TIMELINE LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {daySchedule.map((item) => {
              const badge = getTypeBadge(item.tipo);
              const isActive = isTodaySelected && activeBlockInfo.active && activeBlockInfo.currentBlock?.block === item.block;

              return (
                <div
                  key={item.block + '_' + item.label}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: isActive ? `2px solid ${badge.border}` : '1px solid var(--border-color)',
                    backgroundColor: isActive ? badge.bg : (item.isBreak ? 'rgba(0,0,0,0.02)' : 'var(--bg-primary)'),
                    boxShadow: isActive ? '0 4px 16px rgba(79, 70, 229, 0.15)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* TIME & BLOCK LABEL */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '180px' }}>
                    <div style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '8px',
                      backgroundColor: isActive ? badge.border : 'var(--bg-secondary)',
                      color: isActive ? '#ffffff' : 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      {item.start} - {item.end}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Duración: {item.duration} min
                      </div>
                    </div>
                  </div>

                  {/* MATERIA & GRADO */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>{badge.icon}</span>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {item.materia}
                      </strong>
                    </div>
                    {item.grado && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        Sección / Aula: <strong>{item.grado}</strong>
                      </div>
                    )}
                  </div>

                  {/* TYPE BADGE & ACTION */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 'bold',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`
                    }}>
                      {badge.label}
                    </span>

                    {item.grado && onNavigateToGrade && (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.78rem',
                          fontWeight: 'bold',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        onClick={() => onNavigateToGrade(item.grado)}
                      >
                        Ver Aula {item.grado}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEKLY GRID TABLE VIEW MODE */}
      {viewMode === 'weekly' && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Bloque / Hora</th>
                {DISPLAY_DAYS.map(day => (
                  <th key={day} style={{ padding: '0.75rem', textAlign: 'center' }}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OFFICIAL_BELL_SCHEDULE.map((bell) => (
                <tr key={bell.block + '_' + bell.start} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 'bold', backgroundColor: 'var(--bg-primary)' }}>
                    <div>{bell.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {bell.start} - {bell.end}
                    </div>
                  </td>
                  {DISPLAY_DAYS.map(day => {
                    const dayBlocks = getTeacherDaySchedule(day);
                    const cell = dayBlocks.find(b => b.block === bell.block);
                    const badge = cell ? getTypeBadge(cell.tipo) : getTypeBadge('libre');

                    return (
                      <td key={day} style={{ padding: '0.5rem', textAlign: 'center', backgroundColor: cell?.isBreak ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
                        {cell && cell.materia !== 'Hora Libre' ? (
                          <div style={{
                            padding: '0.4rem 0.5rem',
                            borderRadius: '8px',
                            backgroundColor: badge.bg,
                            border: `1px solid ${badge.border}`,
                            color: badge.color
                          }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.82rem' }}>{cell.materia}</div>
                            {cell.grado && (
                              <div style={{ fontSize: '0.75rem', fontWeight: '800', marginTop: '2px' }}>
                                Grado {cell.grado}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.5 }}>-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
