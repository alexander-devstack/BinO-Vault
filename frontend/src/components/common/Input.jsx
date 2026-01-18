import { useState } from "react";

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="relative">
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full bg-cardBg text-textWhite px-4 py-3 rounded-input 
                   border border-transparent focus:border-primary focus:outline-none
                   transition-all duration-200
                   ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-textGray"}`}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-primary text-sm font-medium
                     ${disabled ? "opacity-50 cursor-not-allowed" : "hover:text-safe"}`}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      )}
    </div>
  );
}
