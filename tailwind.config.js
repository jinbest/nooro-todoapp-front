/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E6F9F",
        secondary: "#8284FA",
        grey: "#808080",
        black: "#0D0D0D",
        white: "#F2F2F2",
        bgCol: "#1A1A1A",
        darkGray: "#333333",
        lightDark: "#262626",
        lightBlue: "#4EA8DE",
      }
    },
  },
  plugins: [],
};