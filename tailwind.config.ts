import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        persian: {
          orange: "#D49653",
        },
        charleston: {
          green: "#2C2C2C",
        },
        parchment: {
          50: "#FAF9F7",
          100: "#F5F3F0",
          200: "#E8DCCB",
          300: "#D8CBB8",
          400: "#C4B5A0",
          500: "#A8957F",
        },
        burgundy: {
          50: "#FDF2F2",
          100: "#FCE7E7",
          200: "#F9D1D1",
          300: "#F4A5A5",
          400: "#ED7171",
          500: "#DC2626",
          600: "#B91C1C",
          700: "#991B1B",
          800: "#7F1D1D",
        },
        olive: {
          50: "#F5F5F0",
          100: "#E8E8DD",
          200: "#D1D1BB",
          300: "#B4B491",
          400: "#8F8F5F",
          500: "#6B6B3D",
          600: "#4F4F2D",
          700: "#3A3A21",
        },
        text: {
          dark: "#2C2C2C",
          body: "#4A4A4A",
          light: "#6B6B6B",
        }
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"]
      },
      fontSize: {
        "display": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-sm": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }]
      },
      spacing: {
        "section": "6rem",
        "section-lg": "8rem",
      }
    }
  },
  plugins: []
} satisfies Config;

