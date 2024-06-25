import { TenantModel } from '@ecdlink/core';

export type TenantState = {
  tenant: TenantModel | null;
  url: string;
};
