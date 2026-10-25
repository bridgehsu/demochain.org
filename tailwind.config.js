/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        // OpenClaw 品牌色与中性背景
        dark: {
          bg: '#101012',
          surface: '#19191c',
          border: '#303034'
        },
        brand: {
          50: '#fff4f0', 100: '#ffe2d9', 200: '#ffc2b2',
          300: '#ff9c87', 400: '#f5654a', 500: '#e05540',
          600: '#d84a31', 700: '#c24028', 800: '#9c3222', 900: '#762b20',
        },
        sea: {400: '#4fc8ae', 500: '#2fa48d', 600: '#14806e', 700: '#0f6355'},
        gray: {
          50: '#f6f5f3', 100: '#eceae6', 200: '#dedcd8', 300: '#bcbcc4',
          400: '#9a9aa2', 500: '#63636c', 600: '#46464e', 700: '#303034',
          800: '#202024', 900: '#19191c', 950: '#101012',
        },
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        accent: "var(--accent-color)",
      },
    },
  },
  plugins: [],
};
