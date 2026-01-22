import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { passwordAPI } from "../services/api";
import AddPasswordModal from "./AddPasswordModal";
import EditPasswordModal from "./EditPasswordModal";
import PasswordGenerator from "./PasswordGenerator";
import Toast from "./Toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // State management
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Fetch passwords on component mount
  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await passwordAPI.getAll();

      if (response.success) {
        setPasswords(response.passwords || []);
      } else {
        setError("Failed to load passwords");
      }
    } catch (err) {
      console.error("Error fetching passwords:", err);
      setError(err.message || "Failed to load passwords");

      // If session expired, redirect to login
      if (err.response?.status === 401) {
        logout();
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${type} copied to clipboard!`, "success");
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast("Failed to copy to clipboard", "error");
    }
  };

  const deletePassword = async (id) => {
    if (!confirm("Are you sure you want to delete this password?")) {
      return;
    }

    try {
      await passwordAPI.delete(id);
      showToast("Password deleted successfully 🗑️", "success");
      // Refresh the list
      fetchPasswords();
    } catch (err) {
      showToast("Failed to delete password", "error");
    }
  };

  // Security level colors
  const getSecurityColor = (level) => {
    switch (level) {
      case "Calm":
        return "#00FFA3"; // Green
      case "Alert":
        return "#F59E0B"; // Orange
      case "Critical":
        return "#EF4444"; // Red
      default:
        return "#6B7280"; // Gray
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1A1A1A",
        padding: "32px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "48px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "white",
                marginBottom: "8px",
              }}
            >
              🔐 BinO-Vault
            </h1>
            <p style={{ color: "#D1D5DB", fontSize: "18px" }}>
              Your passwords are safe
            </p>
          </div>

          {/* Header Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setShowGenerator(true)}
              style={{
                padding: "12px 24px",
                backgroundColor: "#8B5CF6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#7C3AED")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#8B5CF6")}
            >
              🎲 Generate Password
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: "12px 24px",
                backgroundColor: "#EF4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#DC2626")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#EF4444")}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div
            style={{
              backgroundColor: "#7F1D1D",
              border: "2px solid #EF4444",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
              color: "#FEE2E2",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px",
              color: "#D1D5DB",
              fontSize: "18px",
            }}
          >
            Loading your passwords...
          </div>
        ) : passwords.length === 0 ? (
          /* Empty State */
          <div
            style={{
              backgroundColor: "#2A2A2A",
              borderRadius: "16px",
              padding: "48px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🔒</div>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "white",
                marginBottom: "8px",
              }}
            >
              No Passwords Yet
            </h3>
            <p
              style={{
                color: "#9CA3AF",
                marginBottom: "24px",
                fontSize: "16px",
              }}
            >
              Start adding your passwords to keep them secure
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: "16px 32px",
                backgroundColor: "#00FFA3",
                color: "#1A1A1A",
                border: "none",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#00E693")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#00FFA3")}
            >
              + Add Password
            </button>
          </div>
        ) : (
          /* Password List */
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "24px",
                  color: "white",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Your Passwords ({passwords.length})
              </h2>
            </div>

            {/* Password Cards */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {passwords.map((pwd) => (
                <div
                  key={pwd.id}
                  style={{
                    backgroundColor: "#2A2A2A",
                    borderRadius: "12px",
                    padding: "20px",
                    borderLeft: `4px solid ${getSecurityColor(pwd.security_level)}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* Left Side: Password Info */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "white",
                          margin: 0,
                        }}
                      >
                        {pwd.website}
                      </h3>
                      <span
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          backgroundColor:
                            getSecurityColor(pwd.security_level) + "20",
                          color: getSecurityColor(pwd.security_level),
                          borderRadius: "4px",
                          fontWeight: "600",
                        }}
                      >
                        {pwd.security_level}
                      </span>
                    </div>

                    <p
                      style={{
                        color: "#9CA3AF",
                        fontSize: "14px",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {pwd.username}
                    </p>

                    {/* Display Notes if they exist */}
                    {pwd.notes && pwd.notes.trim() !== "" && (
                      <p
                        style={{
                          color: "#6B7280",
                          fontSize: "13px",
                          margin: "0 0 12px 0",
                          fontStyle: "italic",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span>📝</span>
                        <span>{pwd.notes}</span>
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <code
                        style={{
                          fontSize: "16px",
                          color: "#D1D5DB",
                          fontFamily: "monospace",
                        }}
                      >
                        {visiblePasswords.has(pwd.id)
                          ? pwd.password
                          : "••••••••••••"}
                      </code>

                      <button
                        onClick={() => togglePasswordVisibility(pwd.id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#374151",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        {visiblePasswords.has(pwd.id) ? "🙈 Hide" : "👁️ Show"}
                      </button>

                      <button
                        onClick={() =>
                          copyToClipboard(pwd.password, "Password")
                        }
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#00FFA3",
                          color: "#1A1A1A",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>

                  {/* Right Side: Action Buttons */}
                  <div
                    style={{ display: "flex", gap: "12px", marginLeft: "16px" }}
                  >
                    <button
                      onClick={() => setEditingPassword(pwd)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#3B82F6",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#2563EB")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#3B82F6")
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => deletePassword(pwd.id)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#7F1D1D",
                        color: "#FEE2E2",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#991B1B")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#7F1D1D")
                      }
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Password Button (when list exists) */}
            <div style={{ marginTop: "32px", textAlign: "center" }}>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  padding: "16px 48px",
                  backgroundColor: "#00FFA3",
                  color: "#1A1A1A",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#00E693")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#00FFA3")}
              >
                + Add Another Password
              </button>
            </div>
          </div>
        )}

        {/* Add Password Modal */}
        {showAddModal && (
          <AddPasswordModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              fetchPasswords();
              showToast("Password saved successfully! 🔐", "success");
            }}
          />
        )}

        {/* Edit Password Modal */}
        {editingPassword && (
          <EditPasswordModal
            password={editingPassword}
            onClose={() => setEditingPassword(null)}
            onSuccess={() => {
              fetchPasswords();
              setEditingPassword(null);
              showToast("Password updated successfully! ✏️", "success");
            }}
          />
        )}

        {/* Password Generator Modal */}
        {showGenerator && (
          <PasswordGenerator onClose={() => setShowGenerator(false)} />
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
