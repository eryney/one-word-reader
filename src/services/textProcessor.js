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

// Convert section markers (character positions) to word indices
export function mapSectionsToWordIndices(text, sectionMarkers) {
  if (!sectionMarkers || sectionMarkers.length === 0) {
    return [];
  }

  const words = segmentIntoWords(text);

  // Build character position → word index lookup map
  let charCount = 0;
  const charToWordMap = [];

  for (let i = 0; i < words.length; i++) {
    charToWordMap.push({ charPos: charCount, wordIdx: i });
    charCount += words[i].length + 1; // +1 for space
  }

  // Map each section marker to word index
  const sections = sectionMarkers.map((marker, idx) => {
    // Find closest word index for this char position
    let startIndex = 0;
    let minDiff = Infinity;

    for (const mapping of charToWordMap) {
      const diff = Math.abs(mapping.charPos - marker.charPosition);
      if (diff < minDiff) {
        minDiff = diff;
        startIndex = mapping.wordIdx;
      }
      // Early exit if we've passed the marker position
      if (mapping.charPos > marker.charPosition) break;
    }

    // Calculate end index (next section start - 1, or end of book)
    const nextMarker = sectionMarkers[idx + 1];
    let endIndex = words.length - 1;

    if (nextMarker) {
      // Find word index for next marker
      let nextStartIndex = words.length - 1;
      let nextMinDiff = Infinity;

      for (const mapping of charToWordMap) {
        const diff = Math.abs(mapping.charPos - nextMarker.charPosition);
        if (diff < nextMinDiff) {
          nextMinDiff = diff;
          nextStartIndex = mapping.wordIdx;
        }
        if (mapping.charPos > nextMarker.charPosition) break;
      }

      endIndex = nextStartIndex - 1;
    }

    return {
      title: marker.title,
      startIndex: startIndex,
      endIndex: endIndex,
      level: marker.level || 1
    };
  });

  return sections;
}
