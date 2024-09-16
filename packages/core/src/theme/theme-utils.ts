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
    '--primary': variables.primary || '#27385A',
    '--primaryAccent1': variables.primaryAccent1 || '#52607B',
    '--primaryAccent2': variables.primaryAccent2 || '#D4D7DE',
    '--secondary': variables.secondary || '#FF2180',
    '--secondaryAccent1': variables.secondaryAccent1 || '#FF90BF',
    '--secondaryAccent2': variables.secondaryAccent2 || '#FFD3E6',
    '--tertiary': variables.tertiary || '#83BB26',
    '--tertiaryAccent1': variables.tertiaryAccent1 || '#C1DD92',
    '--tertiaryAccent2': variables.tertiaryAccent2 || '#E6F1D4',
    '--textDark': variables.textDark || '#27385A',
    '--textMid': variables.textMid || '#65727A',
    '--textLight': variables.textLight || '#C9CFD2',
    '--uiMidDark': variables.uiMidDark || '#5e557a',
    '--uiMid': variables.uiMid || '#827c93',
    '--uiLight': variables.uiLight || '#cac5d8',
    '--uiBg': variables.uiBg || '#EFF6FA',
    '--errorMain': variables.errorMain || '#ED1414',
    '--errorDark': variables.errorDark || '#D20000',
    '--errorBg': variables.errorBg || '#FFEEF6',
    '--modalBg': variables.modalBg || '#667289',
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
