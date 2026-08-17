const buildSafelist = require('../../tailwind/safelist');

const colors = {
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
  quatenaryMain: 'var(--quatenaryMain)',
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
  adminBackground: '#EFF6FA',
};

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
    '../../packages/core/src/**/*.{js,jsx,ts,tsx}',
    './node_modules/react-tailwind-table/**/*.js',
  ],
  // Classes assembled at runtime that the content scanner cannot see.
  // See tailwind/safelist.js for what each pattern covers.
  //
  // The v2 config also safelisted third-party class names (`haAclf`,
  // `S9gUrf-YoZ4jf`) because PurgeCSS ran over every stylesheet in the CRA
  // pipeline, including vendor CSS. Tailwind now only compiles src/styles.css,
  // so vendor CSS passes through untouched and those entries are obsolete.
  safelist: buildSafelist(colors),
  important: true,
  // Was `false` under v2; v3 treats `false` as 'media', which would start
  // honouring the OS preference. 'class' keeps dark mode opt-in only.
  darkMode: 'class',
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
        button: '0px 10px 10px -5px rgba(39, 56, 90, 0.2)',
      },
      minWidth: {
        120: '120px',
        160: '160px',
        260: '240px',
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
        snug: '1.375rem',
      },
      colors,
      backgroundImage: {
        logo: 'var(--logo)',
        bannerx2: 'var(--banner)',
      },
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
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
