// Segment text into words
export function segmentIntoWords(text) {
  if (!text) return [];

  return text
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => word.trim());
}

// Get word position information
export function getWordPosition(words, index) {
  return {
    word: words[index] || '',
    progress: ((index + 1) / words.length) * 100,
    remaining: words.length - index - 1,
    total: words.length
  };
}

// Clean text for better reading (remove extra whitespace, etc.)
export function cleanText(text) {
  return text
    .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
    .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2 (paragraph break)
    .trim();
}

// Estimate reading time
export function estimateReadingTime(wordCount, wpm = 300) {
  const minutes = Math.ceil(wordCount / wpm);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
