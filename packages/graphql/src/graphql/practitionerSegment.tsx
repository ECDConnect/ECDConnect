import { gql } from '@apollo/client';

export const CreatePractitionerSegment = gql`
  mutation createPractitionerSegment($input: PractitionerSegmentInput) {
    createPractitionerSegment(input: $input) {
      id
    }
  }
`;

export const UpdatePractitionerSegment = gql`
  mutation updatePractitionerSegment($input: PractitionerSegmentInput) {
    updatePractitionerSegment(input: $input) {
      id
    }
  }
`;

export const DeletePractitionerSegment = gql`
  mutation deletePractitionerSegment($id: UUID!) {
    deletePractitionerSegment(id: $id)
  }
`;
