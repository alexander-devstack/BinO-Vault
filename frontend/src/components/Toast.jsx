import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#00FFA3";
      case "error":
        return "#EF4444";
      case "info":
        return "#3B82F6";
      default:
        return "#00FFA3";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "✅";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        backgroundColor: getBackgroundColor(),
        color: type === "success" ? "#1A1A1A" : "white",
        padding: "16px 24px",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        zIndex: 9999,
        fontWeight: "600",
        fontSize: "16px",
        animation: "slideIn 0.3s ease-out",
        minWidth: "300px",
      }}
    >
      <span style={{ fontSize: "20px" }}>{getIcon()}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: type === "success" ? "#1A1A1A" : "white",
          fontSize: "20px",
          cursor: "pointer",
          padding: "0",
          lineHeight: "1",
        }}
      >
        ×
      </button>
    </div>
  );
}
