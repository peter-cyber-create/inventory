/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        gov: {
          navy: '#0f172a',
          blue: '#1e40af',
          slate: '#334155',
          light: '#f1f5f9',
        },
      },
    },
  },
  plugins: [],
};
