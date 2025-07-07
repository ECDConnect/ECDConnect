import { gql } from '@apollo/client';

export const GetAllUserType = gql`
  {
    GetAllUserType {
      id
      name
      normalizedName
    }
  }
`;

export const GetUserTypeById = gql`
  query GetUserTypeById($id: UUID) {
    GetUserTypeById(id: $Id) {
      id
      name
      normalizedName
    }
  }
`;

export const CreateUserType = gql`
  mutation createUserType($input: GenderInput) {
    createUserType(input: $input) {
      id
    }
  }
`;

export const UpdateUserType = gql`
  mutation updateUserType($input: UserTypeInput, $id: UUID) {
    updateUserType(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteUserType = gql`
  mutation deleteUserType($id: UUID!) {
    deleteUserType(id: $id)
  }
`;
