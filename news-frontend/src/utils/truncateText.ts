/**
 * Truncates text to a specified character limit and appends an ellipsis.
 * 
 * @param text The string to truncate
 * @param limit Character count threshold
 * @returns Truncated string
 */
export default function truncateText(text?: string, limit: number = 100): string {
  if (!text) return "";
  if (text.length <= limit) return text;
  return text.substring(0, limit).trim() + "...";
}
