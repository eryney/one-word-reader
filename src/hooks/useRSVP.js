import { useState, useEffect, useRef } from 'react';
import { DEFAULT_WPM } from '../utils/constants';

export function useRSVP(words, initialIndex = 0, initialWPM = DEFAULT_WPM) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWPM] = useState(initialWPM);
  const timerRef = useRef(null);

  const interval = 60000 / wpm; // Convert WPM to milliseconds per word

  useEffect(() => {
    if (isPlaying && currentIndex < words.length) {
      timerRef.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, interval);
    } else if (currentIndex >= words.length && isPlaying) {
      setIsPlaying(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentIndex, interval, words.length]);

  const play = () => {
    if (currentIndex >= words.length) {
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const skipForward = (count = 10) => {
    const newIndex = Math.min(currentIndex + count, words.length - 1);
    setCurrentIndex(newIndex);
  };

  const skipBackward = (count = 10) => {
    const newIndex = Math.max(currentIndex - count, 0);
    setCurrentIndex(newIndex);
  };

  const jumpTo = (index) => {
    const newIndex = Math.max(0, Math.min(index, words.length - 1));
    setCurrentIndex(newIndex);
  };

  const reset = () => {
    pause();
    setCurrentIndex(0);
  };

  // Listen for jump events from bookmarks
  useEffect(() => {
    const handleJump = (e) => {
      jumpTo(e.detail);
    };
    window.addEventListener('jumpToPosition', handleJump);
    return () => window.removeEventListener('jumpToPosition', handleJump);
  }, [words.length]);

  return {
    currentWord: words[currentIndex] || '',
    currentIndex,
    isPlaying,
    wpm,
    setWPM,
    play,
    pause,
    skipForward,
    skipBackward,
    jumpTo,
    reset,
    progress: words.length > 0 ? (currentIndex / words.length) * 100 : 0
  };
}
