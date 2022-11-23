import WhatsappSvg from '@/assets/logos/whatsapp.svg';

export enum LogoSvgs {
  whatsapp,
}

export function getLogo(logo: LogoSvgs): string {
  switch (logo) {
    case LogoSvgs.whatsapp:
      return WhatsappSvg;
  }
}
