import React from 'react';
import { Flame, Star, Calendar } from 'lucide-react';

function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short' });
}

export default function HeaderBar({ streak, mastery, onExport, onImport, lastReview }) {
  const masteryPct = Math.round(mastery * 100);
  return (
    <header className="w-full bg-gradient-to-r from-rose-50 to-sky-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-200">
            <Flame className="text-rose-500" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Yasashii Nihongo Digital</h1>
            <p className="text-xs text-slate-500">Belajar huruf → kosakata → kalimat → budaya (5–10 menit)</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Star className="text-amber-500" size={18} />
            <div className="text-sm"><span className="font-medium">Penguasaan:</span> {masteryPct}%</div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Flame className="text-rose-500" size={18} />
            <div className="text-sm"><span className="font-medium">Streak:</span> {streak} hari</div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Calendar className="text-sky-500" size={18} />
            <div className="text-sm"><span className="font-medium">Review Terakhir:</span> {lastReview ? formatDate(lastReview) : '—'}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onExport} className="text-sm px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition">Ekspor Data</button>
            <label className="text-sm px-3 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition cursor-pointer">
              Impor Data
              <input type="file" accept="application/json" className="hidden" onChange={onImport} />
            </label>
          </div>
        </div>
      </div>
    </header>
  );
}
