import { useState, useEffect, useRef } from "react";
import { passwordAPI } from "../services/api";

export default function PasswordGenerator({ onClose, onUsePassword }) {
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [strength, setStrength] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-focus generate button
  const generateButtonRef = useRef(null);
  useEffect(() => {
    generateButtonRef.current?.focus();
  }, []);

  const generatePassword = async () => {
    if (!useUppercase && !useLowercase && !useDigits && !useSpecial) {
      alert("Please select at least one character type!");
      return;
    }

    setLoading(true);
    try {
      const response = await passwordAPI.generate({
        length: length,
        use_uppercase: useUppercase,
        use_lowercase: useLowercase,
        use_digits: useDigits,
        use_special: useSpecial,
      });

      if (response.success) {
        setGeneratedPassword(response.password);
        setStrength(response.strength);
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert("Failed to generate password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUsePassword = () => {
    if (generatedPassword && onUsePassword) {
      onUsePassword(generatedPassword);
      onClose();
    }
  };

  const getSecurityColor = () => {
    if (!strength) return "#9CA3AF";
    if (strength.level === "Strong") return "#00FFA3";
    if (strength.level === "Medium") return "#F59E0B";
    return "#EF4444";
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
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="generator-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#2A2A2A",
          padding: "32px",
          borderRadius: "12px",
          width: "500px",
          maxWidth: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h2
            id="generator-title"
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#FFFFFF",
              marginBottom: "8px",
            }}
          >
            🎲 Password Generator
          </h2>
          <p style={{ fontSize: "14px", color: "#9CA3AF" }}>
            Create secure passwords with custom options
          </p>
        </div>

        {generatedPassword && (
          <div
            style={{
              backgroundColor: "#1A1A1A",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
              border: `2px solid ${getSecurityColor()}`,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "18px",
                color: "#FFFFFF",
                wordBreak: "break-all",
                marginBottom: "12px",
              }}
              aria-live="polite"
            >
              {generatedPassword}
            </div>
            {strength && (
              <div style={{ marginBottom: "12px" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: "600",
                    backgroundColor: getSecurityColor(),
                    color: "#1A1A1A",
                  }}
                  aria-label={`Password strength: ${strength.level}`}
                >
                  {strength.level}
                </span>
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "14px",
                    color: "#9CA3AF",
                  }}
                >
                  Score: {strength.score}/100
                </span>
              </div>
            )}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={copyToClipboard}
                aria-label={
                  copied ? "Password copied" : "Copy password to clipboard"
                }
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: copied ? "#00FFA3" : "#3B82F6",
                  color: copied ? "#1A1A1A" : "#FFFFFF",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
              {onUsePassword && (
                <button
                  onClick={handleUsePassword}
                  aria-label="Use this password"
                  style={{
                    flex: 1,
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
                  ✓ Use This Password
                </button>
              )}
            </div>
          </div>
        )}

        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <label
              htmlFor="length-slider"
              style={{ fontSize: "14px", color: "#D1D5DB" }}
            >
              Password Length
            </label>
            <span
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#00FFA3",
              }}
              aria-live="polite"
            >
              {length}
            </span>
          </div>
          <input
            id="length-slider"
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            aria-label="Password length slider"
            style={{
              width: "100%",
              height: "6px",
              borderRadius: "3px",
              outline: "none",
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
            <span style={{ fontSize: "12px", color: "#9CA3AF" }}>8</span>
            <span style={{ fontSize: "12px", color: "#9CA3AF" }}>32</span>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              fontSize: "14px",
              color: "#D1D5DB",
              marginBottom: "12px",
              display: "block",
            }}
          >
            Character Types
          </label>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {[
              {
                label: "Uppercase (A-Z)",
                state: useUppercase,
                setter: setUseUppercase,
              },
              {
                label: "Lowercase (a-z)",
                state: useLowercase,
                setter: setUseLowercase,
              },
              {
                label: "Numbers (0-9)",
                state: useDigits,
                setter: setUseDigits,
              },
              {
                label: "Symbols (!@#$%^&*)",
                state: useSpecial,
                setter: setUseSpecial,
              },
            ].map((option, index) => (
              <label
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#D1D5DB",
                }}
              >
                <input
                  type="checkbox"
                  checked={option.state}
                  onChange={(e) => option.setter(e.target.checked)}
                  aria-label={`Include ${option.label}`}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            ref={generateButtonRef}
            onClick={generatePassword}
            disabled={loading}
            aria-label={loading ? "Generating password" : "Generate password"}
            style={{
              flex: 1,
              padding: "14px",
              backgroundColor: "#00FFA3",
              color: "#1A1A1A",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Generating..." : "🎲 Generate Password"}
          </button>
          <button
            onClick={onClose}
            aria-label="Close password generator"
            style={{
              padding: "14px 24px",
              backgroundColor: "#374151",
              color: "#D1D5DB",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
