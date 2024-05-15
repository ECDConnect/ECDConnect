import { TenantService } from '@/services/TenantService';
import { TenantModel, TenantType } from '@ecdlink/core';
import React, { useState, useContext, useEffect } from 'react';

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

export const TenantContextProvider: React.FC<{}> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantContextType>({
    tenant: null,
    isWhiteLabel: false,
    isOpenAccess: true,
    isCHWConnect: false,
  });

  useEffect(() => {
    (async () => {
      const result = await new TenantService().GetCurrent();
      const value: TenantContextType = {
        tenant: result,
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
