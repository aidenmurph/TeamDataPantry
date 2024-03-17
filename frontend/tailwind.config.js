/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['../public/index.html','/src/**/*.{js,ts,jsx,tsx,mjs}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["coffee"],
  },
};