import WhatsappSvg from '../../assets/logos/whatsapp.svg';
import WhatsappWhiteSvg from '../../assets/logos/whatsappWhite.svg';

export enum LogoSvgs {
  whatsapp,
  whatsappWhite,
}

export const getLogo = (logo: LogoSvgs): string => {
  switch (logo) {
    case LogoSvgs.whatsappWhite:
      return WhatsappWhiteSvg;
    case LogoSvgs.whatsapp:
    default:
      return WhatsappSvg;
  }
};
