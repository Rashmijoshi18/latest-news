import { useState, useEffect } from "react";
import { Article } from "./useBookmarks";

export interface HistoryHookResult {
  history: Article[];
  addToHistory: (article: Article) => void;
  clearHistory: () => void;
}

/**
 * Custom hook to manage reading history of viewed news articles in LocalStorage.
 * Capped at 12 items, automatically deduplicates and shifts items to the top.
 * 
 * @returns History collection, addition triggers, and reset helpers.
 */
export default function useHistory(): HistoryHookResult {
  const [history, setHistory] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem("news_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("news_history", JSON.stringify(history));
  }, [history]);

  const addToHistory = (article: Article) => {
    if (!article.url) return;
    setHistory((prev) => {
      // Remove item if it already exists to move it to the top
      const filtered = prev.filter((item) => item.url !== article.url);
      
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

      const updated = [normalizedArticle, ...filtered].slice(0, 12); // Limit to 12 articles
      
      setTimeout(() => {
        window.dispatchEvent(new Event("historyChanged"));
      }, 0);

      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    setTimeout(() => {
      window.dispatchEvent(new Event("historyChanged"));
    }, 0);
  };

  return {
    history,
    addToHistory,
    clearHistory
  };
}
