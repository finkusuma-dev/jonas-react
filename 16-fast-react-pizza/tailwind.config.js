/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    /// Writing our fontFamily config here will overwrite default config,
    /// so we will no longer able to use for example: font-serif
    ///
    extend: {
      /// Adding our own config to the default config
      ///
      fontFamily: {
        sans: 'Roboto Mono, monospace',
      },
      fontSize: {
        big: ['10rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
};
