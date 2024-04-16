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
        }
      }
    }
  }
`;

// leagues {
//   superLeagues {
//     id
//     name
//     clinics {
//       id
//       name
//     }
//   }
//   districts {
//     id
//     name
//     leagues {
//       id
//       name
//       clinics {
//         id
//         name
//       }
//     }
//     unassignedClinics {
//       id
//       name
//     }
//   }
// }
// }
