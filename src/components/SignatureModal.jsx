import React, { useRef, useState, useEffect } from 'react';

export default function SignatureModal({ isOpen, onClose, onSave, title = "Firma Digital Oficial", signerRole = "Docente" }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#002244';
      clearCanvas();
    }
  }, [isOpen]);

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleConfirmSave = () => {
    if (!hasDrawn) {
      alert('Por favor realice su firma en el recuadro antes de guardar.');
      return;
    }
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ backgroundColor: 'var(--bg-secondary)', width: '100%', maxWidth: '480px', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid var(--border-color)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--primary)', fontWeight: 800, fontSize: '1.15rem' }}>✍️ {title}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Firma digital para informes del Liceo Ana Rosa Castillo ({signerRole})</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Trace su firma clara sobre el recuadro usando su pantalla táctil o el puntero del mouse:
          </p>
          <div style={{ border: '2px dashed var(--primary)', borderRadius: '12px', backgroundColor: '#ffffff', overflow: 'hidden', touchAction: 'none' }}>
            <canvas
              ref={canvasRef}
              width={420}
              height={160}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ width: '100%', height: '160px', display: 'block', cursor: 'crosshair' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={clearCanvas}
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
          >
            🗑️ Limpiar Trazo
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleConfirmSave}
              style={{ fontSize: '0.82rem', padding: '0.5rem 1.25rem', backgroundColor: 'var(--primary)', fontWeight: 'bold' }}
            >
              ✅ Adjuntar Firma
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
