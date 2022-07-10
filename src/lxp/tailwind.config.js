const plugin = require('tailwindcss/plugin');

// purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
module.exports = {
  important: true,
  mode: 'aot',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        headercard: '328px',
      },
      height: {
        bannerimage: '200px',
      },
      borderRadius: {
        10: '0.625rem',
        15: '0.9375rem',
      },
      spacing: {
        17: '17px',
        112: '112px',
        116: '116px',
        120: '120px',
        177: '177px',
        180: '180px',
        360: '360px',
        54: '54px',
        102: '102px',
      },
      fontFamily: {
        h1: 'var(--h1-font)',
        body: 'var(--body-font)',
      },
      borderWidth: {
        5: '5px',
        10: '10px',
      },
      minWidth: {
        120: '120px',
      },
      fontSize: {
        12: '0.75rem',
        14: '0.875rem',
        16: '1rem',
        18: '1.125rem',
        24: '1.5rem',
      },
      lineHeight: {
        1.56: '1.56',
      },
      colors: {
        primary: 'var(--primary)',
        primaryAccent1: '#9484BD',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',
        textDark: 'var(--textDark)',
        textMid: 'var(--textMid)',
        textLight: 'var(--textLight)',
        uiMidDark: 'var(--uiMidDark)',
        uiMid: 'var(--uiMid)',
        uiLight: 'var(--uiLight)',
        uiBg: 'var(--uiBg)',
        errorMain: 'var(--errorMain)',
        errorDark: 'var(--errorDark)',
        errorBg: 'var(--errorBg)',
        alertMain: 'var(--alertMain)',
        alertDark: 'var(--alertDark)',
        alertBg: 'var(--alertBg)',
        successMain: 'var(--successMain)',
        successDark: 'var(--successDark)',
        successBg: 'var(--successBg)',
        infoMain: 'var(--infoMain)',
        infoDark: 'var(--infoDark)',
        infoBb: 'var(--infoBb)',
      },
      backgroundImage: (theme) => ({
        logo: "url('./assets/logo.svg')",
        bannerx2: "url('./assets/bannerx2.png')",
      }),
      animation: {
        spinner: 'spin 1.5s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      borderWidth: ['hover', 'focus'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    plugin(function ({ addUtilities, theme }) {
      const themeColors = theme('colors');
      const individualBorderColors = Object.keys(themeColors).map(
        (colorName) => {
          if (typeof themeColors[colorName] == 'string') {
            return {
              [`.border-b-${colorName}`]: {
                borderBottomColor: themeColors[colorName],
              },
              [`.border-t-${colorName}`]: {
                borderTopColor: themeColors[colorName],
              },
              [`.border-l-${colorName}`]: {
                borderLeftColor: themeColors[colorName],
              },
              [`.border-r-${colorName}`]: {
                borderRightColor: themeColors[colorName],
              },
            };
          }

          const colors = {};

          Object.keys(themeColors[colorName]).forEach((level) => {
            colors[`.border-b-${colorName}-${level}`] = {
              borderBottomColor: themeColors[colorName][level],
            };
            colors[`.border-t-${colorName}-${level}`] = {
              borderTopColor: themeColors[colorName][level],
            };
            colors[`.border-l-${colorName}-${level}`] = {
              borderLeftColor: themeColors[colorName][level],
            };
            colors[`.border-r-${colorName}-${level}`] = {
              borderRightColor: themeColors[colorName][level],
            };
          });

          return colors;
        }
      );

      addUtilities(individualBorderColors);
    }),
  ],
};
