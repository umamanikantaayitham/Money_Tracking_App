/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3E7C78', // Exact brand teal from Figma
        secondary: '#549994', // Light teal/mint

        background: {
          light: '#F8F9F9',
          dark: '#111827'
        },
        surface: {
          light: '#ffffff',
          dark: '#1f2937'
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
