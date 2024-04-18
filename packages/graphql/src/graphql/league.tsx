import { gql } from '@apollo/client';

export const GetLeagueSetup = gql`
  query GetLeagueSetup {
    leagueSetupDetails {
      superLeagues {
        id
        name
        clinics {
          id
          name
        }
      }
      districts {
        id
        name
        leagues {
          id
          name
          clinics {
            id
            name
          }
        }
        unassignedClinics {
          id
          name
          subDistrictName
          teamLeads {
            id
            firstName
            surname
          }
        }
      }
    }
  }
`;

export const GetLeagues = gql`
  query GetLeagues(
    $searchString: String
    $districtId: UUID
    $pagingInput: PagedQueryInput
    $where: PortalLeagueModelFilterInput
    $order: [PortalLeagueModelSortInput!]
  ) {
    leagues(
      searchString: $searchString
      districtId: $districtId
      pagingInput: $pagingInput
      where: $where
      order: $order
    ) {
      id
      name
      leagueTypeId
      leagueTypeName
      insertedDate
      clinics {
        id
        name
        subDistrictName
        teamLeads {
          id
          firstName
          surname
        }
      }
    }
  }
`;

export const AddLeagues = gql`
  mutation AddLeagues($input: [LeagueInputModelInput]) {
    addLeagues(input: $input)
  }
`;

export const DeleteLeague = gql`
  mutation DeleteLeague($id: UUID, $leagueId: UUID!) {
    deleteLeague(id: $id, leagueId: $leagueId)
  }
`;
