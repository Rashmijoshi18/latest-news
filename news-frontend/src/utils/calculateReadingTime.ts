/**
 * Calculates estimated reading time of text based on standard WPM (Words Per Minute).
 * 
 * @param text Content block to evaluate
 * @param wpm Words per minute constant (default 200)
 * @returns Estimated read time string (e.g. "2 min read")
 */
export default function calculateReadingTime(text?: string, wpm: number = 200): string {
  if (!text) return "1 min read";
  
  // Clean text and count words
  const wordsCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const minutes = Math.ceil(wordsCount / wpm);
  
  return `${minutes} min read`;
}
