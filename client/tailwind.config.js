/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        wittyweb_dark:{
          DEFAULT: '#030303',
        },
      },
    },
  },
  plugins: [],
}