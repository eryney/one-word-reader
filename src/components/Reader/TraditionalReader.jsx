import { useEffect, useRef, useState } from 'react';
import ProgressBar from '../Shared/ProgressBar';
import FontSizeControl from './FontSizeControl';
import BookmarkPanel from './BookmarkPanel';
import { getBookmarks, addBookmark, deleteBookmark } from '../../services/storage/bookmarkStorage';
import { startSession, endSession } from '../../services/storage/statsStorage';

export default function TraditionalReader({ text, initialScroll = 0, onScroll, onExit, bookId }) {
  const scrollRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const sessionRef = useRef(startSession(bookId));
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('reader_fontSize') || 'medium';
  });
  const [bookmarks, setBookmarks] = useState(() => getBookmarks(bookId));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Restore scroll position on mount
  useEffect(() => {
    if (scrollRef.current && initialScroll > 0) {
      scrollRef.current.scrollTop = initialScroll;
    }
  }, [initialScroll]);

  // Save font size preference
  useEffect(() => {
    localStorage.setItem('reader_fontSize', fontSize);
  }, [fontSize]);

  const handleAddBookmark = (note) => {
    const currentScroll = scrollRef.current?.scrollTop || 0;
    const bookmark = addBookmark(bookId, {
      position: currentScroll,
      note,
      mode: 'traditional'
    });
    setBookmarks(prev => [...prev, bookmark]);
  };

  const handleDeleteBookmark = (bookmarkId) => {
    deleteBookmark(bookId, bookmarkId);
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
  };

  const handleJumpToBookmark = (bookmark) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = bookmark.position;
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm sm:text-base';
      case 'medium': return 'text-base sm:text-lg';
      case 'large': return 'text-lg sm:text-xl';
      case 'xlarge': return 'text-xl sm:text-2xl';
      default: return 'text-base sm:text-lg';
    }
  };

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollTop;
    const scrollHeight = e.target.scrollHeight - e.target.clientHeight;
    const progress = scrollHeight > 0 ? (scrollPosition / scrollHeight) * 100 : 0;

    // Estimate word index from scroll position for stats
    const totalWords = text.split(/\s+/).length;
    const estimatedWordIndex = Math.floor((progress / 100) * totalWords);
    setCurrentWordIndex(estimatedWordIndex);

    // Debounce scroll saves
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      onScroll(scrollPosition, progress);
    }, 1000);
  };

  const handleExit = () => {
    // Save stats before exiting
    endSession(sessionRef.current, currentWordIndex);
    onExit();
  };

  // Calculate progress
  const currentProgress = scrollRef.current
    ? (scrollRef.current.scrollTop / (scrollRef.current.scrollHeight - scrollRef.current.clientHeight)) * 100
    : 0;

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header with exit button */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <button
          onClick={handleExit}
          className="text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-2"
          aria-label="Exit reader"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="flex items-center gap-4">
          <FontSizeControl fontSize={fontSize} onChange={setFontSize} />
          <span className="text-sm text-gray-400">
            {Math.round(currentProgress)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar progress={currentProgress} />

      {/* Text content */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-12"
      >
        <div className="max-w-3xl mx-auto">
          <div className={`text-white ${getFontSizeClass()} leading-relaxed space-y-4`}>
            {text.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-white">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Bookmark panel */}
      <BookmarkPanel
        bookmarks={bookmarks}
        onAdd={handleAddBookmark}
        onDelete={handleDeleteBookmark}
        onJumpTo={handleJumpToBookmark}
        currentPosition={scrollRef.current?.scrollTop || 0}
      />
    </div>
  );
}
