import { gql } from '@apollo/client';

export const GetAllCoach = gql`
  {
    GetAllCoach {
      id
      userId
      user {
        firstName
        surname
        email
        isActive
        idNumber
      }
      areaOfOperation
      secondaryAreaOfOperation
      startDate
    }
  }
`;

export const GetCoachById = gql`
  query GetCoachById($id: UUID) {
    GetCoachById(id: $id) {
      areaOfOperation
      secondaryAreaOfOperation
      startDate
    }
  }
`;

export const CreateCoach = gql`
  mutation createCoach($input: CoachInput) {
    createCoach(input: $input) {
      id
    }
  }
`;

export const UpdateCoach = gql`
  mutation updateCoach($input: CoachInput, $id: UUID) {
    updateCoach(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteCoach = gql`
  mutation deleteCoach($id: UUID!) {
    deleteCoach(id: $id)
  }
`;
