import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ThemeModel } from '../models';
import { applyTheme, DefaultTheme, WhiteLabelTheme } from '../theme';
import { Storage } from '@capacitor/storage';

export interface ThemeContextType {
  theme?: ThemeModel;
  overRideTheme: (theme: ThemeModel) => void;
  setWhiteLabelTheme: () => void;
  children: React.ReactNode | React.ReactNode[] | null;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

function ThemeProvider({
  children,
  themeEndPoint,
  overRideCache,
}: {
  children: ReactNode;
  themeEndPoint: string;
  overRideCache: boolean;
}): JSX.Element {
  const [data, setData] = useState({} as any);
  const [theme, setTheme] = useState<ThemeModel>();

  const getData = async () => {
    const { value } = await Storage.get({ key: 'storageTheme' });

    if (!value || overRideCache) {
      fetch(themeEndPoint)
        .then(function (res) {
          return res.json();
        })
        .then(async function (data) {
          await Storage.set({
            key: 'storageTheme',
            value: JSON.stringify(data),
          });
          setData(data);
        })
        .catch(function (err) {
          setWhiteLabelTheme();
        });
    } else {
      setData(JSON.parse(value));
    }
  };

  useEffect(() => {
    getData();
  }, [themeEndPoint]);

  useEffect(() => {
    if (data && data.colors) {
      if (data.colors) {
        DefaultTheme.primary = data.colors.primary;
        DefaultTheme.primaryAccent1 = data.colors.primaryAccent1;
        DefaultTheme.primaryAccent2 = data.colors.primaryAccent2;
        DefaultTheme.secondary = data.colors.secondary;
        DefaultTheme.secondaryAccent1 = data.colors.secondaryAccent1;
        DefaultTheme.secondaryAccent2 = data.colors.secondaryAccent2;
        DefaultTheme.tertiary = data.colors.tertiary;
        DefaultTheme.tertiaryAccent1 = data.colors.tertiaryAccent1;
        DefaultTheme.tertiaryAccent2 = data.colors.tertiaryAccent2;
        DefaultTheme.textDark = data.colors.textDark;
        DefaultTheme.textMid = data.colors.textMid;
        DefaultTheme.textLight = data.colors.textLight;
        DefaultTheme.uiMidDark = data.colors.uiMidDark;
        DefaultTheme.uiMid = data.colors.uiMid;
        DefaultTheme.uiLight = data.colors.uiLight;
        DefaultTheme.uiBg = data.colors.uiBg;
        DefaultTheme.modalBg = data.colors.modalBg;
        DefaultTheme.errorMain = data.colors.errorMain;
        DefaultTheme.errorDark = data.colors.errorDark;
        DefaultTheme.errorBg = data.colors.errorBg;
        DefaultTheme.alertMain = data.colors.alertMain;
        DefaultTheme.alertDark = data.colors.alertDark;
        DefaultTheme.alertBg = data.colors.alertBg;
        DefaultTheme.successMain = data.colors.successMain;
        DefaultTheme.successDark = data.colors.successDark;
        DefaultTheme.successBg = data.colors.successBg;
        DefaultTheme.infoMain = data.colors.infoMain;
        DefaultTheme.infoDark = data.colors.infoDark;
        DefaultTheme.infoBb = data.colors.infoBb;
        DefaultTheme.infoBb = data.colors.infoBb;
        DefaultTheme.darkBackground = data.colors.darkBackground;
        DefaultTheme.quatenary = data.colors.quatenary;
        DefaultTheme.quatenaryMain = data.colors.quatenaryMain;
        DefaultTheme.adminPortalBg = data.colors.adminPortalBg;
        DefaultTheme.darkBlue = data.colors.darkBlue;
        DefaultTheme.pointsCardBg = data.colors.pointsCardBg;
        DefaultTheme.pointsCardBarBg = data.colors.pointsCardBarBg;
        DefaultTheme.quatenaryBg = data.colors.quatenaryBg;
        DefaultTheme.adminBackground = data.colors.adminBackground;
        DefaultTheme.quinary = data.colors.quinary;
      }

      if (data.images) {
        DefaultTheme.logoUrl = `url(${data.images.logoUrl})`;
        DefaultTheme.graphicOverlayUrl = data.images.graphicOverlayUrl;
        DefaultTheme.faviconUrl = data.images.faviconUrl;
        DefaultTheme.portalLoginLogoUrl = data.images.portalLoginLogoUrl;
        DefaultTheme.portalLoginBackgroundUrl =
          data.images.portalLoginBackgroundUrl;
      }

      if (data.fonts) {
        DefaultTheme.fontUrl = "'Quicksand', sans-serif";
        DefaultTheme.mainHeadingOverrideFontUrl =
          data.fonts.mainHeadingOverrideFontUrl;
      }

      applyTheme();
      overRideTheme(data);
    }
  }, [data]);

  function setWhiteLabelTheme() {
    DefaultTheme.primary = WhiteLabelTheme.primary;
    DefaultTheme.primaryAccent1 = WhiteLabelTheme.primaryAccent1;
    DefaultTheme.primaryAccent2 = WhiteLabelTheme.primaryAccent2;
    DefaultTheme.secondary = WhiteLabelTheme.secondary;
    DefaultTheme.secondaryAccent1 = WhiteLabelTheme.secondaryAccent1;
    DefaultTheme.secondaryAccent2 = WhiteLabelTheme.secondaryAccent2;
    DefaultTheme.tertiary = WhiteLabelTheme.tertiary;
    DefaultTheme.tertiaryAccent1 = WhiteLabelTheme.tertiaryAccent1;
    DefaultTheme.tertiaryAccent2 = WhiteLabelTheme.tertiaryAccent2;
    DefaultTheme.textDark = WhiteLabelTheme.textDark;
    DefaultTheme.textMid = WhiteLabelTheme.textMid;
    DefaultTheme.textLight = WhiteLabelTheme.textLight;
    DefaultTheme.uiMidDark = WhiteLabelTheme.uiMidDark;
    DefaultTheme.uiMid = WhiteLabelTheme.uiMid;
    DefaultTheme.uiLight = WhiteLabelTheme.uiLight;
    DefaultTheme.uiBg = WhiteLabelTheme.uiBg;
    DefaultTheme.modalBg = WhiteLabelTheme.modalBg;
    DefaultTheme.errorMain = WhiteLabelTheme.errorMain;
    DefaultTheme.errorDark = WhiteLabelTheme.errorDark;
    DefaultTheme.errorBg = WhiteLabelTheme.errorBg;
    DefaultTheme.alertMain = WhiteLabelTheme.alertMain;
    DefaultTheme.alertDark = WhiteLabelTheme.alertDark;
    DefaultTheme.alertBg = WhiteLabelTheme.alertBg;
    DefaultTheme.successMain = WhiteLabelTheme.successMain;
    DefaultTheme.successDark = WhiteLabelTheme.successDark;
    DefaultTheme.successBg = WhiteLabelTheme.successBg;
    DefaultTheme.infoMain = WhiteLabelTheme.infoMain;
    DefaultTheme.infoDark = WhiteLabelTheme.infoDark;
    DefaultTheme.infoBb = WhiteLabelTheme.infoBb;
    DefaultTheme.fontUrl = WhiteLabelTheme.fontUrl;
    DefaultTheme.mainHeadingOverrideFontUrl =
      WhiteLabelTheme.mainHeadingOverrideFontUrl;
    DefaultTheme.darkBackground = WhiteLabelTheme.darkBackground;
    DefaultTheme.quatenary = WhiteLabelTheme.quatenary;
    DefaultTheme.quatenaryMain = WhiteLabelTheme.quatenaryMain;
    DefaultTheme.adminPortalBg = WhiteLabelTheme.adminPortalBg;
    DefaultTheme.darkBlue = WhiteLabelTheme.darkBlue;
    DefaultTheme.pointsCardBg = WhiteLabelTheme.pointsCardBg;
    DefaultTheme.pointsCardBarBg = WhiteLabelTheme.pointsCardBarBg;
    DefaultTheme.quatenaryBg = WhiteLabelTheme.quatenaryBg;
    DefaultTheme.adminBackground = WhiteLabelTheme.adminBackground;
    DefaultTheme.quinary = WhiteLabelTheme.quinary;
  }

  function overRideTheme(theme: ThemeModel) {
    setTheme(theme);
  }

  const memoedValue = useMemo(
    () => ({
      theme,
      overRideTheme,
      setWhiteLabelTheme,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  return (
    <ThemeContext.Provider value={memoedValue as ThemeContextType}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider, ThemeContext };

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
