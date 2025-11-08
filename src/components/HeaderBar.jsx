import React from 'react';
import { Music, ShieldCheck, Smartphone, Rocket } from 'lucide-react';

export default function HeaderBar() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shadow">
            <Music size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Audio Reliability & PWA Launcher</h1>
            <p className="text-sm text-gray-500">Solid audio playback + a permanent URL plan for your Android PWA</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2"><ShieldCheck size={16}/> <span>Robust fallback</span></div>
          <div className="flex items-center gap-2"><Smartphone size={16}/> <span>PWA-ready</span></div>
          <div className="flex items-center gap-2"><Rocket size={16}/> <span>Deploy guide</span></div>
        </div>
      </div>
    </header>
  );
}
