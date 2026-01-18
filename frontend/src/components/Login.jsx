import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Please enter your master password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          master_password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.session_token) {
        localStorage.setItem("sessionToken", data.session_token);
        navigate("/dashboard");
      } else {
        setError(data.error || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      setError("Connection failed");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1A1A1A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "448px" }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "96px",
              height: "96px",
              backgroundColor: "#00FFA3",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 40px rgba(0, 255, 163, 0.3)",
            }}
          >
            <svg
              style={{ width: "48px", height: "48px" }}
              fill="#1A1A1A"
              viewBox="0 0 24 24"
            >
              <path d="M12 17a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          BinO-Vault
        </h1>
        <p
          style={{
            color: "#9CA3AF",
            textAlign: "center",
            marginBottom: "48px",
          }}
        >
          Your passwords are safe.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Password Input */}
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
              Master Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your master password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  paddingRight: "80px",
                  backgroundColor: "#2A2A2A",
                  border: "2px solid #374151",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "4px 12px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#00FFA3",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid #EF4444",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            >
              <p
                style={{
                  color: "#EF4444",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Submit Button - FIXED */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: loading ? "#00CC82" : "#00FFA3",
              color: "#1A1A1A",
              fontWeight: "600",
              fontSize: "16px",
              borderRadius: "8px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(0, 255, 163, 0.4)",
              marginBottom: "16px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              !loading && (e.currentTarget.style.backgroundColor = "#00E693")
            }
            onMouseLeave={(e) =>
              !loading && (e.currentTarget.style.backgroundColor = "#00FFA3")
            }
          >
            {loading ? "Unlocking Vault..." : "Unlock Vault"}
          </button>

          {/* Forgot Password Link */}
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={() => alert("Contact admin to reset password")}
              style={{
                color: "#9CA3AF",
                fontSize: "14px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
