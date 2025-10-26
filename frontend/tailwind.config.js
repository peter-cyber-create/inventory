/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Uganda Flag Colors
        'uganda-black': '#000000',
        'uganda-yellow': '#FFD100',
        'uganda-red': '#D90303',
        
        // Ministry of Health Brand Colors
        'moh-primary': '#111827',
        'moh-secondary': '#6B7280',
        'moh-surface': '#F8FAFC',
        
        // Status Colors
        'success': '#16A34A', // Green for received items
        'issued': '#111827',  // Very dark for issued items
        'opening': '#EF4444', // Red for opening stock
        'closing': '#0EA5E9', // Blue for closing balance
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
