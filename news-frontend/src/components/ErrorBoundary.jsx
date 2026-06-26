import React from "react";

/**
 * ErrorBoundary React Class component to catch rendering errors.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-layout">
          <div className="empty-state-container">
            <span className="empty-state-icon">⚠️</span>
            <h2 className="empty-state-title">An unexpected error occurred</h2>
            <p className="empty-state-desc">
              {this.state.error?.message || "A client-side rendering error crashed the layout. Please try refreshing."}
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="action-btn" onClick={this.handleReset}>
                Go to Home
              </button>
              <button 
                className="action-btn" 
                style={{ backgroundColor: "var(--text-muted)", boxShadow: "none" }}
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
