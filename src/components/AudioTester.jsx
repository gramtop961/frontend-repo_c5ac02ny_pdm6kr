import React, { useEffect, useRef, useState } from 'react';

// A resilient audio component with multi-source fallback:
// 1) Primary URL (usually your CDN)
// 2) Mirror URL (GitHub Pages / Cloudflare R2 / Backblaze)
// 3) Browser SpeechSynthesis (ja-JP) as last resort
export default function AudioTester() {
  const audioRef = useRef(null);
  const [status, setStatus] = useState('Idle');
  const [text, setText] = useState('おはようございます');
  const [primaryUrl, setPrimaryUrl] = useState('https://cdn.jsdelivr.net/gh/koe-rei/sample-ja-audio/ohayou.mp3');
  const [mirrorUrl, setMirrorUrl] = useState('https://raw.githubusercontent.com/koe-rei/sample-ja-audio/main/ohayou.mp3');

  const playViaElement = async (url) => {
    return new Promise((resolve, reject) => {
      const el = audioRef.current;
      if (!el) return reject(new Error('No audio element'));
      el.src = url;
      el.oncanplaythrough = () => {
        el.play().then(resolve).catch(reject);
      };
      el.onerror = () => reject(new Error('Audio load error'));
      // Force load to trigger events
      el.load();
    });
  };

  const speakTTS = async (phrase) => {
    if (!('speechSynthesis' in window)) throw new Error('TTS not supported');
    const u = new SpeechSynthesisUtterance(phrase);
    u.lang = 'ja-JP';
    return new Promise((resolve) => {
      u.onend = resolve;
      speechSynthesis.speak(u);
    });
  };

  const play = async () => {
    setStatus('Trying primary URL…');
    try {
      await playViaElement(primaryUrl);
      setStatus('Playing from Primary URL');
      return;
    } catch (_) {}

    setStatus('Primary failed. Trying mirror…');
    try {
      await playViaElement(mirrorUrl);
      setStatus('Playing from Mirror URL');
      return;
    } catch (_) {}

    setStatus('Both URLs failed. Using TTS…');
    try {
      await speakTTS(text);
      setStatus('Played with TTS');
    } catch (e) {
      setStatus('Audio failed on all fallbacks');
      alert('Audio could not be played. Please check connection or enable media in site settings.');
    }
  };

  // Auto-unlock audio on first user gesture for mobile PWA
  useEffect(() => {
    const unlock = () => {
      const el = audioRef.current;
      if (!el) return;
      el.muted = true;
      el.play().catch(() => {});
      el.pause();
      el.muted = false;
      window.removeEventListener('touchend', unlock);
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('touchend', unlock, { once: true });
    window.addEventListener('click', unlock, { once: true });
    return () => {
      window.removeEventListener('touchend', unlock);
      window.removeEventListener('click', unlock);
    };
  }, []);

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Audio Health Check</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{status}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500">Primary URL</label>
          <input className="w-full rounded-md border px-3 py-2" value={primaryUrl} onChange={(e) => setPrimaryUrl(e.target.value)} placeholder="https://cdn.example.com/audio.mp3"/>
          <p className="text-xs text-gray-500">Use a globally cached URL. GitHub via jsDelivr works well.</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500">Mirror URL</label>
          <input className="w-full rounded-md border px-3 py-2" value={mirrorUrl} onChange={(e) => setMirrorUrl(e.target.value)} placeholder="https://mirror.example.com/audio.mp3"/>
          <p className="text-xs text-gray-500">Fallback host (GitHub Raw / Cloudflare R2 / Backblaze B2).</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label className="text-xs font-medium text-gray-500">TTS Fallback Text (ja-JP)</label>
        <input className="w-full rounded-md border px-3 py-2" value={text} onChange={(e) => setText(e.target.value)} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={play} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:bg-indigo-800">Play</button>
        <audio ref={audioRef} controls className="h-10" />
      </div>

      <ul className="mt-6 list-disc pl-5 text-sm text-gray-600 space-y-1">
        <li>Permanent link strategy: host audio on a public GitHub repo, then serve through jsDelivr: https://cdn.jsdelivr.net/gh/USER/REPO/path/file.mp3</li>
        <li>Mirror strategy: the same file on GitHub Raw or another object storage with public URL.</li>
        <li>Android PWA tips: enable autoplay after first tap, ensure HTTPS, include media permissions if prompted.</li>
      </ul>
    </section>
  );
}
