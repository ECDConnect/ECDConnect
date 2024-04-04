import { gql } from '@apollo/client';

export const GetAllRace = gql`
  query GetAllRace($pagingInput: PagedQueryInput) {
    GetAllRace(pagingInput: $pagingInput) {
      id
      description
      isActive
    }
  }
`;

export const GetRaceById = gql`
  query GetRaceById($id: UUID) {
    GetRaceById(id: $id) {
      id
      description
    }
  }
`;

export const CreateRace = gql`
  mutation createRace($input: RaceInput) {
    createRace(input: $input) {
      id
    }
  }
`;

export const UpdateRace = gql`
  mutation updateRace($input: RaceInput, $id: UUID) {
    updateRace(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteRace = gql`
  mutation deleteRace($id: UUID!) {
    deleteRace(id: $id)
  }
`;
