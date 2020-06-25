const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    './src/app/**/*.html',
    './src/app/**/*.ts',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      zIndex: {
        '1000': 1000,
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui'),
  ],
}
