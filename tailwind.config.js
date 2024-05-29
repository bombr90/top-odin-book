/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/index.html", "./client/src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: ["even", "odd"],
  },
  plugins: [],
};