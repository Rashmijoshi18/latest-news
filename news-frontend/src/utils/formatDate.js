/**
 * Formats an ISO date string into a reader-friendly format.
 * If the date is recent (within 24 hours), shows relative time.
 * Otherwise, shows formatted date.
 * 
 * @param {string} dateString ISO date string
 * @returns {string} Formatted date text
 */
export default function formatDate(dateString) {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  
  // If invalid date, return original or empty
  if (isNaN(date.getTime())) return "";

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    // Return structured date
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
}
