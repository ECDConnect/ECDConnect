import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AF from './locales/af/af.json';
import EN_ZA from './locales/en/en-za.json';

const resources = {
  af: AF,
  'en-za': EN_ZA,
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en-za',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
