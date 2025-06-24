/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // THEME SETUP: Map Tailwind color names to our CSS variables.
      // Now, when you use a class like `bg-panel`, Tailwind will apply
      // `background-color: var(--color-panel);`
      colors: {
        'background': 'var(--color-background)',
        'panel': 'var(--color-panel)',
        'border': 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'accent1': 'var(--color-accent1)',
        'accent2': 'var(--color-accent2)',
        'warning': 'var(--color-warning)',
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