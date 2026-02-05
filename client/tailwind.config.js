/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
theme: {
    extend: {
      colors: {
        'cr-blue': '#2151B0',
        'cr-blue-dark': '#163a82',
        'cr-red': '#C21A1A',
        'cr-gold': '#FFC90E',
        'cr-gold-dark': '#b38a00',
        'cr-wood': '#5d3a1a',
      },
      boxShadow: {
        'button-push': '0 4px 0 rgba(0, 0, 0, 0.4)',
      },
      fontFamily: {
        luckiest: ['"Luckiest Guy"', 'cursive'],
      },
    },
  },
  plugins: [],
}

