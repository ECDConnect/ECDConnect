import { gql } from '@apollo/client';

export const GetAllClinic = gql`
  query GetAllClinic($isActive: Boolean = true) {
    GetAllClinic(where: { isActive: { eq: $isActive } }) {
      id
      name
      insertedDate
      teamLeads {
        teamLead {
          id
          user {
            firstName
            surname
          }
        }
      }
      subDistrict {
        id
        name
        district {
          id
          name
          province {
            id
            description
          }
        }
      }
    }
  }
`;

export const GetFilterClinic = gql`
  query GetAllClinic($isActive: Boolean = true) {
    GetAllClinic(where: { isActive: { eq: $isActive } }) {
      id
      name
    }
  }
`;

export const CreateClinic = gql`
  mutation addClinic($input: ClinicModelInput) {
    addClinic(input: $input) {
      id
    }
  }
`;
