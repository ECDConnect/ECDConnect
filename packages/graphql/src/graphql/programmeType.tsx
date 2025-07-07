import { gql } from '@apollo/client';

export const GetAllProgrammeType = gql`
  {
    GetAllProgrammeType {
      id
      description
    }
  }
`;

export const GetProgrammeTypeById = gql`
  query GetProgrammeTypeById($id: UUID) {
    GetProgrammeTypeById(id: $id) {
      id
      description
    }
  }
`;

export const CreateProgrammeType = gql`
  mutation createProgrammeType($input: ProgrammeTypeInput) {
    createPractitionerProgramType(input: $input) {
      id
    }
  }
`;

export const UpdateProgrammeType = gql`
  mutation updateProgrammeType($input: ProgrammeTypeInput) {
    updatePractitionerProgramType(input: $input) {
      id
    }
  }
`;

export const DeleteProgrammeType = gql`
  mutation deleteProgrammeType($id: UUID!) {
    deleteProgrammeType(id: $id)
  }
`;
