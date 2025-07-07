import { QueryUsersArgs } from '@ecdlink/graphql';

export enum AdminTypes {
  SuperAdmin = 'Super Admin',
  Administrator = 'Administrator',
  ContentManager = 'ContentManager',
  DesignManager = 'DesignManager',
}

export enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export interface ApplicationAdminRouteState {
  queryVariables: QueryUsersArgs;
}
