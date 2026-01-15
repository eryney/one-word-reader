import { useState, useEffect } from 'react';
import { getBooks, saveBook, deleteBook as removeBook, saveBookText } from '../services/storage/bookStorage';
import { deleteProgress } from '../services/storage/progressStorage';
import { parseEPUB } from '../services/parsers/epubParser';
import { parsePDF } from '../services/parsers/pdfParser';
import { segmentIntoWords, mapSectionsToWordIndices } from '../services/textProcessor';

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load books from LocalStorage on mount
  useEffect(() => {
    const loadedBooks = getBooks();
    setBooks(loadedBooks);
  }, []);

  const addBook = async (file) => {
    setLoading(true);
    setError(null);

    try {
      let parsedData;

      // Parse based on file type
      if (file.name.endsWith('.epub')) {
        parsedData = await parseEPUB(file);
      } else if (file.name.endsWith('.pdf')) {
        parsedData = await parsePDF(file);
      } else {
        throw new Error('Unsupported file format. Please upload .epub or .pdf files.');
      }

      // NEW: Map section markers to word indices
      const sections = mapSectionsToWordIndices(
        parsedData.text,
        parsedData.sectionMarkers
      );

      console.log(`Mapped ${sections.length} sections to word indices`);

      // Create book object
      const book = {
        id: crypto.randomUUID(),
        title: parsedData.title,
        author: parsedData.author,
        format: parsedData.format,
        wordCount: parsedData.wordCount,
        dateAdded: new Date().toISOString(),
        sections: sections // NEW: Include sections
      };

      // Save book metadata
      saveBook(book);

      // Save book text
      saveBookText(book.id, parsedData.text);

      // Update state
      setBooks(prevBooks => [...prevBooks, book]);

      setLoading(false);
      return book;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const deleteBook = (bookId) => {
    removeBook(bookId);
    deleteProgress(bookId);
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
  };

  const refreshBooks = () => {
    const loadedBooks = getBooks();
    setBooks(loadedBooks);
  };

  return {
    books,
    loading,
    error,
    addBook,
    deleteBook,
    refreshBooks
  };
}
