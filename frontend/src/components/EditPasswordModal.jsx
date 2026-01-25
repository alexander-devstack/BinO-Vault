import { useState, useEffect, useRef } from "react";
import { passwordAPI } from "../services/api";

export default function EditPasswordModal({ password, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    website: password.website,
    username: password.username,
    password: password.password,
    notes: password.notes || "",
  });

  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [securityLevel, setSecurityLevel] = useState(password.security_level);

  // Auto-focus first input
  const firstInputRef = useRef(null);
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Calculate password strength in real-time
  useEffect(() => {
    if (formData.password) {
      const length = formData.password.length;
      const hasUpper = /[A-Z]/.test(formData.password);
      const hasLower = /[a-z]/.test(formData.password);
      const hasDigit = /\d/.test(formData.password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

      const criteriaMet = [hasUpper, hasLower, hasDigit, hasSpecial].filter(
        Boolean,
      ).length;

      if (length >= 12 && criteriaMet >= 3) {
        setSecurityLevel("Calm");
      } else if (length >= 8 && criteriaMet >= 2) {
        setSecurityLevel("Alert");
      } else {
        setSecurityLevel("Critical");
      }
    }
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGeneratePassword = async () => {
    try {
      const response = await passwordAPI.generate({
        length: 16,
        use_uppercase: true,
        use_digits: true,
        use_special: true,
      });

      if (response.success) {
        setFormData({
          ...formData,
          password: response.password,
        });
        setShowPassword(true);
      }
    } catch (err) {
      setError("Failed to generate password");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.website || !formData.username || !formData.password) {
        setError("Website, username, and password are required");
        setLoading(false);
        return;
      }

      const response = await passwordAPI.update(password.id, formData);

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.error || "Failed to update password");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-password-title"
    >
      <div
        style={{
          backgroundColor: "#2A2A2A",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "slideUp 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            id="edit-password-title"
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "white",
              margin: 0,
            }}
          >
            ✏️ Edit Password
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              color: "#9CA3AF",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              padding: "8px 16px",
              backgroundColor: getSecurityColor(securityLevel) + "20",
              color: getSecurityColor(securityLevel),
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Security Level: {securityLevel}
          </span>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              backgroundColor: "#7F1D1D",
              border: "2px solid #EF4444",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "16px",
              color: "#FEE2E2",
              fontSize: "14px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="edit-website"
              style={{
                display: "block",
                color: "#D1D5DB",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              Website/Service
            </label>
            <input
              ref={firstInputRef}
              id="edit-website"
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="e.g., Gmail"
              aria-label="Website or service name"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#1A1A1A",
                border: "2px solid #374151",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#00FFA3")}
              onBlur={(e) => (e.target.style.borderColor = "#374151")}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="edit-username"
              style={{
                display: "block",
                color: "#D1D5DB",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              Username/Email
            </label>
            <input
              id="edit-username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g., yourname@gmail.com"
              aria-label="Username or email address"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#1A1A1A",
                border: "2px solid #374151",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#00FFA3")}
              onBlur={(e) => (e.target.style.borderColor = "#374151")}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="edit-password"
              style={{
                display: "block",
                color: "#D1D5DB",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="edit-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                aria-label="Password"
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1A1A1A",
                  border: "2px solid #374151",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                  outline: "none",
                  fontFamily: "monospace",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#00FFA3")}
                onBlur={(e) => (e.target.style.borderColor = "#374151")}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#374151",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {showPassword ? "🙈 Hide" : "👁️ Show"}
            </button>
            <button
              type="button"
              onClick={handleGeneratePassword}
              aria-label="Generate new password"
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#00FFA3",
                color: "#1A1A1A",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              🎲 Generate
            </button>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="edit-notes"
              style={{
                display: "block",
                color: "#D1D5DB",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              Notes (Optional)
            </label>
            <textarea
              id="edit-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this password"
              rows="3"
              aria-label="Optional notes"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#1A1A1A",
                border: "2px solid #374151",
                borderRadius: "8px",
                color: "white",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#00FFA3")}
              onBlur={(e) => (e.target.style.borderColor = "#374151")}
            />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cancel editing"
              style={{
                flex: 1,
                padding: "14px",
                backgroundColor: "#374151",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              aria-label={loading ? "Saving changes" : "Save changes"}
              style={{
                flex: 1,
                padding: "14px",
                backgroundColor: loading ? "#6B7280" : "#00FFA3",
                color: "#1A1A1A",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Saving..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
