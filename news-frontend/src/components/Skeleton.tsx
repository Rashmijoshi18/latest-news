interface SkeletonProps {
  count?: number;
}

function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-shimmer skeleton-img" />
      <div className="skeleton-content">
        <div className="skeleton-meta">
          <div className="skeleton-shimmer skeleton-meta-item" />
          <div className="skeleton-shimmer skeleton-meta-item" style={{ width: "20%" }} />
        </div>
        <div className="skeleton-shimmer skeleton-title" />
        <div className="skeleton-shimmer skeleton-title-short" />
        <div className="skeleton-shimmer skeleton-desc" />
        <div className="skeleton-shimmer skeleton-desc" style={{ width: "90%" }} />
        <div className="skeleton-shimmer skeleton-desc" style={{ width: "75%" }} />
        <div className="skeleton-actions">
          <div className="skeleton-shimmer skeleton-btn" />
          <div className="skeleton-shimmer skeleton-btn" style={{ width: "15%" }} />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton component renders multiple SkeletonCards in a news-grid layout.
 * 
 * @param count - Number of skeleton cards to render
 */
export default function Skeleton({ count = 6 }: SkeletonProps) {
  const cards = Array.from({ length: count }, (_, idx) => idx);
  return (
    <div className="news-grid">
      {cards.map((cardId) => (
        <SkeletonCard key={cardId} />
      ))}
    </div>
  );
}
