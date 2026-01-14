// Calculate Optimal Recognition Point (ORP) for a word
export function calculateORP(word) {
  const length = word.length;
  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  return 3; // For longer words
}

// Highlight ORP character in a word
export function highlightORP(word) {
  if (!word) return null;

  const orpIndex = calculateORP(word);
  if (orpIndex >= word.length) return word;

  return (
    <span>
      {word.slice(0, orpIndex)}
      <span className="text-red-500 font-bold">{word[orpIndex]}</span>
      {word.slice(orpIndex + 1)}
    </span>
  );
}
