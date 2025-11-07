import React, { useEffect, useMemo, useState } from 'react';
import HeaderBar from './components/HeaderBar';
import LessonNavigator from './components/LessonNavigator';
import TracingPractice from './components/TracingPractice';
import { VocabPractice, SessionSummary, SentencePractice } from './components/PracticePanels';

function usePersisted(key, initial) {
  const [state, setState] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
}

const hiraganaSet = ['あ','い','う','え','お','か','き','く','け','こ'];
const katakanaSet = ['ア','イ','ウ','エ','オ'];

export default function App() {
  const [tab, setTab] = usePersisted('yn_tab', 'huruf');
  const [streak, setStreak] = usePersisted('yn_streak', 1);
  const [progress, setProgress] = usePersisted('yn_progress', { letters: {}, vocab: {}, sentences: {}, mastery: 0, lastReview: null });
  const [results, setResults] = useState([]);
  const [reflect, setReflect] = useState('');

  useEffect(() => {
    // simplistic streak update on load per day
    const last = progress.lastReview ? new Date(progress.lastReview).toDateString() : null;
    const today = new Date().toDateString();
    if (last && last !== today) setStreak(s => s + 1);
    setProgress(p => ({ ...p, lastReview: Date.now() }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mastery = useMemo(() => {
    const total = Object.values(progress.letters).length + Object.values(progress.vocab).length + Object.values(progress.sentences).length + 1;
    const mastered = Object.values(progress.letters).filter(Boolean).length + Object.values(progress.vocab).filter(Boolean).length + Object.values(progress.sentences).filter(Boolean).length;
    return total ? mastered / total : 0;
  }, [progress]);

  const onTraceComplete = () => {
    // Mark current letter as practiced
    const current = currentLetter;
    setProgress(p => ({ ...p, letters: { ...p.letters, [current]: true } }));
    setResults(r => [...r, { type: 'letter', item: { jp: current }, correct: true }]);
  };

  const onPracticeResult = (res) => {
    setResults(r => [...r, res]);
    if (res.type === 'vocab') {
      setProgress(p => ({ ...p, vocab: { ...p.vocab, [res.item.id]: res.correct } }));
    } else if (res.type === 'sentence') {
      setProgress(p => ({ ...p, sentences: { ...p.sentences, [res.item.id]: res.correct } }));
    }
  };

  const [letterIdx, setLetterIdx] = usePersisted('yn_letter_idx', 0);
  const [isKata, setIsKata] = usePersisted('yn_is_kata', false);
  const letters = isKata ? katakanaSet : hiraganaSet;
  const currentLetter = letters[letterIdx % letters.length];

  const exportData = () => {
    const data = { streak, progress, results, version: 1 };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'yasashii_nihongo_data.json';
    a.click(); URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(String(ev.target?.result || '{}'));
        if (data.streak !== undefined) setStreak(data.streak);
        if (data.progress) setProgress(data.progress);
        if (data.version) setResults(data.results || []);
      } catch (err) {
        alert('Gagal impor. Pastikan file JSON valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 to-sky-50">
      <HeaderBar streak={streak} mastery={mastery} onExport={exportData} onImport={importData} lastReview={progress.lastReview} />
      <LessonNavigator current={tab} onChange={setTab} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {tab === 'huruf' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-800">Menulis Huruf</h2>
              <div className="flex items-center gap-2 text-sm">
                <button onClick={() => setIsKata(v=>!v)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">{isKata ? 'Hiragana' : 'Katakana'}</button>
                <button onClick={() => setLetterIdx((i)=> (i - 1 + letters.length) % letters.length)} className="px-3 py-2 rounded-lg border border-slate-200">Sebelumnya</button>
                <button onClick={() => setLetterIdx((i)=> (i + 1) % letters.length)} className="px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">Berikutnya</button>
              </div>
            </div>
            <TracingPractice item={currentLetter} onComplete={onTraceComplete} audioUrl={''} />
          </div>
        )}

        {tab === 'kosakata' && (
          <VocabPractice onResult={onPracticeResult} />
        )}

        {tab === 'kalimat' && (
          <SentencePractice onResult={onPracticeResult} />
        )}

        {tab === 'budaya' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-2">Budaya</h2>
            <p className="text-slate-600 text-sm leading-relaxed">Pelajari kebiasaan sederhana di Jepang: salam bowing (おじぎ), melepas sepatu di genkan (玄関), dan mengucapkan terima kasih (ありがとう). Baca singkat lalu jawab pertanyaan pada latihan sebelumnya. Visual, audio, dan pengulangan adaptif membantu memori bekerja lebih kuat.</p>
          </div>
        )}

        <SessionSummary results={results} onTrainWeak={(keys)=>{
          // Simple recommendation: switch ke kosakata dan fokuskan
          setTab('kosakata');
          alert('Disarankan melatih ulang: ' + keys.join(', '));
        }} />

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-2">Refleksi</h3>
          <input value={reflect} onChange={(e)=>setReflect(e.target.value)} placeholder="Satu kalimat: bagaimana perasaanmu belajar hari ini?" className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-200" />
          <div className="text-xs text-slate-500 mt-2">Tulis singkat untuk memperkuat memori.</div>
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-slate-500">© 2025 Yasashii Nihongo Digital • Mode offline-first, data disimpan di perangkat dan bisa diekspor/impor JSON.</footer>
    </div>
  );
}
