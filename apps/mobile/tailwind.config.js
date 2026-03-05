/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#0052FF',
        'primary-dark': '#0041CC',
        background: {
          light: '#FFFFFF',
          dark: '#0A0B0D',
        },
        surface: {
          light: '#F5F5F5',
          dark: '#1C1C1E',
        },
        text: {
          primary: {
            light: '#0A0B0D',
            dark: '#FFFFFF',
          },
          secondary: '#6B7280',
        },
        success: '#00B300',
        error: '#FF4B4B',
        tabbar: {
          light: '#FFFFFF',
          dark: '#131417',
        },
        border: {
          light: '#E5E7EB',
          dark: '#2C2C2E',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
