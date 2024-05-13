import { gql } from '@apollo/client';

export const RoleList = gql`
  {
    roles {
      id
      name
      normalizedName
      permissions {
        id
        name
      }
      systemName
    }
  }
`;

export const FilterRoleList = gql`
  {
    roles {
      id
      name
      systemName
    }
  }
`;

export const AddPermissionToRole = gql`
  mutation addPermissionsToRole($roleId: String!, $permissionIds: [UUID!]) {
    addPermissionsToRole(roleId: $roleId, permissionIds: $permissionIds)
  }
`;

export const RemovePermissionToRole = gql`
  mutation removePermissionsFromRole(
    $roleId: String!
    $permissionIds: [UUID!]
  ) {
    removePermissionsFromRole(roleId: $roleId, permissionIds: $permissionIds)
  }
`;

export const CreateRole = gql`
  mutation addRole($name: String!, $normalizedName: String!) {
    addRole(name: $name, normalizedName: $normalizedName) {
      id
      name
      normalizedName
      permissions {
        id
        name
      }
    }
  }
`;

export const UpdateRole = gql`
  mutation updateRole($id: String!, $name: String!, $normalizedName: String!) {
    updateRole(id: $id, name: $name, normalizedName: $normalizedName) {
      id
    }
  }
`;

export const DeleteRole = gql`
  mutation deleteRole($id: String!) {
    deleteRole(id: $id)
  }
`;
