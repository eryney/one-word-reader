import { estimateReadingTime } from '../../services/textProcessor';
import { getProgress, getProgressPercentage } from '../../services/storage/progressStorage';

export default function BookCard({ book, onOpen, onDelete, darkMode }) {
  const progress = getProgress(book.id);
  const progressPercentage = getProgressPercentage(book.id, book.wordCount);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-red-300 dark:hover:border-red-600 hover:shadow-xl transition-all cursor-pointer group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0" onClick={onOpen}>
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{book.author}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full font-medium">
              {book.wordCount?.toLocaleString()} words
            </span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full font-medium">
              {estimateReadingTime(book.wordCount)}
            </span>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 rounded-full font-bold uppercase text-xs">
              {book.format}
            </span>
          </div>

          {progress && (
            <div className="mb-3">
              <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span>Progress</span>
                <span className="text-red-600 dark:text-red-400">{progressPercentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-700 transition-all rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 dark:text-gray-500">
            Added {formatDate(book.dateAdded)}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Delete this book?')) {
              onDelete(book.id);
            }
          }}
          className="ml-4 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          aria-label="Delete book"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
