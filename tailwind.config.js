/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      maxWidth: {
        theme: "1920px",
      },
      colors: {},
      fontFamily: {},
    },
  },
  variants: {
    extend: {
      display: ["group-focus", "group-hover"],
    },
  },
  plugins: [],
};
