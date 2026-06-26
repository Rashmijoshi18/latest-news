/**
 * Truncates text to a specified character limit and appends an ellipsis.
 * 
 * @param {string} text The string to truncate
 * @param {number} limit Character count threshold
 * @returns {string} Truncated string
 */
export default function truncateText(text, limit = 100) {
  if (!text) return "";
  if (text.length <= limit) return text;
  return text.substring(0, limit).trim() + "...";
}
