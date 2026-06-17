/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7FBEAB',
          light: '#A5D4C8',
          dark: '#5EA08C',
        },
        secondary: {
          DEFAULT: '#F5F0E8',
          light: '#FAF7F2',
          dark: '#E8E0D0',
        },
        accent: {
          DEFAULT: '#E8A87C',
          light: '#F0C4A8',
          dark: '#D08A5C',
        },
        background: '#FAFAF8',
        foreground: '#3D3D3D',
        muted: '#9CA3AF',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
