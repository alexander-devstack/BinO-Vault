/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00FFA3",
          hover: "#00E693",
        },
        dark: {
          bg: "#1A1A1A",
          card: "#2A2A2A",
        },
      },
    },
  },
  plugins: [],
};
