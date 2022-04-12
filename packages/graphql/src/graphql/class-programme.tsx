import { gql } from '@apollo/client';

export const GetAllClassProgramme = gql`
  {
    GetAllClassProgramme {
      id
      programmeStartDate
      isFullDay
      meetingDay
    }
  }
`;

export const GetClassProgrammeById = gql`
  query GetClassProgrammeById($id: UUID) {
    GetClassProgrammeById(id: $id) {
      id
      programmeStartDate
      isFullDay
      meetingDay
    }
  }
`;

export const CreateClassProgramme = gql`
  mutation createClassProgramme($input: ClassProgrammeInput) {
    createClassProgramme(input: $input) {
      id
      meetingDay
      isFullDay
    }
  }
`;

export const UpdateClassProgramme = gql`
  mutation updateClassProgramme($input: ClassProgrammeInput, $id: UUID) {
    updateClassProgramme(input: $input, id: $id) {
      id
      meetingDay
      isFullDay
    }
  }
`;

export const DeleteClassProgramme = gql`
  mutation deleteClassProgramme($id: UUID!) {
    deleteClassProgramme(id: $id)
  }
`;
