import React from "react";

/**
 * Reusable Card Component for Password Items
 * Matches the Dashboard design with colored left border
 * @param {string} service - Service name (e.g., "Gmail")
 * @param {string} username - Username/email
 * @param {string} status - 'safe' | 'warning' | 'critical'
 * @param {function} onClick - Click handler
 */
const Card = ({ service, username, status = "safe", onClick }) => {
  // Map status to colors and labels
  const statusConfig = {
    safe: {
      borderColor: "border-l-safe",
      textColor: "text-safe",
      label: "Calm",
    },
    warning: {
      borderColor: "border-l-warning",
      textColor: "text-warning",
      label: "Alert",
    },
    critical: {
      borderColor: "border-l-critical",
      textColor: "text-critical",
      label: "Critical",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      onClick={onClick}
      className={`bg-gray-800 rounded-x1 p-6 border-l-4 ${config.borderColor} cursor-pointer hover:bg-opacity-80 transition-all duration-200 transform hover:scale-[1.02]`}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-textWhite font-semibold text-lg mb-1">
            {service}
          </h3>
          <p className="text-textGray text-sm">{username}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`${config.textColor} text-sm font-medium`}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
