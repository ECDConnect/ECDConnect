const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: {
    enabled: true, // force it even if you want to test
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    //content: ['./**/*.{js,ts,jsx,tsx}',],
    safelist: [
      'h-360',
      'h-244',
      'h-116',
      'w-96',
      'fixed',
      'inset-0',
      'flex',
      'items-center',
      'justify-center',
      'grid',
      'place-items-center',
      // add others you suspect are used, e.g.:
      'mx-auto',
      'my-auto',
      'min-h-screen',
      // logo styles
      'inline-block', 'text-left', 'z-0', 'w-10/12', 'justify-start', 'bg-bannerx2', 'h-10', 'w-10',
      'w-3/12', 'flex', 'justify-start',
      // carousel
      'relative', 'h-360px', 'md:h-96', 'w-full',
      // dialog
      'align-bottom', 'max-h-screen', 'overflow-y-auto', 'rounded-2xl', 'max-w-sm', 'text-left', 'shadow-xl', 'transform', 'transition-all', 'align-middle', 'w-full', 'bg-uiBg',
      'rounded-lg bg-white', 'relative', 'w-96', 'sm:w-full',
      'py-6', 'px-4', 'flex', 'flex-col', 'justify-evenly', 'items-center',
      'justify-center', 'flex', 'overflow-hidden', 'fixed', 'inset-0', 'z-50', 'outline-none', 'focus:outline-none',
      'justify-center', 'flex', 'overflow-hidden', 'fixed', 'inset-0', 'outline-none', 'focus:outline-none',
      // walkthrough
      'rounded-lg', 'bg-white', 'relative', 'w-96', 'sm:w-full',
      'opacity-50', 'fixed', 'inset-0', 'z-40', 'bg-black', 'bg-modalBg',
      //offline
      'font-body','font-bold ','text-center','text-alertMain', 'leading-4',
      'flex', 'flex-shrink-0', 'flex-row', 'items-center', 'justify-between', 'px-1', 'py-0', 'rounded-full', 'border', 'border-uiMidDark', 'bg-uiMidDark', 'absolute', 'z-50', 'top-54', 'left-1/2', 'transform -translate-x-1/2',
      // side menu & button
     'fixed', 'inset-0', 'z-40', 'flex',
     'fixed', 'inset-0', 'bg-gray-600', 'bg-opacity-75',
      'relative', 'flex', 'w-full', 'max-w-xs', 'flex-1', 'flex-col' ,'bg-white', 'pt-5', 'pb-4',
      'absolute', 'top-0', 'right-0', '-mr-12' ,'pt-2',
      // robot
      'relative', 'rounded-full', 'cursor-pointer' ,
      // forms
      'relative', 'flex', 'gap-5', 'pb-6',
      // button
      'cursor-pointer', 'inline-flex', 'items-center', 'border-2', 'border-transparent', 'text-sm', 'font-normal', 'shadow-sm', 'justify-center', 'outline-none', 'bg-secondaryAccent2' ,'text-white', 'py-2.5', 'px-17', 'rounded-15', 'h-9', 'w-auto',
      // borders
      'border', 'border-t-0', 'border-r-0', 'border-l-0', 'border-dashed', 'border-color-uiLight', 'block',

    ]
  },
  important: true,
  mode: 'aot',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        headercard: '328px',
      },
      height: {
        bannerimage: '220px',
      },
      borderRadius: {
        10: '0.625rem',
        15: '0.9375rem',
      },
      spacing: {
        13: '13px',
        17: '17px',
        18: '18px',
        22: '22px',
        30: '30px',
        112: '112px',
        116: '116px',
        120: '120px',
        177: '177px',
        180: '180px',
        340: '340px',
        360: '360px',
        600: '600px',
        244: '244px',
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
      boxShadow: {
        card: '0px 10px 10px rgba(39, 56, 90, 0.2)',
        button: '0px 10px 10px -5px rgba(39, 56, 90, 0.2)'
      },
      minWidth: {
        120: '120px',
        160: '160px',
        260: '240px'
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
        snug: '1.375rem'
      },
      colors: {
        primary: 'var(--primary)',
        primaryAccent1: 'var(--primaryAccent1)',
        primaryAccent2: 'var(--primaryAccent2)',
        secondary: 'var(--secondary)',
        secondaryAccent1: 'var(--secondaryAccent1)',
        secondaryAccent2: 'var(--secondaryAccent2)',
        tertiary: 'var(--tertiary)',
        tertiaryAccent1: 'var(--tertiaryAccent1)',
        tertiaryAccent2: 'var(--tertiaryAccent2)',
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
        modalBg: 'var(--modalBg)',
        darkBackground: 'var(--darkBackground)',
        adminPortalBg: 'var(--adminPortalBg)',
        quatenary: 'var(--quatenary)',
        quatenaryBg: 'var(--quatenaryBg)',
        quatenaryMain:'var(--quatenaryMain)',
        darkBlue: 'var(--darkBlue)',
        pointsCardBg: 'var(--pointsCardBg)',
        pointsCardBarBg: 'var(--pointsCardBarBg)',
        infographicBg: 'var(--infographicBg)',
        secondaryMain: 'var(--secondaryMain)',
        quinary: 'var(--quinary)',
        warning: '#FFD525',
        warningBg: '#fff6d0',
        blue: {
          accent3: '#1DBADF',
        },
        adminBackground: '#EFF6FA'
      },
      backgroundImage: (theme) => ({
        logo: "var(--logo)",
        bannerx2: "var(--banner)",
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
