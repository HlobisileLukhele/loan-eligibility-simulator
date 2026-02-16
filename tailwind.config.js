/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        capitec: {
          primary: "#020874",
          accent: "#ffffff",
          success: "#d70303",
          danger: "#C62828",
        },
      },
    },
  },
};
export const plugins = [];
