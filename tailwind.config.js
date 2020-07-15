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
      },
      spacing: {
        '72': '18rem',
        '76': '19rem',
        '84': '21rem',
        '96': '24rem',
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui'),
  ],
}
