/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        'light-blue': '#E0F7FF',
        'light-blue-dark': '#B3E5FF',
        'sky-blue': '#87CEFA',
        'navy-dark': '#001f3f',
        'gold': '#E9CCAB',
        'navy-glow': '#0a1f47',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
};
