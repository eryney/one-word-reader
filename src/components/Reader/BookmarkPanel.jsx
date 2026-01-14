import { useState } from 'react';

export default function BookmarkPanel({ bookmarks, onJumpTo, onDelete, onAdd, currentPosition }) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');

  const handleAddBookmark = () => {
    if (note.trim() || bookmarks.length === 0) {
      onAdd(note.trim() || 'Bookmark');
      setNote('');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Bookmarks"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        {bookmarks.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {bookmarks.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-bold text-lg">Bookmarks</h3>
          </div>

          {/* Add bookmark */}
          <div className="p-4 border-b border-gray-700">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note (optional)"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              onKeyPress={(e) => e.key === 'Enter' && handleAddBookmark()}
            />
            <button
              onClick={handleAddBookmark}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Bookmark Current Position
            </button>
          </div>

          {/* Bookmarks list */}
          <div className="flex-1 overflow-y-auto">
            {bookmarks.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                No bookmarks yet
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {bookmarks.map((bookmark) => (
                  <div key={bookmark.id} className="p-4 hover:bg-gray-800 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <button
                        onClick={() => onJumpTo(bookmark)}
                        className="text-white text-sm font-medium hover:text-red-400 transition-colors text-left flex-1"
                      >
                        {bookmark.note || 'Bookmark'}
                      </button>
                      <button
                        onClick={() => onDelete(bookmark.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors ml-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(bookmark.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
