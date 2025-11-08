import { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, Repeat, CheckCircle2, RefreshCcw } from 'lucide-react';

const DEFAULT_VOCAB = [
  { jp: 'おはよう', romaji: 'ohayō', id: 'ohayou', en: 'good morning' },
  { jp: 'ありがとう', romaji: 'arigatō', id: 'arigatou', en: 'thank you' },
  { jp: 'さようなら', romaji: 'sayōnara', id: 'sayonara', en: 'goodbye' },
  { jp: 'お願いします', romaji: 'onegaishimasu', id: 'onegaishimasu', en: 'please' },
];

const CDN_PRIMARY = 'https://cdn.jsdelivr.net/gh/koe-rei/sample-ja-audio';
const CDN_MIRROR = 'https://raw.githubusercontent.com/koe-rei/sample-ja-audio/main';

function useUnlockedAudio() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    const unlock = () => {
      if (!unlocked) {
        const a = new Audio();
        a.muted = true;
        a.play().finally(() => setUnlocked(true));
      }
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, [unlocked]);
  return unlocked;
}

async function playWithFallback(id, text) {
  const sources = [
    `${CDN_PRIMARY}/${id}.mp3`,
    `${CDN_MIRROR}/${id}.mp3`,
  ];

  for (const src of sources) {
    try {
      await new Promise((resolve, reject) => {
        const audio = new Audio(src);
        const cleanup = () => {
          audio.oncanplay = null;
          audio.onended = null;
          audio.onerror = null;
        };
        audio.oncanplay = () => {
          audio.play().then(resolve).catch(reject);
        };
        audio.onended = () => { cleanup(); resolve(null); };
        audio.onerror = () => { cleanup(); reject(new Error('audio error')); };
      });
      return 'url';
    } catch (_) {
      // try next source
    }
  }

  // Fallback to TTS
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'ja-JP';
  utt.rate = 0.95;
  window.speechSynthesis.speak(utt);
  return 'tts';
}

export default function VocabTrainer() {
  const [vocab, setVocab] = useState(DEFAULT_VOCAB);
  const [index, setIndex] = useState(0);
  const unlocked = useUnlockedAudio();
  const current = vocab[index];

  const next = () => setIndex((i) => (i + 1) % vocab.length);
  const reset = () => setIndex(0);

  const handlePlay = async () => {
    if (!current) return;
    await playWithFallback(current.id, current.jp);
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Latihan Kosakata</h2>
          <p className="text-sm text-gray-600">Dengarkan pelafalan dan hafalkan arti.</p>
        </div>
        <button onClick={reset} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <RefreshCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {current && (
        <div className="mt-6 grid sm:grid-cols-2 gap-6 items-center">
          <div>
            <div className="text-4xl font-bold tracking-tight">{current.jp}</div>
            <div className="text-gray-600 mt-2">{current.romaji} — {current.en}</div>
            <div className="mt-4 flex gap-2">
              <button onClick={handlePlay} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                <Volume2 className="w-4 h-4" /> Putar
              </button>
              <button onClick={next} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50">
                <Repeat className="w-4 h-4" /> Selanjutnya
              </button>
            </div>
            {!unlocked && (
              <p className="text-xs text-amber-600 mt-2">Sentuh layar sekali untuk mengaktifkan audio di perangkat mobile.</p>
            )}
          </div>
          <div className="rounded-lg border border-dashed border-gray-300 p-4">
            <p className="text-sm text-gray-600">Sumber audio:</p>
            <ul className="mt-2 text-sm text-gray-700 list-disc ml-5 space-y-1">
              <li>Utama: jsDelivr</li>
              <li>Mirror: GitHub Raw</li>
              <li>Cadangan: Teks-ke-Suara (ja-JP)</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">Aplikasi akan mencoba berurutan untuk memastikan selalu ada suara.</p>
          </div>
        </div>
      )}
    </section>
  );
}
