import { useState, useEffect, useRef } from "react";
import { passwordAPI } from "../services/api";
import Spinner from "./Spinner";

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
  const [showGeneratorOptions, setShowGeneratorOptions] = useState(false);

  const firstInputRef = useRef(null);
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const [generatorOptions, setGeneratorOptions] = useState({
    length: 16,
    useUppercase: true,
    useLowercase: true,
    useDigits: true,
    useSpecial: true,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGeneratePassword = async () => {
    if (
      !generatorOptions.useUppercase &&
      !generatorOptions.useLowercase &&
      !generatorOptions.useDigits &&
      !generatorOptions.useSpecial
    ) {
      setError("Please select at least one character type!");
      return;
    }

    try {
      setError("");
      const response = await passwordAPI.generate({
        length: generatorOptions.length,
        use_uppercase: generatorOptions.useUppercase,
        use_lowercase: generatorOptions.useLowercase,
        use_digits: generatorOptions.useDigits,
        use_special: generatorOptions.useSpecial,
      });

      if (response.success) {
        setFormData({
          ...formData,
          password: response.password,
        });
        setShowPassword(true);
        setShowGeneratorOptions(false);
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
        onSuccess();
        onClose();
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
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-password-title"
    >
      <div
        style={{
          backgroundColor: "#2A2A2A",
          borderRadius: "16px",
          padding: "32px",
          width: window.innerWidth <= 768 ? "95vw" : "500px",
          maxWidth: window.innerWidth <= 768 ? "95vw" : "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "slideUp 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: "24px" }}>
          <h2
            id="add-password-title"
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

        {error && (
          <div
            role="alert"
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="website-input"
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
              ref={firstInputRef}
              id="website-input"
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="e.g., Gmail, Facebook, Netflix"
              aria-label="Website or service name"
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

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="username-input"
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
              id="username-input"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="yourname@example.com"
              aria-label="Username or email address"
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

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="password-input"
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
                id="password-input"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter or generate password"
                aria-label="Password"
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                  onClick={() => setShowGeneratorOptions(!showGeneratorOptions)}
                  aria-label="Toggle password generator options"
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
                  {showGeneratorOptions ? "▼ Options" : "🎲 Generate"}
                </button>
              </div>
            </div>

            {showGeneratorOptions && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "16px",
                  backgroundColor: "#1A1A1A",
                  borderRadius: "8px",
                  border: "2px solid #374151",
                }}
              >
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <label
                      htmlFor="length-slider"
                      style={{ fontSize: "13px", color: "#D1D5DB" }}
                    >
                      Password Length
                    </label>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#00FFA3",
                      }}
                    >
                      {generatorOptions.length}
                    </span>
                  </div>
                  <input
                    id="length-slider"
                    type="range"
                    min="8"
                    max="32"
                    value={generatorOptions.length}
                    onChange={(e) =>
                      setGeneratorOptions({
                        ...generatorOptions,
                        length: parseInt(e.target.value),
                      })
                    }
                    aria-label="Password length slider"
                    style={{
                      width: "100%",
                      height: "4px",
                      cursor: "pointer",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "4px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#6B7280" }}>
                      8
                    </span>
                    <span style={{ fontSize: "11px", color: "#6B7280" }}>
                      32
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      fontSize: "13px",
                      color: "#D1D5DB",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Character Types
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                    }}
                  >
                    {[
                      { label: "A-Z", key: "useUppercase" },
                      { label: "a-z", key: "useLowercase" },
                      { label: "0-9", key: "useDigits" },
                      { label: "!@#$", key: "useSpecial" },
                    ].map((option) => (
                      <label
                        key={option.key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          fontSize: "12px",
                          color: "#D1D5DB",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={generatorOptions[option.key]}
                          onChange={(e) =>
                            setGeneratorOptions({
                              ...generatorOptions,
                              [option.key]: e.target.checked,
                            })
                          }
                          aria-label={`Include ${option.label} characters`}
                          style={{
                            width: "16px",
                            height: "16px",
                            marginRight: "6px",
                            cursor: "pointer",
                          }}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  aria-label="Generate new password"
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#00FFA3",
                    color: "#1A1A1A",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  ✨ Generate Password
                </button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="notes-input"
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
              id="notes-input"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this password..."
              rows={3}
              aria-label="Optional notes"
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

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cancel and close modal"
              style={{
                padding: "12px 24px",
                backgroundColor: "#374151",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                flex: window.innerWidth <= 480 ? "1 1 100%" : "0 1 auto",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              aria-label={loading ? "Saving password" : "Save password"}
              style={{
                padding: "12px 24px",
                backgroundColor: loading ? "#00CC82" : "#00FFA3",
                color: "#1A1A1A",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "center",
                opacity: loading ? 0.7 : 1,
                flex: window.innerWidth <= 480 ? "1 1 100%" : "0 1 auto",
              }}
            >
              {loading ? (
                <>
                  <Spinner size="small" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
