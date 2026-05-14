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
        background: "#0D1525",
        surface: "#0D1525",
        "surface-raised": "#131E33",
        "surface-high": "#1A2744",
        border: "rgba(148, 163, 184, 0.10)",
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
        // Task 1: New design tokens
        "bg-base": "#070C18",
        "bg-surface": "#0D1525",
        "bg-elevated": "#131E33",
        "bg-hover": "#1A2744",
        "border-subtle": "rgba(148, 163, 184, 0.10)",
        "border-default": "rgba(148, 163, 184, 0.18)",
        "border-focus": "rgba(99, 102, 241, 0.60)",
        "text-tertiary": "#64748B",
        "text-accent": "#818CF8",
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
