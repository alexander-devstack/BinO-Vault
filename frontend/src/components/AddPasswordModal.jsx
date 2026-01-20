import { useState } from "react";
import { passwordAPI } from "../services/api";

export default function AddPasswordModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    website: "",
    username: "",
    password: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        setShowPassword(true); // Show the generated password
      }
    } catch (err) {
      setError("Failed to generate password");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.website || !formData.username || !formData.password) {
      setError("Website, username, and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await passwordAPI.create(formData);

      if (response.success) {
        onSuccess(); // Refresh password list
        onClose(); // Close modal
      } else {
        setError(response.error || "Failed to save password");
      }
    } catch (err) {
      setError(err.message || "Failed to save password");
    } finally {
      setLoading(false);
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
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#2A2A2A",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              color: "white",
              fontSize: "24px",
              fontWeight: "600",
              margin: "0 0 8px 0",
            }}
          >
            🔐 Add Password
          </h2>
          <p style={{ color: "#9CA3AF", margin: 0, fontSize: "14px" }}>
            Securely store a new password with AES-256 encryption
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid #EF4444",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "20px",
            }}
          >
            <p style={{ color: "#EF4444", margin: 0, fontSize: "14px" }}>
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Website */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#D1D5DB",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Website / Service
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="e.g., Gmail, Facebook, Netflix"
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#1A1A1A",
                border: "2px solid #374151",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Username */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#D1D5DB",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Username / Email
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="yourname@example.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#1A1A1A",
                border: "2px solid #374151",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#D1D5DB",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter or generate password"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  paddingRight: "140px",
                  backgroundColor: "#1A1A1A",
                  border: "2px solid #374151",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    color: "#00FFA3",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  style={{
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#1A1A1A",
                    backgroundColor: "#00FFA3",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>

          {/* Notes (Optional) */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                color: "#D1D5DB",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this password..."
              rows={3}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#1A1A1A",
                border: "2px solid #374151",
                borderRadius: "8px",
                color: "white",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 24px",
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
              style={{
                padding: "12px 24px",
                backgroundColor: loading ? "#00CC82" : "#00FFA3",
                color: "#1A1A1A",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Saving..." : "Save Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
