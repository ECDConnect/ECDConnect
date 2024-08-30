import { DefaultTheme } from './theme-base';

export interface ITheme {
  [key: string]: string;
}

export interface IThemes {
  [key: string]: ITheme;
}

export interface IMappedTheme {
  [key: string]: string | null;
}

export const mapTheme = (variables: ITheme): IMappedTheme => {
  return {
    '--primary': variables.primary || '#583f99',
    '--primaryAccent1': variables.primaryAccent1 || '#9484BD',
    '--primaryAccent2': variables.primaryAccent2 || '#D7D1E6',
    '--secondary': variables.secondary || '#00B0E0',
    '--secondaryAccent1': variables.secondaryAccent1 || '#66D0EC',
    '--secondaryAccent2': variables.secondaryAccent2 || '#C2ECF8',
    '--tertiary': variables.tertiary || '#ED145B',
    '--tertiaryAccent1': variables.tertiaryAccent1 || '#F4729D',
    '--tertiaryAccent2': variables.tertiaryAccent2 || '#FBC7D8',
    '--textDark': variables.textDark || '#1F192E',
    '--textMid': variables.textMid || '#483E63',
    '--textLight': variables.textLight || '#9B96A6',
    '--uiMidDark': variables.uiMidDark || '#5e557a',
    '--uiMid': variables.uiMid || '#827c93',
    '--uiLight': variables.uiLight || '#cac5d8',
    '--uiBg': variables.uiBg || '#F3F1F9',
    '--errorMain': variables.errorMain || '#ED1414',
    '--errorDark': variables.errorDark || '#D20000',
    '--errorBg': variables.errorBg || '#FFEEF6',
    '--modalBg': variables.modalBg || '#cac5d8',
    '--alertMain': variables.alertMain || '#FF5C00',
    '--alertDark': variables.alertDark || '#E43802',
    '--alertBg': variables.alertBg || '#FFEEE4',
    '--successMain': variables.successMain || '#83BB26',
    '--successDark': variables.successDark || '#5A8F02',
    '--successBg': variables.successBg || '#E6F1D4',
    '--infoMain': variables.infoMain || '#1D67D5',
    '--infoDark': variables.infoDark || '#1752AB',
    '--infoBb': variables.infoBb || '#EBF3FF',
    '--body-font': variables.fontUrl || '',
    '--h1-font': variables.mainHeadingOverrideFontUrl || '',
    '--logo': variables.logoUrl || '',
    '--banner': variables.graphicOverlayUrl || '',
    '--darkBackground': variables.darkBackground || '#27385A',
    '--quatenary': variables.quatenary || '#1DBADF',
    '--quatenaryMain': variables.quatenaryMain || '#1DBADF',
    '--adminPortalBg': variables.adminPortalBg || '#EFF6FA',
    '--darkBlue': variables.darkBlue || '#27385A',
    '--pointsCardBg': variables.pointsCardBg || '#FEEED7',
    '--pointsCardBarBg': variables.pointsCardBarBg || '#FCCF8C',
    '--quatenaryBg': variables.quatenaryBg || '#D2F1F9',
    '--adminBackground': variables.adminBackground || '#EFF6FA',
    '--quinary': variables.quinary || '#FFD525',
  };
};

export const applyTheme = (): void => {
  const themeObject: IMappedTheme = mapTheme(DefaultTheme);
  if (!themeObject) return;

  const root = document.documentElement;

  Object.keys(themeObject).forEach((property) => {
    if (property === 'name') {
      return;
    }

    root.style.setProperty(property, themeObject[property]);
  });
};

export const extend = (extending: ITheme, newTheme: ITheme): ITheme => {
  return { ...extending, ...newTheme };
};
