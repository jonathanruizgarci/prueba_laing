/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- AGREGA ESTA LÍNEA OBLIGATORIAMENTE
  theme: {
    extend: {},
  },
  plugins: [],
}