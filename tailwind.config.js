/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: '#B8860B',
        'primary-light': '#D4AF37',
        'primary-pale': '#F5ECD7',
        secondary: '#F5F5F5',
        'text-main': '#1A1A1A',
        'text-secondary': '#666666',
        border: '#E8D9B0',
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        display: ['29LTBukra', 'Cairo', 'sans-serif'],
        bukra: ['29LTBukra', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 8px 24px rgba(184, 134, 11, 0.2)',
        'gold-lg': '0 16px 48px rgba(184, 134, 11, 0.25)',
        'dark-sm': '0 4px 16px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
