/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        mist: 'var(--mist)',
        primary: 'var(--primary)',
        'primary-strong': 'var(--primary-strong)',
        danger: 'var(--danger)',
        ok: 'var(--ok)',
        warn: 'var(--warn)',
      },
      fontFamily: {
        sans: ['"Source Sans 3"', '"Segoe UI"', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 12px 40px rgba(20, 34, 28, 0.06)',
      },
    },
  },
  plugins: [],
};
