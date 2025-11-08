import React from 'react';
import HeaderBar from './components/HeaderBar';
import AudioTester from './components/AudioTester';
import DeploymentGuide from './components/DeploymentGuide';
import PWABanner from './components/PWABanner';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <HeaderBar />

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <PWABanner />
        <AudioTester />
        <DeploymentGuide />

        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">How to get a link that always works</h2>
          <ol className="list-decimal pl-5 mt-3 space-y-2 text-sm text-gray-700">
            <li>Host your audio on a public GitHub repo. This gives you a permanent canonical source.</li>
            <li>Serve files via jsDelivr CDN for a stable, globally cached URL.</li>
            <li>Optionally add a mirror (GitHub Raw, Cloudflare R2). Use code to try primary → mirror → TTS.</li>
            <li>Deploy this app to your domain (Netlify/Vercel/GitHub Pages). That URL becomes the one you feed into PWABuilder.</li>
          </ol>

          <div className="mt-4 rounded-md border p-3 bg-gray-50">
            <div className="text-sm font-medium">Permanent URL example (copy & replace USERNAME):</div>
            <div className="mt-2 font-mono text-xs overflow-x-auto">https://cdn.jsdelivr.net/gh/USERNAME/yn-audio@v1.0.0/vocab/apple.mp3</div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-xs text-gray-500">Built for reliable audio & PWA deployment.</footer>
    </div>
  );
}
