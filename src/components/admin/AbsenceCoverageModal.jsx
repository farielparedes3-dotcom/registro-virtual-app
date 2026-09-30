import React, { useState } from 'react';
import { TEACHERS_SCHEDULE_DATA, PERIODS } from '../../data/officialMasterSchedule';

const AbsenceCoverageModal = ({ isOpen, onClose, onSaveSubstitutions }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedDay, setSelectedDay] = useState('Lu');
  const [coverageAssignments, setCoverageAssignments] = useState({});

  if (!isOpen) return null;

  const currentTeacher = TEACHERS_SCHEDULE_DATA.find(t => t.id === selectedTeacherId);
  const teacherBlocks = currentTeacher?.schedule?.[selectedDay] || [];

  // Docentes disponibles para un bloque horario específico (Libre, Registro o Planificación)
  const getAvailableSubstitutes = (periodIndex) => {
    return TEACHERS_SCHEDULE_DATA.filter(t => {
      if (t.id === selectedTeacherId) return false;
      const block = t.schedule?.[selectedDay]?.[periodIndex];
      return !block || block.type === 'free' || block.type === 'register' || block.type === 'planning';
    }).map(t => {
      const block = t.schedule?.[selectedDay]?.[periodIndex];
      const statusLabel = block?.type === 'register' ? 'Hora de Registro'
        : block?.type === 'planning' ? 'Planificación'
        : 'Hora Libre';
      return { id: t.id, name: t.name, status: statusLabel };
    });
  };

  const handleSelectSubstitute = (periodIndex, subTeacherId) => {
    setCoverageAssignments(prev => ({
      ...prev,
      [periodIndex]: subTeacherId
    }));
  };

  const handleConfirmAll = () => {
    const records = Object.entries(coverageAssignments).filter(([_, subId]) => Boolean(subId)).map(([idx, subId]) => ({
      day: selectedDay,
      period: PERIODS[idx],
      absentTeacher: currentTeacher?.name || 'Docente Ausente',
      absentTeacherId: currentTeacher?.id,
      coveringTeacherId: subId,
      coveringTeacher: TEACHERS_SCHEDULE_DATA.find(t => t.id === subId)?.name || 'Docente Sustituto',
      affectedClass: teacherBlocks[idx]
    }));

    if (onSaveSubstitutions) {
      onSaveSubstitutions(records);
    }
    alert("✅ Plan de sustitución generado y guardado.");
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Cabecera */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1E293B', fontWeight: 800 }}>
              Planilla de Ajuste de Horario por Ausencia
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Detecta automáticamente aulas sin profesor y asigna a docentes en horas libres, registro o planificación.
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>

        {/* Filtros */}
        <div style={{ padding: '16px 24px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Docente Ausente</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => { setSelectedTeacherId(e.target.value); setCoverageAssignments({}); }}
              style={{ width: '100%', marginTop: '4px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 600 }}
            >
              <option value="">-- Seleccionar Docente Ausente --</option>
              {TEACHERS_SCHEDULE_DATA.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div style={{ width: '160px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Día de la Semana</label>
            <select
              value={selectedDay}
              onChange={(e) => { setSelectedDay(e.target.value); setCoverageAssignments({}); }}
              style={{ width: '100%', marginTop: '4px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 600 }}
            >
              <option value="Lu">Lunes</option>
              <option value="Ma">Martes</option>
              <option value="Mi">Miércoles</option>
              <option value="Ju">Jueves</option>
              <option value="Vi">Viernes</option>
            </select>
          </div>
        </div>

        {/* Tabla de Bloques */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {!selectedTeacherId ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>👤</span>
              <p style={{ margin: 0, fontWeight: 600 }}>Seleccione un docente ausente para ver los bloques horarios a cubrir.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PERIODS.map((period, idx) => {
                const block = teacherBlocks[idx] || { type: 'free', label: 'Libre' };
                const isClass = block.type === 'class';
                const availableSubstitutes = getAvailableSubstitutes(idx);
                const assignedSubId = coverageAssignments[idx] || '';

                return (
                  <div key={period.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: isClass ? '#FEF2F2' : '#F8FAFC'
                  }}>
                    {/* Hora y Periodo */}
                    <div style={{ minWidth: '120px' }}>
                      <span style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem', display: 'block' }}>
                        {period.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {period.time}
                      </span>
                    </div>

                    {/* Actividad Programada del Docente Ausente */}
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      {isClass ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            background: '#EF4444',
                            color: '#FFFFFF',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 800
                          }}>
                            {block.grade}
                          </span>
                          <span style={{ fontWeight: 700, color: '#991B1B', fontSize: '0.88rem' }}>
                            Asignatura: {block.subject}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: '#64748B', fontStyle: 'italic' }}>
                          {block.label || (block.type === 'register' ? 'Registro' : block.type === 'planning' ? 'Planificación' : 'Libre')}
                        </span>
                      )}
                    </div>

                    {/* Selector de Sustituto Disponible */}
                    <div style={{ flex: 1.2, minWidth: '220px' }}>
                      {isClass ? (
                        <select
                          value={assignedSubId}
                          onChange={(e) => handleSelectSubstitute(idx, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: `1px solid ${assignedSubId ? '#22C55E' : '#CBD5E1'}`,
                            background: assignedSubId ? '#F0FDF4' : '#FFFFFF',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: assignedSubId ? '#15803D' : '#334155'
                          }}
                        >
                          <option value="">-- Asignar Sustituto ({availableSubstitutes.length} disponibles) --</option>
                          {availableSubstitutes.map(sub => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name} ({sub.status})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>No requiere cobertura</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Botones del Pie */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmAll}
            disabled={!selectedTeacherId || Object.keys(coverageAssignments).length === 0}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: (!selectedTeacherId || Object.keys(coverageAssignments).length === 0) ? '#94A3B8' : '#0284C7',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: (!selectedTeacherId || Object.keys(coverageAssignments).length === 0) ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)'
            }}
          >
            Confirmar y Guardar Sustituciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default AbsenceCoverageModal;
