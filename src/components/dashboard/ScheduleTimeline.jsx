import React from 'react';
import { useUpcomingClasses } from '../../hooks/useUpcomingClasses';

export default function ScheduleTimeline({ currentUser, onSelectCourse }) {
  const { currentBlock, upcomingBlocks, isSchoolHours } = useUpcomingClasses(currentUser);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '16px',
      padding: '20px',
      marginTop: '16px',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⏱️ Mi Agenda en Vivo (Próximas 3 Horas)
        </h3>
        <span style={{
          fontSize: '0.8rem',
          padding: '4px 10px',
          borderRadius: '20px',
          background: isSchoolHours ? '#10B98122' : '#6B728033',
          color: isSchoolHours ? '#34D399' : '#9CA3AF',
          border: '1px solid currentColor'
        }}>
          {isSchoolHours ? '● Jornada Activa' : '○ Fuera de Horario'}
        </span>
      </div>

      {/* BLOQUE EN CURSO */}
      {currentBlock && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25))',
          border: '1px solid #818CF8',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#A5B4FC', fontWeight: 700 }}>
              ● EN CLASE AHORA ({currentBlock.start} - {currentBlock.end})
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 'bold', marginTop: '4px' }}>
              {currentBlock.isBreak ? currentBlock.label : (currentBlock.assignment?.materia || 'Hora Libre')}
            </div>
            {currentBlock.assignment?.grado && (
              <div style={{ fontSize: '0.9rem', color: '#E0E7FF' }}>
                Curso: <strong>{currentBlock.assignment.grado}</strong>
              </div>
            )}
          </div>
          {currentBlock.assignment?.grado && onSelectCourse && (
            <button
              onClick={() => onSelectCourse(currentBlock.assignment.grado)}
              style={{
                background: '#6366F1',
                color: '#fff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Ir a Registro
            </button>
          )}
        </div>
      )}

      {/* TIMELINE PRÓXIMOS BLOQUES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {upcomingBlocks.length === 0 ? (
          <div style={{ color: '#9CA3AF', fontSize: '0.9rem', fontStyle: 'italic' }}>
            No hay más bloques programados para las próximas 3 horas.
          </div>
        ) : (
          upcomingBlocks.map((b, idx) => (
            <div key={idx} style={{
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '12px'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                {b.label} • {b.start} - {b.end}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>
                {b.isBreak ? b.label : (b.assignment?.materia || 'Hora Libre')}
              </div>
              {b.assignment?.grado && (
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '2px' }}>
                  Grado: <strong>{b.assignment.grado}</strong>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
