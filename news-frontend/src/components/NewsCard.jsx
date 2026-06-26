import formatDate from "../utils/formatDate";
import truncateText from "../utils/truncateText";

/**
 * @typedef {Object} ArticleSource
 * @property {string} name - Name of the publisher source
 * @property {string} [url] - URL of the source
 */

/**
 * @typedef {Object} Article
 * @property {string} title - Title of the article
 * @property {string} description - Short description of the article
 * @property {string} url - Web link of the article
 * @property {string} [image] - GNews article image
 * @property {string} [urlToImage] - NewsAPI/Fallback article image
 * @property {string} [publishedAt] - ISO date string of publication
 * @property {string} [topic] - Category / Topic
 * @property {ArticleSource} source - Source details
 */

/**
 * NewsCard component displays a single news article in a grid card.
 * 
 * @param {Object} props
 * @param {Article} props.article - The article data
 * @param {boolean} props.isBookmarked - Bookmark status of the article
 * @param {function} props.onBookmarkToggle - Handler function to toggle bookmarks
 * @param {function} props.onShareSuccess - Success callback when link is copied or shared
 */
export default function NewsCard({ article, isBookmarked, onBookmarkToggle, onShareSuccess }) {
  const { title, description, url, publishedAt, source, topic } = article;
  
  // Normalize GNews 'image' and traditional 'urlToImage'
  const imageUrl = article.image || article.urlToImage;
  const sourceName = source?.name || "News";

  const handleCardClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    onBookmarkToggle(article);
  };

  const handleShareClick = async (e) => {
    e.stopPropagation();
    
    const shareData = {
      title: title,
      text: description || "Check out this news article!",
      url: url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Web Share failed:", err);
          fallbackCopy();
        }
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        onShareSuccess("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  return (
    <div className="news-card" onClick={handleCardClick}>
      <div className="news-image-wrapper">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            loading="lazy" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
              e.target.parentNode.classList.add("skeleton-shimmer");
            }}
          />
        ) : (
          <div className="skeleton-shimmer" style={{ width: "100%", height: "100%", opacity: 0.15 }} />
        )}
        {topic && <span className="card-category-badge">{topic}</span>}
      </div>

      <div className="news-content">
        <div className="news-meta">
          <span className="news-source">{sourceName}</span>
          <span className="news-date">{formatDate(publishedAt)}</span>
        </div>

        <h3 className="news-title" title={title}>
          {truncateText(title, 80)}
        </h3>

        <p className="news-desc">
          {description ? truncateText(description, 130) : "No description available for this article. Click read more to view the full details."}
        </p>

        <div className="news-actions">
          <button 
            className={`card-btn ${isBookmarked ? "bookmarked" : ""}`}
            onClick={handleBookmarkClick}
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
            aria-label={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
          >
            {isBookmarked ? "★" : "☆"}
          </button>

          <button 
            className="card-btn"
            onClick={handleShareClick}
            title="Share Article"
            aria-label="Share Article"
          >
            🔗
          </button>

          <span className="read-more-link">
            Read More →
          </span>
        </div>
      </div>
    </div>
  );
}
