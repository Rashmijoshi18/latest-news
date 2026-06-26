import { useEffect } from "react";

/**
 * Toast component displays temporary notification banners (e.g. success/error actions).
 * 
 * @param {Object} props
 * @param {string} props.message - Text alert message
 * @param {string} [props.type="success"] - Alert color category ("success" | "error")
 * @param {function} props.onClose - Action callback when timer runs out
 * @param {number} [props.duration=3000] - Duration in milliseconds before fading
 */
export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast ${type === "error" ? "error" : ""}`} role="alert">
      <span>{type === "error" ? "❌" : "✅"}</span>
      <span>{message}</span>
    </div>
  );
}
