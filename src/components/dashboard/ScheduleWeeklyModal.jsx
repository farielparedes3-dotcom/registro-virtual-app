import React, { useState } from 'react';
import { OFFICIAL_BELL_SCHEDULE } from '../../config/scheduleConfig';
import docentesData from '../../data/docentesHorarios.json';

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
const DISPLAY_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

export default function ScheduleWeeklyModal({ currentUser, onClose, onSelectCourse }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!currentUser || !docentesData) return null;

  const teacherName = (currentUser?.displayName || currentUser?.name || '').toLowerCase();
  const teacherEmail = (currentUser?.email || '').toLowerCase();

  const teacherRecord = (Array.isArray(docentesData) ? docentesData : []).find(d => 
    (d?.email && d.email.toLowerCase() === teacherEmail) ||
    (teacherName && d?.docente && teacherName.includes(d.docente.toLowerCase())) ||
    (d?.docente && teacherName && d.docente.toLowerCase().includes(teacherName)) ||
    (teacherEmail.includes('mario') && d?.docente && d.docente.toLowerCase().includes('mario'))
  ) || docentesData?.[0] || null;

  const currentDayKey = DAYS[selectedDayIndex];
  const daySchedule = teacherRecord?.horario?.[currentDayKey] || [];

  const getBlockDetails = (bell) => {
    if (bell.isBreak) {
      return {
        materia: bell.label,
        grado: null,
        tipo: bell.block === 'recreo' ? 'recreo' : 'almuerzo',
        icon: bell.block === 'recreo' ? '☕' : '🍽️',
        bg: bell.block === 'recreo' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(225, 29, 72, 0.15)',
        color: bell.block === 'recreo' ? '#34d399' : '#f43f5e'
      };
    }

    const assigned = daySchedule.find(s => s.block === bell.block);
    if (assigned) {
      return {
        materia: assigned.materia,
        grado: assigned.grado,
        tipo: assigned.tipo || 'docencia',
        icon: '📚',
        bg: 'rgba(99, 102, 241, 0.15)',
        color: '#818cf8'
      };
    }

    return {
      materia: 'Hora Libre',
      grado: null,
      tipo: 'libre',
      icon: '⏳',
      bg: 'rgba(148, 163, 184, 0.1)',
      color: '#94a3b8'
    };
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        color: '#fff',
        overflow: 'hidden'
      }}>
        {/* Header Modal */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.4)'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📋 Horario Lectivo Semanal Completo
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Docente: <strong style={{ color: '#38bdf8' }}>{teacherRecord?.docente || teacherName || 'Docente'}</strong> • Ordenanza 04-2023
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#94a3b8',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            ✕
          </button>
        </div>

        {/* Day Selector Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 24px',
          background: 'rgba(15, 23, 42, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          overflowX: 'auto'
        }}>
          {DISPLAY_DAYS.map((dayLabel, idx) => {
            const isActive = selectedDayIndex === idx;
            return (
              <button
                key={dayLabel}
                onClick={() => setSelectedDayIndex(idx)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid #38bdf8' : '1px solid transparent',
                  background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {dayLabel}
              </button>
            );
          })}
        </div>

        {/* Schedule List / Grid */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '12px' }}>
            {OFFICIAL_BELL_SCHEDULE.map((bell) => {
              const info = getBlockDetails(bell);

              return (
                <div
                  key={bell.block}
                  style={{
                    background: info.bg,
                    border: `1px solid ${info.color}33`,
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '1.4rem' }}>{info.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: info.color, textTransform: 'uppercase' }}>
                        {bell.label} ({bell.start} - {bell.end})
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
                        {info.materia}
                      </div>
                      {info.grado && (
                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                          Curso: <strong>{info.grado}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {info.grado && onSelectCourse && (
                    <button
                      onClick={() => {
                        onClose();
                        onSelectCourse(info.grado, info.materia);
                      }}
                      style={{
                        background: info.color,
                        color: '#0f172a',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Ver Aula
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(15, 23, 42, 0.4)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              background: '#334155',
              color: '#fff',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cerrar Horario
          </button>
        </div>
      </div>
    </div>
  );
}
