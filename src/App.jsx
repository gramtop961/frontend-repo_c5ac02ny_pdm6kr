import HeaderBar from './components/HeaderBar';
import StudyDashboard from './components/StudyDashboard';
import VocabTrainer from './components/VocabTrainer';
import WritingPractice from './components/WritingPractice';
import AudioTester from './components/AudioTester';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <HeaderBar />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <StudyDashboard />
        <VocabTrainer />
        <WritingPractice />
        <AudioTester />
      </main>

      <footer className="py-8 text-center text-xs text-gray-500">
        Built for reliable Japanese audio practice with PWA-ready audio fallback.
      </footer>
    </div>
  );
}

export default App;
