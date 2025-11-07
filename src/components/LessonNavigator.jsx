import React from 'react';

const steps = [
  { key: 'huruf', label: 'Huruf あいう / アイウ' },
  { key: 'kosakata', label: 'Kosakata Bergambar' },
  { key: 'kalimat', label: 'Pola Kalimat' },
  { key: 'budaya', label: 'Budaya' },
];

export default function LessonNavigator({ current, onChange }) {
  return (
    <nav className="w-full bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto">
        {steps.map((s, idx) => {
          const active = current === s.key;
          return (
            <button
              key={s.key}
              onClick={() => onChange(s.key)}
              className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap border transition ${
                active ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <span className="mr-2 text-xs text-slate-500">{idx + 1}.</span>{s.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
