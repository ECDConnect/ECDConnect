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
  mutation AddClinic($input: PortalClinicModelInput) {
    addClinic(input: $input) {
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
    }
  }
`;

export const EditClinic = gql`
  mutation EditClinic($input: PortalClinicModelInput) {
    editClinic(input: $input) {
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
    }
  }
`;

export const DeleteClinic = gql`
  mutation DeleteClinic($clinicId: UUID!) {
    deleteClinic(clinicId: $clinicId) {
      id
      name
      isActive
    }
  }
`;
