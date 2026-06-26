import { useState, useEffect, useRef, useCallback } from "react";
import useNews from "../hooks/useNews";
import useBookmarks from "../hooks/useBookmarks";
import NewsCard from "../components/NewsCard";
import Skeleton from "../components/Skeleton";
import Toast from "../components/Toast";
import { COUNTRIES, CATEGORIES } from "../constants/categories";

/**
 * Home page component for reading the latest news articles.
 * Integrates search, pagination, category filtering, infinite scroll,
 * and visual progress bar animations.
 * 
 * @param {Object} props
 * @param {function} props.onShowToast - Callback function to show global toast alerts
 */
export default function Home({ onShowToast }) {
  const [country, setCountry] = useState("in");
  const [category, setCategory] = useState("general");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Progress bar animation state
  const [progressState, setProgressState] = useState("idle");

  const observerRef = useRef(null);

  // Debounce search queries to optimize backend load
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Reset page when category or country changes
  useEffect(() => {
    setPage(1);
  }, [category, country]);

  // Hook integrations
  const { articles, loading, error, hasMore, totalArticles, retry } = useNews(
    category,
    debouncedSearch,
    page,
    country
  );
  
  const { isBookmarked, toggleBookmark } = useBookmarks();

  // Progress Bar trigger
  useEffect(() => {
    if (loading) {
      setProgressState("loading");
    } else {
      setProgressState("finished");
      const timer = setTimeout(() => setProgressState("idle"), 800);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Infinite scroll callback
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading && error === null) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loading, error]
  );

  // IntersectionObserver effect for scroll detection
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleObserver]);

  // Bookmark toggle wrapping toast
  const handleBookmarkToggle = (article) => {
    const wasBookmarked = isBookmarked(article.url);
    toggleBookmark(article);
    onShowToast(
      wasBookmarked ? "Article removed from saved articles" : "Article saved successfully!"
    );
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  return (
    <div className="container">
      {/* Top progress bar loader */}
      <div className="top-progress-bar-container">
        <div className={`top-progress-bar ${progressState}`} />
      </div>

      {/* Hero Category Navigation Pills */}
      <div className="category-pills" role="tablist">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.code}
            className={`category-pill ${category === cat.code ? "active" : ""}`}
            onClick={() => setCategory(cat.code)}
            role="tab"
            aria-selected={category === cat.code}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filters Form Row */}
      <div className="selectors-row">
        <div className="filter-group">
          <label htmlFor="country-select">Country</label>
          <select
            id="country-select"
            className="filter-select"
            value={country}
            onChange={handleCountryChange}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search-input">Search Keywords</label>
          <input
            id="search-input"
            type="text"
            className="search-input"
            placeholder="Type keywords (e.g. tech, markets)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Results Header Info */}
      <div className="header-row">
        <h2 className="header-title">
          {category.charAt(0).toUpperCase() + category.slice(1)} News
        </h2>
        {totalArticles > 0 && (
          <span className="header-count" aria-live="polite">
            Showing {articles.length} of {totalArticles} results
          </span>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="empty-state-container">
          <span className="empty-state-icon">❌</span>
          <h3 className="empty-state-title">Unable to fetch news</h3>
          <p className="empty-state-desc">{error}</p>
          <button className="action-btn" onClick={retry}>
            Try Again
          </button>
        </div>
      )}

      {/* Initial load skeleton placeholders */}
      {loading && page === 1 && <Skeleton count={6} />}

      {/* Empty Search / Empty list state */}
      {!loading && articles.length === 0 && !error && (
        <div className="empty-state-container">
          <span className="empty-state-icon">🔍</span>
          <h3 className="empty-state-title">No articles found</h3>
          <p className="empty-state-desc">
            We couldn't find any articles matching your filters. Try search adjustments or category changes.
          </p>
          <button
            className="action-btn"
            onClick={() => {
              setSearchTerm("");
              setCategory("general");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Main Grid View */}
      {articles.length > 0 && (
        <div className="news-grid">
          {articles.map((article) => (
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

      {/* Infinite Scroll Anchor Wrapper */}
      <div ref={observerRef} className="scroll-anchor-container">
        {loading && page > 1 && (
          <>
            <div className="infinite-loading-spinner" />
            <span>Loading more articles...</span>
          </>
        )}
        {!hasMore && articles.length > 0 && !error && (
          <span>🎉 You've reached the end of the news grid.</span>
        )}
      </div>
    </div>
  );
}
