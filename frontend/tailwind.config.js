/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false, // Ne pas écraser les styles Ant Design existants
  },
  darkMode: "class",
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./layouts/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Material Design 3 — issue de Stitch
        "primary":                    "#002045",
        "primary-container":          "#1a365d",
        "on-primary":                 "#ffffff",
        "on-primary-container":       "#86a0cd",
        "secondary":                  "#555f70",
        "secondary-container":        "#d9e3f8",
        "on-secondary-container":     "#5b6577",
        "surface":                    "#f7f9fb",
        "surface-container-lowest":   "#ffffff",
        "surface-container-low":      "#f2f4f6",
        "surface-container":          "#eceef0",
        "surface-container-high":     "#e6e8ea",
        "surface-container-highest":  "#e0e3e5",
        "on-surface":                 "#191c1e",
        "on-surface-variant":         "#43474e",
        "outline":                    "#74777f",
        "outline-variant":            "#c4c6cf",
        "tertiary-fixed":             "#ffddba",
        "tertiary-fixed-dim":         "#f2bc82",
        "tertiary-container":         "#4f2e00",
        "on-tertiary-container":      "#c6955e",
        "error":                      "#ba1a1a",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body:     ["Manrope", "sans-serif"],
        label:    ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg:      "2rem",
        xl:      "3rem",
        full:    "9999px",
      },
    },
  },
  plugins: [],
};
