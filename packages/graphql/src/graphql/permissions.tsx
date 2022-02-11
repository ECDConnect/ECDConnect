import { gql } from '@apollo/client';

export const PermissionGroupList = gql`
  {
    permissionGroups {
      groupName
      permissions {
        id
        name
        normalizedName
        isActive
      }
    }
  }
`;
