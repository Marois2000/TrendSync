/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1B3F9C',
        secondary: {
          100: '#f59a4e',
          200: '#F4872C',
          300: '#b55607'
        },
        background: '#F5F5F5'
      },
    },
  },
  plugins: [],
}

