import { getAvatarColor, getAvatarInitials } from "../utils/avatarUtils";

export default function Avatar({ website, size = "medium" }) {
  const sizes = {
    small: { width: "32px", height: "32px", fontSize: "14px" },
    medium: { width: "48px", height: "48px", fontSize: "20px" },
    large: { width: "64px", height: "64px", fontSize: "28px" },
  };

  const style = sizes[size];
  const bgColor = getAvatarColor(website);
  const initials = getAvatarInitials(website);

  return (
    <div
      style={{
        width: style.width,
        height: style.height,
        borderRadius: "50%",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        fontSize: style.fontSize,
        fontWeight: "bold",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
