import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#15161b",
        canvas: "#FAFAF7",
        surface: "#ffffff",
        ink: "#1b1a17",
        muted: "#74716a",
        line: "#EAE8E1",
        soft: "#f4f2ec",
        good: "#1f8a5b",
        warn: "#a9781c",
        bad: "#bf4a31",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
        modal: "22px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,20,18,.04), 0 10px 30px -14px rgba(20,20,18,.12)",
        modal: "0 30px 80px -24px rgba(20,20,18,.5)",
        toast: "0 16px 40px -12px rgba(20,20,18,.5)",
      },
      letterSpacing: {
        tightest: "-0.035em",
        tighter2: "-0.03em",
      },
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "none" },
        },
        pop: {
          from: { opacity: "0", transform: "translateY(12px) scale(.985)" },
          to: { opacity: "1", transform: "none" },
        },
        overlayIn: { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        spin: "spin 1.1s linear infinite",
        fadeUp: "fadeUp .45s ease both",
        pop: "pop .3s cubic-bezier(.2,.8,.2,1) both",
        overlayIn: "overlayIn .25s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
