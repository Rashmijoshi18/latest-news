import { useState, useEffect } from "react";

export interface ArticleSource {
  name: string;
  url?: string;
}

export interface Article {
  title: string;
  description: string;
  url: string;
  image?: string;
  urlToImage?: string;
  publishedAt?: string;
  topic?: string;
  source?: ArticleSource;
}

export interface BookmarksHookResult {
  bookmarks: Article[];
  toggleBookmark: (article: Article) => void;
  isBookmarked: (url: string) => boolean;
  bookmarksCount: number;
}

/**
 * Custom hook to manage bookmark saving and retrieval in LocalStorage.
 * 
 * @returns Object containing bookmarks array, toggler, count, and lookup helpers.
 */
export default function useBookmarks(): BookmarksHookResult {
  const [bookmarks, setBookmarks] = useState<Article[]>(() => {
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

  const addBookmark = (article: Article) => {
    if (!article.url) return;
    setBookmarks((prev) => {
      if (prev.some((b) => b.url === article.url)) return prev;
      const imageUrl = article.image || article.urlToImage;
      const normalizedArticle: Article = {
        title: article.title,
        description: article.description,
        url: article.url,
        image: imageUrl,
        urlToImage: imageUrl,
        source: article.source,
        publishedAt: article.publishedAt,
        topic: article.topic || "general"
      };
      
      setTimeout(() => {
        window.dispatchEvent(new Event("bookmarksChanged"));
      }, 0);

      return [normalizedArticle, ...prev];
    });
  };

  const removeBookmark = (url: string) => {
    setBookmarks((prev) => {
      const filtered = prev.filter((b) => b.url !== url);
      setTimeout(() => {
        window.dispatchEvent(new Event("bookmarksChanged"));
      }, 0);
      return filtered;
    });
  };

  const toggleBookmark = (article: Article) => {
    if (isBookmarked(article.url)) {
      removeBookmark(article.url);
    } else {
      addBookmark(article);
    }
  };

  const isBookmarked = (url: string): boolean => {
    return bookmarks.some((b) => b.url === url);
  };

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    bookmarksCount: bookmarks.length
  };
}
