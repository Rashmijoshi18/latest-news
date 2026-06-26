import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useBookmarks, { Article } from "../hooks/useBookmarks";
import NewsCard from "../components/NewsCard";
import { CATEGORIES } from "../constants/categories";

interface BookmarksProps {
  onShowToast: (message: string) => void;
}

/**
 * Bookmarks page component to manage locally-saved articles.
 * Displays bookmarked items with category filter functionality.
 * 
 * @param props
 * @param props.onShowToast - Callback function to display toast notifications
 */
export default function Bookmarks({ onShowToast }: BookmarksProps) {
  const [topicFilter, setTopicFilter] = useState<string>("");
  
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  const handleBookmarkToggle = (article: Article) => {
    toggleBookmark(article);
    onShowToast("Bookmark status updated");
  };

  // Synchronous client-side filtering of local bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((article) => {
      return !topicFilter || article.topic?.toLowerCase() === topicFilter.toLowerCase();
    });
  }, [bookmarks, topicFilter]);

  return (
    <div className="container">
      {/* Header Info */}
      <div className="header-row">
        <h2 className="header-title">Saved Articles</h2>
        <span className="header-count" aria-live="polite">
          Showing {filteredBookmarks.length} of {bookmarks.length} saved
        </span>
      </div>

      {/* Filters Form Row (only show when there are bookmarks to filter) */}
      {bookmarks.length > 0 && (
        <div className="selectors-row">
          <div className="filter-group">
            <label htmlFor="bookmark-category">Filter by Category</label>
            <select
              id="bookmark-category"
              className="filter-select"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
            >
              <option value="">All Saved Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {cat.name.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim()}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Empty bookmark state */}
      {bookmarks.length === 0 && (
        <div className="empty-state-container" style={{ marginBottom: "60px" }}>
          <span className="empty-state-icon">⭐</span>
          <h3 className="empty-state-title">No saved articles yet</h3>
          <p className="empty-state-desc">
            Articles you bookmark will be displayed here, even when you're browsing offline.
          </p>
          <Link to="/">
            <button className="action-btn">Browse Latest News</button>
          </Link>
        </div>
      )}

      {/* Empty filter results state */}
      {bookmarks.length > 0 && filteredBookmarks.length === 0 && (
        <div className="empty-state-container" style={{ marginBottom: "60px" }}>
          <span className="empty-state-icon">🔍</span>
          <h3 className="empty-state-title">No category matches</h3>
          <p className="empty-state-desc">
            No bookmarks match your category filters.
          </p>
          <button 
            className="action-btn" 
            onClick={() => {
              setTopicFilter("");
            }}
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Bookmarks Grid View */}
      {filteredBookmarks.length > 0 && (
        <div className="news-grid" style={{ marginBottom: "60px" }}>
          {filteredBookmarks.map((article) => (
            <NewsCard
              key={article.url}
              article={article}
              isBookmarked={isBookmarked(article.url)}
              onBookmarkToggle={handleBookmarkToggle}
              onShareSuccess={onShowToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}
