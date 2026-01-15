// Calculate Optimal Recognition Point (ORP) for a word
export function calculateORP(word) {
  const length = word.length;
  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  return 3; // For longer words
}

// Highlight ORP character with FIXED CENTER ALIGNMENT
// The red letter is ALWAYS at the exact center of the screen
export function highlightORP(word) {
  if (!word) return null;

  const orpIndex = calculateORP(word);
  if (orpIndex >= word.length) return word;

  const before = word.slice(0, orpIndex);
  const orp = word[orpIndex];
  const after = word.slice(orpIndex + 1);

  return (
    <span className="relative inline-block w-full h-full">
      {/* Text before ORP - ends just before center */}
      <span
        className="absolute whitespace-nowrap text-right"
        style={{
          top: 0,
          right: '50%',
          paddingRight: '0.4em'
        }}
      >
        {before}
      </span>

      {/* ORP at dead center - NEVER moves */}
      <span
        className="absolute text-red-500 font-bold whitespace-nowrap"
        style={{
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        {orp}
      </span>

      {/* Text after ORP - starts just after center */}
      <span
        className="absolute whitespace-nowrap text-left"
        style={{
          top: 0,
          left: '50%',
          paddingLeft: '0.4em'
        }}
      >
        {after}
      </span>
    </span>
  );
}
