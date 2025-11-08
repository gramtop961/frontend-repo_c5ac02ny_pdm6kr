import { useEffect, useState } from 'react';
import { Volume2, ShieldCheck } from 'lucide-react';

const DEFAULT_PRIMARY = 'https://cdn.jsdelivr.net/gh/koe-rei/sample-ja-audio/ohayou.mp3';
const DEFAULT_MIRROR = 'https://raw.githubusercontent.com/koe-rei/sample-ja-audio/main/ohayou.mp3';

export default function AudioTester() {
  const [primary, setPrimary] = useState(DEFAULT_PRIMARY);
  const [mirror, setMirror] = useState(DEFAULT_MIRROR);
  const [text, setText] = useState('おはよう');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const unlock = () => {
      const a = new Audio();
      a.muted = true;
      a.play().catch(() => {}).finally(() => {
        setStatus((s) => (s ? s + ' | ' : '') + 'Audio unlocked');
      });
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  const tryPlay = (src) => new Promise((resolve, reject) => {
    const audio = new Audio(src);
    audio.oncanplay = () => {
      audio.play().then(() => resolve(true)).catch(reject);
    };
    audio.onerror = reject;
  });

  const handlePlay = async () => {
    setStatus('Mencoba sumber utama…');
    try {
      await tryPlay(primary);
      setStatus('Berhasil: sumber utama');
      return;
    } catch {}

    setStatus('Gagal utama. Mencoba mirror…');
    try {
      await tryPlay(mirror);
      setStatus('Berhasil: mirror');
      return;
    } catch {}

    setStatus('Gagal URL. Menggunakan TTS (ja-JP)…');
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ja-JP';
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Tes Audio & Cadangan</h2>
          <p className="text-sm text-gray-600">Uji URL audio utama, mirror, lalu TTS jika perlu.</p>
        </div>
        <div className="text-xs text-gray-500 inline-flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> PWA-friendly</div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600">URL Utama</label>
            <input value={primary} onChange={(e) => setPrimary(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-xs text-gray-600">URL Mirror</label>
            <input value={mirror} onChange={(e) => setMirror(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Teks TTS (ja-JP)</label>
            <input value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button onClick={handlePlay} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            <Volume2 className="w-4 h-4" /> Putar Test
          </button>
          {status && <p className="text-sm text-gray-700">Status: {status}</p>}
        </div>
        <div className="text-sm text-gray-700">
          <p className="mb-2">Saran URL permanen:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>jsDelivr: https://cdn.jsdelivr.net/gh/USERNAME/REPO@v1.0.0/path/file.mp3</li>
            <li>Mirror: https://raw.githubusercontent.com/USERNAME/REPO/main/path/file.mp3</li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">Gunakan versi tag untuk URL yang immutable.</p>
        </div>
      </div>
    </section>
  );
}
