const plugin = require('tailwindcss/plugin');

module.exports = {  
  important: true,
  mode: 'aot',
  darkMode: false, 
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-daterange/dist/index.esm.js",
  ],
  theme: {
    extend: {
      width: {
        headercard: '328px',
      },
      height: {
        bannerimage: '200px',
      },
      spacing: {
        10: '10px',
        112: '112px',
        116: '116px',
        120: '120px',
        177: '177px',
        180: '180px',
        360: '360px',
        500: '550px',
        54: '54px',
        102: '102px',
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
        48: '3rem',
        72: '4.5rem',
        
      },
      lineHeight: {
        1.56: '1.56',
      },      
      fontFamily: {
        h1: "var(--h1-font)",
        body: "var(--body-font)",
      },
      colors: {
        primary: 'var(--primary)',
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
        darkBackground: 'var(--darkBackground)',
        adminPortalBg: 'var(--adminPortalBg)',
        quatenary: 'var(--quatenary)',
        quatenaryBg: 'var(--quatenaryBg)',
        quatenaryMain:'var(--quatenaryMain)',
        darkBlue: 'var(--darkBlue)',
        primaryGG: 'var(--primaryGG)',
        secondaryGG: 'var(--secondaryGG)',
        tertiaryGG: 'var(--tertiaryGG)',
        quaternaryGG: 'var(--quaternaryGG)',
        pointsCardBg: 'var(--pointsCardBg)',
        pointsCardBarBg: 'var(--pointsCardBarBg)',
        infographicBg: 'var(--infographicBg)',
        tertiaryAccent1: 'var(--tertiaryAccent1)',
        tertiaryAccent2: 'var(--tertiaryAccent2)',
        tertiaryAccent3: 'var(--tertiaryAccent3)',
        secondaryMain: 'var(--secondaryMain)',
        quinary: 'var(--quinary)',
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
