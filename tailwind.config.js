/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#6E1426',
        'brand-red-deep': '#4E0A17',
        'brand-red-light': '#B87383',
        'brand-rose': '#A32842',
        'brand-dark': '#0B090C',
        'brand-ink': '#130F16',
        'brand-cream': '#FAF7F2',
        champagne: {
          50: '#FBF8F1',
          100: '#F5EEDC',
          200: '#EBDDBF',
          300: '#DEC596',
          400: '#D4B376',
          500: '#C59E56',
          DEFAULT: '#DEC596',
          dark: '#9E7632',
        },
        wine: {
          50: '#FDF2F4',
          100: '#FBE6EA',
          500: '#A32842',
          700: '#6E1426',
          800: '#4E0A17',
          900: '#360610',
          DEFAULT: '#6E1426',
          rose: '#B87383',
        },
        noir: {
          DEFAULT: '#0B090C',
          50: '#26202C',
          100: '#1C1722',
          200: '#141018',
          card: 'rgba(20, 16, 24, 0.78)',
          surface: '#130F16',
          elevated: '#1D1724',
          border: 'rgba(222, 197, 150, 0.16)',
        },
        pearl: {
          DEFAULT: '#FAF7F2',
          muted: '#C7BFB3',
          subtle: 'rgba(250, 247, 242, 0.65)',
        },
      },
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'spin-slow': 'spinSlow 24s linear infinite',
        'pulse-subtle': 'pulseSubtle 2.4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
