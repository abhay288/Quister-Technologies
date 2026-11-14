/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'near-black': '#08090B',
        'charcoal': '#111318',
        'charcoal-mid': '#181A20',
        'charcoal-light': '#22252D',
        'champagne': '#D8B46D',
        'champagne-light': '#F5D9A0',
        'champagne-dark': '#9A7A4A',
        'ivory': '#F3EFE8',
        'ivory-dark': '#E2DDD4',
        'secondary-text': '#AAA7A1',
        'status-green': '#55D88A',
        'warm-white': '#FAF8F5',
      },
      fontFamily: {
        'display': ['Instrument Serif', 'Bodoni Moda', 'Didot', 'Georgia', 'serif'],
        'sans': ['Manrope', 'system-ui', 'sans-serif'],
        'mono': ['IBM Plex Mono', 'monospace'],
      },
      letterSpacing: {
        'display': '0.02em',
        'wide-display': '0.15em',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
