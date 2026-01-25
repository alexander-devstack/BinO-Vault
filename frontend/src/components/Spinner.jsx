export default function Spinner({ size = "medium" }) {
  const sizes = {
    small: "20px",
    medium: "40px",
    large: "60px",
  };

  return (
    <div
      style={{
        width: sizes[size],
        height: sizes[size],
        border: "4px solid #374151",
        borderTop: "4px solid #00FFA3",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}
