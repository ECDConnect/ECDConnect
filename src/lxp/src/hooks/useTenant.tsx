import Loader from '@/components/loader/loader';
import { TenantService } from '@/services/TenantService';
import { useAppDispatch } from '@/store';
import { tenantActions, tenantSelectors } from '@/store/tenant';
import { TenantModel, TenantType, ThemeProvider } from '@ecdlink/core';
import React, { useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

export type TenantContextType = {
  tenant: TenantModel | null;
  isWhiteLabel: boolean;
  isOpenAccess: boolean;
  isCHWConnect: boolean;
};

const TenantContext = React.createContext<TenantContextType>({
  tenant: null,
  isWhiteLabel: false,
  isOpenAccess: true,
  isCHWConnect: false,
});

const createTenantContext = (
  tenantModel: TenantModel | null
): TenantContextType => {
  const value: TenantContextType = {
    tenant: tenantModel,
    isWhiteLabel: !tenantModel
      ? false
      : tenantModel.tenantType === TenantType.WhiteLabel ||
        tenantModel?.tenantType === TenantType.WhiteLabelTemplate,
    isOpenAccess: !tenantModel
      ? true
      : tenantModel.tenantType === TenantType.OpenAccess,
    isCHWConnect: !tenantModel
      ? false
      : tenantModel.tenantType === TenantType.ChwConnect,
  };
  return value;
};

export const TenantContextProvider: React.FC<{}> = ({ children }) => {
  const appDispatch = useAppDispatch();
  const [tenant, setTenant] = useState<TenantContextType>({
    tenant: null,
    isWhiteLabel: false,
    isOpenAccess: true,
    isCHWConnect: false,
  });
  const tenantState = useSelector(tenantSelectors.getTenant);

  useEffect(() => {
    if (tenantState.url !== window.location.host) {
      (async () => {
        const result = await new TenantService().GetCurrent();
        const newTenantContext = createTenantContext(result);
        appDispatch(
          tenantActions.setTenant({
            tenant: newTenantContext.tenant,
            url: window.location.host,
          })
        );
        setTenant(newTenantContext);
      })();
    } else {
      const newTenantContext = createTenantContext(tenantState.tenant);
      setTenant(newTenantContext);
    }
  }, []);

  if (!tenant.tenant) {
    return (
      <TenantContext.Provider value={tenant}>
        <Loader />
      </TenantContext.Provider>
    );
  }

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

  const themeUrl =
    !!tenant && !!tenant.tenant && !!tenant.tenant.themePath
      ? tenant.tenant.themePath
      : props.defaultThemeUrl;

  return (
    <ThemeProvider themeEndPoint={themeUrl} overRideCache={true}>
      {props.children}
    </ThemeProvider>
  );
};
