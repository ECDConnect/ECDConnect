import { gql } from '@apollo/client';

export const GetAllProgrammeAttendanceReason = gql`
  query GetAllProgrammeAttendanceReason($pagingInput: PagedQueryInput) {
    GetAllProgrammeAttendanceReason(pagingInput: $pagingInput) {
      id
      reason
      isActive
    }
  }
`;

export const GetProgrammeAttendanceReasonById = gql`
  query GetProgrammeAttendanceReasonById($id: UUID) {
    GetProgrammeAttendanceReasonById(id: $id) {
      id
      reason
    }
  }
`;

export const CreateProgrammeAttendanceReason = gql`
  mutation createProgrammeAttendanceReason(
    $input: ProgrammeAttendanceReasonInput
  ) {
    createProgrammeAttendanceReason(input: $input) {
      id
    }
  }
`;

export const UpdateProgrammeAttendanceReason = gql`
  mutation updateProgrammeAttendanceReason(
    $input: ProgrammeAttendanceReasonInput
    $id: UUID
  ) {
    updateProgrammeAttendanceReason(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteProgrammeAttendanceReason = gql`
  mutation deleteProgrammeAttendanceReason($id: UUID!) {
    deleteProgrammeAttendanceReason(id: $id)
  }
`;
