import { gql } from '@apollo/client';

export const GetAllNavigation = gql`
  query GetAllNavigation($isActive: Boolean = true) {
    GetAllNavigation(where: { isActive: { eq: $isActive } }) {
      id
      name
      icon
      route
      description
      isActive
      sequence
      permissions {
        id
        name
        isActive
      }
    }
  }
`;

export const GetNavigationById = gql`
  query GetNavigationById($id: UUID) {
    GetNavigationById(id: $id) {
      id
      description
    }
  }
`;

export const CreateNavigation = gql`
  mutation createNavigation($input: NavigationInput) {
    createNavigation(input: $input) {
      id
    }
  }
`;

export const UpdateNavigation = gql`
  mutation updateNavigation($input: NavigationInput, $id: UUID) {
    updateNavigation(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteNavigation = gql`
  mutation deleteNavigation($id: UUID!) {
    deleteNavigation(id: $id)
  }
`;

export const AddPermissionToNavigation = gql`
  mutation addPermissionsToNavigation(
    $navigationId: UUID!
    $permissionIds: [UUID!]
  ) {
    addPermissionsToNavigation(
      navigationId: $navigationId
      permissionIds: $permissionIds
    )
  }
`;

export const RemovePermissionFromNavigation = gql`
  mutation removePermissionsFromNavigation(
    $navigationId: UUID!
    $permissionIds: [UUID!]
  ) {
    removePermissionsFromNavigation(
      navigationId: $navigationId
      permissionIds: $permissionIds
    )
  }
`;
