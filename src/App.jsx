import { useState } from 'react';
import LibraryView from './components/Library/LibraryView';
import ReaderContainer from './components/Reader/ReaderContainer';

function App() {
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleExit = () => {
    setSelectedBook(null);
  };

  return (
    <div className="App">
      {selectedBook ? (
        <ReaderContainer book={selectedBook} onExit={handleExit} />
      ) : (
        <LibraryView onBookSelect={handleBookSelect} />
      )}
    </div>
  );
}

export default App;
