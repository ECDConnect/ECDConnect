import { Config, TenantModel, TenantType } from '@ecdlink/core';
import React, { useState, useContext, useEffect } from 'react';
import { GetCurrentTenant } from '../services/auth.service';

export type TenantContextType = {
  tenant: TenantModel | null;
  isWhiteLabel: boolean;
  isOpenAccess: boolean;
  isCHWConnect: boolean;
  isFundaApp: boolean;
  modules: any | null;
};

const TenantContext = React.createContext<TenantContextType>({
  tenant: null,
  isWhiteLabel: false,
  isOpenAccess: true,
  isCHWConnect: false,
  isFundaApp: false,
  modules: null,
});

export const TenantContextProvider: React.FC<{}> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantContextType>({
    tenant: null,
    isWhiteLabel: false,
    isOpenAccess: true,
    isCHWConnect: false,
    isFundaApp: false,
    modules: null,
  });

  useEffect(() => {
    (async () => {
      const result = await GetCurrentTenant(Config.authApi);
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
        isCHWConnect: !result
          ? false
          : result.tenantType === TenantType.ChwConnect,
        isFundaApp: !result ? false : result.tenantType === TenantType.FundaApp,
      };
      setTenant(value);
    })();
  }, []);

  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
};

export const useTenant = () => {
  const store = useContext(TenantContext);
  return store;
};
