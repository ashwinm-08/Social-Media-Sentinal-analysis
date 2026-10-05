/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          500: '#1d4ed8',
          600: '#1e40af',
          700: '#1d3557',
          800: '#0f172a',
          900: '#0a0f1d',
        },
        sentiment: {
          pos: '#10b981',
          neg: '#ef4444',
          neu: '#6b7280',
        }
      }
    },
  },
  plugins: [],
}
