import Loader from '@/components/loader/loader';
import { TenantService } from '@/services/TenantService';
import { useAppDispatch } from '@/store';
import { tenantActions, tenantSelectors, TenantState } from '@/store/tenant';
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

/*
const Tenants = {
  'localhost:3000': {
    applicationName: 'ECD Connect (Local)',
    themePath: '',
    tenantType: TenantType.OpenAccess,
  },
  'app.ecdconnect.co.za': {
    applicationName: 'ECD Connect',
    themePath: '',
    tenantType: TenantType.OpenAccess,
  },
  'app.staging.ecdconnect.co.za': {
    applicationName: 'ECD Connect',
    themePath: '',
    tenantType: TenantType.OpenAccess,
  },
  'ntataise.ecdconnect.co.za': {
    applicationName: 'NtataiseConnect',
    themePath:
      'https://ecdconnectstoragesa.blob.core.windows.net/theme/f5e41fb7-e586-4ed4-8ed7-2bdc72cd0207_theme.json',
    tenantType: TenantType.WhiteLabel,
  },
  'imbe.ecdconnect.co.za': {
    applicationName: 'IMBE',
    themePath:
      'https://ecdconnectstoragesa.blob.core.windows.net/theme/3d50402b-95de-43da-b719-ce50d9d1bcdb_theme.json',
    tenantType: TenantType.WhiteLabel,
  },
  'khululeka.ecdconnect.co.za': {
    applicationName: 'IMBE',
    themePath:
      'https://ecdconnectstoragesa.blob.core.windows.net/theme/1c50abab-aeb6-4de4-8db9-fc41e4745232_theme.json',
    tenantType: TenantType.WhiteLabel,
  },
  'tnconnect.ecdconnect.co.za': {
    applicationName: 'True North Connect',
    themePath:
      'https://ecdconnectstoragesa.blob.core.windows.net/theme/dc6b770d-6898-4d8e-bbdf-f8ceeda69ece_theme.json',
    tenantType: TenantType.WhiteLabel,
  },
  'tnconnect.staging.ecdconnect.co.za': {
    applicationName: 'True North Connect',
    themePath:
      'https://ecdconnectstoragesa.blob.core.windows.net/theme/dc6b770d-6898-4d8e-bbdf-f8ceeda69ece_theme.json',
    tenantType: TenantType.WhiteLabel,
  },
  'localhost:3005': {
    applicationName: 'White Label Tenant',
    themePath: '',
    tenantType: TenantType.WhiteLabel,
  },
  'whitelabel.ecdconnect.co.za': {
    applicationName: 'White Label Tenant',
    themePath: '',
    tenantType: TenantType.WhiteLabel,
  },
  'whitelabel.staging.ecdconnect.co.za': {
    applicationName: 'White Label Tenant',
    themePath: '',
    tenantType: TenantType.WhiteLabel,
  },
};
*/

export const TenantContextProvider: React.FC<{}> = ({ children }) => {
  const appDispatch = useAppDispatch();
  const [tenant, setTenant] = useState<TenantContextType>({
    tenant: null,
    isWhiteLabel: false,
    isOpenAccess: true,
    isCHWConnect: false,
  });
  let tenantState = useSelector(tenantSelectors.getTenant);
  /*
  tenantState.tenant = null;
  if (!tenantState || !tenantState.tenant) {
    const url = window.location.host;
    var x = (Tenants as any)[url];
    let tenant: TenantState = {
      tenant: {
        adminSiteAddress: '',
        applicationName: x?.applicationName || '',
        id: '',
        organisationName: '',
        organisationEmail: '',
        organisationHelpPhoneNumber: '',
        organisationHelpWhatsAppNumber: '',
        siteAddress: url,
        tenantType: x?.tenantType || TenantType.OpenAccess,
        themePath: x?.themePath,
        modules: null,
        moodleUrl: '',
        googleAnalyticsTag: 'G-533M2PK77Y',
        googleTagManager: 'GTM-5VPCT46J',
        blobStorageAddress: 'https://ecdconnectstoragesa.blob.core.windows.net',
      },
      url: url,
    };
    tenantState = tenant;
  }*/

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
