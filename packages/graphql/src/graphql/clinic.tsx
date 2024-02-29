import { gql } from '@apollo/client';

export const GetAllClinic = gql`
  query GetAllClinic($isActive: Boolean = true) {
    GetAllClinic(where: { isActive: { eq: $isActive } }) {
      id
      name
      phoneNumber
      insertedDate
      siteAddress {
        name
        addressLine1
        addressLine2
        addressLine3
        postalCode
        province {
          description
        }
      }
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
      isActive
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
