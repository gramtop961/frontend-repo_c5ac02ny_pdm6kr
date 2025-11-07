import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Volume2, RefreshCw, Info } from 'lucide-react';

// Minimal local SRS utilities
function now() { return Date.now(); }
function scheduleNext(correctLevel) {
  // levels: 0 wrong -> 1 day, 1 ok -> 3 days, 2 strong -> 7 days
  const days = correctLevel === 0 ? 1 : correctLevel === 1 ? 3 : 7;
  return now() + days * 24 * 60 * 60 * 1000;
}

function speak(url) { if (!url) return; const a = new Audio(url); a.play(); }

// Example content for demo purposes
const defaultVocab = [
  { id: 'cat', jp: 'ねこ', romaji: 'neko', idn: 'kucing', img: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&auto=format&fit=crop&q=60', audio: '' },
  { id: 'dog', jp: 'いぬ', romaji: 'inu', idn: 'anjing', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300&auto=format&fit=crop&q=60', audio: '' },
  { id: 'book', jp: 'ほん', romaji: 'hon', idn: 'buku', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&auto=format&fit=crop&q=60', audio: '' },
];

const defaultSentences = [
  { id: 'watashi-desu', pattern: 'わたしは ___ です', answer: ['がくせい', 'せんせい', 'にほんじん'], hints: 'Isi dengan kata benda tanpa partikel.', audio: '' },
  { id: 'kore-wa', pattern: 'これは ___ です', answer: ['ほん', 'ねこ', 'ペン'], hints: 'Gunakan bentuk kamus (kata dasar).', audio: '' },
];

function useLocalData(key, initial) {
  const [state, setState] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
}

export function VocabPractice({ onResult }) {
  const [queue, setQueue] = useLocalData('yn_vocab_queue', defaultVocab.map(v => ({ ...v, due: 0, ef: 1, history: [] })));
  const [mode, setMode] = useState('choice'); // 'choice' | 'drag'
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const item = queue[idx % queue.length];

  const options = useMemo(() => {
    const pool = [...queue].sort(() => 0.5 - Math.random()).slice(0, 3).map(x => x.idn);
    if (!pool.includes(item.idn)) pool[0] = item.idn;
    return [...new Set(pool)].sort(() => 0.5 - Math.random());
  }, [queue, idx]);

  const submit = (ans, timeMs = 0) => {
    const correct = ans === item.idn;
    const nextDue = scheduleNext(correct ? 2 : 0);
    const updated = queue.map((q, i) => i === idx % queue.length ? { ...q, due: nextDue, history: [...q.history, { t: now(), correct, timeMs }] } : q);
    setQueue(updated);
    setFeedback({ correct, hint: correct ? `Benar: ${item.jp} = ${item.idn}` : `Coba lagi. Petunjuk: ${item.romaji} artinya ${item.idn}.`, example: `${item.jp}（${item.romaji}）= ${item.idn}` });
    onResult && onResult({ type: 'vocab', item, correct, timeMs });
    setTimeout(() => { setIdx(i => i + 1); setSelected(null); setFeedback(null); }, 1200);
  };

  return (
    <div className="w-full grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Latihan Kosakata</h3>
          <div className="text-xs text-slate-500">Mode: 
            <button className={`ml-2 px-2 py-1 rounded border ${mode==='choice'?'bg-rose-50 border-rose-200':'bg-white border-slate-200'}`} onClick={()=>setMode('choice')}>Pilihan Ganda</button>
            <button className={`ml-2 px-2 py-1 rounded border ${mode==='drag'?'bg-rose-50 border-rose-200':'bg-white border-slate-200'}`} onClick={()=>setMode('drag')}>Drag-Drop</button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <img src={item.img} alt={item.idn} className="w-56 h-40 object-cover rounded-xl border border-slate-200" />
          <div className="text-5xl font-bold tracking-tight">{item.jp}</div>
          <button onClick={() => speak(item.audio)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"><Volume2 size={18}/>Dengar</button>
          {mode === 'choice' && (
            <div className="grid grid-cols-2 gap-2 w-full mt-2">
              {options.map(opt => (
                <button key={opt} onClick={() => { setSelected(opt); submit(opt); }} className={`px-3 py-2 rounded-lg border text-left ${selected===opt?'bg-rose-50 border-rose-200':'bg-white border-slate-200 hover:bg-slate-50'}`}>{opt}</button>
              ))}
            </div>
          )}
          {mode === 'drag' && (
            <DragMatch idn={item.idn} options={options} onDrop={submit} />
          )}
          {feedback && (
            <div className={`mt-3 w-full p-3 rounded-lg flex items-start gap-2 ${feedback.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
              {feedback.correct ? <CheckCircle2/> : <XCircle/>}
              <div>
                <div className="font-medium">{feedback.correct ? 'Benar!' : 'Kurang tepat'}</div>
                <div className="text-sm opacity-90">{feedback.hint}</div>
                <div className="text-xs mt-1 text-slate-600">Contoh: {feedback.example}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <SentencePractice onResult={onResult} />
    </div>
  );
}

function DragMatch({ idn, options, onDrop }) {
  const [drag, setDrag] = useState(null);
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-2">
        {options.map(opt => (
          <div key={opt} draggable onDragStart={() => setDrag(opt)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white cursor-move">
            {opt}
          </div>
        ))}
      </div>
      <div onDragOver={(e)=>e.preventDefault()} onDrop={()=> drag && onDrop(drag)} className="mt-3 h-16 rounded-lg border-2 border-dashed flex items-center justify-center text-slate-500">
        Seret jawaban ke sini: <span className="ml-2 font-medium">{idn}</span>
      </div>
    </div>
  );
}

export function SentencePractice({ onResult }) {
  const [queue, setQueue] = useLocalData('yn_sentence_queue', defaultSentences.map(s => ({ ...s, due: 0, history: [] })));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const item = queue[idx % queue.length];

  const check = () => {
    const ans = input.trim();
    const correct = item.answer.includes(ans);
    const nextDue = scheduleNext(correct ? 2 : 0);
    const updated = queue.map((q, i) => i === idx % queue.length ? { ...q, due: nextDue, history: [...q.history, { t: now(), correct }] } : q);
    setQueue(updated);
    setFeedback({ correct, hint: correct ? 'Bagus! Pola kalimat tepat.' : `Hint: ${item.hints}`, example: item.pattern.replace('___', item.answer[0]) });
    onResult && onResult({ type: 'sentence', item, correct });
    if (correct) setTimeout(()=>{ setIdx(i => i+1); setInput(''); setFeedback(null); }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800">Latihan Kalimat</h3>
        <button onClick={() => speak(item.audio)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900"><Volume2 size={18}/>Dengar</button>
      </div>
      <div className="text-3xl font-bold tracking-tight mb-2">{item.pattern}</div>
      <div className="text-sm text-slate-600 mb-3 flex items-center gap-2"><Info size={16}/>Isi bagian kosong dengan kata yang tepat.</div>
      <div className="flex items-center gap-2">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="jawaban di sini (hiragana/katakana/kana)" className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-200" />
        <button onClick={check} className="px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">Cek</button>
      </div>
      {feedback && (
        <div className={`mt-3 w-full p-3 rounded-lg flex items-start gap-2 ${feedback.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
          {feedback.correct ? <CheckCircle2/> : <XCircle/>}
          <div>
            <div className="font-medium">{feedback.correct ? 'Benar!' : 'Jawaban belum tepat'}</div>
            <div className="text-sm opacity-90">{feedback.hint}</div>
            <div className="text-xs mt-1 text-slate-600">Contoh: {feedback.example}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SessionSummary({ results, onTrainWeak }) {
  const total = results.length;
  const wrong = results.filter(r => !r.correct);
  const avgTime = Math.round(results.filter(r=> r.timeMs !== undefined).reduce((a,b)=> a + (b.timeMs||0), 0) / Math.max(1, results.filter(r=> r.timeMs !== undefined).length));
  const counts = wrong.reduce((acc, r) => { const key = r.item.jp || r.item.pattern; acc[key] = (acc[key]||0) + 1; return acc; }, {});
  const weakest = Object.entries(counts).sort((a,b)=> b[1]-a[1]).slice(0,5).map(x=>x[0]);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-2">Ringkasan Sesi</h3>
      <div className="text-sm text-slate-600">Total latihan: {total} • Salah: {wrong.length} • Waktu rata-rata: {isNaN(avgTime) ? '-' : avgTime + ' ms'}</div>
      {weakest.length > 0 && (
        <div className="mt-2 text-sm">
          Sering salah: {weakest.join(', ')}
        </div>
      )}
      <button onClick={()=> onTrainWeak && onTrainWeak(weakest)} className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"><RefreshCw size={16}/>Latih Ulang yang Lemah</button>
    </div>
  );
}
