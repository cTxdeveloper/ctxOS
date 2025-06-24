/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // This line is critical
  ],
  theme: {
    extend: {
      colors: {
        'background': '#1a1b26',
        'panel': '#24283b',
        'border': '#3b4261',
        'text-primary': '#c0caf5',
        'text-secondary': '#a9b1d6',
        'accent1': '#73daca', // Teal
        'accent2': '#9ece6a', // Green
        'warning': '#f7768e', // Red
      },
      fontFamily: {
        'primary': ['"JetBrains Mono"', 'monospace'],
        'secondary': ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}