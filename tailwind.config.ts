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
        "page-bg": "#060B14",
        background: "#0A0F1C",
        surface: "#0F1729",
        "surface-raised": "#141E35",
        "surface-high": "#1A2540",
        border: "rgba(148, 163, 184, 0.12)",
        accent: {
          DEFAULT: "#6366F1",
          hover: "#818CF8",
        },
        "accent-secondary": "#2DD4BF",
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "text-muted": "#475569",
        error: "#F43F5E",
        warning: "#F59E0B",
        success: "#2DD4BF",
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