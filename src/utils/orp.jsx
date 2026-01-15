// Calculate Optimal Recognition Point (ORP) for a word
export function calculateORP(word) {
  const length = word.length;
  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  return 3; // For longer words
}

// Highlight ORP character with FIXED CENTER ALIGNMENT
// The red letter stays in the exact same position on screen
export function highlightORP(word) {
  if (!word) return null;

  const orpIndex = calculateORP(word);
  if (orpIndex >= word.length) return word;

  const before = word.slice(0, orpIndex);
  const orp = word[orpIndex];
  const after = word.slice(orpIndex + 1);

  return (
    <span className="inline-block relative">
      {/* Container with fixed center point */}
      <span className="inline-flex items-baseline justify-center">
        {/* Left part - right aligned */}
        <span className="inline-block text-right" style={{ minWidth: '0' }}>
          {before}
        </span>
        {/* ORP - this stays at the fixed center point */}
        <span className="text-red-500 font-bold inline-block" style={{ minWidth: '1ch' }}>
          {orp}
        </span>
        {/* Right part - left aligned */}
        <span className="inline-block text-left" style={{ minWidth: '0' }}>
          {after}
        </span>
      </span>
    </span>
  );
}
