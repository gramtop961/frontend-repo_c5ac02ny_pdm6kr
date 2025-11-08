import { Activity, BookOpenCheck, PenTool, Volume2 } from 'lucide-react';

export default function StudyDashboard() {
  return (
    <section className="bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3">
        <Activity className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold">Dasbor Belajar</h2>
      </div>
      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-white">
          <div className="flex items-center gap-2 text-gray-700"><Volume2 className="w-4 h-4 text-indigo-600"/> Audio</div>
          <p className="text-2xl font-bold mt-2">Fallback 3-lapis</p>
          <p className="text-xs text-gray-500 mt-1">Utama → Mirror → TTS</p>
        </div>
        <div className="p-4 rounded-lg border bg-white">
          <div className="flex items-center gap-2 text-gray-700"><PenTool className="w-4 h-4 text-indigo-600"/> Menulis</div>
          <p className="text-2xl font-bold mt-2">Kanvas Lancar</p>
          <p className="text-xs text-gray-500 mt-1">Sentuhan & mouse</p>
        </div>
        <div className="p-4 rounded-lg border bg-white">
          <div className="flex items-center gap-2 text-gray-700"><BookOpenCheck className="w-4 h-4 text-indigo-600"/> Kosakata</div>
          <p className="text-2xl font-bold mt-2">4 contoh</p>
          <p className="text-xs text-gray-500 mt-1">Bisa ditambah</p>
        </div>
      </div>
    </section>
  );
}
