import { useState } from "react";

export default function RecoveryKeyModal({ recoveryKey, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyKey = async () => {
    await navigator.clipboard.writeText(recoveryKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadKey = () => {
    const blob = new Blob(
      [
        `BinO-Vault Recovery Key\n\n${recoveryKey}\n\nSave this key! You cannot recover it later.`,
      ],
      { type: "text/plain" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "binovault-recovery-key.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    if (confirmed) onClose();
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
    >
      <div
        style={{
          backgroundColor: "#2A2A2A",
          padding: "2rem",
          borderRadius: "12px",
          maxWidth: "500px",
          width: "90%",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <h2
          style={{ color: "#FFFFFF", marginBottom: "1rem", fontSize: "1.5rem" }}
        >
          🔑 Recovery Key Generated
        </h2>

        <div
          style={{
            backgroundColor: "#1A1A1A",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            border: "2px solid #00FFA3",
          }}
        >
          <p
            style={{
              color: "#00FFA3",
              fontSize: "1.25rem",
              fontWeight: "bold",
              fontFamily: "monospace",
              letterSpacing: "2px",
              textAlign: "center",
              wordBreak: "break-all",
            }}
          >
            {recoveryKey}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#7F1D1D",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            border: "2px solid #EF4444",
          }}
        >
          <p style={{ color: "#FFFFFF", margin: 0, fontSize: "0.9rem" }}>
            ⚠️ <strong>WARNING:</strong> Save this key immediately! You cannot
            recover it later. If you lose your master password, this is the ONLY
            way to reset it.
          </p>
        </div>

        <div
          style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}
        >
          <button
            onClick={copyKey}
            style={{
              flex: 1,
              padding: "0.75rem",
              backgroundColor: "#00FFA3",
              color: "#1A1A1A",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy Key"}
          </button>

          <button
            onClick={downloadKey}
            style={{
              flex: 1,
              padding: "0.75rem",
              backgroundColor: "#3B82F6",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            💾 Download
          </button>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            cursor: "pointer",
            color: "#D1D5DB",
          }}
        >
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
          <span>I have saved my recovery key securely</span>
        </label>

        <button
          onClick={handleClose}
          disabled={!confirmed}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: confirmed ? "#00FFA3" : "#374151",
            color: confirmed ? "#1A1A1A" : "#9CA3AF",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: confirmed ? "pointer" : "not-allowed",
            fontSize: "1rem",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
