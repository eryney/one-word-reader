import { useState, useEffect } from 'react';
import Header from '../Shared/Header';
import FileUpload from './FileUpload';
import BookCard from './BookCard';
import StatsPanel from './StatsPanel';
import { useBooks } from '../../hooks/useBooks';

export default function LibraryView({ onBookSelect }) {
  const { books, loading, error, addBook, deleteBook } = useBooks();
  const [uploadError, setUploadError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(books.length === 0);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileSelect = async (file) => {
    try {
      setUploadError(null);
      await addBook(file);
    } catch (err) {
      setUploadError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-gray-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <StatsPanel />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Always Visible */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Read <span className="text-red-600 dark:text-red-500">faster</span>
            </h1>
          </div>

          {/* What is this - Clean, minimal */}
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              You're maybe here from Twitter. This is your no-frills speed reader, based on the principles of RSVP (Rapid Serial Visual Presentation).
              I wrote this for myself, but you can use it too if you think it'd be helpful.
            </p>

            {/* Payment CTA - Made prominent */}
            <div className="mb-6 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl">
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                💰 It's free, but if you find this useful, pay $5
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Click the yellow <span className="font-bold">"Pay $5"</span> button in the top right →
              </p>
            </div>

            <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
              Files stay local in your browser. Nothing gets uploaded. Progress saves automatically.
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300">
              Words flash sequentially at your chosen speed—eliminating eye movement and subvocalization.
              Start at 250 WPM, work up to 500-800+. Red letter marks the focus point.
            </p>
          </div>

          {/* Simple 3-step - No boxes */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 dark:text-red-500 mb-3">1</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Upload</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                EPUB or PDF with text layer
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 dark:text-red-500 mb-3">2</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Play</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Adjust speed with slider
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 dark:text-red-500 mb-3">3</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Focus</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Follow the red letter
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
            {books.length === 0 ? 'Upload a book' : 'Add another book'}
          </h2>
          <FileUpload onFileSelect={handleFileSelect} loading={loading} darkMode={darkMode} />
          {uploadError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-xl">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">{uploadError}</p>
            </div>
          )}
        </div>

        {/* Library Section */}
        {books.length > 0 && (
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
              Your library
              <span className="ml-3 text-lg font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full">
                {books.length}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onOpen={() => onBookSelect(book)}
                  onDelete={deleteBook}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
