import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#111118",
        "surface-raised": "#1A1A24",
        border: "#2A2A38",
        accent: {
          DEFAULT: "#6C63FF",
          hover: "#7C74FF",
        },
        "accent-secondary": "#00D4AA",
        "text-primary": "#F0F0FF",
        "text-secondary": "#8888AA",
        "text-muted": "#55556A",
        error: "#FF4D6A",
        warning: "#FFB547",
        success: "#00D4AA",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        vouch: "12px",
        "vouch-sm": "8px",
        "vouch-pill": "999px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;