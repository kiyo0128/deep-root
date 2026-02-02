/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fantasy: {
          bg: "#0a0a0c",
          primary: "#4ade80", // Life Force Green
          secondary: "#60a5fa", // Mana Blue
          accent: "#f472b6", // Soul Pink
          muted: "#1f2937",
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
