/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        lg: "2rem",
      },
    },
    extend: {
      fontFamily: {
        serif: [
          "Fraunces",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "Plus Jakarta Sans",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          sky: "#0C4A6E",
          "sky-light": "#0369A1",
          "sky-soft": "#E0F2FE",
          coral: "#F97316",
          "coral-light": "#FB923C",
          "coral-soft": "#FFEDD5",
          sand: "#FEF3C7",
          "sand-dark": "#FDE68A",
        },
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(12, 74, 110, 0.15)",
        glow: "0 0 30px -5px rgba(249, 115, 22, 0.4)",
        card: "0 4px 24px -4px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(16px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "zoom-slow": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-left": {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "heart-pop": {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.4)" },
          "60%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        "progress-fill": {
          "0%": { width: "0" },
          "100%": { width: "var(--progress-width, 100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        "zoom-slow": "zoom-slow 20s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "slide-right": "slide-right 0.5s ease-out both",
        "slide-left": "slide-left 0.5s ease-out both",
        pop: "pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "heart-pop": "heart-pop 0.45s ease-out",
        "progress-fill": "progress-fill 1.2s ease-out both",
      },
    },
  },
  plugins: [
    function ({ addUtilities, addComponents }) {
      addUtilities({
        ".content-auto": {
          "content-visibility": "auto",
        },
        ".text-balance": {
          "text-wrap": "balance",
        },
        ".mask-fade-b": {
          "mask-image":
            "linear-gradient(to bottom, black 50%, transparent 100%)",
          "-webkit-mask-image":
            "linear-gradient(to bottom, black 50%, transparent 100%)",
        },
        ".custom-scrollbar::-webkit-scrollbar": {
          width: "6px",
        },
        ".custom-scrollbar::-webkit-scrollbar-track": {
          background: "transparent",
        },
        ".custom-scrollbar::-webkit-scrollbar-thumb": {
          background: "#CBD5E1",
          "border-radius": "3px",
        },
        ".custom-scrollbar::-webkit-scrollbar-thumb:hover": {
          background: "#94A3B8",
        },
        ".hide-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".hide-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });

      addComponents({
        ".btn-primary": {
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.5rem",
          "border-radius": "1rem",
          "font-weight": "600",
          color: "white",
          background:
            "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
          "box-shadow": "0 4px 14px -2px rgba(249, 115, 22, 0.5)",
          transition: "all 0.2s ease",
          cursor: "pointer",
          border: "none",
          "&:hover": {
            transform: "translateY(-2px) scale(1.02)",
            "box-shadow": "0 10px 24px -4px rgba(249, 115, 22, 0.5)",
          },
          "&:active": {
            transform: "translateY(0) scale(1)",
          },
        },
        ".btn-secondary": {
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.5rem",
          "border-radius": "1rem",
          "font-weight": "600",
          color: "#0C4A6E",
          background: "white",
          border: "1.5px solid #E2E8F0",
          transition: "all 0.2s ease",
          cursor: "pointer",
          "&:hover": {
            "border-color": "#0C4A6E",
            transform: "translateY(-1px)",
            "box-shadow": "0 4px 12px -2px rgba(12, 74, 110, 0.15)",
          },
        },
        ".btn-ghost": {
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.625rem 1.25rem",
          "border-radius": "0.875rem",
          "font-weight": "500",
          color: "#475569",
          background: "transparent",
          border: "none",
          transition: "all 0.15s ease",
          cursor: "pointer",
          "&:hover": {
            color: "#0C4A6E",
            background: "#F1F5F9",
          },
        },
        ".glass-card": {
          background: "rgba(255, 255, 255, 0.85)",
          "backdrop-filter": "blur(12px)",
          "-webkit-backdrop-filter": "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          "box-shadow": "0 8px 32px -8px rgba(15, 23, 42, 0.1)",
        },
      });
    },
  ],
};
