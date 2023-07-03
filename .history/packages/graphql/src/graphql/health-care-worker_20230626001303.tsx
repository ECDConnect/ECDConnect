import { gql } from '@apollo/client';

export const GetAllHealthCareWorker = gql`
query ($search: String, $provinceSearch: String, $clinicSearch: String) {
  teamLeadResults: GetAllHealthCareWorker(
    where: {
      teamLead: {
        clinic: {
          and: [
          { name: { contains: $clinicSearch} }
          { siteAddress: { province: { description: { eq: $provinceSearch } } } }
          ]
        }
      }
    }
  ) {
    ...hcwFields
  }

  userResults: GetAllHealthCareWorker(
    where: {
      user: {
        or: [
          { fullName: { contains: $search } }
          { idNumber: { contains: $search } }
          { email: { contains: $search } }
        ]
      }
    }
  ) {
    ...hcwFields
  }
}

fragment hcwFields on HealthCareWorker {
  id
    user {
      fullName
      idNumber
      phoneNumber
      email
    }
    teamLead {
      clinic {
        name
        siteAddress {
          province {
            description
          }
        }
      }
    }
}
`;

export const GetHealthCareWorkerByUserId = gql`
  query GetHealthCareWorkerByUserId($id: UUID) {
    GetHealthCareWorkerByUserId(id: $id) {
      id
      user {
        firstName
        surname
        email
        phoneNumber
      }
      siteAddress {
        id
        province {
          id
          description
        }
        name
        addressLine1
        addressLine2
        addressLine3
        postalCode
        ward
      }
    }
  }
`;

export const CreateHealthCareWorker = gql`
  mutation addHealthCareWorker($input: HealthCareWorkerModelInput) {
    addHealthCareWorker(input: $input) {
      id
    }
  }
`;

export const UpdateHealthCareWorker = gql`
  mutation updateHealthCareWorker($input: PractitionerInput, $id: UUID) {
    updateHealthCareWorker(id: $id, input: $input) {
      id
    }
  }
`;
