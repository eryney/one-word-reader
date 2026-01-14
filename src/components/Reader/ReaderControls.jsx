export default function ReaderControls({ isPlaying, onPlay, onPause, onSkipBack, onSkipForward }) {
  return (
    <div className="flex items-center gap-6">
      {/* Skip backward */}
      <button
        onClick={onSkipBack}
        className="text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-2"
        aria-label="Skip backward"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.5 12l8.5 6V6l-8.5 6zm-7.5 0l8.5 6V6l-8.5 6z"/>
        </svg>
      </button>

      {/* Play/Pause */}
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-3"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>

      {/* Skip forward */}
      <button
        onClick={onSkipForward}
        className="text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-2"
        aria-label="Skip forward"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
        </svg>
      </button>
    </div>
  );
}
