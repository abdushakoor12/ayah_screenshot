/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        indopak: ["IndoPak", "sans-serif"],
      }
    },
  },
  plugins: [],
};
