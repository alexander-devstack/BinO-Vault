// Generate consistent color from string (website name)
export function getAvatarColor(text) {
  const colors = [
    "#EF4444", // Red
    "#F59E0B", // Orange
    "#10B981", // Green
    "#3B82F6", // Blue
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#14B8A6", // Teal
    "#F97316", // Deep Orange
  ];

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

// Get first letter (or first 2 if short)
export function getAvatarInitials(text) {
  const cleaned = text.trim().toUpperCase();
  if (!cleaned) return "?";

  // If it's a domain, extract main part (gmail.com → G)
  const parts = cleaned.split(".");
  const mainPart = parts[0];

  // Return first letter
  return mainPart.charAt(0);
}
