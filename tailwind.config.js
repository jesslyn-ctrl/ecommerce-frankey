/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: "'Poppins', sans-serif",
        roboto: "'Roboto', sans-serif",
        jost: "'Jost', sans-serif",
        outfit: "'Outfit', sans-serif",
      },
    },
  },
  plugins: [],
};
