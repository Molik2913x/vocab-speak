/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        stage: {
          950: "#0B1613",
          900: "#0F1F1C",
          800: "#152E29",
          700: "#1E3F38",
          600: "#2A5148",
        },
        chalk: "#F5F1E8",
        chalkdim: "#C9C3B4",
        coral: {
          DEFAULT: "#FF5D73",
          dim: "#D94A5F",
        },
        amber: {
          DEFAULT: "#F2C14E",
          dim: "#D9A93A",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(242,193,78,0.25), 0 20px 60px -20px rgba(255,93,115,0.35)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseRing: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
      },
      animation: {
        rise: "rise 0.5s cubic-bezier(0.16,1,0.3,1) both",
        pulseRing: "pulseRing 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
