import { useState } from "react";

export default function PasswordDetailsModal({
  password,
  onClose,
  onEdit,
  onDelete,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(null);

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Security level colors
  const getSecurityColor = (level) => {
    switch (level) {
      case "Calm":
        return "#00FFA3";
      case "Alert":
        return "#F59E0B";
      case "Critical":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  // Copy to clipboard with feedback
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Handle ESC key to close modal
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      onKeyDown={handleKeyDown}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#2A2A2A",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          borderLeft: `6px solid ${getSecurityColor(password.security_level)}`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            backgroundColor: "#374151",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "white",
                margin: 0,
              }}
            >
              {password.website}
            </h2>
            <span
              style={{
                fontSize: "13px",
                padding: "6px 12px",
                backgroundColor:
                  getSecurityColor(password.security_level) + "20",
                color: getSecurityColor(password.security_level),
                borderRadius: "6px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {password.security_level}
            </span>
          </div>
          <p style={{ color: "#9CA3AF", fontSize: "14px", margin: 0 }}>
            Password Details
          </p>
        </div>

        {/* Username Section */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              color: "#D1D5DB",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            👤 Username
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#1A1A1A",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "2px solid #374151",
            }}
          >
            <code
              style={{
                flex: 1,
                color: "white",
                fontSize: "16px",
                fontFamily: "monospace",
              }}
            >
              {password.username}
            </code>
            <button
              onClick={() => copyToClipboard(password.username, "username")}
              style={{
                padding: "6px 12px",
                backgroundColor:
                  copyFeedback === "username" ? "#00FFA3" : "#374151",
                color: copyFeedback === "username" ? "#1A1A1A" : "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {copyFeedback === "username" ? "✓ Copied!" : "📋 Copy"}
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              color: "#D1D5DB",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            🔑 Password
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#1A1A1A",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "2px solid #374151",
            }}
          >
            <code
              style={{
                flex: 1,
                color: "white",
                fontSize: "16px",
                fontFamily: "monospace",
              }}
            >
              {isPasswordVisible ? password.password : "••••••••••••"}
            </code>
            <button
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              style={{
                padding: "6px 12px",
                backgroundColor: "#374151",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {isPasswordVisible ? "🙈 Hide" : "👁️ Show"}
            </button>
            <button
              onClick={() => copyToClipboard(password.password, "password")}
              style={{
                padding: "6px 12px",
                backgroundColor:
                  copyFeedback === "password" ? "#00FFA3" : "#00FFA3",
                color: "#1A1A1A",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {copyFeedback === "password" ? "✓ Copied!" : "📋 Copy"}
            </button>
          </div>
        </div>

        {/* Notes Section */}
        {password.notes && password.notes.trim() !== "" && (
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                color: "#D1D5DB",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              📝 Notes
            </label>
            <div
              style={{
                backgroundColor: "#1A1A1A",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "2px solid #374151",
                color: "#D1D5DB",
                fontSize: "15px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {password.notes}
            </div>
          </div>
        )}

        {/* Metadata Section */}
        <div
          style={{
            backgroundColor: "#1A1A1A",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <span style={{ color: "#9CA3AF", fontSize: "13px" }}>
              📅 Created:
            </span>
            <span
              style={{ color: "white", fontSize: "14px", marginLeft: "8px" }}
            >
              {formatDate(password.created_at)}
            </span>
          </div>
          {password.updated_at &&
            password.updated_at !== password.created_at && (
              <div>
                <span style={{ color: "#9CA3AF", fontSize: "13px" }}>
                  🔄 Updated:
                </span>
                <span
                  style={{
                    color: "white",
                    fontSize: "14px",
                    marginLeft: "8px",
                  }}
                >
                  {formatDate(password.updated_at)}
                </span>
              </div>
            )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onEdit}
            style={{
              flex: 1,
              padding: "14px",
              backgroundColor: "#3B82F6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563EB")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82F6")}
          >
            ✏️ Edit Password
          </button>
          <button
            onClick={onDelete}
            style={{
              flex: 1,
              padding: "14px",
              backgroundColor: "#7F1D1D",
              color: "#FEE2E2",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#991B1B")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#7F1D1D")}
          >
            🗑️ Delete Password
          </button>
        </div>
      </div>
    </div>
  );
}
