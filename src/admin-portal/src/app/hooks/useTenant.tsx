import { Config, TenantModel, TenantType, ThemeProvider } from '@ecdlink/core';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { GetCurrentTenant } from '../services/auth.service';

export type TenantContextType = {
  tenant: TenantModel | null;
  isWhiteLabel: boolean;
  isOpenAccess: boolean;
  isFundaApp: boolean;
  modules: any | null;
  loading: boolean;
  error: boolean;
  refresh: () => void;
};

const TenantContext = React.createContext<TenantContextType>({
  tenant: null,
  isWhiteLabel: false,
  isOpenAccess: true,
  isFundaApp: false,
  modules: null,
  loading: false,
  error: false,
  refresh: () => {},
});

export const TenantContextProvider: React.FC<{}> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantContextType>({
    tenant: null,
    isWhiteLabel: false,
    isOpenAccess: true,
    isFundaApp: false,
    modules: null,
    loading: false,
    error: false,
    refresh: () => {},
  });

  const fetchData = useCallback(async () => {
    setTenant({ ...tenant, loading: true, error: false });
    const result = await GetCurrentTenant(Config.authApi);
    if (!result) {
      const value: TenantContextType = {
        ...tenant,
        loading: false,
        error: true,
        refresh: fetchData,
      };
      setTenant(value);
    } else {
      const value: TenantContextType = {
        tenant: result,
        modules: result.modules,
        isWhiteLabel: !result
          ? false
          : result.tenantType === TenantType.WhiteLabel ||
            result?.tenantType === TenantType.WhiteLabelTemplate,
        isOpenAccess: !result
          ? true
          : result.tenantType === TenantType.OpenAccess,
        isFundaApp: !result ? false : result.tenantType === TenantType.FundaApp,
        loading: false,
        error: false,
        refresh: fetchData,
      };
      setTenant(value);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
};

export const useTenant = () => {
  const store = useContext(TenantContext);
  return store;
};

type TenantThemeProviderProps = {
  defaultThemeUrl: string;
};

export const TenantThemeProvider: React.FC<TenantThemeProviderProps> = (
  props
) => {
  const tenant = useTenant();

  // const themeUrl =
  //   !!tenant && !!tenant.tenant && !!tenant.tenant.themePath
  //     ? tenant.tenant.themePath
  //     : props.defaultThemeUrl;

  return (
    <ThemeProvider themeEndPoint={props.defaultThemeUrl} overRideCache={true}>
      {props.children}
    </ThemeProvider>
  );
};
