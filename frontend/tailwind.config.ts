import type { Config } from "tailwindcss";

/**
 * Love 21 color tokens
 *
 * Prefer:     brand-dark | brand-slate | brand-light | brand-red | brand-crimson
 * Legacy:     brand-ink | brand-coral | brand-sand | brand-cream | brand-sea
 *             (temporary aliases only — do not use in new code)
 * Avoid:      new raw hex for text/buttons; undefined color names
 * Decorative blob washes (#FBEAEA, etc.) may stay as hex.
 */
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        // Official palette (RGB channels via CSS vars)
        "brand-dark": "rgb(var(--brand-dark) / <alpha-value>)",
        "brand-slate": "rgb(var(--brand-slate) / <alpha-value>)",
        "brand-light": "rgb(var(--brand-light) / <alpha-value>)",
        "brand-red": "rgb(var(--brand-red) / <alpha-value>)",
        "brand-crimson": "rgb(var(--brand-crimson) / <alpha-value>)",

        // Legacy aliases → official palette
        "brand-ink": "rgb(var(--brand-ink) / <alpha-value>)",
        "brand-coral": "rgb(var(--brand-coral) / <alpha-value>)",
        "brand-sand": "rgb(var(--brand-sand) / <alpha-value>)",
        "brand-cream": "rgb(var(--brand-cream) / <alpha-value>)",
        "brand-sea": "rgb(var(--brand-sea) / <alpha-value>)",

        // Home-page aliases
        indigo: "rgb(var(--brand-dark) / <alpha-value>)",
        lavender: "rgb(var(--brand-slate) / <alpha-value>)",
        platinum: "rgb(var(--brand-light) / <alpha-value>)",
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
    },
  },
  plugins: [],
};

export default config;
