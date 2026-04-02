/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Cabinet Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        obsidian: {
          50:  "#f5f5f0",
          100: "#e8e8e0",
          200: "#d0d0c0",
          300: "#b0b09a",
          400: "#8a8a72",
          500: "#6e6e58",
          600: "#565640",
          700: "#3e3e2e",
          800: "#28281e",
          900: "#161610",
          950: "#0a0a07",
        },
        gold: {
          50:  "#fefdf5",
          100: "#fef9e0",
          200: "#fdf0b0",
          300: "#fae070",
          400: "#f5c832",
          500: "#e8a800",
          600: "#c98500",
          700: "#a06400",
          800: "#7a4d00",
          900: "#5c3a00",
          950: "#3a2400",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
        "gold-gradient": "linear-gradient(135deg, #e8a800 0%, #f5c832 50%, #c98500 100%)",
        "card-glow": "radial-gradient(ellipse at top, rgba(232,168,0,0.08) 0%, transparent 60%)",
      },
      boxShadow: {
        "gold": "0 0 0 1px rgba(232,168,0,0.3), 0 4px 24px rgba(232,168,0,0.12)",
        "gold-lg": "0 0 0 1px rgba(232,168,0,0.4), 0 8px 48px rgba(232,168,0,0.2)",
        "card": "0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 40px rgba(0,0,0,0.6)",
      },
      animation: {
        "shimmer": "shimmer 2.5s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(232,168,0,0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(232,168,0,0.1)" },
        },
      },
    },
  },
  plugins: [],
}
