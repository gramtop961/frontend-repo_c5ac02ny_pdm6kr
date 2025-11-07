import React, { useEffect, useRef, useState } from 'react';

// Simple canvas tracing for hiragana/katakana
export default function TracingPractice({ item, onComplete, audioUrl }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const pos = (canvas.width / 4) * i;
      ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(canvas.width, pos); ctx.stroke();
    }
    // character guide (big, light)
    ctx.font = '180px Noto Sans JP, system-ui';
    ctx.fillStyle = 'rgba(15,23,42,0.08)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item, canvas.width / 2, canvas.height / 2);

    // redraw user strokes
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 8;
    paths.forEach(p => {
      ctx.beginPath();
      for (let i = 0; i < p.length; i++) {
        const [x, y] = p[i];
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }, [item, paths]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return [x, y];
  };

  const start = (e) => { setIsDrawing(true); setPaths(prev => [...prev, [getPos(e)]]); };
  const move = (e) => { if (!isDrawing) return; setPaths(prev => { const copy = [...prev]; copy[copy.length - 1] = [...copy[copy.length - 1], getPos(e)]; return copy; }); };
  const end = () => { setIsDrawing(false); };

  const reset = () => setPaths([]);
  const playAudio = () => { if (audioUrl) { const a = new Audio(audioUrl); a.play(); } };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="text-5xl md:text-6xl font-bold text-slate-800">{item}</div>
      <div className="text-sm text-slate-500">Jejakkan garis mengikuti contoh. Ketuk untuk mulai menulis.</div>
      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className="touch-none rounded-xl bg-white select-none"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={reset} className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Reset</button>
        <button onClick={playAudio} className="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700">Dengar Audio</button>
        <button onClick={() => onComplete && onComplete(paths)} className="px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">Selesai</button>
      </div>
    </div>
  );
}
