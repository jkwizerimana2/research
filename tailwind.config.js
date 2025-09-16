/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
};