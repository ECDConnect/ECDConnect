import { gql } from '@apollo/client';

export const CreateClassroomGroup = gql`
  mutation createClassroomGroup($input: ClassroomGroupInput) {
    createClassroomGroup(input: $input) {
      id
      classroomId
      programType {
        id
        description
      }
      name
    }
  }
`;

export const UpdateClassroomGroup = gql`
  mutation updateClassroomGroup($input: ClassroomGroupInput, $id: UUID) {
    updateClassroomGroup(input: $input, id: $id) {
      id
      classroomId
      programType {
        id
        description
      }
      name
      userId
    }
  }
`;

export const DeleteClassroomGroup = gql`
  mutation deleteClassroomGroup($id: UUID!) {
    deleteClassroomGroup(id: $id)
  }
`;
