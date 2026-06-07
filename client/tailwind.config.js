/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        cream: '#FAF8F4',
        ink: '#111110',
        muted: '#7A7870',
        accent: '#E8531A',
        surface: '#F5F3EF',
      }
    },
  },
  plugins: [],
}