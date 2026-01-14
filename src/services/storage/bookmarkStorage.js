const BOOKMARKS_KEY = 'speed_reader_bookmarks';

// Get all bookmarks for a book
export function getBookmarks(bookId) {
  const allBookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '{}');
  return allBookmarks[bookId] || [];
}

// Add a bookmark
export function addBookmark(bookId, bookmark) {
  const allBookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '{}');

  if (!allBookmarks[bookId]) {
    allBookmarks[bookId] = [];
  }

  const newBookmark = {
    id: crypto.randomUUID(),
    position: bookmark.position, // word index or scroll position
    note: bookmark.note || '',
    timestamp: new Date().toISOString(),
    mode: bookmark.mode // 'rsvp' or 'traditional'
  };

  allBookmarks[bookId].push(newBookmark);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(allBookmarks));

  return newBookmark;
}

// Delete a bookmark
export function deleteBookmark(bookId, bookmarkId) {
  const allBookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '{}');

  if (allBookmarks[bookId]) {
    allBookmarks[bookId] = allBookmarks[bookId].filter(b => b.id !== bookmarkId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(allBookmarks));
  }
}

// Delete all bookmarks for a book
export function deleteAllBookmarks(bookId) {
  const allBookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '{}');
  delete allBookmarks[bookId];
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(allBookmarks));
}
