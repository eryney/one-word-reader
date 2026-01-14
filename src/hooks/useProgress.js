import { useState, useEffect } from 'react';
import { getProgress, saveProgress as saveProgressToStorage } from '../services/storage/progressStorage';

export function useProgress(bookId) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (bookId) {
      const savedProgress = getProgress(bookId);
      setProgress(savedProgress);
    }
  }, [bookId]);

  const saveProgress = (data) => {
    if (bookId) {
      saveProgressToStorage(bookId, data);
      setProgress(data);
    }
  };

  const updateProgress = (updates) => {
    const newProgress = { ...progress, ...updates };
    saveProgress(newProgress);
  };

  return {
    progress,
    saveProgress,
    updateProgress
  };
}
