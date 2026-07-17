/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        display: ['29LTBukra', 'Cairo', 'sans-serif'],
        bukra: ['29LTBukra', 'Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
