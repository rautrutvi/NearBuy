/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDF6F0',
          100: '#FBEADE',
          200: '#F6D3BC',
          300: '#EFA688',
          400: '#E87856',
          500: '#E05236', // Primary Terracotta / Amber
          600: '#C83D24',
          700: '#A62D1B',
          800: '#86261A',
          900: '#6D2319',
        },
        safety: {
          50: '#F0FDF9',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#0D9488', // Safety Teal / Monsoon Cyan
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        flood: {
          safe: '#10B981',
          watch: '#F59E0B',
          alert: '#EF4444',
          'bg-safe': '#ECFDF5',
          'bg-watch': '#FFFBEB',
          'bg-alert': '#FEF2F2',
        },
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(1)' },
          '50%': { opacity: '0.28', transform: 'scale(1.1)' },
        },
        liveDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.4' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 5s ease-in-out infinite',
        'live-dot': 'liveDot 1.8s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'lift': '0 10px 25px -5px rgba(224, 82, 54, 0.15)',
        'safety': '0 10px 25px -5px rgba(13, 148, 136, 0.15)',
      }
    },
  },
  plugins: [],
}
