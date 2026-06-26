import { useState, useEffect } from "react";
import { Article } from "../hooks/useBookmarks";
import formatDate from "../utils/formatDate";
import truncateText from "../utils/truncateText";
import calculateReadingTime from "../utils/calculateReadingTime";

interface NewsCardProps {
  article: Article;
  isBookmarked: boolean;
  onBookmarkToggle: (article: Article) => void;
  onShareSuccess: (message: string) => void;
  onCardClick?: (article: Article) => void; // Optional history-tracking callback
}

/**
 * NewsCard component displays a single news article in a grid card.
 * Features Text-to-Speech audio capability, reading time estimates,
 * Web Share integrations, and bookmarks persistence.
 * 
 * @param props
 * @param props.article - The article data
 * @param props.isBookmarked - Bookmark status of the article
 * @param props.onBookmarkToggle - Handler function to toggle bookmarks
 * @param props.onShareSuccess - Success callback when link is shared/copied
 * @param props.onCardClick - Trigger callback when user clicks card (tracks history)
 */
export default function NewsCard({ 
  article, 
  isBookmarked, 
  onBookmarkToggle, 
  onShareSuccess,
  onCardClick 
}: NewsCardProps) {
  const { title, description, url, publishedAt, source, topic } = article;
  
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const imageUrl = article.image || article.urlToImage;
  const sourceName = source?.name || "News";
  const readingTime = calculateReadingTime(description ? `${title} ${description}` : title);

  // Sync speech state globally across other cards
  useEffect(() => {
    const handleGlobalSpeechStart = (e: Event) => {
      const customEvent = e as CustomEvent<{ url: string }>;
      if (customEvent.detail?.url !== url) {
        setIsSpeaking(false);
      }
    };

    window.addEventListener("newsSpeechStarted", handleGlobalSpeechStart);
    
    // Cleanup SpeechSynthesis when card unmounts
    return () => {
      window.removeEventListener("newsSpeechStarted", handleGlobalSpeechStart);
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [url, isSpeaking]);

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(article);
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkToggle(article);
  };

  const handleSpeechClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Cancel active speech on other components first
      window.speechSynthesis.cancel();
      
      // Dispatch event to stop play status on other cards
      window.dispatchEvent(
        new CustomEvent("newsSpeechStarted", { detail: { url } })
      );

      const cleanText = `${title}. ${description || "No further details available."}`;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareData = {
      title: title,
      text: description || "Check out this news article!",
      url: url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
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
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = "none";
              if (target.parentNode) {
                (target.parentNode as HTMLElement).classList.add("skeleton-shimmer");
              }
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
          <span className="news-read-time" style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "2px" }}>
            ⏱️ {readingTime}
          </span>
        </div>

        <h3 className="news-title" title={title}>
          {truncateText(title, 80)}
        </h3>

        <p className="news-desc">
          {description ? truncateText(description, 130) : "No description available for this article. Click read more to view the full details."}
        </p>

        <div className="news-actions">
          <div style={{ display: "flex", gap: "6px" }}>
            <button 
              className={`card-btn ${isBookmarked ? "bookmarked" : ""}`}
              onClick={handleBookmarkClick}
              title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
              aria-label={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
            >
              {isBookmarked ? "★" : "☆"}
            </button>

            <button 
              className={`card-btn ${isSpeaking ? "speaking" : ""}`}
              onClick={handleSpeechClick}
              title={isSpeaking ? "Stop Audio Reader" : "Listen to Article"}
              aria-label={isSpeaking ? "Stop Audio Reader" : "Listen to Article"}
              style={{ color: isSpeaking ? "var(--primary-color)" : "inherit" }}
            >
              {isSpeaking ? "⏹️" : "🔊"}
            </button>

            <button 
              className="card-btn"
              onClick={handleShareClick}
              title="Share Article"
              aria-label="Share Article"
            >
              🔗
            </button>
          </div>

          <span className="read-more-link">
            Read More →
          </span>
        </div>
      </div>
    </div>
  );
}
