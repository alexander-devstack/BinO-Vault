export default function StrengthBar({ level }) {
  const getStrengthData = (level) => {
    switch (level) {
      case "Calm":
        return { width: "100%", color: "#00FFA3", label: "Strong" };
      case "Alert":
        return { width: "60%", color: "#F59E0B", label: "Medium" };
      case "Critical":
        return { width: "30%", color: "#EF4444", label: "Weak" };
      default:
        return { width: "0%", color: "#6B7280", label: "Unknown" };
    }
  };

  const { width, color, label } = getStrengthData(level);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: "600" }}>
          PASSWORD STRENGTH
        </span>
        <span
          style={{
            fontSize: "12px",
            color: color,
            fontWeight: "bold",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "6px",
          backgroundColor: "#1A1A1A",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: width,
            height: "100%",
            backgroundColor: color,
            borderRadius: "3px",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
