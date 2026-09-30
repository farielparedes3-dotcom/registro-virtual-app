import React, { useState } from 'react';
import { TEACHERS_SCHEDULE_DATA, PERIODS } from '../../data/officialMasterSchedule';

const SPECIAL_ROLE_TEACHER_IDS = [
  'mario_paredes',     // Coordinación Pedagógica
  'nathaly_stevez',    // Orientación y Psicología
  'francina_minaya',   // Orientación y Psicología
  'emiliana_espinal'   // Encargada de Alimentación Escolar
];

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
      const isSpecialRole = SPECIAL_ROLE_TEACHER_IDS.includes(t.id);
      const statusLabel = block?.type === 'register' ? 'Hora de Registro'
        : block?.type === 'planning' ? 'Planificación'
        : 'Hora Libre';
      return { id: t.id, name: t.name, status: statusLabel, isSpecialRole };
    });
  };

  const autoAssignSubstitutes = (day, blocks) => {
    const targetDay = day || selectedDay;
    const targetBlocks = blocks || teacherBlocks;

    const newAssignments = {};
    const usageCount = {}; // Control de rotación equitativa

    targetBlocks.forEach((block, idx) => {
      if (block?.type !== 'class') return;

      // 1. Obtener todos los docentes libres en este día y bloque
      const available = TEACHERS_SCHEDULE_DATA.filter(t => {
        if (t.id === selectedTeacherId) return false;
        const tBlock = t.schedule?.[targetDay]?.[idx];
        return !tBlock || tBlock.type === 'free' || tBlock.type === 'register' || tBlock.type === 'planning';
      });

      // 2. Separar docentes regulares de los de último recurso
      const regularTeachers = available.filter(t => !SPECIAL_ROLE_TEACHER_IDS.includes(t.id));
      const fallbackTeachers = available.filter(t => SPECIAL_ROLE_TEACHER_IDS.includes(t.id));

      // 3. Seleccionar de regularTeachers con menor carga; si está vacío, usar fallbackTeachers
      let chosenTeacher = null;
      if (regularTeachers.length > 0) {
        regularTeachers.sort((a, b) => (usageCount[a.id] || 0) - (usageCount[b.id] || 0));
        chosenTeacher = regularTeachers[0];
      } else if (fallbackTeachers.length > 0) {
        fallbackTeachers.sort((a, b) => (usageCount[a.id] || 0) - (usageCount[b.id] || 0));
        chosenTeacher = fallbackTeachers[0];
      }

      if (chosenTeacher) {
        newAssignments[idx] = chosenTeacher.id;
        usageCount[chosenTeacher.id] = (usageCount[chosenTeacher.id] || 0) + 1;
      }
    });

    setCoverageAssignments(newAssignments);
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

  const handlePrintCircular = () => {
    const printWindow = window.open('', '_blank');
    const dateFormatted = new Date().toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Circular de Sustitución Docente - Liceo Ana Rosa Castillo</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; background: #ffffff; }
          .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 16px; margin-bottom: 24px; }
          .school-title { font-size: 20px; font-weight: 900; color: #1e3a8a; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
          .school-sub { font-size: 13px; color: #475569; margin: 4px 0 0 0; font-weight: 600; }
          .doc-title { font-size: 15px; font-weight: 800; margin-top: 15px; text-decoration: underline; color: #0f172a; }
          .statement { font-size: 14px; text-align: justify; margin: 20px 0; color: #1e293b; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; }
          th, td { border: 1px solid #94a3b8; padding: 10px 14px; font-size: 13px; text-align: left; }
          th { background-color: #1e3a8a; color: #ffffff; font-weight: 800; text-transform: uppercase; font-size: 12px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .signatures { margin-top: 60px; display: flex; justify-content: space-around; }
          .sign-line { border-top: 1.5px solid #0f172a; width: 220px; text-align: center; font-size: 12px; padding-top: 8px; color: #0f172a; }
          @media print {
            body { padding: 20px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="school-title">Liceo Ana Rosa Castillo</h1>
          <p class="school-sub">Distrito Educativo 14-01, Nagua | Gestión y Control Académico</p>
          <div class="doc-title">CIRCULAR INTERNA: ASIGNACIÓN DE COLABORACIÓN Y COBERTURA DOCENTE</div>
        </div>

        <p style="font-size: 13px; font-weight: 800; color: #1e293b;">Fecha: ${dateFormatted}</p>

        <div class="statement">
          Por medio de la presente se hace de público conocimiento al equipo docente que, debido a situaciones de causa mayor y ajenas a su voluntad, el/la docente <strong>${currentTeacher?.name || 'Docente Ausente'}</strong> no podrá presentarse al centro educativo en la jornada correspondiente.
          <br><br>
          En procura de garantizar la continuidad pedagógica y el debido orden institucional, se ha coordinado el siguiente esquema de colaboración y sustitución para el acompañamiento de los grupos de estudiantes:
        </div>

        <table>
          <thead>
            <tr>
              <th>Horario / Bloque</th>
              <th>Curso / Sección</th>
              <th>Asignatura Afectada</th>
              <th>Docente Colaborador Asignado</th>
              <th>Firma de Recibido</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(coverageAssignments).map(([idx, subId]) => {
              const period = PERIODS[idx];
              const block = teacherBlocks[idx];
              const subTeacher = TEACHERS_SCHEDULE_DATA.find(t => t.id === subId);
              return `
                <tr>
                  <td><strong>${period.label}</strong> (${period.time})</td>
                  <td><strong>${block?.grade || ''}</strong></td>
                  <td>${block?.subject || ''}</td>
                  <td><strong>${subTeacher?.name || 'Por asignar'}</strong></td>
                  <td style="width: 130px;"></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="statement" style="font-size: 12px; font-style: italic; margin-top: 25px; color: #475569;">
          Agradecemos el compromiso y el sentido de solidaridad institucional de cada uno de los compañeros docentes al brindar su apoyo en el resguardo de nuestros estudiantes.
        </div>

        <div class="signatures">
          <div class="sign-line">
            <strong>Dirección / Coordinación Pedagógica</strong><br>
            Liceo Ana Rosa Castillo
          </div>
          <div class="sign-line">
            <strong>Unidad de Registro y Control</strong><br>
            Gestión de Horarios
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const dayLabels = {
    Lu: 'Lunes',
    Ma: 'Martes',
    Mi: 'Miércoles',
    Ju: 'Jueves',
    Vi: 'Viernes'
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
        maxWidth: '880px',
        maxHeight: '92vh',
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
              Detecta automáticamente aulas sin profesor y asigna a docentes en horas libres respetando prioridades de roles especiales.
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>

        {/* Filtros y Botón de Auto-Asignación */}
        <div style={{ padding: '16px 24px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Docente Ausente</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedTeacherId(newId);
                setCoverageAssignments({});
              }}
              style={{ width: '100%', marginTop: '4px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 600 }}
            >
              <option value="">-- Seleccionar Docente Ausente --</option>
              {TEACHERS_SCHEDULE_DATA.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div style={{ width: '150px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Día de la Semana</label>
            <select
              value={selectedDay}
              onChange={(e) => {
                const newDay = e.target.value;
                setSelectedDay(newDay);
                setCoverageAssignments({});
              }}
              style={{ width: '100%', marginTop: '4px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 600 }}
            >
              <option value="Lu">Lunes</option>
              <option value="Ma">Martes</option>
              <option value="Mi">Miércoles</option>
              <option value="Ju">Jueves</option>
              <option value="Vi">Viernes</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => autoAssignSubstitutes(selectedDay, teacherBlocks)}
            disabled={!selectedTeacherId}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: selectedTeacherId ? '#4F46E5' : '#CBD5E1',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: selectedTeacherId ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: selectedTeacherId ? '0 2px 4px rgba(79, 70, 229, 0.25)' : 'none'
            }}
          >
            ⚡ Asignar Automáticamente
          </button>
        </div>

        {/* Tabla / Vista para Captura (#printable-circular) */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {!selectedTeacherId ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>👤</span>
              <p style={{ margin: 0, fontWeight: 600 }}>Seleccione un docente ausente para ver los bloques horarios a cubrir.</p>
            </div>
          ) : (
            <div id="printable-circular" style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              {/* Encabezado formal visible para captura */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #1E3A8A', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1E3A8A', fontWeight: 900, textTransform: 'uppercase' }}>
                  Liceo Ana Rosa Castillo
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                  Distrito Educativo 14-01, Nagua | Cobertura Docente por Ausencia
                </p>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '8px', color: '#0F172A', textDecoration: 'underline' }}>
                  CIRCULAR INTERNA: ASIGNACIÓN DE SUSTITUCIONES ({dayLabels[selectedDay]?.toUpperCase()})
                </div>
              </div>

              {/* Leyenda de Docente y Motivo */}
              <div style={{ background: '#F1F5F9', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', borderLeft: '4px solid #1E3A8A', fontSize: '0.85rem', color: '#1E293B' }}>
                Docente Ausente: <strong>{currentTeacher?.name}</strong> | Cobertura Pedagógica Planificada
              </div>

              {/* Filas estilizadas de alto contraste */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: isClass ? '1.5px solid #FCA5A5' : '1px solid #E2E8F0',
                      background: isClass ? '#FEF2F2' : '#F8FAFC'
                    }}>
                      {/* Hora y Bloque */}
                      <div style={{ minWidth: '130px' }}>
                        <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem', display: 'block' }}>
                          {period.label}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                          {period.time}
                        </span>
                      </div>

                      {/* Actividad / Curso */}
                      <div style={{ flex: 1, minWidth: '160px' }}>
                        {isClass ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              background: '#DC2626',
                              color: '#FFFFFF',
                              padding: '2px 8px',
                              borderRadius: '5px',
                              fontSize: '0.78rem',
                              fontWeight: 900
                            }}>
                              {block.grade}
                            </span>
                            <span style={{ fontWeight: 800, color: '#991B1B', fontSize: '0.88rem' }}>
                              {block.subject}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
                            {block.label || (block.type === 'register' ? 'Hora de Registro' : block.type === 'planning' ? 'Planificación' : 'Libre')}
                          </span>
                        )}
                      </div>

                      {/* Selector de Docente Sustituto */}
                      <div style={{ flex: 1.3, minWidth: '220px' }}>
                        {isClass ? (
                          <select
                            value={assignedSubId}
                            onChange={(e) => handleSelectSubstitute(idx, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: `1.5px solid ${assignedSubId ? '#16A34A' : '#94A3B8'}`,
                              background: assignedSubId ? '#F0FDF4' : '#FFFFFF',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              color: assignedSubId ? '#15803D' : '#1E293B'
                            }}
                          >
                            <option value="">-- Asignar Sustituto ({availableSubstitutes.length} dispon.) --</option>
                            {availableSubstitutes.map(sub => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name} {sub.isSpecialRole ? '⚠️ (Rol Especial)' : ''} ({sub.status})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>Sin requerimiento</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Botones del Pie */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            onClick={handlePrintCircular}
            disabled={!selectedTeacherId || Object.keys(coverageAssignments).length === 0}
            style={{
              background: '#047857',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: (!selectedTeacherId || Object.keys(coverageAssignments).length === 0) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📥 Imprimir / Guardar Circular en PDF
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
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
    </div>
  );
};

export default AbsenceCoverageModal;
