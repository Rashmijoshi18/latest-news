import { useState, useEffect, useCallback, useRef } from "react";
import API from "../constants/api";

/**
 * Custom hook to handle fetching news articles from the backend server.
 * Handles category, query search, pagination, loading states, and error handling.
 * 
 * @param {string} category News category (general, technology, etc.)
 * @param {string} query Keyword search input
 * @param {number} page Current page number
 * @param {string} country Selected country code
 * @returns {Object} Fetching states, article results, and retry helper.
 */
export default function useNews(category, query, page, country) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalArticles, setTotalArticles] = useState(0);

  // Keep track of the active request to ignore stale responses
  const activeRequestRef = useRef(0);

  // Reset articles list when filters change
  useEffect(() => {
    setArticles([]);
    setTotalArticles(0);
    setHasMore(true);
    setError(null);
  }, [category, query, country]);

  const fetchNews = useCallback(async (isRetry = false) => {
    // Increment the active request counter
    const currentRequestId = ++activeRequestRef.current;

    // Prevent fetching if we know there is no more data (unless page is 1)
    if (page > 1 && !hasMore && !isRetry) return;

    setLoading(true);
    setError(null);

    const params = {
      country,
      max: 10,
      page,
    };

    if (category) {
      params.topic = category;
    }
    if (query && query.trim() !== "") {
      params.q = query.trim();
    }

    let response;
    let retries = 0;
    const maxRetries = 3;

    // Network helper with retry capabilities for concurrency boot delay
    const attemptFetch = async () => {
      try {
        return await API.get("/news", { params });
      } catch (err) {
        // If it's a network connection error (backend is still booting), retry
        const isNetworkErr = !err.response && err.request;
        if (isNetworkErr && retries < maxRetries && currentRequestId === activeRequestRef.current) {
          retries++;
          console.log(`Backend booting, retrying request (attempt ${retries}/${maxRetries})...`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return attemptFetch();
        }
        throw err;
      }
    };

    try {
      response = await attemptFetch();

      // Ignore this response if a newer request has already started
      if (currentRequestId !== activeRequestRef.current) return;

      const fetchedArticles = response.data.articles || [];
      const total = response.data.totalArticles || 0;

      setTotalArticles(total);
      
      setArticles((prev) => {
        if (page === 1) {
          return fetchedArticles;
        }
        // Deduplicate articles just in case GNews duplicates them across pages
        const combined = [...prev, ...fetchedArticles];
        const unique = combined.filter(
          (article, index, self) =>
            self.findIndex((a) => a.url === article.url) === index
        );
        return unique;
      });

      // GNews API returns totalArticles.
      // If we have fetched as many or more than totalArticles, or we get empty articles
      if (fetchedArticles.length === 0 || (page * 10) >= total) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      // Ignore this error if a newer request has already started
      if (currentRequestId !== activeRequestRef.current) return;

      console.error("useNews fetch error:", err);
      
      let errMsg = "An unexpected error occurred while loading news.";
      if (err.response) {
        if (err.response.status === 429) {
          errMsg = "Rate limit exceeded. Please try again after 15 minutes.";
        } else if (err.response.data && err.response.data.error) {
          errMsg = err.response.data.error;
        }
      } else if (err.request) {
        errMsg = "Could not connect to the server. Please check if your backend is running.";
      }
      
      setError(errMsg);
    } finally {
      if (currentRequestId === activeRequestRef.current) {
        setLoading(false);
      }
    }
  }, [category, query, page, country, hasMore]);

  // Fetch articles when page or trigger changes
  useEffect(() => {
    fetchNews();
  }, [category, query, page, country]);

  return {
    articles,
    loading,
    error,
    hasMore,
    totalArticles,
    retry: () => fetchNews(true)
  };
}
