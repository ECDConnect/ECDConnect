import i18n from "i18next";
import { initReactI18next } from "react-i18next";


// Importing translation files
// Creating object with the variables of imported translation files
const resources = {
  en: {
    translation: require('./locales/en/translation.json'),
  }  
};

// i18N Initialization
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng:"en",     
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;