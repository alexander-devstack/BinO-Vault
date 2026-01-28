import { useState, useEffect } from "react";
import RecoveryKeyModal from "./RecoveryKeyModal";
import axios from "axios";

export default function SettingsModal({ onClose }) {
  const [hasRecoveryKey, setHasRecoveryKey] = useState(false);
  const [showRecoveryKey, setShowRecoveryKey] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHasRecoveryKey(false);
  }, []);

  const generateKey = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/recovery/generate",
        {},
        { withCredentials: true },
      );
      setRecoveryKey(res.data.recovery_key);
      setShowRecoveryKey(true);
      setHasRecoveryKey(true);
    } catch (err) {
      alert("Failed to generate recovery key");
    }
    setLoading(false);
  };

  return (
    <>
      <div
        onClick={onClose}
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
          zIndex: 999,
          padding: "20px",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "#2A2A2A",
            padding: window.innerWidth <= 480 ? "24px" : "32px",
            borderRadius: "12px",
            width: window.innerWidth <= 768 ? "95vw" : "500px",
            maxWidth: window.innerWidth <= 768 ? "95vw" : "500px",
            animation: "slideUp 0.3s ease-out",
          }}
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
              style={{
                color: "#FFFFFF",
                fontSize: window.innerWidth <= 480 ? "20px" : "24px",
                margin: 0,
              }}
            >
              ⚙️ Settings
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#D1D5DB",
                fontSize: "24px",
                cursor: "pointer",
                padding: 0,
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              backgroundColor: "#1A1A1A",
              padding: window.innerWidth <= 480 ? "16px" : "24px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <h3
              style={{
                color: "#FFFFFF",
                fontSize: window.innerWidth <= 480 ? "16px" : "18px",
                marginBottom: "12px",
              }}
            >
              🔑 Account Recovery
            </h3>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              Recovery Key: {hasRecoveryKey ? "✅ Generated" : "❌ Not Set"}
            </p>
            {!hasRecoveryKey && (
              <button
                onClick={generateKey}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#00FFA3",
                  color: "#1A1A1A",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: loading ? "wait" : "pointer",
                  fontSize: "16px",
                }}
              >
                {loading ? "Generating..." : "Generate Recovery Key"}
              </button>
            )}
            {hasRecoveryKey && (
              <p style={{ color: "#00FFA3", fontSize: "13px", margin: 0 }}>
                ✓ Your account can be recovered if you forget your master
                password
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#374151",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Close
          </button>
        </div>
      </div>

      {showRecoveryKey && (
        <RecoveryKeyModal
          recoveryKey={recoveryKey}
          onClose={() => setShowRecoveryKey(false)}
        />
      )}
    </>
  );
}
