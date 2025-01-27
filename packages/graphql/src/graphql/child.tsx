import { gql } from '@apollo/client';

export const GetAllChild = gql`
  query GetAllChild($classroomGroupId: UUID) {
    GetAllChild(classroomGroupId: UUID) {
      id
      caregiverId
      workflowStatusId
      workflowStatus {
        id
        description
        enumId
      }
      insertedDate
      userId
      user {
        firstName
        surname
        email
        genderId
        dateOfBirth
      }
      language {
        id
        description
      }
      allergies
      disabilities
      otherHealthConditions
    }
  }
`;

export const GetChildById = gql`
  query GetChildById($id: UUID) {
    GetChildById(id: $id) {
      id
      caregiverId
      childStatusId
      childStatus {
        id
        description
      }
      insertedDate
      userId
      caregiverId
      user {
        id
        firstName
        surname
        dateOfBirth
      }
      language {
        id
        description
      }
      allergies
      disabilities
      otherHealthConditions
    }
  }
`;

export const CreateChild = gql`
  mutation createChild($input: ChildInput) {
    createChild(input: $input) {
      id
    }
  }
`;

export const UpdateChild = gql`
  mutation updateChild($input: ChildInput, $id: UUID) {
    updateChild(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteChild = gql`
  mutation deleteChild($id: UUID!) {
    deleteChild(id: $id)
  }
`;
