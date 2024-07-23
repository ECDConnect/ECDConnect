import { RootState } from '../types';
import { TenantState } from './tenant.types';

export const getTenant = (state: RootState): TenantState => state.tenant;
