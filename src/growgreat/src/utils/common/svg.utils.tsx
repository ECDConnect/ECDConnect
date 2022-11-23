import WhatsappSvg from '../../assets/logos/whatsapp.svg';

export enum LogoSvgs {
  whatsapp,
}

export const getLogo = (logo: LogoSvgs): string => {
  switch (logo) {
    case LogoSvgs.whatsapp:
    default:
      return WhatsappSvg;
  }
};
