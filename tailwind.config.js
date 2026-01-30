/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Classic Restaurant Palette
        primary: {
          50: '#fef7f6',
          100: '#fde9e7',
          200: '#fbd0ca',
          300: '#f8b1a7',
          400: '#f3897e',
          500: '#eb5f52',
          600: '#dc3c31',
          700: '#b92d25',
          800: '#962621',
          900: '#7c231f',
          950: '#430f0d',
        },
        secondary: {
          50: '#f8faf9',
          100: '#f0f5f1',
          200: '#e1ede4',
          300: '#c7dfcd',
          400: '#a5c9ad',
          500: '#83b18e',
          600: '#659572',
          700: '#51795e',
          800: '#415f4c',
          900: '#354f3f',
          950: '#1c2b21',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'elegant-lg': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'elegant-xl': '0 12px 40px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '96': '24rem',
      }
    },
  },
  plugins: [],
};
