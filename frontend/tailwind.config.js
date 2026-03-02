/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'body-sm': ['0.8125rem', { lineHeight: '1.25rem' }],
        'body': ['0.875rem', { lineHeight: '1.375rem' }],
        'body-lg': ['0.9375rem', { lineHeight: '1.5rem' }],
        'label': ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
        'heading-sm': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'heading': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'heading-lg': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'page-title': ['1.375rem', { lineHeight: '1.75rem', fontWeight: '600' }],
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '18': '4.5rem',
        '20': '5rem',
      },
      borderRadius: {
        'form': '4px',
        'card': '4px',
        'button': '4px',
      },
      colors: {
        gov: {
          primary: '#0F1C2E',
          primaryHover: '#1a2d47',
          secondary: '#2E3B4E',
          secondaryMuted: '#5c6b7e',
          accent: '#0d9488',
          accentHover: '#0f766e',
          border: '#d1d9e2',
          borderLight: '#e8ecf1',
          surface: '#ffffff',
          background: '#F5F7FA',
          backgroundAlt: '#eaeef4',
          danger: '#b91c1c',
          dangerHover: '#991b1b',
          success: '#15803d',
          warning: '#a16207',
        },
      },
      boxShadow: {
        'header': '0 1px 0 0 rgba(15, 28, 46, 0.08)',
        'card': '0 1px 3px 0 rgba(15, 28, 46, 0.06)',
        'card-hover': '0 2px 6px 0 rgba(15, 28, 46, 0.08)',
      },
      transitionDuration: {
        'fast': '120ms',
        'normal': '150ms',
      },
    },
  },
  plugins: [],
};
