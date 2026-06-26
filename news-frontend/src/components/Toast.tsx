import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

/**
 * Toast component displays temporary notification banners (e.g. success/error actions).
 * 
 * @param props
 * @param props.message - Text alert message
 * @param props.type - Alert color category ("success" | "error")
 * @param props.onClose - Action callback when timer runs out
 * @param props.duration - Duration in milliseconds before fading
 */
export default function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
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
