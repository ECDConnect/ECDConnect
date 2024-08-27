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
    '--primary': variables.primary || '',
    '--primaryAccent1': variables.primaryAccent1 || '',
    '--primaryAccent2': variables.primaryAccent2 || '',
    '--secondary': variables.secondary || '',
    '--secondaryAccent1': variables.secondaryAccent1 || '',
    '--secondaryAccent2': variables.secondaryAccent2 || '',
    '--tertiary': variables.tertiary || '',
    '--tertiaryAccent1': variables.tertiaryAccent1 || '',
    '--tertiaryAccent2': variables.tertiaryAccent2 || '',
    '--textDark': variables.textDark || '',
    '--textMid': variables.textMid || '',
    '--textLight': variables.textLight || '',
    '--uiMidDark': variables.uiMidDark || '',
    '--uiMid': variables.uiMid || '',
    '--uiLight': variables.uiLight || '',
    '--uiBg': variables.uiBg || '',
    '--errorMain': variables.errorMain || '',
    '--errorDark': variables.errorDark || '',
    '--errorBg': variables.errorBg || '',
    '--modalBg': variables.modalBg || '',
    '--alertMain': variables.alertMain || '',
    '--alertDark': variables.alertDark || '',
    '--alertBg': variables.alertBg || '',
    '--successMain': variables.successMain || '',
    '--successDark': variables.successDark || '',
    '--successBg': variables.successBg || '',
    '--infoMain': variables.infoMain || '',
    '--infoDark': variables.infoDark || '',
    '--infoBb': variables.infoBb || '',
    '--body-font': variables.fontUrl || '',
    '--h1-font': variables.mainHeadingOverrideFontUrl || '',
    '--logo': variables.logoUrl || '',
    '--banner': variables.graphicOverlayUrl || '',
    '--darkBackground': variables.darkBackground || '',
    '--quatenary': variables.quatenary || '',
    '--quatenaryMain': variables.quatenaryMain || '',
    '--adminPortalBg': variables.adminPortalBg || '',
    '--darkBlue': variables.darkBlue || '',
    '--pointsCardBg': variables.pointsCardBg || '',
    '--pointsCardBarBg': variables.pointsCardBarBg || '',
    '--quatenaryBg': variables.quatenaryBg || '',
    '--adminBackground': variables.adminBackground || '',
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
