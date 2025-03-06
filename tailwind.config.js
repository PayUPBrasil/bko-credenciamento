const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      backgroundImage: {
        'pattern-user': "url('https://img.freepik.com/premium-vector/modern-memphis-geometric-blue-abstract-banner-design-background-blue-banner-background-geometric-blue-light-stripes-texture-background_181182-28836.jpg?w=1800')",
        'pattern-login': "url('https://img.freepik.com/free-photo/3d-vertical-background-with-abstract-style_23-2150641323.jpg?t=st=1729686818~exp=1729690418~hmac=c963c3eb4dace50afebfde82d47862166cda6410ad06e57e8234487030c7bc11&w=740')",
      },

      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spin: 'spin 2s cubic-bezier(0.4, 0, 1, 1) infinite',
      },
      fontFamily: {
        sans: ['Sora', ...defaultTheme.fontFamily.sans],
        second: ['Montserrat'],
        minText: ['Inter'],
      },
      colors: {
        accent: '#4e2ec7',
        primary: '#4B4DED',
        secondary: '#45d6fc',
        background: '#f7fafd',
        text: '#54595F',
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'), require('@tailwindcss/forms'),
    plugin(({ addUtilities }) => {
      addUtilities({
        /* Chrome, Safari and Opera */
        ".scrollbar-hidden::-webkit-scrollbar": {
          display: "none",
        },

        ".scrollbar-hidden": {
          "scrollbar-width": "none" /* Firefox */,
          "-ms-overflow-style": "none" /* IE and Edge */,
        },
      })
    }),
  ],
}
