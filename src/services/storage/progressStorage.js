import { STORAGE_KEYS } from '../../utils/constants';

// Save reading progress for a book
export function saveProgress(bookId, progress) {
  const allProgress = getAllProgress();
  allProgress[bookId] = {
    ...progress,
    lastRead: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
}

// Get progress for a specific book
export function getProgress(bookId) {
  const allProgress = getAllProgress();
  return allProgress[bookId] || null;
}

// Get all progress data
function getAllProgress() {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return data ? JSON.parse(data) : {};
}

// Calculate progress percentage
export function getProgressPercentage(bookId, totalWords) {
  const progress = getProgress(bookId);
  if (!progress || !totalWords) return 0;
  return Math.round((progress.currentIndex / totalWords) * 100);
}

// Delete progress for a book
export function deleteProgress(bookId) {
  const allProgress = getAllProgress();
  delete allProgress[bookId];
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
}

// Reset progress for a book
export function resetProgress(bookId) {
  saveProgress(bookId, {
    currentIndex: 0,
    scrollPosition: 0,
    mode: 'rsvp'
  });
}
