import { useState, useEffect } from "react";

/**
 * Custom hook to manage bookmark saving and retrieval in LocalStorage.
 * 
 * @returns {Object} Bookmarking states and event triggers.
 */
export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("news_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse bookmarks from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("news_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (article) => {
    if (!article.url) return;
    setBookmarks((prev) => {
      // Avoid duplicate bookmarks
      if (prev.some((b) => b.url === article.url)) return prev;
      // standardizing property names if needed (e.g. image vs urlToImage)
      const normalizedArticle = {
        title: article.title,
        description: article.description,
        url: article.url,
        // GNews uses .image, keep both key names so it works seamlessly
        image: article.image || article.urlToImage,
        urlToImage: article.image || article.urlToImage,
        source: article.source,
        publishedAt: article.publishedAt,
        topic: article.topic || "general"
      };
      
      // Dispatch a custom event to notify other parts of the app (like Navbar count)
      setTimeout(() => {
        window.dispatchEvent(new Event("bookmarksChanged"));
      }, 0);

      return [normalizedArticle, ...prev];
    });
  };

  const removeBookmark = (url) => {
    setBookmarks((prev) => {
      const filtered = prev.filter((b) => b.url !== url);
      setTimeout(() => {
        window.dispatchEvent(new Event("bookmarksChanged"));
      }, 0);
      return filtered;
    });
  };

  const toggleBookmark = (article) => {
    if (isBookmarked(article.url)) {
      removeBookmark(article.url);
    } else {
      addBookmark(article);
    }
  };

  const isBookmarked = (url) => {
    return bookmarks.some((b) => b.url === url);
  };

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    bookmarksCount: bookmarks.length
  };
}
