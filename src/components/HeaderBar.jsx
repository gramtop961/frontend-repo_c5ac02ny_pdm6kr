import { Book, PenTool, Volume2 } from 'lucide-react';

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="w-6 h-6 text-indigo-600" />
          <h1 className="text-lg font-semibold tracking-tight">Nihongo Practice</h1>
        </div>
        <nav className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1"><Volume2 className="w-4 h-4" /> Audio</span>
          <span className="inline-flex items-center gap-1"><PenTool className="w-4 h-4" /> Menulis</span>
        </nav>
      </div>
    </header>
  );
}
