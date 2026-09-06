/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050507',
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1c1c28',
          600: '#28283a',
          500: '#3a3a52',
        },
        gold: {
          50: '#fff8e6',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#f5b225',
          600: '#d49a1a',
          700: '#a87514',
          800: '#7a5410',
          900: '#4d3508',
        },
        blood: {
          400: '#ef5350',
          500: '#e53935',
          600: '#c62828',
          700: '#b71c1c',
        },
        emerald: {
          400: '#26d07c',
          500: '#16a34a',
          600: '#15803d',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Inter', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'coin-flip': 'coinFlip 0.6s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.92)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(40px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245, 178, 37, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(245, 178, 37, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        coinFlip: {
          '0%': { transform: 'rotateY(0deg) scale(0.8)', opacity: '0' },
          '50%': { transform: 'rotateY(180deg) scale(1.1)', opacity: '1' },
          '100%': { transform: 'rotateY(360deg) scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
