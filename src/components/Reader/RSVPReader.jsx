import { useEffect, useState, useRef } from 'react';
import { useRSVP } from '../../hooks/useRSVP';
import { highlightORP } from '../../utils/orp';
import ReaderControls from './ReaderControls';
import SpeedSlider from './SpeedSlider';
import ProgressBar from '../Shared/ProgressBar';
import BookmarkPanel from './BookmarkPanel';
import { SKIP_COUNT, PROGRESS_SAVE_INTERVAL } from '../../utils/constants';
import { getBookmarks, addBookmark, deleteBookmark } from '../../services/storage/bookmarkStorage';
import { startSession, endSession } from '../../services/storage/statsStorage';

export default function RSVPReader({ words, initialIndex = 0, initialWPM, onProgress, onExit, bookId }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => getBookmarks(bookId));
  const sessionRef = useRef(startSession(bookId));
  const {
    currentWord,
    currentIndex,
    isPlaying,
    wpm,
    setWPM,
    play,
    pause,
    skipForward,
    skipBackward,
    progress
  } = useRSVP(words, initialIndex, initialWPM);

  // Track session start index
  useEffect(() => {
    sessionRef.current.startIndex = initialIndex;
  }, [initialIndex]);

  // Save progress periodically when playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        onProgress(currentIndex);
      }, PROGRESS_SAVE_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentIndex, onProgress]);

  // Save progress when pausing or exiting
  useEffect(() => {
    if (!isPlaying && currentIndex > 0) {
      onProgress(currentIndex);
    }
  }, [isPlaying, currentIndex, onProgress]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // In fullscreen mode, any key exits fullscreen
      if (isFullscreen) {
        e.preventDefault();
        setIsFullscreen(false);
        return;
      }

      // Normal keyboard shortcuts when not in fullscreen
      if (e.code === 'Space') {
        e.preventDefault();
        isPlaying ? pause() : play();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipForward(SKIP_COUNT);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipBackward(SKIP_COUNT);
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        setIsFullscreen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isFullscreen, play, pause, skipForward, skipBackward]);

  const handleAddBookmark = (note) => {
    const bookmark = addBookmark(bookId, {
      position: currentIndex,
      note,
      mode: 'rsvp'
    });
    setBookmarks(prev => [...prev, bookmark]);
  };

  const handleDeleteBookmark = (bookmarkId) => {
    deleteBookmark(bookId, bookmarkId);
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
  };

  const handleJumpToBookmark = (bookmark) => {
    pause();
    // Use the jumpTo function from useRSVP
    const event = new CustomEvent('jumpToPosition', { detail: bookmark.position });
    window.dispatchEvent(event);
  };

  const handleExit = () => {
    // Save stats before exiting
    endSession(sessionRef.current, currentIndex);
    onExit();
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Fullscreen mode - only show word */}
      {isFullscreen ? (
        <div className="h-screen bg-black flex items-center justify-center">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium text-white tracking-wide text-center px-8">
            {highlightORP(currentWord)}
          </h1>
        </div>
      ) : (
        <>
          {/* Exit button */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={handleExit}
              className="text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-2"
              aria-label="Exit reader"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>

          {/* Fullscreen button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsFullscreen(true)}
              className="text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-2"
              aria-label="Fullscreen mode (press F)"
              title="Fullscreen (F) - Press any key to exit"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>

          {/* Main word display */}
          <div className="flex-1 flex items-center justify-center px-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-white tracking-wide text-center">
              {highlightORP(currentWord)}
            </h1>
          </div>

          {/* Progress bar */}
          <ProgressBar progress={progress} />

          {/* Speed slider */}
          <div className="w-full max-w-md mx-auto px-8 py-6">
            <SpeedSlider wpm={wpm} onChange={setWPM} />
          </div>

          {/* Controls */}
          <div className="flex justify-center pb-8">
            <ReaderControls
              isPlaying={isPlaying}
              onPlay={play}
              onPause={pause}
              onSkipBack={() => skipBackward(SKIP_COUNT)}
              onSkipForward={() => skipForward(SKIP_COUNT)}
            />
          </div>

          {/* Word counter */}
          <div className="text-center pb-4 text-gray-500 text-sm">
            {currentIndex + 1} / {words.length}
          </div>

          {/* Bookmark panel */}
          <BookmarkPanel
            bookmarks={bookmarks}
            onAdd={handleAddBookmark}
            onDelete={handleDeleteBookmark}
            onJumpTo={handleJumpToBookmark}
            currentPosition={currentIndex}
          />
        </>
      )}
    </div>
  );
}
