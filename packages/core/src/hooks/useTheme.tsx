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
  }, []);

  useEffect(() => {
    if (data && data.colors) {
      if (data.colors) {
        DefaultTheme.primary = data.colors.primary;
        DefaultTheme.secondary = data.colors.secondary;
        DefaultTheme.tertiary = data.colors.tertiary;
        DefaultTheme.textDark = data.colors.textDark;
        DefaultTheme.textLight = data.colors.textLight;
        DefaultTheme.textMid = data.colors.textMid;
        DefaultTheme.uiBg = data.colors.uiBg;
        DefaultTheme.uiLight = data.colors.uiLight;
        DefaultTheme.uiMid = data.colors.uiMid;
        DefaultTheme.uiMidDark = data.colors.uiMidDark;
        DefaultTheme.alertBg = data.colors.alertBg;
        DefaultTheme.alertDark = data.colors.alertDark;
        DefaultTheme.alertMain = data.colors.alertMain;
        DefaultTheme.errorBg = data.colors.errorBg;
        DefaultTheme.errorDark = data.colors.errorDark;
        DefaultTheme.errorMain = data.colors.errorMain;
        DefaultTheme.infoBb = data.colors.infoBb;
        DefaultTheme.infoDark = data.colors.infoDark;
        DefaultTheme.infoMain = data.colors.infoMain;
        DefaultTheme.successBg = data.colors.successBg;
        DefaultTheme.successDark = data.colors.successDark;
        DefaultTheme.successMain = data.colors.successMain;
      }

      if (data.images) {
        DefaultTheme.logoUrl = data.images.logoUrl;
        DefaultTheme.graphicOverlayUrl = data.images.graphicOverlayUrl;
        DefaultTheme.faviconUrl = data.images.faviconUrl;
        DefaultTheme.portalLoginLogoUrl = data.images.portalLoginLogoUrl;
        DefaultTheme.portalLoginBackgroundUrl =
          data.images.portalLoginBackgroundUrl;
      }

      if (data.fonts) {
        DefaultTheme.fontUrl = data.fonts.fontUrl;
        DefaultTheme.mainHeadingOverrideFontUrl =
          data.fonts.mainHeadingOverrideFontUrl;
      }

      applyTheme();
      overRideTheme(data);
    }
  }, [data]);

  function setWhiteLabelTheme() {
    DefaultTheme.primary = WhiteLabelTheme.primary;
    DefaultTheme.secondary = WhiteLabelTheme.secondary;
    DefaultTheme.tertiary = WhiteLabelTheme.tertiary;
    DefaultTheme.textDark = WhiteLabelTheme.textDark;
    DefaultTheme.textLight = WhiteLabelTheme.textLight;
    DefaultTheme.textMid = WhiteLabelTheme.textMid;
    DefaultTheme.uiBg = WhiteLabelTheme.uiBg;
    DefaultTheme.uiLight = WhiteLabelTheme.uiLight;
    DefaultTheme.uiMid = WhiteLabelTheme.uiMid;
    DefaultTheme.uiMidDark = WhiteLabelTheme.uiMidDark;
    DefaultTheme.alertBg = WhiteLabelTheme.alertBg;
    DefaultTheme.alertDark = WhiteLabelTheme.alertDark;
    DefaultTheme.alertMain = WhiteLabelTheme.alertMain;
    DefaultTheme.errorBg = WhiteLabelTheme.errorBg;
    DefaultTheme.errorDark = WhiteLabelTheme.errorDark;
    DefaultTheme.errorMain = WhiteLabelTheme.errorMain;
    DefaultTheme.infoBb = WhiteLabelTheme.infoBb;
    DefaultTheme.infoDark = WhiteLabelTheme.infoDark;
    DefaultTheme.infoMain = WhiteLabelTheme.infoMain;
    DefaultTheme.successBg = WhiteLabelTheme.successBg;
    DefaultTheme.successDark = WhiteLabelTheme.successDark;
    DefaultTheme.successMain = WhiteLabelTheme.successMain;
    DefaultTheme.fontUrl = WhiteLabelTheme.fontUrl;
    DefaultTheme.mainHeadingOverrideFontUrl =
      WhiteLabelTheme.mainHeadingOverrideFontUrl;
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
