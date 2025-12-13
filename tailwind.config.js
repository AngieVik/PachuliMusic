/** @type {import('tailwindcss').Config} */

import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#13ec5b",
        "background-light": "#f0f2f5",
        "background-dark": "#121212",
        "surface-light": "#ffffff",
        "surface-dark": "#1e1e1e",
        "on-surface-light": "#121212",
        "on-surface-dark": "#e0e0e0",
        "on-surface-variant-light": "#757575",
        "on-surface-variant-dark": "#9e9e9e",
        "card-light": "#ffffff",
        "card-dark": "#1e1e1e",
        "text-primary-light": "#000000",
        "text-primary-dark": "#ffffff",
        "text-secondary-light": "#6b7280",
        "text-secondary-dark": "#a0a0a0",
      },
      fontFamily: {
        display: ["Spline Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      boxShadow: {
        "neumorphic-light": "5px 5px 10px #d9dbde, -5px -5px 10px #ffffff",
        "neumorphic-dark": "5px 5px 10px #0d0d0d, -5px -5px 10px #171717",
        "neumorphic-inset-light":
          "inset 5px 5px 10px #d9dbde, inset -5px -5px 10px #ffffff",
        "neumorphic-inset-dark":
          "inset 5px 5px 10px #0d0d0d, inset -5px -5px 10px #171717",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(0.1)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        wave: "wave 1.5s infinite ease-in-out",
      },
    },
  },
  // 2. Usamos las variables que importamos arriba
  plugins: [forms, containerQueries],
};
