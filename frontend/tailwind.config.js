/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official MOH Uganda Colors
        'moh': {
          'primary': '#006747',      // Official MOH Green
          'primary-light': '#00A968',
          'primary-dark': '#004D35',
          'secondary': '#FFD600',    // Official MOH Yellow
          'secondary-light': '#FFE033',
          'secondary-dark': '#B3951F',
          'accent': '#E53935',       // Official MOH Red
          'accent-light': '#EF5350',
          'accent-dark': '#C62828',
        },
        // Uganda Flag Colors
        'uganda': {
          'black': '#000000',
          'yellow': '#FFD100',
          'red': '#CE1126',
        },
        // Neutral Colors
        'moh-neutral': {
          'background': '#FAFBFC',
          'background-alt': '#F5F7FA',
          'surface': '#FFFFFF',
          'surface-hover': '#F8F9FA',
          'text': '#1A1A1A',
          'text-secondary': '#5A6872',
          'text-tertiary': '#8B9499',
          'border': '#E1E5E9',
          'border-light': '#F0F3F7',
        },
        // Status Colors
        'status': {
          'success': '#00A968',
          'success-light': '#E8F5E8',
          'info': '#1976D2',
          'info-light': '#E3F2FD',
          'warning': '#FF8F00',
          'warning-light': '#FFF8E1',
          'error': '#E53935',
          'error-light': '#FFEBEE',
        },
        // Legacy Support
        'uganda-black': '#000000',
        'uganda-yellow': '#FFD100',
        'uganda-red': '#D90303',
        'moh-primary': '#006747',
        'moh-secondary': '#6B7280',
        'moh-surface': '#F8FAFC',
        'success': '#16A34A',
        'issued': '#111827',
        'opening': '#EF4444',
        'closing': '#0EA5E9',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
