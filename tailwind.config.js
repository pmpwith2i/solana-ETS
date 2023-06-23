/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f6aa1c',
        secondary: '#c7f9cc',
        white: '#F8F1F1',
      },
      borderColor: {
        primary: '#332e24',
      },
      backgroundColor: {
        primary: '#141418',
        'button-primary': '#E57C23',
      },
    },
  },
  plugins: [],
};
