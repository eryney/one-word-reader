import { useState, useEffect } from 'react';
import RSVPReader from './RSVPReader';
import TraditionalReader from './TraditionalReader';
import { getBookText } from '../../services/storage/bookStorage';
import { segmentIntoWords } from '../../services/textProcessor';
import { useProgress } from '../../hooks/useProgress';
import { DEFAULT_WPM } from '../../utils/constants';

export default function ReaderContainer({ book, onExit }) {
  const [mode, setMode] = useState('rsvp'); // 'rsvp' or 'traditional'
  const [text, setText] = useState('');
  const [words, setWords] = useState([]);
  const [sections, setSections] = useState([]); // NEW: Track sections
  const [loading, setLoading] = useState(true);
  const { progress, updateProgress } = useProgress(book.id);

  // Load book text on mount
  useEffect(() => {
    const loadText = async () => {
      try {
        const bookText = getBookText(book.id);
        console.log('Loaded book text, length:', bookText.length);
        console.log('First 200 chars:', bookText.substring(0, 200));
        setText(bookText);
        const bookWords = segmentIntoWords(bookText);
        console.log('Segmented into words:', bookWords.length);
        console.log('First 10 words:', bookWords.slice(0, 10));
        setWords(bookWords);

        // NEW: Load sections from book metadata
        if (book.sections && book.sections.length > 0) {
          setSections(book.sections);
          console.log('Loaded sections:', book.sections.length);
        }

        // Set initial mode from progress if available
        if (progress?.mode) {
          setMode(progress.mode);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading book text:', error);
        setLoading(false);
      }
    };

    loadText();
  }, [book.id, book.sections, progress]);

  const handleRSVPProgress = (currentIndex) => {
    updateProgress({
      currentIndex,
      scrollPosition: 0,
      mode: 'rsvp',
      wpm: progress?.wpm || DEFAULT_WPM
    });
  };

  const handleTraditionalScroll = (scrollPosition, scrollProgress) => {
    // Estimate word index from scroll progress
    const estimatedIndex = Math.floor((scrollProgress / 100) * words.length);

    updateProgress({
      currentIndex: estimatedIndex,
      scrollPosition,
      mode: 'traditional'
    });
  };

  const toggleMode = () => {
    const newMode = mode === 'rsvp' ? 'traditional' : 'rsvp';
    setMode(newMode);
    updateProgress({ ...progress, mode: newMode });
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading book...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Mode toggle button */}
      <button
        onClick={toggleMode}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
      >
        {mode === 'rsvp' ? 'Traditional Mode' : 'Speed Mode'}
      </button>

      {mode === 'rsvp' ? (
        <RSVPReader
          words={words}
          initialIndex={progress?.currentIndex || 0}
          initialWPM={progress?.wpm || DEFAULT_WPM}
          onProgress={handleRSVPProgress}
          onExit={onExit}
          bookId={book.id}
          sections={sections}
        />
      ) : (
        <TraditionalReader
          text={text}
          initialScroll={progress?.scrollPosition || 0}
          onScroll={handleTraditionalScroll}
          onExit={onExit}
          bookId={book.id}
        />
      )}
    </div>
  );
}
