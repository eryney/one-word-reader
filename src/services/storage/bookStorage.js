import { STORAGE_KEYS } from '../../utils/constants';

// Save a book to LocalStorage
export function saveBook(book) {
  const books = getBooks();
  const existingIndex = books.findIndex(b => b.id === book.id);

  if (existingIndex >= 0) {
    books[existingIndex] = book;
  } else {
    books.push(book);
  }

  try {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    console.log('Saved book metadata:', book);
  } catch (e) {
    console.error('Failed to save book metadata:', e);
    throw new Error('Failed to save book. Storage quota may be exceeded.');
  }
}

// Get all books from LocalStorage
export function getBooks() {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
  return data ? JSON.parse(data) : [];
}

// Get a single book by ID
export function getBook(bookId) {
  const books = getBooks();
  return books.find(b => b.id === bookId);
}

// Delete a book from LocalStorage
export function deleteBook(bookId) {
  const books = getBooks().filter(b => b.id !== bookId);
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  // Also delete the book's text content
  localStorage.removeItem(`${STORAGE_KEYS.FILES}_${bookId}`);
  console.log('Deleted book:', bookId);
}

// Save book text content separately (to avoid storing huge text in the books array)
export function saveBookText(bookId, text) {
  try {
    const key = `${STORAGE_KEYS.FILES}_${bookId}`;
    localStorage.setItem(key, text);
    console.log(`Saved book text for ${bookId}, length:`, text.length);
    console.log('Storage key:', key);
  } catch (e) {
    console.error('Failed to save book text:', e);
    throw new Error('Failed to save book text. Storage quota may be exceeded. Try a smaller file.');
  }
}

// Get book text content
export function getBookText(bookId) {
  const key = `${STORAGE_KEYS.FILES}_${bookId}`;
  const text = localStorage.getItem(key) || '';
  console.log(`Retrieved book text for ${bookId}, length:`, text.length);
  return text;
}

// Update book metadata
export function updateBook(bookId, updates) {
  const books = getBooks();
  const index = books.findIndex(b => b.id === bookId);

  if (index >= 0) {
    books[index] = { ...books[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  }
}
