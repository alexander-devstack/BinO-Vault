import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { passwordAPI } from "../services/api";
import AddPasswordModal from "./AddPasswordModal";
import EditPasswordModal from "./EditPasswordModal";
import PasswordGenerator from "./PasswordGenerator";
import PasswordDetailsModal from "./PasswordDetailsModal";
import Toast from "./Toast";
import Spinner from "./Spinner";
import SettingsModal from "./SettingsModal";
import Avatar from "./Avatar";
import StrengthBar from "./StrengthBar";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [viewingPassword, setViewingPassword] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showSettings, setShowSettings] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
      showToast(`${type} copied to clipboard! 🔒 Will clear in 30s`, "success");

      setTimeout(async () => {
        try {
          const currentClipboard = await navigator.clipboard.readText();
          if (currentClipboard === text) {
            await navigator.clipboard.writeText("");
            showToast("Clipboard cleared for security 🔒", "success");
          }
        } catch (err) {
          console.log("Clipboard auto-clear skipped");
        }
      }, 30000);
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
      fetchPasswords();
    } catch (err) {
      showToast("Failed to delete password", "error");
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

  const getFilteredAndSortedPasswords = () => {
    let filtered = [...passwords];
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (pwd) =>
          pwd.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pwd.username.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (filterLevel !== "All") {
      filtered = filtered.filter((pwd) => pwd.security_level === filterLevel);
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "a-z":
          return a.website.localeCompare(b.website);
        case "z-a":
          return b.website.localeCompare(a.website);
        default:
          return 0;
      }
    });
    return filtered;
  };

  const filteredPasswords = getFilteredAndSortedPasswords();

  const clearSearchAndFilters = () => {
    setSearchTerm("");
    setFilterLevel("All");
    setSortBy("newest");
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
        {/* MOBILE-RESPONSIVE HEADER */}
        <div
          className="dashboard-header"
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
          <div
            className="dashboard-header-buttons"
            style={{ display: "flex", gap: "12px" }}
          >
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
              aria-label="Open password generator"
            >
              🎲 Generate Password
            </button>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                padding: "12px 24px",
                backgroundColor: "#6B7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#4B5563")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#6B7280")}
              aria-label="Open settings"
            >
              ⚙️ Settings
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
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>

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

        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "80px 0",
            }}
          >
            <Spinner size="large" />
            <p
              style={{
                color: "#9CA3AF",
                fontSize: "16px",
                marginTop: "24px",
              }}
            >
              Loading your passwords...
            </p>
          </div>
        ) : passwords.length === 0 ? (
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
          <div>
            {/* MOBILE-RESPONSIVE SEARCH/FILTER */}
            <div
              style={{
                backgroundColor: "#2A2A2A",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "24px",
              }}
            >
              <div style={{ position: "relative", marginBottom: "16px" }}>
                <input
                  id="search-input"
                  type="text"
                  placeholder="🔍 Search by website or username... (Ctrl+K)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 48px 14px 16px",
                    backgroundColor: "#1A1A1A",
                    border: "2px solid #374151",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#00FFA3")}
                  onBlur={(e) => (e.target.style.borderColor = "#374151")}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "#374151",
                      color: "#D1D5DB",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* MOBILE-RESPONSIVE FILTER SECTION */}
              <div
                className="search-filter-container"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div
                  className="filter-buttons"
                  style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                >
                  <span
                    style={{
                      color: "#9CA3AF",
                      fontSize: "14px",
                      alignSelf: "center",
                      marginRight: "4px",
                    }}
                  >
                    Filter:
                  </span>
                  {["All", "Calm", "Alert", "Critical"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFilterLevel(level)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor:
                          filterLevel === level ? "#00FFA3" : "#374151",
                        color: filterLevel === level ? "#1A1A1A" : "#D1D5DB",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {level === "Calm" && "🟢 "}
                      {level === "Alert" && "🟠 "}
                      {level === "Critical" && "🔴 "}
                      {level}
                    </button>
                  ))}
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span style={{ color: "#9CA3AF", fontSize: "14px" }}>
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#374151",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="newest">Date Added (Newest)</option>
                    <option value="oldest">Date Added (Oldest)</option>
                    <option value="a-z">Alphabetical (A-Z)</option>
                    <option value="z-a">Alphabetical (Z-A)</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <p style={{ color: "#9CA3AF", fontSize: "14px", margin: 0 }}>
                Showing{" "}
                <strong style={{ color: "#00FFA3" }}>
                  {filteredPasswords.length}
                </strong>{" "}
                of <strong>{passwords.length}</strong> passwords
              </p>
              {(searchTerm || filterLevel !== "All" || sortBy !== "newest") && (
                <button
                  onClick={clearSearchAndFilters}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#374151",
                    color: "#D1D5DB",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  🔄 Clear Filters
                </button>
              )}
            </div>

            {filteredPasswords.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#2A2A2A",
                  borderRadius: "16px",
                  padding: "48px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "60px", marginBottom: "16px" }}>🔍</div>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "white",
                    marginBottom: "8px",
                  }}
                >
                  No passwords found
                </h3>
                <p
                  style={{
                    color: "#9CA3AF",
                    marginBottom: "24px",
                    fontSize: "16px",
                  }}
                >
                  {searchTerm
                    ? `No passwords match "${searchTerm}"`
                    : `No passwords with security level "${filterLevel}"`}
                </p>
                <button
                  onClick={clearSearchAndFilters}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#00FFA3",
                    color: "#1A1A1A",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Clear Search & Filters
                </button>
              </div>
            ) : (
              <div
                className="password-grid"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {filteredPasswords.map((pwd) => (
                  <div
                    key={pwd.id}
                    className="password-card"
                    onClick={() => setViewingPassword(pwd)}
                    style={{
                      backgroundColor: "#2A2A2A",
                      borderRadius: "12px",
                      padding: "20px",
                      borderLeft: `4px solid ${getSecurityColor(pwd.security_level)}`,
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#333333")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#2A2A2A")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "12px",
                      }}
                    >
                      <Avatar website={pwd.website} size="medium" />

                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "white",
                            margin: "0 0 4px 0",
                          }}
                        >
                          {pwd.website}
                        </h3>
                        <p
                          style={{
                            color: "#9CA3AF",
                            fontSize: "14px",
                            margin: 0,
                          }}
                        >
                          {pwd.username}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                      <StrengthBar level={pwd.security_level} />
                    </div>

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
                        marginBottom: "16px",
                      }}
                    >
                      <code
                        style={{
                          fontSize: "16px",
                          color: "#D1D5DB",
                          fontFamily: "monospace",
                          flex: 1,
                        }}
                      >
                        {visiblePasswords.has(pwd.id)
                          ? pwd.password
                          : "••••••••••••"}
                      </code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePasswordVisibility(pwd.id);
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(pwd.password, "Password");
                        }}
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

                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPassword(pwd);
                        }}
                        style={{
                          flex: 1,
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
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePassword(pwd.id);
                        }}
                        style={{
                          flex: 1,
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
            )}

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

        {showAddModal && (
          <AddPasswordModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              fetchPasswords();
              showToast("Password saved successfully! 🔐", "success");
            }}
          />
        )}
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
        {showGenerator && (
          <PasswordGenerator onClose={() => setShowGenerator(false)} />
        )}
        {viewingPassword && (
          <PasswordDetailsModal
            password={viewingPassword}
            onClose={() => setViewingPassword(null)}
            onEdit={() => {
              setEditingPassword(viewingPassword);
              setViewingPassword(null);
            }}
            onDelete={() => {
              deletePassword(viewingPassword.id);
              setViewingPassword(null);
            }}
          />
        )}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </div>
    </div>
  );
}
