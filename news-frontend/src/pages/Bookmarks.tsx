import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import useBookmarks, { Article } from "../hooks/useBookmarks";
import useHistory from "../hooks/useHistory";
import NewsCard from "../components/NewsCard";
import { CATEGORIES } from "../constants/categories";

interface BookmarksProps {
  onShowToast: (message: string) => void;
}

/**
 * Bookmarks page component to manage locally-saved articles.
 * Displays bookmarked items with search filter functionality, and
 * lists recently read articles in a persistent history log.
 * 
 * @param props
 * @param props.onShowToast - Callback function to display toast notifications
 */
export default function Bookmarks({ onShowToast }: BookmarksProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [topicFilter, setTopicFilter] = useState<string>("");
  
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const { history, addToHistory, clearHistory } = useHistory();

  const handleBookmarkToggle = (article: Article) => {
    toggleBookmark(article);
    onShowToast("Bookmark status updated");
  };

  const handleClearHistory = () => {
    clearHistory();
    onShowToast("Reading history cleared successfully!");
  };

  // Synchronous client-side filtering of local bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((article) => {
      const titleMatch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = (article.description || "").toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = !topicFilter || article.topic?.toLowerCase() === topicFilter.toLowerCase();
      
      return (titleMatch || descMatch) && categoryMatch;
    });
  }, [bookmarks, searchTerm, topicFilter]);

  // Sync state between history toggling and navbar count if needed
  const [historyItems, setHistoryItems] = useState<Article[]>(history);

  useEffect(() => {
    const syncHistory = () => {
      try {
        const saved = localStorage.getItem("news_history");
        setHistoryItems(saved ? JSON.parse(saved) : []);
      } catch (e) {
        setHistoryItems([]);
      }
    };

    window.addEventListener("historyChanged", syncHistory);
    return () => {
      window.removeEventListener("historyChanged", syncHistory);
    };
  }, []);

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

          <div className="filter-group">
            <label htmlFor="bookmark-search">Search Saved</label>
            <input
              id="bookmark-search"
              type="text"
              className="search-input"
              placeholder="Search saved articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          <h3 className="empty-state-title">No search matches</h3>
          <p className="empty-state-desc">
            No bookmarks match your search keywords or category filters.
          </p>
          <button 
            className="action-btn" 
            onClick={() => {
              setSearchTerm("");
              setTopicFilter("");
            }}
          >
            Clear Search
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
              onCardClick={addToHistory}
            />
          ))}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* Dynamic Reading History Dashboard Section */}
      {historyItems.length > 0 && (
        <div style={{ marginTop: "60px", borderTop: "2px solid var(--border-color)", paddingTop: "40px" }}>
          <div className="header-row">
            <h2 className="header-title" style={{ fontSize: "1.7rem", background: "none", WebkitTextFillColor: "inherit", color: "var(--text-color)" }}>
              ⏱️ Recently Viewed Articles
            </h2>
            <button 
              className="action-btn"
              onClick={handleClearHistory}
              style={{ 
                backgroundColor: "var(--error-color)", 
                padding: "8px 16px", 
                fontSize: "0.85rem", 
                boxShadow: "none" 
              }}
            >
              Clear History
            </button>
          </div>
          
          <div className="news-grid">
            {historyItems.map((article) => (
              <NewsCard
                key={`hist-${article.url}`}
                article={article}
                isBookmarked={isBookmarked(article.url)}
                onBookmarkToggle={handleBookmarkToggle}
                onShareSuccess={onShowToast}
                onCardClick={addToHistory}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
