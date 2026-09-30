/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  // lib/ et context/ contiennent aussi des classes (couleurs de categories, statuts) :
  // sans eux, ces classes ne sont jamais generees.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: "12px",
      },
      colors: {
        brand: "#00c950",
        "brand-dark": "#16a34a",
        "brand-deep": "#14532d",

        // Jetons semantiques clair / sombre : chaque paire remplace les
        // variables CSS `--c-*` du web (pas d'equivalent natif aux
        // custom properties qui changent avec une classe .dark).
        // Convention : `bg-surface dark:bg-surface-dark`.
        canvas: "#f4f4f5",
        "canvas-dark": "#09090b",
        surface: "#ffffff",
        "surface-dark": "#17171a",
        subtle: "#f4f4f5",
        "subtle-dark": "#232327",
        "subtle-soft": "#fafafa",
        "subtle-soft-dark": "#1c1c20",
        "subtle-strong": "#e4e4e7",
        "subtle-strong-dark": "#3f3f46",
        fg: "#09090b",
        "fg-dark": "#fafafa",
        "fg-soft": "#27272a",
        "fg-soft-dark": "#e4e4e7",
        muted: "#71717b",
        "muted-dark": "#a1a1aa",
        faint: "#8e8e98",
        "faint-dark": "#83838d",
        line: "#e4e4e7",
        "line-dark": "#2e2e34",
        "line-soft": "#f4f4f5",
        "line-soft-dark": "#232327",
      },
    },
  },
  plugins: [],
};
