export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  loading = false,
}) {
  const baseStyles =
    "w-full py-3 px-6 rounded-button font-semibold transition-all duration-200";

  const variantStyles = {
    primary: "bg-primary text-bgDark hover:opacity-90",
    secondary:
      "bg-cardBg text-textWhite border border-primary hover:bg-primary hover:text-bgDark",
    danger: "bg-critical text-textWhite hover:opacity-90",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} 
                 ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          {/* Spinning loader icon */}
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
