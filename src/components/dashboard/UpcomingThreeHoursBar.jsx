import React, { useState } from 'react';
import { useUpcomingClasses } from '../../hooks/useUpcomingClasses';
import ScheduleWeeklyModal from './ScheduleWeeklyModal';

export default function UpcomingThreeHoursBar({ currentUser, onSelectCourse }) {
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  if (!currentUser) return null;

  const upcomingSchedule = useUpcomingClasses(currentUser) || {};
  const visibleBlocks = upcomingSchedule.visibleBlocks || [];
  const currentBlock = upcomingSchedule.currentBlock || null;
  const isSchoolHours = !!upcomingSchedule.isSchoolHours;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(30, 41, 59, 0.7))',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '16px',
      padding: '16px 20px',
      marginTop: '16px',
      marginBottom: '24px',
      color: '#fff',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Widget Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: visibleBlocks.length === 0 ? '0' : '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⏱️ Próximas 3 Horas Lectivas
          </h3>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: '20px',
            background: isSchoolHours ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
            color: isSchoolHours ? '#34d399' : '#94a3b8',
            border: `1px solid ${isSchoolHours ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`
          }}>
            {isSchoolHours ? '● Jornada Activa' : '○ Fuera de Horario'}
          </span>
        </div>

        {/* Header Button: Ver Horario Semanal */}
        <button
          onClick={() => setShowWeeklyModal(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '0.82rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          📋 Ver Horario Semanal
        </button>
      </div>

      {/* Banner Delgado si no hay bloques pendientes */}
      {visibleBlocks.length === 0 ? (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '10px',
          padding: '10px 16px',
          color: '#34d399',
          fontSize: '0.88rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '6px'
        }}>
          <span>✨</span> Has concluido tu carga lectiva por hoy o estás fuera de horario escolar.
        </div>
      ) : (
        /* Horizontal Chips Grid (Strictly max 3 items) */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {visibleBlocks.map((b) => {
            const isActiveNow = currentBlock && currentBlock.block === b.block;

            // Formatear materia y grado
            let displayTitle = 'Hora Libre';
            let displaySub = '';
            let icon = '⏳';
            let isBreakOrLunch = false;

            if (b.isBreak) {
              isBreakOrLunch = true;
              if (b.block === 'recreo') {
                displayTitle = 'Recreo Escolar';
                icon = '☕';
              } else {
                displayTitle = 'Almuerzo Escolar';
                icon = '🍽️';
              }
            } else if (b.assignment?.grado) {
              displayTitle = `${b.assignment.grado} - ${b.assignment.materia}`;
              displaySub = b.assignment.materia;
              icon = '📚';
            }

            return (
              <div
                key={b.block}
                style={{
                  background: isActiveNow
                    ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.3), rgba(147, 51, 234, 0.3))'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isActiveNow
                    ? '1.5px solid #818cf8'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Header Row of Chip */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: isActiveNow ? '#a5b4fc' : '#94a3b8',
                    letterSpacing: '0.03em'
                  }}>
                    {b.label} ({b.start} - {b.end})
                  </span>

                  {isActiveNow && (
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: '#10b981',
                      color: '#0f172a',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      ● EN CURSO
                    </span>
                  )}
                </div>

                {/* Course & Subject Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '2px 0' }}>
                  <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                  <div>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: isActiveNow ? '#ffffff' : '#f1f5f9',
                      lineHeight: '1.2'
                    }}>
                      {displayTitle}
                    </div>
                    {isBreakOrLunch && (
                      <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                        Receso de Jornada
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct Action Button [Abrir Registro] */}
                {b.assignment?.grado && (
                  <button
                    onClick={() => onSelectCourse && onSelectCourse(b.assignment.grado, b.assignment.materia)}
                    style={{
                      background: isActiveNow ? '#6366f1' : 'rgba(99, 102, 241, 0.2)',
                      color: isActiveNow ? '#ffffff' : '#a5b4fc',
                      border: isActiveNow ? 'none' : '1px solid rgba(99, 102, 241, 0.4)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#4f46e5';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isActiveNow ? '#6366f1' : 'rgba(99, 102, 241, 0.2)';
                      e.currentTarget.style.color = isActiveNow ? '#ffffff' : '#a5b4fc';
                    }}
                  >
                    Abrir Registro ➔
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Emergente con el Horario Semanal Completo */}
      {showWeeklyModal && (
        <ScheduleWeeklyModal
          currentUser={currentUser}
          onClose={() => setShowWeeklyModal(false)}
          onSelectCourse={onSelectCourse}
        />
      )}
    </div>
  );
}
