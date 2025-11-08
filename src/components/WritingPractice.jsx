import { useState, useRef } from 'react';
import { Eraser, Pencil } from 'lucide-react';

export default function WritingPractice() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#111827');
  const [size, setSize] = useState(6);

  const start = (e) => {
    setDrawing(true);
    draw(e);
  };

  const end = () => {
    setDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx && ctx.beginPath();
  };

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Latihan Menulis</h2>
          <p className="text-sm text-gray-600">Latih goresan hiragana/katakana secara bebas.</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Warna" className="w-8 h-8 p-0 border rounded" />
          <input type="range" min="2" max="18" value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-24" />
          <button onClick={clear} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50">
            <Eraser className="w-4 h-4" /> Bersihkan
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="relative w-full h-72 sm:h-80 md:h-96 border rounded-lg overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#f9fafb,transparent_60%)]">
          <canvas
            ref={canvasRef}
            width={1000}
            height={600}
            onMouseDown={start}
            onMouseUp={end}
            onMouseMove={draw}
            onMouseLeave={end}
            onTouchStart={start}
            onTouchEnd={end}
            onTouchMove={draw}
            className="w-full h-full touch-none"
          />
          <div className="absolute inset-0 pointer-events-none grid grid-cols-12 grid-rows-8">
            {Array.from({ length: 12 * 8 }).map((_, i) => (
              <div key={i} className="border border-gray-100/60" />
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Gunakan warna dan ukuran garis untuk meniru huruf. Sentuh/klik lalu tarik untuk menggambar.</p>
      </div>
    </section>
  );
}
