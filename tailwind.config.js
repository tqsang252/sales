/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        sidebar: {
          DEFAULT: '#172033',
          hover: '#1E293B',
          active: '#27354F',
          text: '#94A3B8',
          textActive: '#FFFFFF'
        },
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8'
        }
      }
    },
  },
  plugins: [],
}
