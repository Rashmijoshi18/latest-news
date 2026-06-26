import { useState, useEffect, useCallback, useRef } from "react";
import API from "../constants/api";
import { Article } from "./useBookmarks";

export interface NewsHookResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalArticles: number;
  retry: () => void;
}

/**
 * Custom hook to handle fetching news articles from the backend server.
 * Handles category, query search, pagination, loading states, and error handling.
 * 
 * @param category News category (general, technology, etc.)
 * @param query Keyword search input
 * @param page Current page number
 * @param country Selected country code
 * @returns Fetching states, article results, and retry helper.
 */
export default function useNews(
  category: string,
  query: string,
  page: number,
  country: string
): NewsHookResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalArticles, setTotalArticles] = useState<number>(0);

  const activeRequestRef = useRef<number>(0);

  // Reset articles list when filters change
  useEffect(() => {
    setArticles([]);
    setTotalArticles(0);
    setHasMore(true);
    setError(null);
  }, [category, query, country]);

  const fetchNews = useCallback(async (isRetry: boolean = false) => {
    const currentRequestId = ++activeRequestRef.current;

    if (page > 1 && !hasMore && !isRetry) return;

    setLoading(true);
    setError(null);

    interface NewsParams {
      country: string;
      max: number;
      page: number;
      topic?: string;
      q?: string;
    }

    const params: NewsParams = {
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

    let retries = 0;
    const maxRetries = 3;

    // Retry loop in case backend server is booting concurrently
    const attemptFetch = async (): Promise<any> => {
      try {
        return await API.get("/news", { params });
      } catch (err: any) {
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
      const response = await attemptFetch();

      if (currentRequestId !== activeRequestRef.current) return;

      const fetchedArticles: Article[] = response.data.articles || [];
      const total: number = response.data.totalArticles || 0;

      setTotalArticles(total);
      
      setArticles((prev) => {
        if (page === 1) {
          return fetchedArticles;
        }
        const combined = [...prev, ...fetchedArticles];
        const unique = combined.filter(
          (article, index, self) =>
            self.findIndex((a) => a.url === article.url) === index
        );
        return unique;
      });

      if (fetchedArticles.length === 0 || (page * 10) >= total) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err: any) {
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

  // Fetch articles when parameters update
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
