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
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui'),
  ],
}
