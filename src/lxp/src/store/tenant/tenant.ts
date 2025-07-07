import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { TenantState } from './tenant.types';

const initialState: TenantState = {
  tenant: null,
  url: '',
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    resetTenantState: (state) => {
      state.tenant = initialState.tenant;
      state.url = initialState.url;
    },
    setTenant: (state, action: PayloadAction<TenantState>) => {
      state.tenant = action.payload.tenant;
      state.url = action.payload.url;
    },
  },
});

const { reducer: tenantReducer, actions: tenantActions } = tenantSlice;

const tenantPersistConfig = {
  key: 'tenant',
  storage: localForage,
  blacklist: [],
};

export { tenantPersistConfig, tenantReducer, tenantActions };
