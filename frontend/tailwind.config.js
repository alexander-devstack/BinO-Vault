/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00FFA3',
        bgDark: '#1A1A1A',
        cardBg: '#2A2A2A',
        textWhite: '#FFFFFF',
        textGray: '#B0B0B0',
        safe: '#00FFA3',
        warning: '#FFD700',
        critical: '#FF4444',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
}
