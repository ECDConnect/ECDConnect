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
          subDistrictName
          teamLeads {
            id
            firstName
            surname
          }
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
            subDistrictName
            teamLeads {
              id
              firstName
              surname
            }
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
      districtId
      districtName
      leagueTypeId
      leagueTypeName
      insertedDate
      clinics {
        id
        name
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

export const EditLeague = gql`
  mutation EditLeague(
    $leagueId: UUID!
    $name: String
    $clinicsToAdd: [UUID!]
    $clinicsToRemove: [UUID!]
  ) {
    editLeague(
      leagueId: $leagueId
      name: $name
      clinicsToAdd: $clinicsToAdd
      clinicsToRemove: $clinicsToRemove
    )
  }
`;

export const GetLeague = gql`
  query GetLeague(
    $leagueId: UUID!
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    league(leagueId: $leagueId, startDate: $startDate, endDate: $endDate) {
      id
      name
      districtId
      districtName
      leagueTypeId
      leagueTypeName
      insertedDate
      clinics {
        id
        name
        leagueRanking
        pointsTotal
        teamLeads {
          id
          firstName
          surname
        }
      }
    }
  }
`;

export const AddClinicToLeague = gql`
  mutation AddClinicToLeague($leagueId: UUID!, $clinicId: UUID!) {
    addClinicToLeague(leagueId: $leagueId, clinicId: $clinicId)
  }
`;

export const GetLeaguesForTeamLead = gql`
  query GetLeaguesForTeamLead($teamLeadUserId: UUID!) {
    leaguesForTeamLead(teamLeadUserId: $teamLeadUserId) {
      id
      name
      leagueTypeId
      leagueTypeName
      insertedDate
      clinics {
        id
        name
      }
    }
  }
`;
