import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { AF } from './locales/afrikaans/af';
import { EN_ZA } from './locales/english/en-za';
import { NSO } from './locales/sepedi/nso';
import { NR } from './locales/isiNdebele/nr';
import { XH } from './locales/isiXhosa/xh';
import { ZU } from './locales/isiZulu/zu';
import { ST } from './locales/sesotho/st';
import { TN } from './locales/setswana/tn';
import { SS } from './locales/siSwati/ss';
import { VE } from './locales/tshivenda/ve';
import { TSO } from './locales/xitsonga/tso';

const resources = {
  af: AF,
  'en-za': EN_ZA,
  nso: NSO,
  nr: NR,
  xh: XH,
  zu: ZU,
  st: ST,
  tn: TN,
  ss: SS,
  ve: VE,
  tso: TSO,
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en-za',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
