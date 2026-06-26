import { Link } from "react-router-dom";

/**
 * NotFound component renders a custom 404 error page.
 */
export default function NotFound() {
  return (
    <div className="container">
      <div className="empty-state-container" style={{ margin: "60px auto" }}>
        <span className="empty-state-icon">🧭</span>
        <h2 className="empty-state-title">404 - Page Not Found</h2>
        <p className="empty-state-desc">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/">
          <button className="action-btn">Return to Home</button>
        </Link>
      </div>
    </div>
  );
}
